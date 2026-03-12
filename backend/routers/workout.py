from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from services.groq_service import get_workout_plan
from services.youtube_service import search_exercise_videos, extract_exercises_from_plan
from database import get_db, WorkoutPlan, User
from schemas import WorkoutPlanCreate, WorkoutPlanResponse
from .users import get_current_user

router = APIRouter(tags=["workout"])


@router.post("/workout/generate", response_model=WorkoutPlanResponse)
async def generate_workout(
    request: WorkoutPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a new AI workout plan"""
    print(f"DEBUG - Starting workout generation for user: {current_user.username}")
    try:
        # Enhanced prompt with user profile context
        enhanced_prompt = f"""User Profile:
    - Fitness Level: {current_user.fitness_level or 'Not specified'}
    - Goal: {current_user.fitness_goal or 'general fitness'}
    - Current Weight: {current_user.current_weight or 'Not specified'} kg
    - Target Weight: {current_user.target_weight or 'Not specified'} kg
    
    User Request: {request.prompt}
    
    Please create a detailed 7-day workout plan including:
    1. Daily workout structure with warm-up, main exercises, and cool-down
    2. Specific exercises with sets, reps, and rest periods
    3. Modifications for different fitness levels
    4. Safety tips and form guidance
    5. Suggest relevant YouTube video keywords for demonstrations
    6. Daily fitness tips"""
    
        plan_content = await get_workout_plan(enhanced_prompt)
        print(f"DEBUG - Received response from Groq: {len(plan_content)} chars")
        
        # Extract exercise names and fetch Youtube videos
        exercises = extract_exercises_from_plan(plan_content)
        youtube_videos = []
        
        for exercise in exercises:
            videos = search_exercise_videos(exercise, max_results=1)
            if videos:
                 youtube_videos.extend(videos)
                 
        # Generate Google Calendar add event link
        import urllib.parse
        title = urllib.parse.quote(f"ArogyaMitra Workout: {request.prompt[:30]}...")
        details = urllib.parse.quote("Time for your AI-generated workout session! Check ArogyaMitra for the full plan.")
        calendar_sync_url = f"https://calendar.google.com/calendar/r/eventedit?text={title}&details={details}"
    
        # Save to database
        workout_plan = WorkoutPlan(
            user_id=current_user.id,
            title=f"Workout Plan - {request.prompt[:50]}...",
            prompt=request.prompt,
            plan_content=plan_content,
            is_active=True,
            youtube_videos=json.dumps(youtube_videos)
        )
        
        # Deactivate other plans
        db.query(WorkoutPlan).filter(
            WorkoutPlan.user_id == current_user.id,
            WorkoutPlan.is_active == True
        ).update({"is_active": False})
        
        db.add(workout_plan)
        db.commit()
        db.refresh(workout_plan)
        
        # Extract exercise names and fetch Youtube videos
        exercises = extract_exercises_from_plan(plan_content)
        youtube_videos = []
        
        for exercise in exercises:
            videos = search_exercise_videos(exercise, max_results=1)
            if videos:
                 youtube_videos.extend(videos)
                 
        # Since we are returning the SQLAlchemy model which maps directly to the Pydantic schema Response,
        # we need to ensure the client understands this added attribute, or we modify the schema.
        # We will modify the response directly before returning it using dict unpacking
        parsed_videos = []
        if workout_plan.youtube_videos:
            parsed_videos = json.loads(workout_plan.youtube_videos)
            
        response_data = {
           "id": workout_plan.id,
           "title": workout_plan.title,
           "prompt": workout_plan.prompt,
           "plan_content": workout_plan.plan_content,
           "created_at": workout_plan.created_at,
           "is_active": workout_plan.is_active,
           "youtube_videos": parsed_videos
        }
            
        return response_data
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/workout/history", response_model=List[WorkoutPlanResponse])
def get_workout_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's workout plan history"""
    plans = db.query(WorkoutPlan).filter(
        WorkoutPlan.user_id == current_user.id
    ).order_by(WorkoutPlan.created_at.desc()).all()
    
    import json
    result = []
    for plan in plans:
        parsed_videos = []
        if plan.youtube_videos:
            try:
                parsed_videos = json.loads(plan.youtube_videos)
            except:
                pass
                
        result.append({
           "id": plan.id,
           "title": plan.title,
           "prompt": plan.prompt,
           "plan_content": plan.plan_content,
           "created_at": plan.created_at,
           "is_active": plan.is_active,
           "youtube_videos": parsed_videos
        })
        
    return result


@router.get("/workout/{plan_id}", response_model=WorkoutPlanResponse)
def get_workout_plan_by_id(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific workout plan"""
    plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == plan_id,
        WorkoutPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")
    
    import json
    parsed_videos = []
    if plan.youtube_videos:
        try:
            parsed_videos = json.loads(plan.youtube_videos)
        except:
            pass
            
    return {
       "id": plan.id,
       "title": plan.title,
       "prompt": plan.prompt,
       "plan_content": plan.plan_content,
       "created_at": plan.created_at,
       "is_active": plan.is_active,
       "youtube_videos": parsed_videos
    }


@router.delete("/workout/{plan_id}")
def delete_workout_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a workout plan"""
    plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == plan_id,
        WorkoutPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")
    
    db.delete(plan)
    db.commit()
    
    return {"message": "Workout plan deleted successfully"}
