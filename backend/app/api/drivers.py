from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.models.models import Driver, User, RoleEnum
from app.schemas.driver import Driver as DriverSchema, DriverCreate, DriverUpdate
from app.api.deps import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[DriverSchema])
async def read_drivers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    result = await db.execute(select(Driver).offset(skip).limit(limit))
    drivers = result.scalars().all()
    return drivers

@router.post("/", response_model=DriverSchema)
async def create_driver(
    *,
    db: AsyncSession = Depends(get_db),
    driver_in: DriverCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    if current_user.role not in [RoleEnum.FLEET_MANAGER, RoleEnum.SAFETY_OFFICER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    result = await db.execute(select(Driver).filter(Driver.license_number == driver_in.license_number))
    driver = result.scalars().first()
    if driver:
        raise HTTPException(
            status_code=400,
            detail="A driver with this license number already exists in the system.",
        )
    driver = Driver(**driver_in.dict())
    db.add(driver)
    await db.commit()
    await db.refresh(driver)
    return driver

@router.get("/{id}", response_model=DriverSchema)
async def read_driver(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    result = await db.execute(select(Driver).filter(Driver.id == id))
    driver = result.scalars().first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

@router.put("/{id}", response_model=DriverSchema)
async def update_driver(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    driver_in: DriverUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    if current_user.role not in [RoleEnum.FLEET_MANAGER, RoleEnum.SAFETY_OFFICER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    result = await db.execute(select(Driver).filter(Driver.id == id))
    driver = result.scalars().first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    update_data = driver_in.dict(exclude_unset=True)
    if "license_number" in update_data and update_data["license_number"] != driver.license_number:
        result_check = await db.execute(select(Driver).filter(Driver.license_number == update_data["license_number"]))
        if result_check.scalars().first():
            raise HTTPException(status_code=400, detail="License number already exists.")
            
    for field, value in update_data.items():
        setattr(driver, field, value)
        
    db.add(driver)
    await db.commit()
    await db.refresh(driver)
    return driver
