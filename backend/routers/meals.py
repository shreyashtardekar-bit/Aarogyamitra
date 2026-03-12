from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from services.groq_service import get_meal_plan
from services.spoonacular_service import get_spoonacular_recipes, extract_recipe_queries
from services.youtube_service import search_recipe_videos
from database import get_db, MealPlan, User
from schemas import MealPlanCreate, MealPlanResponse
from .users import get_current_user

router = APIRouter(tags=["meals"])


@router.post("/meals/generate", response_model=MealPlanResponse)
async def generate_meals(
    request: MealPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a new AI meal plan"""
    # Parse dietary restrictions if exists
    dietary_restrictions = []
    if current_user.dietary_restrictions:
        try:
            dietary_restrictions = json.loads(current_user.dietary_restrictions)
        except:
            pass
    
    # Enhanced prompt with user profile context
    enhanced_prompt = f"""User Profile:
- Goal: {current_user.fitness_goal or 'general health'}
- Current Weight: {current_user.current_weight or 'Not specified'} kg
- Target Weight: {current_user.target_weight or 'Not specified'} kg
- Dietary Restrictions: {', '.join(dietary_restrictions) if dietary_restrictions else 'None'}

User Request: {request.prompt}

Please create a detailed 7-day meal plan including:
1. Daily meal structure (Breakfast, Lunch, Dinner, Snacks)
2. Specific recipes with ingredients and preparation instructions
3. Macro breakdown for each meal (Calories, Protein, Carbs, Fats)
4. Total daily macros
5. Indian cuisine focus with local ingredients
6. Allergen information and substitution options
7. Meal prep tips"""

    plan_content = await get_meal_plan(enhanced_prompt)
    
    # Extract meal names and fetch Spoonacular recipes
    recipe_queries = extract_recipe_queries(plan_content)
    spoonacular_recipes = []
    
    for query in recipe_queries:
        recipes = get_spoonacular_recipes(query, max_results=1)
        if recipes:
            for recipe in recipes:
                video = search_recipe_videos(recipe['title'])
                if video:
                    recipe['youtube_video'] = video
            spoonacular_recipes.extend(recipes)

    # Save to database
    meal_plan = MealPlan(
        user_id=current_user.id,
        title=f"Meal Plan - {request.prompt[:50]}...",
        prompt=request.prompt,
        plan_content=plan_content,
        is_active=True,
        recipes=json.dumps(spoonacular_recipes)
    )
    
    # Deactivate other plans
    db.query(MealPlan).filter(
        MealPlan.user_id == current_user.id,
        MealPlan.is_active == True
    ).update({"is_active": False})
    
    db.add(meal_plan)
    db.commit()
    db.refresh(meal_plan)
    
    # Map to schema response
    response_data = {
       "id": meal_plan.id,
       "title": meal_plan.title,
       "prompt": meal_plan.prompt,
       "plan_content": meal_plan.plan_content,
       "created_at": meal_plan.created_at,
       "is_active": meal_plan.is_active,
       "recipes": spoonacular_recipes
    }
    
    return response_data


@router.get("/meals/history", response_model=List[MealPlanResponse])
def get_meal_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's meal plan history"""
    plans = db.query(MealPlan).filter(
        MealPlan.user_id == current_user.id
    ).order_by(MealPlan.created_at.desc()).all()
    
    result = []
    for plan in plans:
        parsed_recipes = []
        if plan.recipes:
            try:
                parsed_recipes = json.loads(plan.recipes)
            except:
                pass
                
        result.append({
           "id": plan.id,
           "title": plan.title,
           "prompt": plan.prompt,
           "plan_content": plan.plan_content,
           "created_at": plan.created_at,
           "is_active": plan.is_active,
           "recipes": parsed_recipes
        })
        
    return result


@router.get("/meals/{plan_id}", response_model=MealPlanResponse)
def get_meal_plan_by_id(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific meal plan"""
    plan = db.query(MealPlan).filter(
        MealPlan.id == plan_id,
        MealPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    
    parsed_recipes = []
    if plan.recipes:
        try:
            parsed_recipes = json.loads(plan.recipes)
        except:
            pass
            
    return {
       "id": plan.id,
       "title": plan.title,
       "prompt": plan.prompt,
       "plan_content": plan.plan_content,
       "created_at": plan.created_at,
       "is_active": plan.is_active,
       "recipes": parsed_recipes
    }


@router.delete("/meals/{plan_id}")
def delete_meal_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a meal plan"""
    plan = db.query(MealPlan).filter(
        MealPlan.id == plan_id,
        MealPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    
    db.delete(plan)
    db.commit()
    
    return {"message": "Meal plan deleted successfully"}
