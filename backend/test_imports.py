#!/usr/bin/env python3

print("Testing imports...")

try:
    from services.auth import get_current_user
    print("✅ get_current_user imported successfully")
except Exception as e:
    print(f"❌ Error importing get_current_user: {e}")

try:
    from routers import wellness, genetics, biometrics, ai_coach, devices, community
    print("✅ All routers imported successfully")
except Exception as e:
    print(f"❌ Error importing routers: {e}")

try:
    from schemas import WellnessPlanCreate, WellnessPlanResponse, WellnessInsights
    print("✅ Wellness schemas imported successfully")
except Exception as e:
    print(f"❌ Error importing wellness schemas: {e}")

print("All import tests completed!")
