from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.db.session import get_db
from app.models.models import MaintenanceLog, Vehicle, VehicleStatusEnum, MaintenanceStatusEnum
from app.schemas.maintenance import MaintenanceLogCreate, MaintenanceLogUpdate, MaintenanceLogResponse
from app.api.deps import get_current_active_user

router = APIRouter()

@router.post("/", response_model=MaintenanceLogResponse, status_code=status.HTTP_201_CREATED)
async def create_maintenance_log(
    log_in: MaintenanceLogCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> Any:
    result = await db.execute(select(Vehicle).filter(Vehicle.id == log_in.vehicle_id))
    vehicle = result.scalars().first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    new_log = MaintenanceLog(
        vehicle_id=log_in.vehicle_id,
        description=log_in.description,
        cost=log_in.cost
    )

    # Update vehicle status to IN_SHOP
    vehicle.status = VehicleStatusEnum.IN_SHOP

    db.add(new_log)
    await db.commit()
    await db.refresh(new_log)

    return new_log

@router.get("/", response_model=List[MaintenanceLogResponse])
async def get_maintenance_logs(
    skip: int = 0,
    limit: int = 100,
    vehicle_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> Any:
    query = select(MaintenanceLog)
    if vehicle_id:
        query = query.filter(MaintenanceLog.vehicle_id == vehicle_id)
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()

@router.put("/{log_id}", response_model=MaintenanceLogResponse)
async def update_maintenance_log(
    log_id: int,
    log_in: MaintenanceLogUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> Any:
    result = await db.execute(select(MaintenanceLog).filter(MaintenanceLog.id == log_id))
    log = result.scalars().first()
    if not log:
        raise HTTPException(status_code=404, detail="Maintenance log not found")

    update_data = log_in.model_dump(exclude_unset=True)

    if 'status' in update_data and update_data['status'] == MaintenanceStatusEnum.CLOSED and log.status != MaintenanceStatusEnum.CLOSED:
        # Check if there are other OPEN maintenance logs for this vehicle
        open_result = await db.execute(
            select(func.count()).select_from(MaintenanceLog).filter(
                MaintenanceLog.vehicle_id == log.vehicle_id,
                MaintenanceLog.id != log_id,
                MaintenanceLog.status == MaintenanceStatusEnum.OPEN
            )
        )
        open_logs = open_result.scalar()
        if open_logs == 0:
            veh_result = await db.execute(select(Vehicle).filter(Vehicle.id == log.vehicle_id))
            vehicle = veh_result.scalars().first()
            if vehicle:
                vehicle.status = VehicleStatusEnum.AVAILABLE

    for key, value in update_data.items():
        setattr(log, key, value)

    await db.commit()
    await db.refresh(log)
    return log
