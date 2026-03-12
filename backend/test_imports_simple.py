#!/usr/bin/env python3

print("Testing all imports step by step...")

try:
    print("1. Testing main import...")
    from main import app
    print("✅ Main import successful")
except Exception as e:
    print(f"❌ Main import failed: {e}")
    exit(1)

try:
    print("2. Testing router imports...")
    from routers import users, token, wellness, genetics, biometrics, ai_coach_simple, devices_simple, community_simple
    print("✅ Router imports successful")
except Exception as e:
    print(f"❌ Router imports failed: {e}")
    exit(1)

try:
    print("3. Testing schema imports...")
    from schemas import BiometricEntryCreate, BiometricResponse, BiometricAnalytics
    print("✅ Schema imports successful")
except Exception as e:
    print(f"❌ Schema imports failed: {e}")
    exit(1)

print("🎉 All imports working! Server should start successfully.")
