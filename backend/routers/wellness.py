from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import json

from database import get_db, User, WellnessPlan, BiometricEntry
from schemas import WellnessPlanCreate, WellnessPlanResponse, WellnessInsights
from services.auth import get_current_user
from services.openai_service import generate_wellness_plan, analyze_wellness_data

router = APIRouter(prefix="/wellness", tags=["wellness"])

@router.post("/generate", response_model=WellnessPlanResponse)
async def create_wellness_plan(
    plan_data: WellnessPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate AI-powered personalized wellness plan"""
    try:
        # Get user's comprehensive profile
        user_profile = {
            "age": current_user.age,
            "gender": current_user.gender,
            "weight": current_user.current_weight,
            "height": current_user.height,
            "fitness_level": current_user.fitness_level,
            "fitness_goal": current_user.fitness_goal,
            "health_conditions": current_user.health_conditions or [],
            "preferences": plan_data.preferences,
            "goals": plan_data.goals
        }
        
        # Generate comprehensive wellness plan using AI
        ai_plan = await generate_wellness_plan(user_profile)
        
        # Save wellness plan to database
        wellness_plan = WellnessPlan(
            user_id=current_user.id,
            title="Comprehensive Wellness Plan",
            prompt=plan_data.prompt,
            plan_content=json.dumps(ai_plan) if isinstance(ai_plan, dict) else ai_plan,
            goals=json.dumps(plan_data.goals) if plan_data.goals else "[]",
            created_at=datetime.utcnow(),
            is_active=True
        )
        
        db.add(wellness_plan)
        db.commit()
        db.refresh(wellness_plan)
        
        return WellnessPlanResponse(
            id=wellness_plan.id,
            title=wellness_plan.title,
            prompt=wellness_plan.prompt,
            plan_content=wellness_plan.plan_content,
            goals=plan_data.goals,
            created_at=wellness_plan.created_at,
            is_active=wellness_plan.is_active
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate wellness plan: {str(e)}"
        )

@router.get("/current", response_model=Optional[WellnessPlanResponse])
async def get_current_wellness_plan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's current active wellness plan"""
    plan = db.query(WellnessPlan).filter(
        WellnessPlan.user_id == current_user.id,
        WellnessPlan.expires_at > datetime.utcnow()
    ).order_by(WellnessPlan.created_at.desc()).first()
    
    if not plan:
        return None
        
    return WellnessPlanResponse(
        id=plan.id,
        plan_type=plan.plan_type,
        plan_data=plan.plan_data,
        created_at=plan.created_at,
        expires_at=plan.expires_at,
        is_active=True
    )

@router.put("/optimize", response_model=WellnessPlanResponse)
async def optimize_wellness_plan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Use ML to optimize existing wellness plan based on progress"""
    try:
        # Get current plan and user progress
        current_plan = db.query(WellnessPlan).filter(
            WellnessPlan.user_id == current_user.id,
            WellnessPlan.expires_at > datetime.utcnow()
        ).first()
        
        if not current_plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active wellness plan found"
            )
        
        # Analyze progress and optimize
        optimized_plan = await analyze_wellness_data(
            current_user.id,
            current_plan.plan_data
        )
        
        # Update plan with optimizations
        current_plan.plan_data = optimized_plan
        current_plan.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(current_plan)
        
        return WellnessPlanResponse(
            id=current_plan.id,
            plan_type=current_plan.plan_type,
            plan_data=optimized_plan,
            created_at=current_plan.created_at,
            expires_at=current_plan.expires_at,
            is_active=True
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to optimize wellness plan: {str(e)}"
        )

@router.get("/history", response_model=List[WellnessPlanResponse])
async def get_wellness_history(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's wellness plan history"""
    plans = db.query(WellnessPlan).filter(
        WellnessPlan.user_id == current_user.id
    ).order_by(WellnessPlan.created_at.desc()).limit(limit).all()
    
    return [
        WellnessPlanResponse(
            id=plan.id,
            plan_type=plan.plan_type,
            plan_data=plan.plan_data,
            created_at=plan.created_at,
            expires_at=plan.expires_at,
            is_active=plan.expires_at > datetime.utcnow()
        )
        for plan in plans
    ]

@router.get("/insights", response_model=WellnessInsights)
async def get_wellness_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI-powered wellness insights and recommendations"""
    try:
        # Get user's biometric data and progress
        biometric_data = db.query(BiometricEntry).filter(
            BiometricEntry.user_id == current_user.id
        ).order_by(BiometricEntry.timestamp.desc()).limit(30).all()
        
        # Generate insights using AI
        insights = await analyze_wellness_data(current_user.id, biometric_data)
        
        return WellnessInsights(
            metabolic_age=insights.get("metabolic_age"),
            wellness_score=insights.get("wellness_score"),
            recovery_rate=insights.get("recovery_rate"),
            recommendations=insights.get("recommendations", []),
            risk_factors=insights.get("risk_factors", []),
            achievements=insights.get("achievements", [])
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate wellness insights: {str(e)}"
        )

@router.delete("/{plan_id}")
async def delete_wellness_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a wellness plan"""
    plan = db.query(WellnessPlan).filter(
        WellnessPlan.id == plan_id,
        WellnessPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wellness plan not found"
        )
    
    db.delete(plan)
    db.commit()
    
    return {"message": "Wellness plan deleted successfully"}
