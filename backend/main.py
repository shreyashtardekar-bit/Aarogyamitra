from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, token, wellness, genetics, biometrics, coach, devices_simple as devices, community_simple as community, workout, meals, progress
from database import init_db, SessionLocal, User
from services.auth import get_password_hash
import json
app = FastAPI(
    title="ArogyaMitra API", 
    version="2.0.0",
    description="Next-Gen AI Wellness Platform by Shreyash Sanjay Tardekar"
)

# CORS - Allow frontend from any origin for deployment flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    """Initialize database and create default admin user"""
    init_db()
    
    # Create default admin user if not exists
    db = SessionLocal()
    try:
        # Create shreyash user
        shreyash = db.query(User).filter(User.username == "shreyash").first()
        if not shreyash:
            shreyash_user = User(
                username="shreyash",
                email="shreyash@vitalflow.com",
                full_name="Shreyash Sanjay Tardekar",
                hashed_password=get_password_hash("vitalflow2024"),
                fitness_level="advanced",
                fitness_goal="optimization"
            )
            db.add(shreyash_user)
            
        # Create admin user for demo
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin_user = User(
                username="admin",
                email="admin@arogyamitra.com",
                full_name="Admin User",
                hashed_password=get_password_hash("admin123"),
                fitness_level="intermediate",
                fitness_goal="maintenance"
            )
            db.add(admin_user)
            
        db.commit()
        print("✓ Default users created successfully")
    finally:
        db.close()


app.include_router(users.router)
app.include_router(token.router)
app.include_router(wellness.router)
app.include_router(genetics.router)
app.include_router(biometrics.router)
app.include_router(coach.router)
app.include_router(devices.router)
app.include_router(community.router)
app.include_router(workout.router)
app.include_router(meals.router)
app.include_router(progress.router)

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
