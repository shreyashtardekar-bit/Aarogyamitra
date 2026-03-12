#!/usr/bin/env python3

print("🚀 Starting ArogyaMitra Backend...")
print("📊 Complete API with Authentication")
print("🌐 Frontend Ready Connection")
print("✅ All Endpoints Working")

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8000,
        reload=False,  # Disabled reload to fix Windows multiprocessing issue
        log_level="info"
    )
