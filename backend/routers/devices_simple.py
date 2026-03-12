from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from database import get_db, User
from schemas import DeviceConnectCreate, DeviceResponse
from services.auth import get_current_user

router = APIRouter(prefix="/devices", tags=["devices"])

@router.get("/connected", response_model=List[DeviceResponse])
async def get_connected_devices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all connected wearable devices"""
    try:
        # Return mock connected devices
        return [
            DeviceResponse(
                id=1,
                device_type="apple_watch",
                device_name="Apple Watch Series 8",
                is_connected=True,
                last_sync=datetime.now(),
                battery_level=85,
                data_types=["heart_rate", "steps", "sleep"]
            ),
            DeviceResponse(
                id=2,
                device_type="fitbit",
                device_name="Fitbit Charge 5",
                is_connected=True,
                last_sync=datetime.now(),
                battery_level=92,
                data_types=["steps", "calories", "sleep"]
            )
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get connected devices: {str(e)}"
        )

@router.post("/connect/apple-watch", response_model=DeviceResponse)
async def connect_apple_watch_device(
    connection_data: DeviceConnectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Connect Apple Watch for health data synchronization"""
    try:
        return DeviceResponse(
            id=1,
            device_type="apple_watch",
            device_name="Apple Watch Series 8",
            is_connected=True,
            last_sync=datetime.now(),
            battery_level=85,
            data_types=["heart_rate", "steps", "sleep"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to connect Apple Watch: {str(e)}"
        )

@router.post("/connect/fitbit", response_model=DeviceResponse)
async def connect_fitbit_device(
    connection_data: DeviceConnectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Connect Fitbit device for health data synchronization"""
    try:
        return DeviceResponse(
            id=2,
            device_type="fitbit",
            device_name="Fitbit Charge 5",
            is_connected=True,
            last_sync=datetime.now(),
            battery_level=92,
            data_types=["steps", "calories", "sleep"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to connect Fitbit: {str(e)}"
        )

@router.post("/sync/{device_id}")
async def sync_device_data(
    device_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Sync data from connected wearable device"""
    try:
        return {
            "success": True,
            "device_id": device_id,
            "sync_time": datetime.utcnow(),
            "data_points_synced": 150,
            "new_insights": ["Great sleep quality last night!", "Daily step goal achieved!"],
            "battery_level": 88,
            "next_sync_recommended": "1 hour"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sync device data: {str(e)}"
        )
