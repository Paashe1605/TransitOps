from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.db.session import get_db
from app.models.models import FuelLog, MaintenanceLog, Vehicle
from app.schemas.expenses import FuelLogCreate, FuelLogUpdate, FuelLogResponse, VehicleFinancialsResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/fuel", response_model=FuelLogResponse, status_code=status.HTTP_201_CREATED)
def create_fuel_log(
    log_in: FuelLogCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == log_in.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    new_log = FuelLog(**log_in.model_dump())
    
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    
    return new_log

@router.get("/fuel", response_model=List[FuelLogResponse])
def get_fuel_logs(
    skip: int = 0,
    limit: int = 100,
    vehicle_id: int = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(FuelLog)
    if vehicle_id:
        query = query.filter(FuelLog.vehicle_id == vehicle_id)
    return query.offset(skip).limit(limit).all()

@router.get("/roi/{vehicle_id}", response_model=VehicleFinancialsResponse)
def get_vehicle_roi(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    maintenance_cost = db.query(func.sum(MaintenanceLog.cost)).filter(MaintenanceLog.vehicle_id == vehicle_id).scalar() or 0.0
    fuel_cost = db.query(func.sum(FuelLog.cost)).filter(FuelLog.vehicle_id == vehicle_id).scalar() or 0.0
    
    total_operational_cost = maintenance_cost + fuel_cost
    
    if vehicle.acquisition_cost > 0:
        roi_percentage = - (total_operational_cost / vehicle.acquisition_cost) * 100
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
