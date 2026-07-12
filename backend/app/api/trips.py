from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import date

from app.db.session import get_db
from app.models.models import Trip, Vehicle, Driver, User, RoleEnum, TripStatusEnum, VehicleStatusEnum, DriverStatusEnum
from app.schemas.trip import Trip as TripSchema, TripCreate, TripUpdate, TripCompleteRequest
from app.api.deps import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[TripSchema])
async def read_trips(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    result = await db.execute(select(Trip).offset(skip).limit(limit))
    trips = result.scalars().all()
    return trips

@router.post("/", response_model=TripSchema)
async def create_trip(
    *,
    db: AsyncSession = Depends(get_db),
    trip_in: TripCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    if current_user.role not in [RoleEnum.FLEET_MANAGER, RoleEnum.DRIVER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    # Validation logic is usually done upon dispatch, but we can do basic validation here
    result = await db.execute(select(Vehicle).filter(Vehicle.id == trip_in.vehicle_id))
    vehicle = result.scalars().first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    result = await db.execute(select(Driver).filter(Driver.id == trip_in.driver_id))
    driver = result.scalars().first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    if trip_in.cargo_weight > vehicle.max_load:
        raise HTTPException(status_code=400, detail="Cargo weight exceeds vehicle's maximum load capacity.")

    trip = Trip(**trip_in.dict())
    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    return trip

@router.post("/{id}/dispatch", response_model=TripSchema)
async def dispatch_trip(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    result = await db.execute(select(Trip).filter(Trip.id == id))
    trip = result.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if trip.status != TripStatusEnum.DRAFT:
        raise HTTPException(status_code=400, detail="Only DRAFT trips can be dispatched")

    result = await db.execute(select(Vehicle).filter(Vehicle.id == trip.vehicle_id))
    vehicle = result.scalars().first()
    
    result = await db.execute(select(Driver).filter(Driver.id == trip.driver_id))
    driver = result.scalars().first()

    if vehicle.status != VehicleStatusEnum.AVAILABLE:
        raise HTTPException(status_code=400, detail=f"Vehicle is not available. Status: {vehicle.status}")
        
    if driver.status != DriverStatusEnum.AVAILABLE:
        raise HTTPException(status_code=400, detail=f"Driver is not available. Status: {driver.status}")

    if driver.expiry_date < date.today():
        raise HTTPException(status_code=400, detail="Driver's license has expired")

    if trip.cargo_weight > vehicle.max_load:
         raise HTTPException(status_code=400, detail="Cargo weight exceeds vehicle maximum capacity")

    trip.status = TripStatusEnum.DISPATCHED
    vehicle.status = VehicleStatusEnum.ON_TRIP
    driver.status = DriverStatusEnum.ON_TRIP

    db.add(trip)
    db.add(vehicle)
    db.add(driver)
    await db.commit()
    await db.refresh(trip)
    return trip


@router.post("/{id}/complete", response_model=TripSchema)
async def complete_trip(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    complete_in: TripCompleteRequest,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    result = await db.execute(select(Trip).filter(Trip.id == id))
    trip = result.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if trip.status != TripStatusEnum.DISPATCHED:
        raise HTTPException(status_code=400, detail="Only DISPATCHED trips can be completed")

    result = await db.execute(select(Vehicle).filter(Vehicle.id == trip.vehicle_id))
    vehicle = result.scalars().first()
    
    result = await db.execute(select(Driver).filter(Driver.id == trip.driver_id))
    driver = result.scalars().first()

    # Create fuel log could be added here in the future
    vehicle.odometer = complete_in.final_odometer

    trip.status = TripStatusEnum.COMPLETED
    vehicle.status = VehicleStatusEnum.AVAILABLE
    driver.status = DriverStatusEnum.AVAILABLE

    db.add(trip)
    db.add(vehicle)
    db.add(driver)
    await db.commit()
    await db.refresh(trip)
    return trip


@router.post("/{id}/cancel", response_model=TripSchema)
async def cancel_trip(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    result = await db.execute(select(Trip).filter(Trip.id == id))
    trip = result.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if trip.status not in [TripStatusEnum.DRAFT, TripStatusEnum.DISPATCHED]:
        raise HTTPException(status_code=400, detail="Trip cannot be cancelled from current status")

    if trip.status == TripStatusEnum.DISPATCHED:
        result = await db.execute(select(Vehicle).filter(Vehicle.id == trip.vehicle_id))
        vehicle = result.scalars().first()
        
        result = await db.execute(select(Driver).filter(Driver.id == trip.driver_id))
        driver = result.scalars().first()
        
        vehicle.status = VehicleStatusEnum.AVAILABLE
        driver.status = DriverStatusEnum.AVAILABLE
        db.add(vehicle)
        db.add(driver)

    trip.status = TripStatusEnum.CANCELLED
    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    return trip
