import json
from typing import Dict, List, Any
from datetime import datetime

class GeneticsService:
    def __init__(self):
        self.known_markers = self._load_genetic_markers()
        
    def _load_genetic_markers(self) -> Dict[str, Dict]:
        """Load known genetic markers and their associations"""
        return {
            "rs7903146": {
                "gene": "TCF7L2",
                "trait": "Type 2 Diabetes Risk",
                "risk_allele": "T",
                "description": "Associated with increased risk of type 2 diabetes"
            },
            "rs9939609": {
                "gene": "FTO",
                "trait": "Obesity Risk",
                "risk_allele": "A",
                "description": "Associated with BMI and obesity risk"
            },
            "rs429358": {
                "gene": "APOE",
                "trait": "Alzheimer's Risk",
                "risk_allele": "C",
                "description": "Part of APOE e4 allele associated with Alzheimer's"
            },
            "rs1801133": {
                "gene": "MTHFR",
                "trait": "Folate Metabolism",
                "risk_allele": "T",
                "description": "Affects folate and B-vitamin metabolism"
            },
            "rs1799853": {
                "gene": "LCT",
                "trait": "Lactose Intolerance",
                "risk_allele": "C",
                "description": "Associated with lactose intolerance"
            }
        }
    
    async def analyze_genetic_markers(self, genetic_data: Dict[str, Any], 
                                   user_traits: Dict[str, Any] = None) -> Dict[str, Any]:
        """Analyze genetic markers and provide comprehensive insights"""
        try:
            markers = genetic_data.get('markers', {})
            
            # Initialize analysis results
            analysis = {
                "health_risks": [],
                "nutritional_needs": [],
                "exercise_recommendations": [],
                "metabolic_profile": {},
                "sleep_patterns": {},
                "stress_response": {},
                "longevity_factors": []
            }
            
            # Analyze each marker
            for rs_id, genotype in markers.items():
                if rs_id in self.known_markers:
                    marker_info = self.known_markers[rs_id]
                    self._analyze_marker(rs_id, genotype, marker_info, analysis)
            
            # Add personalized recommendations based on user traits
            if user_traits:
                analysis = self._personalize_recommendations(analysis, user_traits)
            
            # Calculate risk scores
            analysis["risk_scores"] = self._calculate_risk_scores(markers)
            
            return {
                "analysis": analysis,
                "markers_analyzed": len(markers),
                "quality_score": self._assess_data_quality(markers),
                "analysis_date": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to analyze genetic markers: {str(e)}")
    
    def _analyze_marker(self, rs_id: str, genotype: str, marker_info: Dict, analysis: Dict):
        """Analyze individual genetic marker"""
        gene = marker_info["gene"]
        trait = marker_info["trait"]
        risk_allele = marker_info["risk_allele"]
        
        # Check if user has risk allele
        has_risk = risk_allele in genotype
        
        if gene == "TCF7L2" and has_risk:
            analysis["health_risks"].append({
                "condition": "Type 2 Diabetes",
                "risk_level": "moderate",
                "description": "Increased genetic predisposition to type 2 diabetes",
                "recommendations": [
                    "Maintain healthy body weight",
                    "Regular physical activity",
                    "Balanced diet low in refined sugars",
                    "Regular blood glucose monitoring"
                ]
            })
            analysis["nutritional_needs"].append({
                "nutrient": "Chromium",
                "reason": "Improves insulin sensitivity",
                "food_sources": ["broccoli", "whole grains", "lean meats"]
            })
        
        elif gene == "FTO" and has_risk:
            analysis["health_risks"].append({
                "condition": "Obesity",
                "risk_level": "moderate",
                "description": "Genetic tendency toward higher BMI",
                "recommendations": [
                    "Portion control awareness",
                    "Regular exercise routine",
                    "Mindful eating practices",
                    "Regular weight monitoring"
                ]
            })
            analysis["exercise_recommendations"].append({
                "type": "High-Intensity Interval Training",
                "frequency": "3-4 times per week",
                "reason": "Effective for genetic predisposition to weight gain"
            })
        
        elif gene == "APOE" and has_risk:
            analysis["health_risks"].append({
                "condition": "Alzheimer's Disease",
                "risk_level": "high",
                "description": "Increased genetic risk for late-onset Alzheimer's",
                "recommendations": [
                    "Cognitive stimulation activities",
                    "Regular cardiovascular exercise",
                    "Mediterranean-style diet",
                    "Quality sleep prioritization"
                ]
            })
            analysis["longevity_factors"].append({
                "factor": "Brain Health",
                "recommendations": [
                    "Omega-3 fatty acid supplementation",
                    "Regular mental challenges",
                    "Social engagement",
                    "Stress management"
                ]
            })
        
        elif gene == "MTHFR" and has_risk:
            analysis["nutritional_needs"].append({
                "nutrient": "Folate (Vitamin B9)",
                "reason": "Reduced conversion efficiency",
                "food_sources": ["leafy greens", "legumes", "fortified grains"],
                "supplementation": "Consider methylfolate supplement"
            })
            analysis["nutritional_needs"].append({
                "nutrient": "Vitamin B12",
                "reason": "Works with folate in methylation",
                "food_sources": ["animal products", "fortified foods"]
            })
        
        elif gene == "LCT" and has_risk:
            analysis["nutritional_needs"].append({
                "nutrient": "Calcium",
                "reason": "Lactose intolerance may reduce dairy intake",
                "food_sources": ["fortified plant milks", "leafy greens", "sardines"]
            })
    
    def _personalize_recommendations(self, analysis: Dict, user_traits: Dict) -> Dict:
        """Personalize recommendations based on user traits"""
        age = user_traits.get('age', 30)
        gender = user_traits.get('gender', 'unknown')
        fitness_level = user_traits.get('fitness_level', 'beginner')
        
        # Age-based adjustments
        if age > 50:
            analysis["longevity_factors"].append({
                "factor": "Age-Related Considerations",
                "recommendations": [
                    "Increased protein intake for muscle maintenance",
                    "Calcium and Vitamin D for bone health",
                    "Regular strength training"
                ]
            })
        
        # Gender-based adjustments
        if gender.lower() == 'female':
            analysis["nutritional_needs"].append({
                "nutrient": "Iron",
                "reason": "Higher iron requirements",
                "food_sources": ["red meat", "spinach", "lentils"]
            })
        
        # Fitness level adjustments
        if fitness_level == 'beginner':
            analysis["exercise_recommendations"].insert(0, {
                "type": "Low-Impact Cardio",
                "frequency": "3-5 times per week",
                "reason": "Build fitness foundation safely"
            })
        elif fitness_level == 'advanced':
            analysis["exercise_recommendations"].append({
                "type": "Strength Training",
                "frequency": "4-5 times per week",
                "reason": "Optimize genetic potential for muscle development"
            })
        
        return analysis
    
    def _calculate_risk_scores(self, markers: Dict[str, str]) -> Dict[str, float]:
        """Calculate risk scores for various conditions"""
        risk_scores = {}
        
        # Diabetes risk
        diabetes_risk = 0
        if "rs7903146" in markers:
            genotype = markers["rs7903146"]
            if genotype.count('T') == 2:
                diabetes_risk = 0.4
            elif genotype.count('T') == 1:
                diabetes_risk = 0.2
        risk_scores["type_2_diabetes"] = diabetes_risk
        
        # Obesity risk
        obesity_risk = 0
        if "rs9939609" in markers:
            genotype = markers["rs9939609"]
            if genotype.count('A') == 2:
                obesity_risk = 0.3
            elif genotype.count('A') == 1:
                obesity_risk = 0.15
        risk_scores["obesity"] = obesity_risk
        
        # Alzheimer's risk
        alzheimers_risk = 0
        if "rs429358" in markers:
            genotype = markers["rs429358"]
            if genotype == 'CC':
                alzheimers_risk = 0.25
            elif genotype == 'CT':
                alzheimers_risk = 0.15
        risk_scores["alzheimers"] = alzheimers_risk
        
        return risk_scores
    
    def _assess_data_quality(self, markers: Dict[str, str]) -> float:
        """Assess the quality of genetic data"""
        total_markers = len(markers)
        known_markers_count = sum(1 for rs_id in markers if rs_id in self.known_markers)
        
        # Quality based on coverage and known markers
        coverage_score = min(total_markers / 500000, 1.0)  # Normalize to 500k markers
        known_marker_score = known_markers_count / len(self.known_markers)
        
        return (coverage_score * 0.7 + known_marker_score * 0.3)
    
    async def get_dna_recommendations(self, genetic_analysis: Dict, user_profile: Any, 
                                   category: str = None) -> Dict[str, Any]:
        """Get DNA-based recommendations for specific categories"""
        try:
            analysis = genetic_analysis.get("analysis", {})
            
            recommendations = {
                "recommendations": [],
                "priority_actions": [],
                "lifestyle_adjustments": [],
                "monitoring_needs": []
            }
            
            if category == "nutrition" or category is None:
                nutrition_needs = analysis.get("nutritional_needs", [])
                for need in nutrition_needs:
                    recommendations["recommendations"].append({
                        "category": "Nutrition",
                        "item": need.get("nutrient"),
                        "reason": need.get("reason"),
                        "action": f"Increase intake of {need.get('nutrient')}",
                        "food_sources": need.get("food_sources", [])
                    })
            
            if category == "exercise" or category is None:
                exercise_recs = analysis.get("exercise_recommendations", [])
                for rec in exercise_recs:
                    recommendations["recommendations"].append({
                        "category": "Exercise",
                        "type": rec.get("type"),
                        "frequency": rec.get("frequency"),
                        "reason": rec.get("reason")
                    })
            
            if category == "health_risks" or category is None:
                health_risks = analysis.get("health_risks", [])
                for risk in health_risks:
                    recommendations["priority_actions"].append({
                        "condition": risk.get("condition"),
                        "risk_level": risk.get("risk_level"),
                        "actions": risk.get("recommendations", [])
                    })
            
            # Add monitoring needs based on risk scores
            risk_scores = analysis.get("risk_scores", {})
            for condition, score in risk_scores.items():
                if score > 0.2:  # High risk threshold
                    recommendations["monitoring_needs"].append({
                        "condition": condition.replace("_", " ").title(),
                        "frequency": "Regular monitoring recommended",
                        "tests": self._get_monitoring_tests(condition)
                    })
            
            return recommendations
            
        except Exception as e:
            raise Exception(f"Failed to generate DNA recommendations: {str(e)}")
    
    def _get_monitoring_tests(self, condition: str) -> List[str]:
        """Get recommended monitoring tests for conditions"""
        test_mapping = {
            "type_2_diabetes": ["Fasting blood glucose", "HbA1c", "Oral glucose tolerance test"],
            "obesity": ["BMI measurement", "Body composition analysis", "Waist circumference"],
            "alzheimers": ["Cognitive function tests", "Brain imaging (if needed)", "Memory assessments"]
        }
        return test_mapping.get(condition, ["Regular health check-ups"])

# Global instance
genetics_service = GeneticsService()

# Helper functions for router imports
async def analyze_genetic_markers(dna_data: str) -> dict:
    """Analyze genetic markers using genetics service"""
    return await genetics_service.analyze_genetic_markers(dna_data)

async def get_dna_recommendations(genetic_profile: dict) -> dict:
    """Get DNA-based recommendations using genetics service"""
    return await genetics_service.get_dna_recommendations(genetic_profile)
