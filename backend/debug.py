from fastapi.testclient import TestClient
from main import app
from services.auth import create_access_token

client = TestClient(app)
token = create_access_token(subject="admin")
response = client.get("/workout/history", headers={"Authorization": f"Bearer {token}"})
print("WORKOUT RESPONSE:", response.json())
response = client.get("/meals/history", headers={"Authorization": f"Bearer {token}"})
print("MEALS RESPONSE:", response.json())
