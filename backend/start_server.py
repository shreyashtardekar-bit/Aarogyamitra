#!/usr/bin/env python3

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Starting ArogyaMitra backend server...")

try:
    from main import app
    print("✅ Main app imported successfully")
    
    # Test imports
    from services.auth import get_current_user
    print("✅ Auth service imported successfully")
    
    from routers import wellness, genetics, biometrics, ai_coach, devices, community
    print("✅ All routers imported successfully")
    
    from schemas import WellnessPlanCreate, WellnessPlanResponse, WellnessInsights
    print("✅ Schemas imported successfully")
    
    print("🎉 All imports successful! Server is ready to start.")
    
except Exception as e:
    print(f"❌ Import error: {e}")
    import traceback
    traceback.print_exc()
