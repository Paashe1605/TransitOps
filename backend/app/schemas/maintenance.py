from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.models import MaintenanceStatusEnum

class MaintenanceLogBase(BaseModel):
    vehicle_id: int
    description: str
    cost: float

class MaintenanceLogCreate(MaintenanceLogBase):
    pass

class MaintenanceLogUpdate(BaseModel):
    description: Optional[str] = None
    cost: Optional[float] = None
    status: Optional[MaintenanceStatusEnum] = None

class MaintenanceLogResponse(MaintenanceLogBase):
    id: int
    status: MaintenanceStatusEnum
    created_at: datetime

    class Config:
        from_attributes = True
