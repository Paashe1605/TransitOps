from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from app.models.models import VehicleStatusEnum

class VehicleBase(BaseModel):
    registration_number: str = Field(..., max_length=50)
    model: str = Field(..., max_length=100)
    type: str = Field(..., max_length=50)
    max_load: float = Field(..., gt=0)
    odometer: float = Field(0.0, ge=0)
    acquisition_cost: float = Field(..., ge=0)
    status: VehicleStatusEnum = VehicleStatusEnum.AVAILABLE

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    registration_number: Optional[str] = Field(None, max_length=50)
    model: Optional[str] = Field(None, max_length=100)
    type: Optional[str] = Field(None, max_length=50)
    max_load: Optional[float] = Field(None, gt=0)
    odometer: Optional[float] = Field(None, ge=0)
    acquisition_cost: Optional[float] = Field(None, ge=0)
    status: Optional[VehicleStatusEnum] = None

class VehicleInDBBase(VehicleBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

class Vehicle(VehicleInDBBase):
    pass

class VehicleDocumentBase(BaseModel):
    document_type: str
    document_name: str
    expiry_date: date

class VehicleDocumentCreate(VehicleDocumentBase):
    vehicle_id: int

class VehicleDocumentResponse(VehicleDocumentBase):
    id: int
    vehicle_id: int
    created_at: datetime

    class Config:
        from_attributes = True
