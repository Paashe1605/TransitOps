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
    status: Optional[MaintenanceStatusEnum] = None
    description: Optional[str] = None
    cost: Optional[float] = None

class MaintenanceLog(MaintenanceLogBase):
    id: int
    status: MaintenanceStatusEnum
    created_at: datetime

    class Config:
        from_attributes = True
