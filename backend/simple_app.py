from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import hashlib
from datetime import datetime, timedelta
import uuid

# FastAPI app
app = FastAPI(
    title="ArogyaMitra API",
    version="2.0.0",
    description="Next-Gen AI Wellness Platform by Shreyash Sanjay Tardekar"
)

# CORS
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

# Pydantic Models
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

# Mock Database
users_db = {}
users_counter = 1

# Helper Functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_simple_token(username: str) -> str:
    """Create a simple token without JWT"""
    return f"token-{uuid.uuid4().hex[:16]}-{username}"

# Routes
@app.get("/")
def read_root():
    return {
        "status": "ok", 
        "message": "ArogyaMitra Backend is running",
        "platform": "Next-Gen AI Wellness Platform",
        "creator": "Shreyash Sanjay Tardekar"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/auth/register", response_model=Token)
async def register(user: UserCreate):
    global users_counter
    
    # Check if user already exists
    for existing_user in users_db.values():
        if existing_user["username"] == user.username or existing_user["email"] == user.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already registered"
            )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    new_user = {
        "id": users_counter,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    users_db[users_counter] = new_user
    users_counter += 1
    
    # Create simple token
    access_token = create_simple_token(user.username)
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin):
    # Find user
    user_data = None
    for existing_user in users_db.values():
        if existing_user["username"] == user.username:
            user_data = existing_user
            break
    
    if user_data is None or not verify_password(user.password, user_data["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Create simple token
    access_token = create_simple_token(user.username)
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/users/me", response_model=UserResponse)
async def get_current_user_info(token: str):
    # Simple token validation (extract username from token)
    if not token.startswith("token-"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format"
        )
    
    # Extract username from token (simple approach)
    token_parts = token.split("-")
    if len(token_parts) < 3:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    username = token_parts[-1]
    
    # Find user
    user_data = None
    for existing_user in users_db.values():
        if existing_user["username"] == username:
            user_data = existing_user
            break
    
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return UserResponse(
        id=user_data["id"],
        username=user_data["username"],
        email=user_data["email"],
        full_name=user_data.get("full_name")
    )

@app.get("/api/wellness/plans")
async def get_wellness_plans(token: str):
    return {
        "plans": [
            {
                "id": 1,
                "title": "7-Day Detox Plan",
                "description": "Cleanse your body with healthy foods",
                "duration_days": 7,
                "difficulty": "easy"
            },
            {
                "id": 2,
                "title": "30-Day Fitness Challenge",
                "description": "Build strength and endurance",
                "duration_days": 30,
                "difficulty": "medium"
            }
        ]
    }

@app.post("/api/wellness/generate")
async def generate_wellness_plan(
    preferences: dict,
    token: str
):
    return {
        "plan": {
            "title": "Personalized Wellness Plan",
            "description": "AI-generated wellness plan based on your preferences",
            "recommendations": [
                "Drink 8 glasses of water daily",
                "Exercise for 30 minutes",
                "Get 8 hours of sleep",
                "Eat 5 servings of fruits and vegetables"
            ],
            "created_at": datetime.utcnow()
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)
