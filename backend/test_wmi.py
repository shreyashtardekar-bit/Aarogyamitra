import platform

# Monkey patch platform to avoid WMI query hang
original_system = platform.system
platform.system = lambda: "Windows"
platform.release = lambda: "10"
platform.version = lambda: "10"

import os
from dotenv import load_dotenv
load_dotenv()

from services.groq_service import get_workout_plan
print("Starting query...", flush=True)
try:
    workout = get_workout_plan("I want a 2 min stretch")
    print("Success. Length of response:", len(workout))
    print(workout[:200])
except Exception as e:
    print("Error:", e)
