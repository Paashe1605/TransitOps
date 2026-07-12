from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from app.models.models import DriverStatusEnum

class DriverBase(BaseModel):
    license_number: str = Field(..., max_length=50)
    name: str = Field(..., max_length=100)
    license_category: str = Field(..., max_length=50)
    expiry_date: date
    contact: str = Field(..., max_length=50)
    safety_score: int = Field(100, ge=0, le=100)
    status: DriverStatusEnum = DriverStatusEnum.AVAILABLE

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    license_number: Optional[str] = Field(None, max_length=50)
    name: Optional[str] = Field(None, max_length=100)
    license_category: Optional[str] = Field(None, max_length=50)
    expiry_date: Optional[date] = None
    contact: Optional[str] = Field(None, max_length=50)
    safety_score: Optional[int] = Field(None, ge=0, le=100)
    status: Optional[DriverStatusEnum] = None

class DriverInDBBase(DriverBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

class Driver(DriverInDBBase):
    pass
