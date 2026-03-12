import os
import requests
from typing import List, Dict, Any

SPOONACULAR_API_KEY = os.environ.get("SPOONACULAR_API_KEY")

def get_spoonacular_recipes(query: str, max_results: int = 3) -> List[Dict[str, Any]]:
    """Search Spoonacular for recipes based on dietary needs or query"""
    if not SPOONACULAR_API_KEY or SPOONACULAR_API_KEY == "your-spoonacular-api-key":
        return []
        
    try:
        url = "https://api.spoonacular.com/recipes/complexSearch"
        params = {
            "query": query,
            "number": max_results,
            "apiKey": SPOONACULAR_API_KEY,
            "addRecipeInformation": True,
            "addRecipeNutrition": True
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        recipes = []
        
        for item in data.get("results", []):
            calories = "N/A"
            protein = "N/A"
            for nutrient in item.get("nutrition", {}).get("nutrients", []):
                if nutrient["name"] == "Calories":
                    calories = f"{nutrient['amount']} {nutrient['unit']}"
                if nutrient["name"] == "Protein":
                    protein = f"{nutrient['amount']} {nutrient['unit']}"

            recipes.append({
                "title": item.get("title", ""),
                "id": item.get("id"),
                "image": item.get("image", ""),
                "sourceUrl": item.get("sourceUrl", ""),
                "calories": calories,
                "protein": protein,
                "readyInMinutes": item.get("readyInMinutes", "N/A"),
                "servings": item.get("servings", 1)
            })
            
        return recipes
    except Exception as e:
        print(f"Spoonacular Search Error for '{query}': {str(e)}")
        return []

def extract_recipe_queries(plan_text: str) -> List[str]:
    """Basic extraction of recipe/meal names from the textual plan to search for."""
    # Simplified extractor. Looks for breakfast, lunch, or dinner text usually containing meal ideas.
    meals = []
    lines = plan_text.split('\n')
    for line in lines:
        line = line.strip().lower()
        if "breakfast:" in line or "lunch:" in line or "dinner:" in line or "snack:" in line:
            # Try to grab the item after the colon
            parts = line.split(':')
            if len(parts) > 1:
                meal_name = parts[1].strip()
                # Remove markdown characters and extra details
                clean_name = meal_name.replace('*', '').replace('-', '').split('(')[0].split('with')[0].strip()
                if clean_name and len(clean_name) > 3:
                     meals.append(clean_name)
                     
    return list(dict.fromkeys(meals))[:4]
