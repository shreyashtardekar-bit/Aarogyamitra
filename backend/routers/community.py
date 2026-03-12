from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json

from database import get_db, User
from schemas import (
    ChallengeCreate, ChallengeResponse, ChallengeJoinResponse,
    LeaderboardResponse, CommunityPostCreate, CommunityPostResponse
)
from services.auth import get_current_user

router = APIRouter(prefix="/community", tags=["community"])

@router.get("/challenges", response_model=List[ChallengeResponse])
async def get_active_challenges(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get active wellness challenges"""
    try:
        query = db.query(WellnessChallenge).filter(
            WellnessChallenge.is_active == True,
            WellnessChallenge.end_date > datetime.utcnow()
        )
        
        if category:
            query = query.filter(WellnessChallenge.category == category)
        if difficulty:
            query = query.filter(WellnessChallenge.difficulty == difficulty)
        
        challenges = query.order_by(WellnessChallenge.start_date.asc()).all()
        
        # Check user participation
        user_participations = db.query(ChallengeParticipant).filter(
            ChallengeParticipant.user_id == current_user.id
        ).all()
        participated_challenge_ids = [p.challenge_id for p in user_participations]
        
        return [
            ChallengeResponse(
                id=challenge.id,
                title=challenge.title,
                description=challenge.description,
                category=challenge.category,
                difficulty=challenge.difficulty,
                duration_days=challenge.duration_days,
                participants_count=len(db.query(ChallengeParticipant).filter(
                    ChallengeParticipant.challenge_id == challenge.id
                ).all()),
                prize_pool=challenge.prize_pool,
                start_date=challenge.start_date,
                end_date=challenge.end_date,
                requirements=challenge.requirements,
                rewards=challenge.rewards,
                is_user_participating=challenge.id in participated_challenge_ids,
                difficulty_badge=get_difficulty_badge(challenge.difficulty),
                category_icon=get_category_icon(challenge.category)
            )
            for challenge in challenges
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get challenges: {str(e)}"
        )

@router.post("/join/{challenge_id}", response_model=ChallengeJoinResponse)
async def join_challenge(
    challenge_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Join a wellness challenge"""
    try:
        # Check if challenge exists and is active
        challenge = db.query(WellnessChallenge).filter(
            WellnessChallenge.id == challenge_id,
            WellnessChallenge.is_active == True,
            WellnessChallenge.end_date > datetime.utcnow()
        ).first()
        
        if not challenge:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Challenge not found or has ended"
            )
        
        # Check if user already joined
        existing_participation = db.query(ChallengeParticipant).filter(
            ChallengeParticipant.user_id == current_user.id,
            ChallengeParticipant.challenge_id == challenge_id
        ).first()
        
        if existing_participation:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already joined this challenge"
            )
        
        # Create participation record
        participation = ChallengeParticipant(
            user_id=current_user.id,
            challenge_id=challenge_id,
            joined_at=datetime.utcnow(),
            progress_data={},
            current_streak=0,
            best_streak=0
        )
        
        db.add(participation)
        db.commit()
        db.refresh(participation)
        
        # Update challenge participants count
        challenge.participants_count += 1
        db.commit()
        
        return ChallengeJoinResponse(
            success=True,
            challenge_id=challenge_id,
            participation_id=participation.id,
            message=f"Successfully joined '{challenge.title}'!",
            next_milestone=calculate_next_milestone(challenge),
            team_members=get_team_members(challenge_id, db)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to join challenge: {str(e)}"
        )

@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    challenge_id: Optional[int] = None,
    time_period: str = "week",
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get wellness leaderboard"""
    try:
        # Calculate date range based on time period
        end_date = datetime.utcnow()
        if time_period == "day":
            start_date = end_date - timedelta(days=1)
        elif time_period == "week":
            start_date = end_date - timedelta(days=7)
        elif time_period == "month":
            start_date = end_date - timedelta(days=30)
        else:
            start_date = end_date - timedelta(days=7)
        
        # Get leaderboard data
        leaderboard_query = db.query(LeaderboardEntry).filter(
            LeaderboardEntry.timestamp >= start_date,
            LeaderboardEntry.timestamp <= end_date
        )
        
        if challenge_id:
            leaderboard_query = leaderboard_query.filter(
                LeaderboardEntry.challenge_id == challenge_id
            )
        
        if category:
            leaderboard_query = leaderboard_query.filter(
                LeaderboardEntry.category == category
            )
        
        leaderboard_entries = leaderboard_query.order_by(
            LeaderboardEntry.wellness_score.desc()
        ).limit(100).all()
        
        # Format leaderboard with user rankings
        leaderboard_data = []
        for rank, entry in enumerate(leaderboard_entries, 1):
            user = db.query(User).filter(User.id == entry.user_id).first()
            
            leaderboard_data.append({
                "rank": rank,
                "user_id": entry.user_id,
                "username": user.username if user else "Unknown",
                "full_name": user.full_name if user else "Unknown User",
                "wellness_score": entry.wellness_score,
                "streak_days": entry.streak_days,
                "achievements_count": entry.achievements_count,
                "challenge_wins": entry.challenge_wins,
                "profile_image": user.profile_image if user else None,
                "badge": get_rank_badge(rank),
                "is_current_user": entry.user_id == current_user.id
            })
        
        # Get current user's rank
        current_user_rank = next(
            (item["rank"] for item in leaderboard_data if item["is_current_user"]),
            None
        )
        
        return LeaderboardResponse(
            leaderboard=leaderboard_data,
            current_user_rank=current_user_rank,
            total_participants=len(leaderboard_data),
            time_period=time_period,
            category=category,
            challenge_id=challenge_id,
            last_updated=datetime.utcnow()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get leaderboard: {str(e)}"
        )

@router.post("/share", response_model=CommunityPostResponse)
async def share_progress(
    post_data: CommunityPostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Share wellness progress with community"""
    try:
        # Create community post
        post = CommunityPost(
            user_id=current_user.id,
            content=post_data.content,
            post_type=post_data.post_type or "progress",
            achievement_data=post_data.achievement_data,
            challenge_id=post_data.challenge_id,
            wellness_score=post_data.wellness_score,
            images=post_data.images,
            tags=post_data.tags,
            is_public=post_data.is_public,
            created_at=datetime.utcnow()
        )
        
        db.add(post)
        db.commit()
        db.refresh(post)
        
        # Get user info for response
        user = db.query(User).filter(User.id == current_user.id).first()
        
        return CommunityPostResponse(
            id=post.id,
            user_id=current_user.id,
            username=user.username,
            full_name=user.full_name,
            profile_image=user.profile_image,
            content=post.content,
            post_type=post.post_type,
            achievement_data=post.achievement_data,
            challenge_id=post.challenge_id,
            wellness_score=post.wellness_score,
            images=post.images,
            tags=post.tags,
            likes_count=0,
            comments_count=0,
            created_at=post.created_at,
            is_liked_by_user=False
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to share progress: {str(e)}"
        )

@router.get("/feed", response_model=List[CommunityPostResponse])
async def get_community_feed(
    limit: int = 20,
    offset: int = 0,
    post_type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get community feed with posts from other users"""
    try:
        query = db.query(CommunityPost).filter(
            CommunityPost.is_public == True
        )
        
        if post_type:
            query = query.filter(CommunityPost.post_type == post_type)
        
        posts = query.order_by(
            CommunityPost.created_at.desc()
        ).offset(offset).limit(limit).all()
        
        # Get post metadata
        feed_data = []
        for post in posts:
            user = db.query(User).filter(User.id == post.user_id).first()
            
            # Get likes and comments count
            likes_count = db.query(PostLike).filter(
                PostLike.post_id == post.id
            ).count()
            
            comments_count = db.query(PostComment).filter(
                PostComment.post_id == post.id
            ).count()
            
            # Check if current user liked this post
            is_liked = db.query(PostLike).filter(
                PostLike.post_id == post.id,
                PostLike.user_id == current_user.id
            ).first() is not None
            
            feed_data.append(CommunityPostResponse(
                id=post.id,
                user_id=post.user_id,
                username=user.username if user else "Unknown",
                full_name=user.full_name if user else "Unknown User",
                profile_image=user.profile_image if user else None,
                content=post.content,
                post_type=post.post_type,
                achievement_data=post.achievement_data,
                challenge_id=post.challenge_id,
                wellness_score=post.wellness_score,
                images=post.images,
                tags=post.tags,
                likes_count=likes_count,
                comments_count=comments_count,
                created_at=post.created_at,
                is_liked_by_user=is_liked
            ))
        
        return feed_data
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get community feed: {str(e)}"
        )

@router.post("/like/{post_id}", response_model=Dict[str, Any])
async def like_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Like a community post"""
    try:
        # Check if post exists
        post = db.query(CommunityPost).filter(
            CommunityPost.id == post_id
        ).first()
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        # Check if already liked
        existing_like = db.query(PostLike).filter(
            PostLike.post_id == post_id,
            PostLike.user_id == current_user.id
        ).first()
        
        if existing_like:
            # Unlike
            db.delete(existing_like)
            action = "unliked"
        else:
            # Like
            like = PostLike(
                post_id=post_id,
                user_id=current_user.id,
                created_at=datetime.utcnow()
            )
            db.add(like)
            action = "liked"
        
        db.commit()
        
        # Get updated likes count
        likes_count = db.query(PostLike).filter(
            PostLike.post_id == post_id
        ).count()
        
        return {
            "message": f"Post {action} successfully",
            "likes_count": likes_count,
            "is_liked": action == "liked"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to like post: {str(e)}"
        )

@router.get("/stats", response_model=Dict[str, Any])
async def get_community_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's community statistics"""
    try:
        # Get user's challenge participations
        participations = db.query(ChallengeParticipant).filter(
            ChallengeParticipant.user_id == current_user.id
        ).all()
        
        # Get user's posts
        posts = db.query(CommunityPost).filter(
            CommunityPost.user_id == current_user.id
        ).all()
        
        # Get total likes received
        total_likes = db.query(PostLike).join(CommunityPost).filter(
            CommunityPost.user_id == current_user.id
        ).count()
        
        # Get challenge wins
        challenge_wins = db.query(ChallengeParticipant).filter(
            ChallengeParticipant.user_id == current_user.id,
            ChallengeParticipant.is_winner == True
        ).count()
        
        # Calculate wellness score
        wellness_score = calculate_user_wellness_score(current_user.id, db)
        
        return {
            "challenges_joined": len(participations),
            "challenges_completed": len([p for p in participations if p.is_completed]),
            "challenge_wins": challenge_wins,
            "posts_shared": len(posts),
            "total_likes_received": total_likes,
            "current_streak": get_current_streak(current_user.id, db),
            "best_streak": get_best_streak(current_user.id, db),
            "wellness_score": wellness_score,
            "community_rank": get_community_rank(current_user.id, db),
            "achievements_unlocked": get_achievements_count(current_user.id, db)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get community stats: {str(e)}"
        )

def get_difficulty_badge(difficulty: str) -> str:
    """Get difficulty badge emoji"""
    badges = {
        "beginner": "🟢",
        "intermediate": "🟡",
        "advanced": "🟠",
        "expert": "🔴"
    }
    return badges.get(difficulty, "⚪")

def get_category_icon(category: str) -> str:
    """Get category icon"""
    icons = {
        "fitness": "💪",
        "nutrition": "🥗",
        "mindfulness": "🧘",
        "sleep": "😴",
        "hydration": "💧",
        "steps": "🚶",
        "weight_loss": "⚖️"
    }
    return icons.get(category, "🎯")

def get_rank_badge(rank: int) -> str:
    """Get rank badge"""
    if rank == 1:
        return "🥇"
    elif rank == 2:
        return "🥈"
    elif rank == 3:
        return "🥉"
    elif rank <= 10:
        return "⭐"
    elif rank <= 50:
        return "✨"
    else:
        return "🌟"

def calculate_next_milestone(challenge) -> Dict[str, Any]:
    """Calculate next milestone for challenge"""
    return {
        "type": "progress",
        "target": "50% completion",
        "reward": "Badge unlock",
        "days_remaining": (challenge.end_date - datetime.utcnow()).days
    }

def get_team_members(challenge_id: int, db) -> List[Dict[str, Any]]:
    """Get team members for challenge"""
    participants = db.query(ChallengeParticipant).filter(
        ChallengeParticipant.challenge_id == challenge_id
    ).limit(5).all()
    
    team_members = []
    for participant in participants:
        user = db.query(User).filter(User.id == participant.user_id).first()
        if user:
            team_members.append({
                "username": user.username,
                "full_name": user.full_name,
                "profile_image": user.profile_image
            })
    
    return team_members

def calculate_user_wellness_score(user_id: int, db) -> float:
    """Calculate user's wellness score"""
    # Simplified calculation - in real implementation, this would be more complex
    biometric_entries = db.query(BiometricEntry).filter(
        BiometricEntry.user_id == user_id
    ).order_by(BiometricEntry.timestamp.desc()).limit(30).all()
    
    if not biometric_entries:
        return 0.0
    
    # Calculate based on various factors
    avg_heart_rate = sum(entry.heart_rate for entry in biometric_entries) / len(biometric_entries)
    avg_sleep = sum(entry.sleep_hours or 0 for entry in biometric_entries) / len(biometric_entries)
    
    # Simple scoring algorithm
    heart_rate_score = max(0, 100 - abs(avg_heart_rate - 70))  # Ideal heart rate around 70
    sleep_score = min(100, (avg_sleep / 8) * 100)  # Ideal sleep 8 hours
    
    return (heart_rate_score + sleep_score) / 2

def get_current_streak(user_id: int, db) -> int:
    """Get current wellness streak"""
    # Simplified implementation
    return 7  # Example value

def get_best_streak(user_id: int, db) -> int:
    """Get best wellness streak"""
    # Simplified implementation
    return 21  # Example value

def get_community_rank(user_id: int, db) -> int:
    """Get user's community rank"""
    # Simplified implementation
    return 42  # Example value

def get_achievements_count(user_id: int, db) -> int:
    """Get achievements count"""
    # Simplified implementation
    return 15  # Example value
