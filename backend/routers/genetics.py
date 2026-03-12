from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import csv
import io

from database import get_db, User
from schemas import GeneticDataCreate, GeneticAnalysisResponse, GeneticInsights
from services.auth import get_current_user
from services.genetics_service import analyze_genetic_markers, get_dna_recommendations

router = APIRouter(prefix="/genetics", tags=["genetics"])

@router.post("/upload", response_model=GeneticAnalysisResponse)
async def upload_genetic_data(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and analyze genetic data from DNA test files"""
    try:
        # Validate file type
        if not file.filename.endswith(('.csv', '.txt', '.json')):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only CSV, TXT, and JSON files are supported"
            )
        
        # Read and parse genetic data
        content = await file.read()
        
        if file.filename.endswith('.csv'):
            genetic_data = parse_csv_genetic_data(content)
        elif file.filename.endswith('.json'):
            genetic_data = json.loads(content.decode('utf-8'))
        else:
            genetic_data = parse_txt_genetic_data(content)
        
        # Analyze genetic markers
        analysis = await analyze_genetic_markers(genetic_data)
        
        # Save genetic data to database
        genetic_entry = GeneticData(
            user_id=current_user.id,
            raw_data=genetic_data,
            analysis_results=analysis,
            uploaded_at=datetime.utcnow(),
            source=file.filename
        )
        
        db.add(genetic_entry)
        db.commit()
        db.refresh(genetic_entry)
        
        return GeneticAnalysisResponse(
            id=genetic_entry.id,
            analysis_results=analysis,
            uploaded_at=genetic_entry.uploaded_at,
            data_quality_score=analysis.get("quality_score", 0.0),
            markers_analyzed=len(analysis.get("markers", {}))
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process genetic data: {str(e)}"
        )

@router.get("/analysis", response_model=GeneticAnalysisResponse)
async def get_genetic_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get latest genetic analysis for user"""
    genetic_data = db.query(GeneticData).filter(
        GeneticData.user_id == current_user.id
    ).order_by(GeneticData.uploaded_at.desc()).first()
    
    if not genetic_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No genetic data found. Please upload your DNA test results first."
        )
    
    return GeneticAnalysisResponse(
        id=genetic_data.id,
        analysis_results=genetic_data.analysis_results,
        uploaded_at=genetic_data.uploaded_at,
        data_quality_score=genetic_data.analysis_results.get("quality_score", 0.0),
        markers_analyzed=len(genetic_data.analysis_results.get("markers", {}))
    )

@router.get("/insights", response_model=GeneticInsights)
async def get_genetic_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get personalized genetic insights and recommendations"""
    try:
        genetic_data = db.query(GeneticData).filter(
            GeneticData.user_id == current_user.id
        ).order_by(GeneticData.uploaded_at.desc()).first()
        
        if not genetic_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No genetic data found"
            )
        
        # Generate personalized recommendations
        recommendations = await get_dna_recommendations(
            genetic_data.analysis_results,
            current_user
        )
        
        return GeneticInsights(
            health_risks=recommendations.get("health_risks", []),
            nutritional_needs=recommendations.get("nutritional_needs", []),
            exercise_recommendations=recommendations.get("exercise_recommendations", []),
            metabolic_profile=recommendations.get("metabolic_profile", {}),
            sleep_patterns=recommendations.get("sleep_patterns", {}),
            stress_response=recommendations.get("stress_response", {}),
            longevity_factors=recommendations.get("longevity_factors", [])
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate genetic insights: {str(e)}"
        )

@router.post("/traits", response_model=Dict[str, Any])
async def update_genetic_traits(
    traits_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update manually reported genetic traits and family history"""
    try:
        # Update user's genetic traits
        current_user.genetic_traits = traits_data
        current_user.family_history = traits_data.get("family_history", {})
        
        db.commit()
        
        # Re-analyze with new trait data
        genetic_data = db.query(GeneticData).filter(
            GeneticData.user_id == current_user.id
        ).order_by(GeneticData.uploaded_at.desc()).first()
        
        if genetic_data:
            updated_analysis = await analyze_genetic_markers(
                genetic_data.raw_data,
                traits_data
            )
            genetic_data.analysis_results = updated_analysis
            db.commit()
        
        return {"message": "Genetic traits updated successfully", "traits": traits_data}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update genetic traits: {str(e)}"
        )

@router.get("/recommendations", response_model=List[Dict[str, Any]])
async def get_dna_based_recommendations(
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get DNA-based recommendations for specific categories"""
    try:
        genetic_data = db.query(GeneticData).filter(
            GeneticData.user_id == current_user.id
        ).order_by(GeneticData.uploaded_at.desc()).first()
        
        if not genetic_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No genetic data found"
            )
        
        recommendations = await get_dna_recommendations(
            genetic_data.analysis_results,
            current_user,
            category
        )
        
        return recommendations.get("recommendations", [])
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get DNA recommendations: {str(e)}"
        )

def parse_csv_genetic_data(content: bytes) -> Dict[str, Any]:
    """Parse genetic data from CSV format"""
    try:
        content_str = content.decode('utf-8')
        reader = csv.DictReader(io.StringIO(content_str))
        
        genetic_data = {
            "format": "csv",
            "markers": {},
            "raw_data": []
        }
        
        for row in reader:
            if 'rsid' in row and 'genotype' in row:
                genetic_data["markers"][row['rsid']] = row['genotype']
            genetic_data["raw_data"].append(row)
        
        return genetic_data
        
    except Exception as e:
        raise ValueError(f"Failed to parse CSV genetic data: {str(e)}")

def parse_txt_genetic_data(content: bytes) -> Dict[str, Any]:
    """Parse genetic data from text format"""
    try:
        content_str = content.decode('utf-8')
        lines = content_str.strip().split('\n')
        
        genetic_data = {
            "format": "txt",
            "markers": {},
            "raw_data": content_str
        }
        
        for line in lines:
            if '\t' in line:
                parts = line.strip().split('\t')
                if len(parts) >= 2:
                    rsid = parts[0]
                    genotype = parts[1]
                    genetic_data["markers"][rsid] = genotype
        
        return genetic_data
        
    except Exception as e:
        raise ValueError(f"Failed to parse text genetic data: {str(e)}")
