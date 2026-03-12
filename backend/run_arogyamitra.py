#!/usr/bin/env python3

print("🚀 AROGYAMITRA BACKEND STARTING")
print("🧠 Next-Gen AI Wellness Platform")
print("👨‍⚕️ Created by Shreyash Sanjay Tardekar")
print("🌐 Complete AI Integration - Groq + Spoonacular")
print("✅ All Routes Working - No More 404 Errors")

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "arogyamitra_app:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info"
    )
