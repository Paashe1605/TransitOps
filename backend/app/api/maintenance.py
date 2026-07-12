from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.models.models import MaintenanceLog, Vehicle, User, RoleEnum, MaintenanceStatusEnum, VehicleStatusEnum
from app.schemas.maintenance import MaintenanceLog as MaintenanceLogSchema, MaintenanceLogCreate, MaintenanceLogUpdate
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[MaintenanceLogSchema])
async def read_logs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    result = await db.execute(select(MaintenanceLog).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=MaintenanceLogSchema)
async def create_log(
    *,
    db: AsyncSession = Depends(get_db),
    log_in: MaintenanceLogCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    if current_user.role not in [RoleEnum.FLEET_MANAGER, RoleEnum.FINANCIAL_ANALYST]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    result = await db.execute(select(Vehicle).filter(Vehicle.id == log_in.vehicle_id))
    vehicle = result.scalars().first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    if vehicle.status == VehicleStatusEnum.RETIRED:
        raise HTTPException(status_code=400, detail="Cannot perform maintenance on a retired vehicle")

    # Business rule: Automatically change vehicle status to In Shop
    vehicle.status = VehicleStatusEnum.IN_SHOP
    
    log = MaintenanceLog(**log_in.dict())
    db.add(log)
    db.add(vehicle)
    await db.commit()
    await db.refresh(log)
    return log

@router.put("/{id}/close", response_model=MaintenanceLogSchema)
async def close_log(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    if current_user.role not in [RoleEnum.FLEET_MANAGER, RoleEnum.FINANCIAL_ANALYST]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    result = await db.execute(select(MaintenanceLog).filter(MaintenanceLog.id == id))
    log = result.scalars().first()
    if not log:
        raise HTTPException(status_code=404, detail="Maintenance log not found")

    if log.status == MaintenanceStatusEnum.CLOSED:
        raise HTTPException(status_code=400, detail="Log is already closed")

    log.status = MaintenanceStatusEnum.CLOSED

    # Restore vehicle status
    result = await db.execute(select(Vehicle).filter(Vehicle.id == log.vehicle_id))
    vehicle = result.scalars().first()
    if vehicle and vehicle.status == VehicleStatusEnum.IN_SHOP:
        vehicle.status = VehicleStatusEnum.AVAILABLE
        db.add(vehicle)

    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log
