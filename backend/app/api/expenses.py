from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.db.session import get_db
from app.models.models import FuelLog, MaintenanceLog, Vehicle
from app.schemas.expenses import FuelLogCreate, FuelLogUpdate, FuelLogResponse, VehicleFinancialsResponse
from app.api.deps import get_current_active_user

router = APIRouter()

@router.post("/fuel", response_model=FuelLogResponse, status_code=status.HTTP_201_CREATED)
async def create_fuel_log(
    log_in: FuelLogCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> Any:
    result = await db.execute(select(Vehicle).filter(Vehicle.id == log_in.vehicle_id))
    vehicle = result.scalars().first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    new_log = FuelLog(**log_in.model_dump())

    db.add(new_log)
    await db.commit()
    await db.refresh(new_log)

    return new_log

@router.get("/fuel", response_model=List[FuelLogResponse])
async def get_fuel_logs(
    skip: int = 0,
    limit: int = 100,
    vehicle_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> Any:
    query = select(FuelLog)
    if vehicle_id:
        query = query.filter(FuelLog.vehicle_id == vehicle_id)
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/roi/{vehicle_id}", response_model=VehicleFinancialsResponse)
async def get_vehicle_roi(
    vehicle_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> Any:
    result = await db.execute(select(Vehicle).filter(Vehicle.id == vehicle_id))
    vehicle = result.scalars().first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    maint_result = await db.execute(
        select(func.sum(MaintenanceLog.cost)).filter(MaintenanceLog.vehicle_id == vehicle_id)
    )
    maintenance_cost = maint_result.scalar() or 0.0

    fuel_result = await db.execute(
        select(func.sum(FuelLog.cost)).filter(FuelLog.vehicle_id == vehicle_id)
    )
    fuel_cost = fuel_result.scalar() or 0.0

    total_operational_cost = maintenance_cost + fuel_cost

    if vehicle.acquisition_cost > 0:
        roi_percentage = -(total_operational_cost / vehicle.acquisition_cost) * 100
    else:
        roi_percentage = 0.0

    return VehicleFinancialsResponse(
        vehicle_id=vehicle.id,
        registration_number=vehicle.registration_number,
        acquisition_cost=vehicle.acquisition_cost,
        total_maintenance_cost=maintenance_cost,
        total_fuel_cost=fuel_cost,
        total_operational_cost=total_operational_cost,
        roi_percentage=round(roi_percentage, 2)
    )
