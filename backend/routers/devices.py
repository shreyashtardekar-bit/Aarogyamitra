from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
import json

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
        devices = db.query(WearableDevice).filter(
            WearableDevice.user_id == current_user.id,
            WearableDevice.is_active == True
        ).all()
        
        return [
            DeviceResponse(
                id=device.id,
                device_type=device.device_type,
                device_name=device.device_name,
                brand=device.brand,
                model=device.model,
                connection_status=device.connection_status,
                last_sync=device.last_sync,
                battery_level=device.battery_level,
                data_types=device.data_types,
                is_active=device.is_active
            )
            for device in devices
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
        # Connect to Apple Watch HealthKit
        connection_result = await connect_apple_watch(
            access_token=connection_data.access_token,
            user_id=current_user.id
        )
        
        if not connection_result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=connection_result["error"]
            )
        
        # Save device to database
        device = WearableDevice(
            user_id=current_user.id,
            device_type="apple_watch",
            device_name=connection_data.device_name or "Apple Watch",
            brand="Apple",
            model=connection_result.get("model", "Unknown"),
            connection_status="connected",
            access_token=connection_data.access_token,
            refresh_token=connection_result.get("refresh_token"),
            data_types=connection_result.get("data_types", []),
            last_sync=datetime.utcnow(),
            is_active=True
        )
        
        db.add(device)
        db.commit()
        db.refresh(device)
        
        return DeviceResponse(
            id=device.id,
            device_type=device.device_type,
            device_name=device.device_name,
            brand=device.brand,
            model=device.model,
            connection_status=device.connection_status,
            last_sync=device.last_sync,
            battery_level=device.battery_level,
            data_types=device.data_types,
            is_active=device.is_active
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
        # Connect to Fitbit Web API
        connection_result = await connect_fitbit(
            access_token=connection_data.access_token,
            user_id=current_user.id
        )
        
        if not connection_result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=connection_result["error"]
            )
        
        # Save device to database
        device = WearableDevice(
            user_id=current_user.id,
            device_type="fitbit",
            device_name=connection_data.device_name or "Fitbit Device",
            brand="Fitbit",
            model=connection_result.get("model", "Unknown"),
            connection_status="connected",
            access_token=connection_data.access_token,
            refresh_token=connection_result.get("refresh_token"),
            data_types=connection_result.get("data_types", []),
            last_sync=datetime.utcnow(),
            is_active=True
        )
        
        db.add(device)
        db.commit()
        db.refresh(device)
        
        return DeviceResponse(
            id=device.id,
            device_type=device.device_type,
            device_name=device.device_name,
            brand=device.brand,
            model=device.model,
            connection_status=device.connection_status,
            last_sync=device.last_sync,
            battery_level=device.battery_level,
            data_types=device.data_types,
            is_active=device.is_active
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to connect Fitbit: {str(e)}"
        )

@router.post("/connect/oura-ring", response_model=DeviceResponse)
async def connect_oura_ring_device(
    connection_data: DeviceConnectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Connect Oura Ring for advanced sleep and recovery tracking"""
    try:
        # Connect to Oura API
        connection_result = await connect_oura_ring(
            access_token=connection_data.access_token,
            user_id=current_user.id
        )
        
        if not connection_result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=connection_result["error"]
            )
        
        # Save device to database
        device = WearableDevice(
            user_id=current_user.id,
            device_type="oura_ring",
            device_name=connection_data.device_name or "Oura Ring",
            brand="Oura",
            model=connection_result.get("model", "Unknown"),
            connection_status="connected",
            access_token=connection_data.access_token,
            refresh_token=connection_result.get("refresh_token"),
            data_types=connection_result.get("data_types", []),
            last_sync=datetime.utcnow(),
            is_active=True
        )
        
        db.add(device)
        db.commit()
        db.refresh(device)
        
        return DeviceResponse(
            id=device.id,
            device_type=device.device_type,
            device_name=device.device_name,
            brand=device.brand,
            model=device.model,
            connection_status=device.connection_status,
            last_sync=device.last_sync,
            battery_level=device.battery_level,
            data_types=device.data_types,
            is_active=device.is_active
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to connect Oura Ring: {str(e)}"
        )

@router.post("/connect/garmin", response_model=DeviceResponse)
async def connect_garmin_device(
    connection_data: DeviceConnectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Connect Garmin device for fitness and health tracking"""
    try:
        # Connect to Garmin Connect API
        connection_result = await connect_garmin(
            access_token=connection_data.access_token,
            user_id=current_user.id
        )
        
        if not connection_result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=connection_result["error"]
            )
        
        # Save device to database
        device = WearableDevice(
            user_id=current_user.id,
            device_type="garmin",
            device_name=connection_data.device_name or "Garmin Device",
            brand="Garmin",
            model=connection_result.get("model", "Unknown"),
            connection_status="connected",
            access_token=connection_data.access_token,
            refresh_token=connection_result.get("refresh_token"),
            data_types=connection_result.get("data_types", []),
            last_sync=datetime.utcnow(),
            is_active=True
        )
        
        db.add(device)
        db.commit()
        db.refresh(device)
        
        return DeviceResponse(
            id=device.id,
            device_type=device.device_type,
            device_name=device.device_name,
            brand=device.brand,
            model=device.model,
            connection_status=device.connection_status,
            last_sync=device.last_sync,
            battery_level=device.battery_level,
            data_types=device.data_types,
            is_active=device.is_active
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to connect Garmin device: {str(e)}"
        )

@router.post("/sync/{device_id}")
async def sync_device_data(
    device_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Sync data from connected wearable device"""
    try:
        # Get device
        device = db.query(WearableDevice).filter(
            WearableDevice.id == device_id,
            WearableDevice.user_id == current_user.id
        ).first()
        
        if not device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found"
            )
        
        # Sync data based on device type
        sync_result = await sync_device_data(
            device_type=device.device_type,
            access_token=device.access_token,
            user_id=current_user.id,
            last_sync=device.last_sync
        )
        
        if not sync_result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=sync_result["error"]
            )
        
        # Update last sync time
        device.last_sync = datetime.utcnow()
        device.battery_level = sync_result.get("battery_level")
        db.commit()
        
        return {
            "success": True,
            "device_id": device_id,
            "sync_time": datetime.utcnow(),
            "data_points_synced": sync_result.get("data_points", 0),
            "new_insights": sync_result.get("insights", []),
            "battery_level": device.battery_level,
            "next_sync_recommended": sync_result.get("next_sync", "1 hour")
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sync device data: {str(e)}"
        )

@router.get("/status/{device_id}", response_model=Dict[str, Any])
async def get_device_status_info(
    device_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get real-time device status and information"""
    try:
        device = db.query(WearableDevice).filter(
            WearableDevice.id == device_id,
            WearableDevice.user_id == current_user.id
        ).first()
        
        if not device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found"
            )
        
        # Get real-time status
        status_info = await get_device_status(
            device_type=device.device_type,
            access_token=device.access_token
        )
        
        return {
            "device_id": device_id,
            "device_name": device.device_name,
            "connection_status": device.connection_status,
            "battery_level": status_info.get("battery_level", device.battery_level),
            "last_sync": device.last_sync.isoformat(),
            "data_available": status_info.get("data_available", False),
            "sync_quality": status_info.get("sync_quality", "good"),
            "device_health": status_info.get("device_health", "good"),
            "firmware_version": status_info.get("firmware_version"),
            "serial_number": status_info.get("serial_number"),
            "wear_detection": status_info.get("wear_detection", False)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get device status: {str(e)}"
        )

@router.put("/settings/{device_id}", response_model=Dict[str, Any])
async def update_device_settings(
    device_id: int,
    settings: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update device synchronization and notification settings"""
    try:
        device = db.query(WearableDevice).filter(
            WearableDevice.id == device_id,
            WearableDevice.user_id == current_user.id
        ).first()
        
        if not device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found"
            )
        
        # Update device settings
        device.sync_frequency = settings.get("sync_frequency", "hourly")
        device.notification_preferences = settings.get("notifications", {})
        device.data_preferences = settings.get("data_types", device.data_types)
        device.auto_sync = settings.get("auto_sync", True)
        
        db.commit()
        
        return {
            "message": "Device settings updated successfully",
            "settings": {
                "sync_frequency": device.sync_frequency,
                "notifications": device.notification_preferences,
                "data_types": device.data_preferences,
                "auto_sync": device.auto_sync
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update device settings: {str(e)}"
        )

@router.delete("/{device_id}")
async def disconnect_device(
    device_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Disconnect and remove wearable device"""
    try:
        device = db.query(WearableDevice).filter(
            WearableDevice.id == device_id,
            WearableDevice.user_id == current_user.id
        ).first()
        
        if not device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found"
            )
        
        # Deactivate device (keep for history)
        device.is_active = False
        device.connection_status = "disconnected"
        device.disconnected_at = datetime.utcnow()
        
        db.commit()
        
        return {"message": "Device disconnected successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to disconnect device: {str(e)}"
        )
