import asyncio
import os
import sys

# Add the parent directory to sys.path so 'app' can be found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine, Base
from app.models.models import Vehicle, VehicleStatusEnum
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def seed_vehicles():
    async with AsyncSessionLocal() as session:
        # Create some test vehicles
        v1 = Vehicle(
            id=1,
            registration_number="TRK-9001",
            model="Volvo FH16",
            type="Heavy Truck",
            max_load=20000,
            odometer=150000,
            acquisition_cost=120000,
            status=VehicleStatusEnum.AVAILABLE
        )
        v2 = Vehicle(
            id=2,
            registration_number="VAN-4042",
            model="Mercedes Sprinter",
            type="Delivery Van",
            max_load=3500,
            odometer=45000,
            acquisition_cost=45000,
            status=VehicleStatusEnum.AVAILABLE
        )
        session.add_all([v1, v2])
        await session.commit()
        print("Database seeded with test vehicles.")

if __name__ == "__main__":
    asyncio.run(seed_vehicles())
