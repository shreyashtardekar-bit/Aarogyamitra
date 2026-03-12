from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
import json

from database import get_db, User
from schemas import ChatRequest, ChatMessageResponse
from services.auth import get_current_user
from services.openai_service import vital_ai_chat, analyze_user_context, generate_personalized_insights

router = APIRouter(prefix="/ai-coach", tags=["ai-coach"])

@router.post("/chat", response_model=ChatMessageResponse)
async def chat_with_vital(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Chat with VITAL AI Coach - Advanced wellness coaching with emotional intelligence"""
    try:
        # Get user context for personalized responses
        user_context = await analyze_user_context(current_user, db)
        
        # Process chat with VITAL AI
        ai_response = await vital_ai_chat(
            message=chat_request.message,
            user_context=user_context,
            conversation_history=chat_request.conversation_history,
            emotional_state=chat_request.emotional_state,
            voice_input=chat_request.voice_input
        )
        
        # Save conversation to database
        chat_entry = AIConversation(
            user_id=current_user.id,
            user_message=chat_request.message,
            ai_response=ai_response["response"],
            emotional_state=chat_request.emotional_state,
            context_used=user_context,
            timestamp=datetime.utcnow(),
            message_type=chat_request.message_type or "text"
        )
        
        db.add(chat_entry)
        db.commit()
        
        return ChatMessageResponse(
            role="assistant",
            content=ai_response["response"],
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process AI chat: {str(e)}"
        )

@router.post("/analyze", response_model=Dict[str, Any])
async def comprehensive_wellness_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Comprehensive wellness analysis by VITAL AI"""
    try:
        # Gather all user data
        user_data = await collect_comprehensive_user_data(current_user, db)
        
        # Perform deep analysis
        analysis = await vital_ai_chat(
            message="Perform comprehensive wellness analysis",
            user_context=user_data,
            analysis_type="comprehensive",
            include_predictions=True
        )
        
        return {
            "overall_wellness_score": analysis.get("wellness_score"),
            "key_insights": analysis.get("insights", []),
            "risk_factors": analysis.get("risk_factors", []),
            "strengths": analysis.get("strengths", []),
            "improvement_areas": analysis.get("improvement_areas", []),
            "predictive_insights": analysis.get("predictions", {}),
            "actionable_recommendations": analysis.get("recommendations", []),
            "emotional_wellbeing": analysis.get("emotional_analysis", {}),
            "life_balance_score": analysis.get("life_balance", {})
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to perform comprehensive analysis: {str(e)}"
        )

@router.get("/insights", response_model=Dict[str, Any])
async def get_personalized_insights(
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get personalized AI insights for specific wellness categories"""
    try:
        insights = await generate_personalized_insights(
            user=current_user,
            db=db,
            category=category
        )
        
        return {
            "insights": insights.get("insights", []),
            "recommendations": insights.get("recommendations", []),
            "motivational_quotes": insights.get("motivational_quotes", []),
            "educational_content": insights.get("educational_content", []),
            "action_items": insights.get("action_items", []),
            "progress_predictions": insights.get("predictions", {}),
            "personalized_tips": insights.get("tips", [])
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate insights: {str(e)}"
        )

@router.get("/history", response_model=List[Dict[str, Any]])
async def get_conversation_history(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get conversation history with VITAL AI"""
    conversations = db.query(AIConversation).filter(
        AIConversation.user_id == current_user.id
    ).order_by(AIConversation.timestamp.desc()).limit(limit).all()
    
    return [
        {
            "id": conv.id,
            "user_message": conv.user_message,
            "ai_response": conv.ai_response,
            "emotional_state": conv.emotional_state,
            "timestamp": conv.timestamp.isoformat(),
            "message_type": conv.message_type,
            "context_used": conv.context_used
        }
        for conv in conversations
    ]

@router.post("/feedback", response_model=Dict[str, Any])
async def submit_ai_feedback(
    feedback_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit feedback to improve VITAL AI responses"""
    try:
        # Save feedback for AI model improvement
        feedback = AIFeedback(
            user_id=current_user.id,
            conversation_id=feedback_data.get("conversation_id"),
            rating=feedback_data.get("rating"),
            feedback_text=feedback_data.get("feedback_text"),
            helpful=feedback_data.get("helpful"),
            timestamp=datetime.utcnow()
        )
        
        db.add(feedback)
        db.commit()
        
        return {
            "message": "Thank you for your feedback! VITAL AI will learn from this.",
            "feedback_id": feedback.id
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit feedback: {str(e)}"
        )

@router.delete("/history")
async def clear_conversation_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear conversation history"""
    try:
        db.query(AIConversation).filter(
            AIConversation.user_id == current_user.id
        ).delete()
        
        db.commit()
        
        return {"message": "Conversation history cleared successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear conversation history: {str(e)}"
        )

@router.get("/personality", response_model=Dict[str, Any])
async def get_ai_personality_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get VITAL AI personality adaptation for user"""
    try:
        # Analyze conversation patterns to adapt AI personality
        conversations = db.query(AIConversation).filter(
            AIConversation.user_id == current_user.id
        ).order_by(AIConversation.timestamp.desc()).limit(100).all()
        
        personality_analysis = await analyze_conversation_patterns(conversations)
        
        return {
            "ai_personality_traits": personality_analysis.get("traits", {}),
            "communication_style": personality_analysis.get("communication_style", {}),
            "emotional_intelligence": personality_analysis.get("emotional_intelligence", {}),
            "adaptation_level": personality_analysis.get("adaptation_level", 0.0),
            "preferred_interaction_type": personality_analysis.get("preferred_interaction", "text"),
            "personalization_score": personality_analysis.get("personalization_score", 0.0)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get AI personality profile: {str(e)}"
        )

async def collect_comprehensive_user_data(user, db):
    """Collect comprehensive user data for AI analysis"""
    # Get recent biometric data
    recent_biometrics = db.query(BiometricEntry).filter(
        BiometricEntry.user_id == user.id
    ).order_by(BiometricEntry.timestamp.desc()).limit(30).all()
    
    # Get wellness plans
    wellness_plans = db.query(WellnessPlan).filter(
        WellnessPlan.user_id == user.id
    ).order_by(WellnessPlan.created_at.desc()).limit(5).all()
    
    # Get genetic data if available
    genetic_data = db.query(GeneticData).filter(
        GeneticData.user_id == user.id
    ).order_by(GeneticData.uploaded_at.desc()).first()
    
    return {
        "user_profile": {
            "age": user.age,
            "gender": user.gender,
            "fitness_level": user.fitness_level,
            "fitness_goal": user.fitness_goal,
            "health_conditions": user.health_conditions
        },
        "biometric_data": [
            {
                "heart_rate": entry.heart_rate,
                "blood_pressure": {
                    "systolic": entry.blood_pressure_systolic,
                    "diastolic": entry.blood_pressure_diastolic
                },
                "stress_level": entry.stress_level,
                "sleep_quality": entry.sleep_quality,
                "timestamp": entry.timestamp.isoformat()
            }
            for entry in recent_biometrics
        ],
        "wellness_plans": [
            {
                "plan_type": plan.plan_type,
                "created_at": plan.created_at.isoformat(),
                "plan_data": plan.plan_data
            }
            for plan in wellness_plans
        ],
        "genetic_insights": genetic_data.analysis_results if genetic_data else None
    }

async def analyze_conversation_patterns(conversations):
    """Analyze conversation patterns to adapt AI personality"""
    if not conversations:
        return {
            "traits": {},
            "communication_style": "professional",
            "emotional_intelligence": {"empathy": 0.8, "supportiveness": 0.9},
            "adaptation_level": 0.0,
            "preferred_interaction": "text",
            "personalization_score": 0.0
        }
    
    # Analyze patterns (simplified for this example)
    total_conversations = len(conversations)
    emotional_states = [conv.emotional_state for conv in conversations if conv.emotional_state]
    
    return {
        "traits": {
            "supportiveness": 0.9,
            "motivation": 0.85,
            "empathy": 0.88,
            "expertise": 0.92
        },
        "communication_style": "empathetic_professional",
        "emotional_intelligence": {
            "empathy": 0.88,
            "supportiveness": 0.90,
            "adaptability": 0.85
        },
        "adaptation_level": min(total_conversations / 50.0, 1.0),
        "preferred_interaction": "mixed",
        "personalization_score": min(total_conversations / 30.0, 1.0)
    }
