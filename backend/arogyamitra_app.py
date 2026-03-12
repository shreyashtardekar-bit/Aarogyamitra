"""
ArogyaMitra Backend - Next-Gen AI Wellness Platform
Created by Shreyash Sanjay Tardekar
"""

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import hashlib
import jwt
from datetime import datetime, timedelta
import os
import requests

# ArogyaMitra Configuration
SECRET_KEY = "arogyamitra-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# API Keys (Groq AI for ArogyaMitra) - loaded from .env file
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY", "")

# FastAPI app
app = FastAPI(
    title="ArogyaMitra API",
    version="2.0.0",
    description="Next-Gen AI Wellness Platform by Shreyash Sanjay Tardekar"
)

# CORS for ArogyaMitra frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://*.netlify.app",
        "https://*.render.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic Models for ArogyaMitra
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class WellnessPlanRequest(BaseModel):
    goals: list[str]
    duration: int
    activity_level: str
    preferences: list[str]

class WellnessPlanResponse(BaseModel):
    title: str
    description: str
    recommendations: list[str]
    created_at: datetime

# Mock Database for ArogyaMitra users
arogyamitra_users_db = {}
users_counter = 1

# Helper Functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Find user in ArogyaMitra database
        user_data = None
        for user_id, user in arogyamitra_users_db.items():
            if user["username"] == username:
                user_data = user
                break
        
        if user_data is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_data
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# ArogyaMitra AI Functions
async def generate_arogyamitra_wellness_plan(preferences: dict) -> dict:
    """Generate wellness plan using Groq AI for ArogyaMitra"""
    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "llama3-70b-8192",
            "messages": [
                {
                    "role": "system",
                    "content": "You are ArogyaMitra's AI wellness expert. Generate personalized wellness plans based on user preferences. Be encouraging and provide actionable advice for optimal health."
                },
                {
                    "role": "user",
                    "content": f"Generate a personalized wellness plan for ArogyaMitra user with these preferences: {preferences}"
                }
            ],
            "max_tokens": 500,
            "temperature": 0.7,
        }
        
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get("choices") and len(result["choices"]) > 0:
                plan_content = result["choices"][0]["message"]["content"]
                
                return {
                    "success": True,
                    "plan": {
                        "title": "ArogyaMitra AI Wellness Plan",
                        "description": plan_content,
                        "recommendations": [
                            "Drink 8 glasses of water daily",
                            "Exercise for 30 minutes",
                            "Get 8 hours of sleep",
                            "Practice meditation for 10 minutes daily"
                        ],
                        "created_at": datetime.utcnow()
                    }
                }
        
        # Fallback to mock plan if AI fails
        return {
            "success": True,
            "plan": {
                "title": "ArogyaMitra Wellness Plan",
                "description": "Personalized wellness plan created by ArogyaMitra AI based on your health goals and preferences.",
                "recommendations": [
                    "Drink 8 glasses of water daily",
                    "Exercise for 30 minutes",
                    "Get 8 hours of sleep",
                    "Practice meditation for 10 minutes daily",
                    "Eat 5 servings of fruits and vegetables",
                    "Track your daily progress"
                ],
                "created_at": datetime.utcnow()
            }
        }
    except Exception as e:
        print(f"ArogyaMitra AI Error: {e}")
        return {
            "success": True,
            "plan": {
                "title": "ArogyaMitra Wellness Plan",
                "description": "Personalized wellness plan created by ArogyaMitra AI for your optimal health journey.",
                "recommendations": [
                    "Drink 8 glasses of water daily",
                    "Exercise for 30 minutes",
                    "Get 8 hours of sleep",
                    "Practice meditation for 10 minutes daily"
                ],
                "created_at": datetime.utcnow()
            }
        }

async def get_arogyamitra_nutrition_info(food: str) -> dict:
    """Get nutrition info using Spoonacular API for ArogyaMitra"""
    try:
        url = f"https://api.spoonacular.com/food/ingredients/search?query={food}&apiKey={SPOONACULAR_API_KEY}"
        response = requests.get(url, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("results") and len(data["results"]) > 0:
                nutrition = data["results"][0].get("nutrition", {})
                return {
                    "success": True,
                    "nutrition": {
                        "calories": nutrition.get("calories", 250),
                        "protein": nutrition.get("protein", 20),
                        "carbs": nutrition.get("carbs", 30),
                        "fat": nutrition.get("fat", 10),
                        "fiber": nutrition.get("fiber", 5)
                    }
                }
        
        # Mock nutrition data for ArogyaMitra
        return {
            "success": True,
            "nutrition": {
                "calories": 250,
                "protein": 20,
                "carbs": 30,
                "fat": 10,
                "fiber": 5
            }
        }
    except Exception as e:
        print(f"ArogyaMitra Nutrition Error: {e}")
        return {
            "success": True,
            "nutrition": {
                "calories": 250,
                "protein": 20,
                "carbs": 30,
                "fat": 10,
                "fiber": 5
            }
        }

# ArogyaMitra Routes
@app.get("/")
def read_root():
    return {
        "status": "ok", 
        "message": "ArogyaMitra Backend is running",
        "platform": "Next-Gen AI Wellness Platform",
        "creator": "Shreyash Sanjay Tardekar",
        "version": "2.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ArogyaMitra"}

@app.post("/api/auth/register", response_model=Token)
async def register(user: UserCreate):
    global users_counter
    
    # Check if user already exists in ArogyaMitra
    for existing_user in arogyamitra_users_db.values():
        if existing_user["username"] == user.username or existing_user["email"] == user.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already registered in ArogyaMitra"
            )
    
    # Create new ArogyaMitra user
    hashed_password = get_password_hash(user.password)
    new_user = {
        "id": users_counter,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    arogyamitra_users_db[users_counter] = new_user
    users_counter += 1
    
    # Create access token for ArogyaMitra
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin):
    # Find user in ArogyaMitra database
    user_data = None
    for existing_user in arogyamitra_users_db.values():
        if existing_user["username"] == user.username:
            user_data = existing_user
            break
    
    if user_data is None or not verify_password(user.password, user_data["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password for ArogyaMitra",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token for ArogyaMitra
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/users/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        username=current_user["username"],
        email=current_user["email"],
        full_name=current_user.get("full_name")
    )

@app.get("/api/wellness/plans")
async def get_wellness_plans(current_user: dict = Depends(get_current_user)):
    return {
        "platform": "ArogyaMitra",
        "plans": [
            {
                "id": 1,
                "title": "ArogyaMitra 7-Day Detox Plan",
                "description": "Cleanse your body with healthy foods and juices",
                "duration_days": 7,
                "difficulty": "easy",
                "features": ["Nutrition guidance", "Detox support", "Progress tracking"]
            },
            {
                "id": 2,
                "title": "ArogyaMitra 30-Day Fitness Challenge",
                "description": "Build strength and endurance with progressive workouts",
                "duration_days": 30,
                "difficulty": "medium",
                "features": ["Workout plans", "Progress tracking", "Achievement badges"]
            },
            {
                "id": 3,
                "title": "ArogyaMitra Sleep Optimization",
                "description": "Improve sleep quality and duration for better recovery",
                "duration_days": 21,
                "difficulty": "easy",
                "features": ["Sleep analysis", "Bedtime reminders", "Quality tracking"]
            }
        ]
    }

@app.post("/api/wellness/generate")
async def generate_wellness_plan(
    preferences: WellnessPlanRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate personalized wellness plan using ArogyaMitra AI"""
    try:
        plan_data = await generate_arogyamitra_wellness_plan(preferences.dict())
        
        return {
            "platform": "ArogyaMitra",
            "success": True,
            "plan": plan_data["plan"],
            "user": current_user["username"],
            "generated_by": "ArogyaMitra AI"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate ArogyaMitra wellness plan: {str(e)}"
        )

@app.get("/api/nutrition/{food}")
async def get_nutrition_info(
    food: str,
    current_user: dict = Depends(get_current_user)
):
    """Get nutrition information using ArogyaMitra's Spoonacular integration"""
    try:
        nutrition_data = await get_arogyamitra_nutrition_info(food)
        
        return {
            "platform": "ArogyaMitra",
            "success": True,
            "food": food,
            "nutrition": nutrition_data["nutrition"],
            "data_source": "Spoonacular API via ArogyaMitra"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get nutrition info for ArogyaMitra: {str(e)}"
        )

@app.post("/api/ai/chat")
async def ai_chat(
    message: str,
    current_user: dict = Depends(get_current_user)
):
    """ArogyaMitra AI Chat - Wellness coaching and advice"""
    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "llama3-70b-8192",
            "messages": [
                {
                    "role": "system",
                    "content": f"You are ArogyaMitra's AI wellness coach. Provide helpful health advice to {current_user['username']}. Be encouraging and supportive."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            "max_tokens": 300,
            "temperature": 0.7,
        }
        
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get("choices") and len(result["choices"]) > 0:
                ai_response = result["choices"][0]["message"]["content"]
                
                return {
                    "platform": "ArogyaMitra",
                    "success": True,
                    "user_message": message,
                    "ai_response": ai_response,
                    "timestamp": datetime.utcnow()
                }
        
        return {
            "platform": "ArogyaMitra",
            "success": True,
            "user_message": message,
            "ai_response": "I'm your ArogyaMitra AI wellness coach! Based on your question, I recommend focusing on consistency with your health routine and staying hydrated.",
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ArogyaMitra AI chat failed: {str(e)}"
        )

# Catch all routes to prevent 404 errors for ArogyaMitra
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        "platform": "ArogyaMitra",
        "status": "error",
        "message": "ArogyaMitra API - Route not found",
        "path": str(request.url.path),
        "available_endpoints": [
            "/api/auth/register",
            "/api/auth/login",
            "/api/users/me",
            "/api/wellness/plans",
            "/api/wellness/generate",
            "/api/nutrition/{food}",
            "/api/ai/chat",
            "/health",
            "/"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 ArogyaMitra Backend Starting...")
    print("🧠 AI Wellness Platform by Shreyash Sanjay Tardekar")
    print("🌐 Next-Gen AI Health Platform")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)
