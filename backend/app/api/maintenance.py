from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.models import MaintenanceLog, Vehicle, VehicleStatusEnum, MaintenanceStatusEnum
from app.schemas.maintenance import MaintenanceLogCreate, MaintenanceLogUpdate, MaintenanceLogResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=MaintenanceLogResponse, status_code=status.HTTP_201_CREATED)
def create_maintenance_log(
    log_in: MaintenanceLogCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == log_in.vehicle_id).first()
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
    db.commit()
    db.refresh(new_log)
    
    return new_log

@router.get("/", response_model=List[MaintenanceLogResponse])
def get_maintenance_logs(
    skip: int = 0,
    limit: int = 100,
    vehicle_id: int = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(MaintenanceLog)
    if vehicle_id:
        query = query.filter(MaintenanceLog.vehicle_id == vehicle_id)
    return query.offset(skip).limit(limit).all()

@router.put("/{log_id}", response_model=MaintenanceLogResponse)
def update_maintenance_log(
    log_id: int,
    log_in: MaintenanceLogUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    log = db.query(MaintenanceLog).filter(MaintenanceLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Maintenance log not found")

    update_data = log_in.model_dump(exclude_unset=True)
    
    if 'status' in update_data and update_data['status'] == MaintenanceStatusEnum.CLOSED and log.status != MaintenanceStatusEnum.CLOSED:
        # Check if there are other OPEN maintenance logs for this vehicle
        open_logs = db.query(MaintenanceLog).filter(
            MaintenanceLog.vehicle_id == log.vehicle_id, 
            MaintenanceLog.id != log_id,
            MaintenanceLog.status == MaintenanceStatusEnum.OPEN
        ).count()
        if open_logs == 0:
            vehicle = db.query(Vehicle).filter(Vehicle.id == log.vehicle_id).first()
            if vehicle:
                vehicle.status = VehicleStatusEnum.AVAILABLE

    for key, value in update_data.items():
        setattr(log, key, value)

    db.commit()
    db.refresh(log)
    return log
