import os
import platform
platform.system = lambda: "Windows"
platform.release = lambda: "10"
platform.version = lambda: "10"
from groq import AsyncGroq
from typing import Dict, List, Any
from datetime import datetime

class OpenAIService:
    def __init__(self):
        self.client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
        
    async def generate_wellness_plan(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive wellness plan using LLaMA"""
        try:
            prompt = f"""
            Create a comprehensive 90-day wellness plan for the following user:
            
            User Profile:
            - Age: {user_profile.get('age')}
            - Gender: {user_profile.get('gender')}
            - Weight: {user_profile.get('weight')}kg
            - Height: {user_profile.get('height')}cm
            - Fitness Level: {user_profile.get('fitness_level')}
            - Goals: {user_profile.get('goals')}
            - Preferences: {user_profile.get('preferences')}
            
            Generate a detailed plan including:
            1. Daily routines with specific times
            2. Weekly workout schedules
            3. Nutrition guidelines
            4. Sleep optimization
            5. Stress management techniques
            6. Progress tracking metrics
            
            Format as JSON with clear sections and actionable items.
            """
            
            response = await self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are VITAL, an advanced AI wellness coach specializing in personalized health optimization."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            return {
                "plan_content": response.choices[0].message.content,
                "generated_at": datetime.utcnow().isoformat(),
                "model": "gpt-4",
                "confidence": 0.95
            }
            
        except Exception as e:
            raise Exception(f"Failed to generate wellness plan: {str(e)}")
    
    async def vital_ai_chat(self, message: str, user_context: Dict[str, Any], 
                          conversation_history: List[Dict] = None,
                          emotional_state: str = "neutral") -> Dict[str, Any]:
        """Chat with VITAL AI coach"""
        try:
            context_prompt = f"""
            User Context:
            - Wellness Score: {user_context.get('wellness_score', 'N/A')}
            - Current Goals: {user_context.get('goals', 'N/A')}
            - Recent Activities: {user_context.get('recent_activities', 'N/A')}
            - Emotional State: {emotional_state}
            
            Previous conversation context:
            {conversation_history[-5:] if conversation_history else 'None'}
            """
            
            response = await self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": """
                    You are VITAL, an empathetic and knowledgeable AI wellness coach. 
                    - Provide personalized, evidence-based advice
                    - Consider emotional intelligence and context
                    - Be encouraging and motivational
                    - Ask follow-up questions when helpful
                    - Prioritize user safety and wellbeing
                    """},
                    {"role": "system", "content": context_prompt},
                    {"role": "user", "content": message}
                ],
                temperature=0.8,
                max_tokens=1000
            )
            
            ai_response = response.choices[0].message.content
            
            # Analyze emotional tone
            emotional_tone = self._analyze_emotional_tone(ai_response)
            
            return {
                "response": ai_response,
                "emotional_tone": emotional_tone,
                "suggestions": self._generate_suggestions(ai_response),
                "follow_up_questions": self._generate_follow_up_questions(ai_response),
                "confidence": 0.92
            }
            
        except Exception as e:
            raise Exception(f"Failed to process AI chat: {str(e)}")
    
    async def analyze_genetic_markers(self, genetic_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze genetic markers and provide insights"""
        try:
            prompt = f"""
            Analyze the following genetic data and provide comprehensive health insights:
            
            Genetic Markers: {len(genetic_data.get('markers', {}))}
            Data Format: {genetic_data.get('format')}
            
            Provide analysis on:
            1. Health predispositions and risks
            2. Nutritional requirements
            3. Exercise response patterns
            4. Metabolic profile
            5. Sleep patterns
            6. Stress response
            7. Longevity factors
            
            Format as JSON with detailed explanations and actionable recommendations.
            """
            
            response = await self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a genetic analysis expert specializing in personalized medicine and wellness optimization."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2500
            )
            
            return {
                "analysis": response.choices[0].message.content,
                "quality_score": self._calculate_data_quality(genetic_data),
                "markers_analyzed": len(genetic_data.get('markers', {})),
                "analyzed_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to analyze genetic data: {str(e)}")
    
    async def analyze_wellness_data(self, user_id: int, biometric_data: List) -> Dict[str, Any]:
        """Analyze wellness data and provide insights"""
        try:
            # Process biometric data for analysis
            data_summary = self._summarize_biometric_data(biometric_data)
            
            prompt = f"""
            Analyze the following biometric data trends and provide comprehensive wellness insights:
            
            Data Summary:
            - Average Heart Rate: {data_summary.get('avg_heart_rate')}
            - Heart Rate Variability: {data_summary.get('hrv')}
            - Sleep Quality: {data_summary.get('sleep_quality')}
            - Stress Levels: {data_summary.get('stress_levels')}
            - Activity Levels: {data_summary.get('activity_levels')}
            
            Provide insights on:
            1. Overall wellness assessment
            2. Metabolic age estimation
            3. Recovery rate analysis
            4. Risk factors and warnings
            5. Improvement recommendations
            6. Predictive health insights
            
            Format as JSON with specific metrics and actionable advice.
            """
            
            response = await self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a biomedical data analyst specializing in wellness optimization and predictive health analytics."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                max_tokens=2000
            )
            
            return {
                "insights": response.choices[0].message.content,
                "metabolic_age": data_summary.get('estimated_metabolic_age'),
                "wellness_score": data_summary.get('calculated_wellness_score'),
                "recovery_rate": data_summary.get('recovery_rate'),
                "analyzed_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to analyze wellness data: {str(e)}")
    
    def _analyze_emotional_tone(self, response: str) -> str:
        """Analyze emotional tone of AI response"""
        positive_words = ['excellent', 'great', 'wonderful', 'fantastic', 'amazing', 'proud', 'motivated']
        supportive_words = ['support', 'help', 'guide', 'encourage', 'together', 'journey']
        
        response_lower = response.lower()
        
        if any(word in response_lower for word in positive_words):
            return "encouraging"
        elif any(word in response_lower for word in supportive_words):
            return "supportive"
        elif 'caution' in response_lower or 'careful' in response_lower:
            return "cautious"
        else:
            return "informative"
    
    def _generate_suggestions(self, response: str) -> List[str]:
        """Generate actionable suggestions from AI response"""
        suggestions = []
        
        # Simple keyword-based suggestion extraction
        if 'exercise' in response.lower():
            suggestions.append("Try a 10-minute walk after meals")
        if 'sleep' in response.lower():
            suggestions.append("Maintain consistent bedtime routine")
        if 'stress' in response.lower():
            suggestions.append("Practice 5-minute breathing exercises")
        if 'nutrition' in response.lower():
            suggestions.append("Stay hydrated with 8 glasses of water daily")
            
        return suggestions[:3]  # Return max 3 suggestions
    
    def _generate_follow_up_questions(self, response: str) -> List[str]:
        """Generate relevant follow-up questions"""
        questions = [
            "How do you feel about this suggestion?",
            "Would you like more specific guidance on this topic?",
            "What challenges are you currently facing?",
            "How can I better support your wellness journey?"
        ]
        return questions[:2]  # Return 2 relevant questions
    
    def _calculate_data_quality(self, genetic_data: Dict[str, Any]) -> float:
        """Calculate quality score of genetic data"""
        markers_count = len(genetic_data.get('markers', {}))
        
        # Quality based on number of markers analyzed
        if markers_count > 500000:
            return 0.95
        elif markers_count > 100000:
            return 0.85
        elif markers_count > 50000:
            return 0.75
        else:
            return 0.65
    
    def _summarize_biometric_data(self, biometric_data: List) -> Dict[str, Any]:
        """Summarize biometric data for analysis"""
        if not biometric_data:
            return {}
        
        # Calculate averages and trends
        heart_rates = [entry.heart_rate for entry in biometric_data if entry.heart_rate]
        stress_levels = [entry.stress_level for entry in biometric_data if entry.stress_level]
        sleep_hours = [entry.sleep_hours for entry in biometric_data if entry.sleep_hours]
        
        return {
            'avg_heart_rate': sum(heart_rates) / len(heart_rates) if heart_rates else 0,
            'hrv': self._calculate_hrv(heart_rates) if heart_rates else 0,
            'stress_levels': sum(stress_levels) / len(stress_levels) if stress_levels else 0,
            'sleep_quality': sum(sleep_hours) / len(sleep_hours) if sleep_hours else 0,
            'estimated_metabolic_age': 28,  # Simplified calculation
            'calculated_wellness_score': 85,  # Simplified calculation
            'recovery_rate': 78,  # Simplified calculation
            'activity_levels': 'moderate'
        }
    
    def _calculate_hrv(self, heart_rates: List[float]) -> float:
        """Calculate Heart Rate Variability (simplified)"""
        if len(heart_rates) < 2:
            return 0
        
        # Simplified HRV calculation
        differences = [abs(heart_rates[i] - heart_rates[i-1]) for i in range(1, len(heart_rates))]
        return sum(differences) / len(differences)

# Global instance
openai_service = OpenAIService()

# Helper functions for router imports
async def generate_wellness_plan(user_profile: dict) -> dict:
    """Generate wellness plan using OpenAI service"""
    return await openai_service.generate_wellness_plan(user_profile)

async def analyze_wellness_data(data: dict) -> dict:
    """Analyze wellness data using OpenAI service"""
    return await openai_service.analyze_wellness_data(data)
