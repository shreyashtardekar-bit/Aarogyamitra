import sys
import os
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getcwd())
from database import SessionLocal, User
from services.auth import create_access_token
from datetime import timedelta
import requests

db = SessionLocal()
user = db.query(User).filter(User.username=='admin').first()
token = create_access_token(subject=user.username, expires_delta=timedelta(minutes=30))
print(f'Token: {token}')

headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
res = requests.post('http://127.0.0.1:8000/workout/generate', json={'prompt': '5 min stretch'}, headers=headers)
print('Workout Status:', res.status_code)
print('Workout Response:', res.text)

res = requests.post('http://127.0.0.1:8000/wellness/generate', json={'prompt': 'I want to lose weight and get fit', 'goals': ['sleep'], 'preferences': {}}, headers=headers)
print('Wellness Status:', res.status_code)
print('Wellness Response:', res.text)
