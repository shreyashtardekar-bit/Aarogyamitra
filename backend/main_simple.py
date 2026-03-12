from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, token, wellness
from database import init_db
import os

app = FastAPI(
    title="ArogyaMitra API", 
    version="2.0.0",
    description="Next-Gen AI Wellness Platform by Shreyash Sanjay Tardekar"
)

# CORS - Allow frontend from any origin for deployment flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://*.netlify.app",
        "https://*.render.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include core routers only
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(token.router, prefix="/api/auth", tags=["auth"])
app.include_router(wellness.router, prefix="/api/wellness", tags=["wellness"])

@app.get("/")
def read_root():
    return {
        "status": "ok", 
        "message": "ArogyaMitra Backend is running",
        "platform": "Next-Gen AI Wellness Platform",
        "creator": "Shreyash Sanjay Tardekar"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.on_event("startup")
async def startup_event():
    init_db()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
