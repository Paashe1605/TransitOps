from pydantic import BaseModel
from typing import Optional
from datetime import date

class FuelLogBase(BaseModel):
    vehicle_id: int
    liters: float
    cost: float
    date: date
    expense_type: Optional[str] = "Fuel"

class FuelLogCreate(FuelLogBase):
    pass

class FuelLogUpdate(BaseModel):
    liters: Optional[float] = None
    cost: Optional[float] = None
    date: Optional[date] = None
    expense_type: Optional[str] = None

class FuelLogResponse(FuelLogBase):
    id: int

    class Config:
        from_attributes = True

class VehicleFinancialsResponse(BaseModel):
    vehicle_id: int
    registration_number: str
    acquisition_cost: float
    total_maintenance_cost: float
    total_fuel_cost: float
    total_operational_cost: float
    roi_percentage: float
