from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from datetime import datetime

from database import get_db, User
from services.auth import get_current_user
from schemas import ChatRequest

router = APIRouter(prefix="/coach", tags=["ai-coach"])

@router.post("/chat")
async def chat_with_ai(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Simple AI chat functionality"""
    try:
        # Simple response for now
        response = f"Hello {current_user.username}! I'm your ArogyaMitra AI coach. You said: {request.prompt}"
        
        return {
            "response": response,
            "timestamp": datetime.now(),
            "user_id": current_user.id
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process chat: {str(e)}"
        )

@router.get("/insights")
async def get_insights(
    current_user: User = Depends(get_current_user)
):
    """Get simple wellness insights"""
    return {
        "insights": ["Stay hydrated", "Get 8 hours of sleep", "Exercise regularly"],
        "recommendations": ["Drink more water", "Maintain sleep schedule", "Daily walks"],
        "user_id": current_user.id
    }
