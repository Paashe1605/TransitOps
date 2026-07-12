from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class ExpenseBase(BaseModel):
    vehicle_id: int
    liters: float = 0.0
    cost: float
    date: date
    expense_type: str = "Fuel"

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int

    class Config:
        from_attributes = True

class OperationalCost(BaseModel):
    vehicle_id: int
    vehicle_registration: str
    total_fuel_cost: float
    total_maintenance_cost: float
    total_other_cost: float
    total_operational_cost: float
