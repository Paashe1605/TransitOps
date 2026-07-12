from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.models.models import Vehicle, User, RoleEnum, VehicleDocument
from app.schemas.vehicle import Vehicle as VehicleSchema, VehicleCreate, VehicleUpdate, VehicleDocumentCreate, VehicleDocumentResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[VehicleSchema])
async def read_vehicles(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    result = await db.execute(select(Vehicle).offset(skip).limit(limit))
    vehicles = result.scalars().all()
    return vehicles

@router.post("/", response_model=VehicleSchema)
async def create_vehicle(
    *,
    db: AsyncSession = Depends(get_db),
    vehicle_in: VehicleCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    if current_user.role not in [RoleEnum.FLEET_MANAGER, RoleEnum.SAFETY_OFFICER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    result = await db.execute(select(Vehicle).filter(Vehicle.registration_number == vehicle_in.registration_number))
    vehicle = result.scalars().first()
    if vehicle:
        raise HTTPException(
            status_code=400,
            detail="A vehicle with this registration number already exists in the system.",
        )
    vehicle = Vehicle(**vehicle_in.dict())
    db.add(vehicle)
    await db.commit()
    await db.refresh(vehicle)
    return vehicle

@router.get("/{id}", response_model=VehicleSchema)
async def read_vehicle(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    result = await db.execute(select(Vehicle).filter(Vehicle.id == id))
    vehicle = result.scalars().first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

@router.put("/{id}", response_model=VehicleSchema)
async def update_vehicle(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    vehicle_in: VehicleUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    if current_user.role not in [RoleEnum.FLEET_MANAGER, RoleEnum.SAFETY_OFFICER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    result = await db.execute(select(Vehicle).filter(Vehicle.id == id))
    vehicle = result.scalars().first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    update_data = vehicle_in.dict(exclude_unset=True)
    if "registration_number" in update_data and update_data["registration_number"] != vehicle.registration_number:
        result_check = await db.execute(select(Vehicle).filter(Vehicle.registration_number == update_data["registration_number"]))
        if result_check.scalars().first():
            raise HTTPException(status_code=400, detail="Registration number already exists.")
            
    for field, value in update_data.items():
        setattr(vehicle, field, value)
        
    db.add(vehicle)
    await db.commit()
    await db.refresh(vehicle)
    return vehicle

@router.post("/documents", response_model=VehicleDocumentResponse)
async def create_vehicle_document(
    *,
    db: AsyncSession = Depends(get_db),
    doc_in: VehicleDocumentCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    if current_user.role not in [RoleEnum.FLEET_MANAGER, RoleEnum.SAFETY_OFFICER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    doc = VehicleDocument(**doc_in.dict())
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc

@router.get("/{id}/documents", response_model=List[VehicleDocumentResponse])
async def read_vehicle_documents(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    result = await db.execute(select(VehicleDocument).filter(VehicleDocument.vehicle_id == id))
    return result.scalars().all()

@router.delete("/documents/{doc_id}")
async def delete_vehicle_document(
    *,
    db: AsyncSession = Depends(get_db),
    doc_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    if current_user.role not in [RoleEnum.FLEET_MANAGER, RoleEnum.SAFETY_OFFICER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    result = await db.execute(select(VehicleDocument).filter(VehicleDocument.id == doc_id))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    await db.delete(doc)
    await db.commit()
    return {"status": "success"}
