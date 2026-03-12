from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="ArogyaMitra API")

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "ArogyaMitra Backend Running!"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/auth/login")
async def login(data: dict):
    return {"access_token": "test-token-123", "token_type": "bearer"}

@app.post("/api/auth/register")
async def register(data: dict):
    return {"access_token": "test-token-456", "token_type": "bearer"}

@app.get("/api/users/me")
async def get_user():
    return {"id": 1, "username": "testuser", "email": "test@example.com"}

# Catch all routes to prevent 404
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=200,
        content={"message": "ArogyaMitra API - Route handled", "path": str(request.url.path)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)
