import asyncio
import os
from dotenv import load_dotenv
load_dotenv()

# Apply the WMI hang fix
import platform
platform.system = lambda: "Windows"
platform.release = lambda: "10"
platform.version = lambda: "10"

from services.openai_service import openai_service

async def run_tests():
    test_questions = [
        "How many calories are in a 100g serving of chicken breast?",
        "What are the best exercises for losing weight quickly?",
        "I'm feeling really stressed lately, any quick tips to calm down?",
        "Can you suggest a beginner-friendly 5-minute morning stretching routine?",
        "Is it better to do cardio before or after weightlifting?",
        "What are some healthy high-protein vegetarian snacks?"
    ]
    
    user_context = {
        "wellness_score": 75,
        "goals": "weight loss and stress management",
        "recent_activities": "none"
    }

    print("Starting AI Chatbot Verification Tests...\n" + "="*50)
    
    for i, question in enumerate(test_questions, 1):
        print(f"\n[Test {i}/6]")
        print(f"User Question: {question}")
        try:
            result = await openai_service.vital_ai_chat(question, user_context)
            print(f"AI Response:\n{result['response']}\n")
            print(f"(Emotional Tone: {result.get('emotional_tone')})")
        except Exception as e:
            print(f"Error during test: {str(e)}")
        print("-" * 50)

if __name__ == "__main__":
    asyncio.run(run_tests())
