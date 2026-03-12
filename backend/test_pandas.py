#!/usr/bin/env python3

print("Testing pandas import...")

try:
    import pandas as pd
    print("✅ Pandas imported successfully")
    print(f"✅ Pandas version: {pd.__version__}")
    
except Exception as e:
    print(f"❌ Error importing pandas: {e}")
    print("💡 Solution: Run 'pip install pandas' in the backend directory")

print("Test completed!")
