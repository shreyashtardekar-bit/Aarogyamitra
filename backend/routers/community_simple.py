from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json

from database import get_db, User
from services.auth import get_current_user

router = APIRouter(prefix="/community", tags=["community"])

@router.get("/challenges")
async def get_challenges(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get available wellness challenges"""
    try:
        return [
            {
                "id": 1,
                "title": "10K Steps Daily",
                "description": "Walk 10,000 steps every day for a month",
                "participants": 1250,
                "duration_days": 30,
                "difficulty": "medium",
                "reward_points": 500,
                "is_joined": True
            },
            {
                "id": 2,
                "title": "Sleep Better Challenge",
                "description": "Get 8 hours of quality sleep for 21 days",
                "participants": 890,
                "duration_days": 21,
                "difficulty": "easy",
                "reward_points": 300,
                "is_joined": False
            },
            {
                "id": 3,
                "title": "Hydration Hero",
                "description": "Drink 8 glasses of water daily for 2 weeks",
                "participants": 2100,
                "duration_days": 14,
                "difficulty": "easy",
                "reward_points": 200,
                "is_joined": True
            }
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get challenges: {str(e)}"
        )

@router.post("/challenges/{challenge_id}/join")
async def join_challenge(
    challenge_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Join a wellness challenge"""
    try:
        return {
            "success": True,
            "challenge_id": challenge_id,
            "user_id": current_user.id,
            "joined_at": datetime.now(),
            "message": "Successfully joined challenge!"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to join challenge: {str(e)}"
        )

@router.get("/leaderboard")
async def get_leaderboard(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get community leaderboard"""
    try:
        return [
            {
                "rank": 1,
                "username": "fitness_guru",
                "points": 2450,
                "challenges_completed": 12,
                "streak_days": 45
            },
            {
                "rank": 2,
                "username": "wellness_warrior",
                "points": 2380,
                "challenges_completed": 11,
                "streak_days": 38
            },
            {
                "rank": 3,
                "username": current_user.username,
                "points": 1850,
                "challenges_completed": 8,
                "streak_days": 21
            }
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get leaderboard: {str(e)}"
        )

@router.get("/posts")
async def get_community_posts(
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get community posts"""
    try:
        return [
            {
                "id": 1,
                "author": "fitness_guru",
                "content": "Just completed my 10K steps challenge! Feeling amazing! 💪",
                "likes": 45,
                "comments": 12,
                "timestamp": datetime.now() - timedelta(hours=2),
                "is_liked": False
            },
            {
                "id": 2,
                "author": "wellness_warrior",
                "content": "New personal record on my morning run! 5K in 22 minutes 🏃‍♂️",
                "likes": 38,
                "comments": 8,
                "timestamp": datetime.now() - timedelta(hours=4),
                "is_liked": True
            },
            {
                "id": 3,
                "author": "health_hero",
                "content": "Sleep quality has improved so much since joining the challenges!",
                "likes": 67,
                "comments": 23,
                "timestamp": datetime.now() - timedelta(hours=6),
                "is_liked": False
            }
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get community posts: {str(e)}"
        )

@router.post("/posts")
async def create_post(
    content: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a community post"""
    try:
        return {
            "id": 999,
            "author": current_user.username,
            "content": content,
            "likes": 0,
            "comments": 0,
            "timestamp": datetime.now(),
            "is_liked": False
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create post: {str(e)}"
        )
