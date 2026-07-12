from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.models import TripStatusEnum

class TripBase(BaseModel):
    vehicle_id: int
    driver_id: int
    source: str = Field(..., max_length=255)
    destination: str = Field(..., max_length=255)
    cargo_weight: float = Field(..., gt=0)
    planned_distance: float = Field(..., gt=0)
    revenue: float = 0.0
    status: TripStatusEnum = TripStatusEnum.DRAFT

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    vehicle_id: Optional[int] = None
    driver_id: Optional[int] = None
    source: Optional[str] = Field(None, max_length=255)
    destination: Optional[str] = Field(None, max_length=255)
    cargo_weight: Optional[float] = Field(None, gt=0)
    planned_distance: Optional[float] = Field(None, gt=0)
    status: Optional[TripStatusEnum] = None

class TripInDBBase(TripBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class Trip(TripInDBBase):
    pass

class TripCompleteRequest(BaseModel):
    final_odometer: float = Field(..., ge=0)
    fuel_consumed: float = Field(..., ge=0)
    fuel_cost: float = Field(..., ge=0)
    revenue: float = Field(0.0, ge=0)
