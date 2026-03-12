import requests
import time

try:
    print("Getting token...")
    token_res = requests.post("http://localhost:8000/token", data={"username": "shreyash", "password": "vitalflow2024"})
    token = token_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Testing Chat...")
    t1 = time.time()
    res1 = requests.post("http://localhost:8000/coach/chat", json={"prompt": "Hi AROMI, a short fitness tip?"}, headers=headers)
    print(res1.status_code, res1.text[:200], f"took {time.time()-t1:.2f}s")
    
    print("Testing Meals...")
    t2 = time.time()
    res2 = requests.post("http://localhost:8000/meals/generate", json={"prompt": "1 day vegan meal plan"}, headers=headers)
    print(res2.status_code, res2.text[:200], f"took {time.time()-t2:.2f}s")
    
    print("Testing Workouts...")
    t3 = time.time()
    res3 = requests.post("http://localhost:8000/workout/generate", json={"prompt": "10 mins cardio"}, headers=headers)
    print(res3.status_code, res3.text[:200], f"took {time.time()-t3:.2f}s")

except Exception as e:
    print(f"Error: {e}")
