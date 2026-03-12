#!/usr/bin/env python3

print("Testing OpenAI import...")

try:
    import openai
    print("✅ OpenAI imported successfully")
    
    # Test creating client
    client = openai.OpenAI(api_key="test-key")
    print("✅ OpenAI client created successfully")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
