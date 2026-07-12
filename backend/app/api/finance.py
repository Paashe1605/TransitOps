from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.db.session import get_db
from app.models.models import FuelLog, MaintenanceLog, Vehicle, User, RoleEnum
from app.schemas.finance import Expense, ExpenseCreate, OperationalCost
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/expenses", response_model=List[Expense])
async def read_expenses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    result = await db.execute(select(FuelLog).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/expenses", response_model=Expense)
async def create_expense(
    *,
    db: AsyncSession = Depends(get_db),
    expense_in: ExpenseCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    if current_user.role not in [RoleEnum.FLEET_MANAGER, RoleEnum.FINANCIAL_ANALYST]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    result = await db.execute(select(Vehicle).filter(Vehicle.id == expense_in.vehicle_id))
    vehicle = result.scalars().first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    expense = FuelLog(**expense_in.dict())
    db.add(expense)
    await db.commit()
    await db.refresh(expense)
    return expense

@router.get("/operational-costs", response_model=List[OperationalCost])
async def get_operational_costs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    # Get all vehicles
    result = await db.execute(select(Vehicle))
    vehicles = result.scalars().all()

    costs = []
    for v in vehicles:
        # Get fuel logs for vehicle
        f_result = await db.execute(select(FuelLog).filter(FuelLog.vehicle_id == v.id))
        expenses = f_result.scalars().all()
        
        # Get maintenance logs for vehicle
        m_result = await db.execute(select(MaintenanceLog).filter(MaintenanceLog.vehicle_id == v.id))
        maintenance_logs = m_result.scalars().all()

        fuel_cost = sum([e.cost for e in expenses if e.expense_type.lower() == "fuel"])
        other_cost = sum([e.cost for e in expenses if e.expense_type.lower() != "fuel"])
        maintenance_cost = sum([m.cost for m in maintenance_logs])

        costs.append(OperationalCost(
            vehicle_id=v.id,
            vehicle_registration=v.registration_number,
            total_fuel_cost=fuel_cost,
            total_maintenance_cost=maintenance_cost,
            total_other_cost=other_cost,
            total_operational_cost=fuel_cost + maintenance_cost + other_cost
        ))

    return costs
