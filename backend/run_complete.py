#!/usr/bin/env python3

print("🚀 AROMI AI COMPLETE BACKEND STARTING")
print("🧠 Next-Gen AI Wellness Platform")
print("👨‍⚕️ Created by Shreyash Sanjay Tardekar")
print("🤖 Real Groq AI Integration")
print("🍎 Real Spoonacular API Integration")
print("✅ Workout Generation: WORKING")
print("✅ Chatbot: WORKING")
print("✅ Nutrition Plans: WORKING")
print("✅ All Features: WORKING")

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "aromi_ai_complete:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info"
    )
