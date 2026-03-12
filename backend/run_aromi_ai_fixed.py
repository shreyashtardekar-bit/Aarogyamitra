#!/usr/bin/env python3

print("🚀 AROMI AI BACKEND STARTING (FIXED)")
print("🧠 Next-Gen AI Wellness Platform")
print("👨‍⚕️ Created by Shreyash Sanjay Tardekar")
print("🌐 Complete AI Integration")
print("✅ All Routes Working - Fixed Exception Handler")
print("✅ Added Missing Coach Endpoints")

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "aromi_ai_fixed:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info"
    )
