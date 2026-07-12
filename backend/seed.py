import asyncio
from datetime import date, datetime, timedelta
from app.db.session import AsyncSessionLocal
from app.models.models import (
    User, Vehicle, Driver, Trip, MaintenanceLog, FuelLog, VehicleDocument,
    VehicleStatusEnum, DriverStatusEnum, TripStatusEnum, MaintenanceStatusEnum, RoleEnum
)
from app.core.security import get_password_hash

async def seed_data():
    async with AsyncSessionLocal() as db:
        print("Cleaning up old data...")
        await db.execute(FuelLog.__table__.delete())
        await db.execute(MaintenanceLog.__table__.delete())
        await db.execute(Trip.__table__.delete())
        await db.execute(VehicleDocument.__table__.delete())
        await db.execute(Vehicle.__table__.delete())
        await db.execute(Driver.__table__.delete())
        await db.commit()

        print("Seeding Admin User...")
        from sqlalchemy import select
        result = await db.execute(select(User).filter(User.email == "admin@transitops.com"))
        admin_user = result.scalars().first()
        if not admin_user:
            admin_user = User(
                email="admin@transitops.com",
                hashed_password=get_password_hash("password123"),
                full_name="System Admin",
                role=RoleEnum.ADMIN,
                is_active=True
            )
            db.add(admin_user)
            await db.commit()

        print("Seeding Vehicles...")
        v1 = Vehicle(registration_number="MH-01-AA-1111", model="Volvo FH16", type="Heavy Duty", max_load=15000, acquisition_cost=85000, status=VehicleStatusEnum.AVAILABLE)
        v2 = Vehicle(registration_number="MH-02-BB-2222", model="Tata Prima", type="Truck", max_load=8000, acquisition_cost=45000, status=VehicleStatusEnum.AVAILABLE)
        v3 = Vehicle(registration_number="MH-03-CC-3333", model="Ashok Leyland", type="Truck", max_load=10000, acquisition_cost=55000, status=VehicleStatusEnum.AVAILABLE)
        v4 = Vehicle(registration_number="MH-04-DD-4444", model="Mahindra Furio", type="Light Commercial", max_load=4000, acquisition_cost=25000, status=VehicleStatusEnum.ON_TRIP)
        v5 = Vehicle(registration_number="MH-05-EE-5555", model="Eicher Pro", type="Medium Duty", max_load=6500, acquisition_cost=35000, status=VehicleStatusEnum.IN_SHOP)
        db.add_all([v1, v2, v3, v4, v5])
        await db.commit()
        await db.refresh(v1)
        await db.refresh(v2)
        await db.refresh(v3)
        await db.refresh(v4)
        await db.refresh(v5)

        print("Seeding Drivers...")
        d1 = Driver(license_number="LIC-1001", name="Ramesh Kumar", license_category="HTV", expiry_date=date(2028, 5, 12), contact="9876543210", safety_score=95, status=DriverStatusEnum.AVAILABLE)
        d2 = Driver(license_number="LIC-1002", name="Suresh Patel", license_category="HTV", expiry_date=date(2026, 8, 15), contact="9876543211", safety_score=82, status=DriverStatusEnum.AVAILABLE)
        d3 = Driver(license_number="LIC-1003", name="Amit Singh", license_category="HTV", expiry_date=date(2029, 1, 10), contact="9876543212", safety_score=100, status=DriverStatusEnum.AVAILABLE)
        d4 = Driver(license_number="LIC-1004", name="Vikram Sharma", license_category="LMV", expiry_date=date(2027, 11, 20), contact="9876543213", safety_score=78, status=DriverStatusEnum.ON_TRIP)
        d5 = Driver(license_number="LIC-1005", name="Rahul Verma", license_category="HTV", expiry_date=date(2024, 5, 1), contact="9876543214", safety_score=65, status=DriverStatusEnum.SUSPENDED)
        db.add_all([d1, d2, d3, d4, d5])
        await db.commit()
        await db.refresh(d1)
        await db.refresh(d2)
        await db.refresh(d3)
        await db.refresh(d4)
        await db.refresh(d5)

        print("Seeding Trips...")
        t1 = Trip(vehicle_id=v1.id, driver_id=d1.id, source="Mumbai", destination="Pune", cargo_weight=12000, planned_distance=150, status=TripStatusEnum.COMPLETED, revenue=1500)
        t2 = Trip(vehicle_id=v2.id, driver_id=d2.id, source="Delhi", destination="Jaipur", cargo_weight=5000, planned_distance=280, status=TripStatusEnum.COMPLETED, revenue=2200)
        t3 = Trip(vehicle_id=v3.id, driver_id=d3.id, source="Bangalore", destination="Chennai", cargo_weight=8000, planned_distance=350, status=TripStatusEnum.COMPLETED, revenue=3100)
        t4 = Trip(vehicle_id=v4.id, driver_id=d4.id, source="Hyderabad", destination="Vijayawada", cargo_weight=3500, planned_distance=275, status=TripStatusEnum.DISPATCHED)
        t5 = Trip(vehicle_id=v1.id, driver_id=d2.id, source="Pune", destination="Nashik", cargo_weight=14000, planned_distance=210, status=TripStatusEnum.DRAFT)
        db.add_all([t1, t2, t3, t4, t5])
        await db.commit()

        print("Seeding Expenses & Fuel Logs...")
        e1 = FuelLog(vehicle_id=v1.id, expense_type="Fuel", cost=450, liters=42, date=date.today() - timedelta(days=2))
        e2 = FuelLog(vehicle_id=v2.id, expense_type="Fuel", cost=800, liters=75, date=date.today() - timedelta(days=5))
        e3 = FuelLog(vehicle_id=v3.id, expense_type="Toll", cost=120, liters=0, date=date.today() - timedelta(days=1))
        e4 = FuelLog(vehicle_id=v4.id, expense_type="Insurance", cost=1500, liters=0, date=date.today() - timedelta(days=30))
        e5 = FuelLog(vehicle_id=v1.id, expense_type="Fuel", cost=520, liters=48, date=date.today() - timedelta(days=10))
        db.add_all([e1, e2, e3, e4, e5])
        
        print("Seeding Maintenance Logs...")
        m1 = MaintenanceLog(vehicle_id=v2.id, description="Brake pad replacement", cost=350, status=MaintenanceStatusEnum.CLOSED)
        m2 = MaintenanceLog(vehicle_id=v5.id, description="Engine overhaul", cost=4200, status=MaintenanceStatusEnum.OPEN)
        db.add_all([m1, m2])
        await db.commit()

        print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
