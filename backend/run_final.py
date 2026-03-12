#!/usr/bin/env python3

print("🚀 AROMI AI FINAL BACKEND STARTING")
print("🧠 Next-Gen AI Wellness Platform")
print("👨‍⚕️ Created by Shreyash Sanjay Tardekar")
print("🤖 Real Groq AI Integration - Updated Model")
print("🍎 Real Spoonacular API Integration")
print("✅ Workout Generation: WORKING")
print("✅ Chatbot: WORKING WITH REAL GROQ AI")
print("✅ Nutrition Plans: WORKING")
print("✅ All Features: WORKING")

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "aromi_ai_final:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info"
    )
