from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class UserProfile(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    current_weight: Optional[float] = None
    target_weight: Optional[float] = None
    fitness_level: Optional[str] = None
    health_conditions: Optional[List[str]] = []
    dietary_restrictions: Optional[List[str]] = []
    fitness_goal: Optional[str] = None


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    current_weight: Optional[float] = None
    target_weight: Optional[float] = None
    fitness_level: Optional[str] = None
    health_conditions: Optional[List[str]] = None
    dietary_restrictions: Optional[List[str]] = None
    fitness_goal: Optional[str] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime
    age: Optional[int]
    gender: Optional[str]
    height: Optional[float]
    current_weight: Optional[float]
    target_weight: Optional[float]
    fitness_level: Optional[str]
    fitness_goal: Optional[str]
    
    class Config:
        from_attributes = True


# Workout schemas
class WorkoutPlanCreate(BaseModel):
    prompt: str = Field(..., min_length=10)


class WorkoutPlanResponse(BaseModel):
    id: int
    title: Optional[str]
    prompt: str
    plan_content: str
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True


# Meal plan schemas
class MealPlanCreate(BaseModel):
    prompt: str = Field(..., min_length=10)


class MealPlanResponse(BaseModel):
    id: int
    title: Optional[str]
    prompt: str
    plan_content: str
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True


# Progress schemas
class ProgressEntryCreate(BaseModel):
    weight: float
    body_fat_percentage: Optional[float] = None
    measurements: Optional[dict[str, float]] = None
    notes: Optional[str] = None


class ProgressEntryResponse(BaseModel):
    id: int
    date: datetime
    weight: float
    body_fat_percentage: Optional[float]
    measurements: Optional[str]
    notes: Optional[str]
    
    class Config:
        from_attributes = True


# Chat schemas
class ChatRequest(BaseModel):
    prompt: str = Field(..., min_length=1)


class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    timestamp: datetime
    
    class Config:
        from_attributes = True


# Achievement schemas
class AchievementResponse(BaseModel):
    id: int
    achievement_type: str
    title: str
    description: Optional[str]
    points: int
    charity_contribution: float
    unlocked_at: datetime
    
    class Config:
        from_attributes = True


# Wellness schemas
class WellnessPlanCreate(BaseModel):
    prompt: str = Field(..., min_length=10)
    goals: Optional[List[str]] = []
    preferences: Optional[dict] = {}

class WellnessPlanResponse(BaseModel):
    id: int
    title: Optional[str]
    prompt: str
    plan_content: str
    goals: List[str]
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class WellnessInsights(BaseModel):
    insights: List[str]
    recommendations: List[str]
    score: Optional[float] = None

# Genetic schemas
class GeneticDataCreate(BaseModel):
    dna_data: str = Field(..., min_length=10)
    traits: Optional[dict] = {}

class GeneticAnalysisResponse(BaseModel):
    id: int
    health_risks: List[dict]
    recommendations: List[str]
    nutrition_needs: dict
    created_at: datetime
    
    class Config:
        from_attributes = True

class GeneticInsights(BaseModel):
    risk_factors: List[dict]
    genetic_markers: List[str]
    health_predictions: List[str]
    lifestyle_recommendations: List[str]

# Biometric schemas
class BiometricAnalytics(BaseModel):
    trends: dict
    averages: dict
    insights: List[str]

class BiometricEntryCreate(BaseModel):
    heart_rate: Optional[int] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    weight: Optional[float] = None
    sleep_hours: Optional[float] = None
    stress_level: Optional[int] = None

class BiometricResponse(BaseModel):
    id: int
    measurements: dict
    timestamp: datetime
    alerts: List[str]
    
    class Config:
        from_attributes = True

# AI Coach schemas
class AIAnalysisRequest(BaseModel):
    query: str = Field(..., min_length=5)
    context: Optional[dict] = {}

class AIAnalysisResponse(BaseModel):
    insights: List[str]
    recommendations: List[str]
    emotional_tone: str
    confidence_score: float

# Device schemas
class DeviceConnectCreate(BaseModel):
    device_type: str = Field(..., min_length=3)
    device_id: str
    access_token: Optional[str] = None

class DeviceResponse(BaseModel):
    id: int
    device_type: str
    device_id: str
    is_connected: bool
    battery_level: Optional[int] = None
    last_sync: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Community schemas
class ChallengeResponse(BaseModel):
    id: int
    title: str
    description: str
    participants_count: int
    end_date: datetime
    difficulty: str
    
    class Config:
        from_attributes = True

class CommunityPostCreate(BaseModel):
    content: str = Field(..., min_length=5)
    challenge_id: Optional[int] = None

class CommunityPostResponse(BaseModel):
    id: int
    content: str
    author: str
    likes_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Response wrappers
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MessageResponse(BaseModel):
    message: str
