from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Enum, Date
from sqlalchemy.orm import relationship
import enum
from datetime import datetime, timezone

from app.db.session import Base

# Enums
class RoleEnum(str, enum.Enum):
    FLEET_MANAGER = "Fleet Manager"
    DRIVER = "Driver"
    SAFETY_OFFICER = "Safety Officer"
    FINANCIAL_ANALYST = "Financial Analyst"

class VehicleStatusEnum(str, enum.Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    IN_SHOP = "In Shop"
    RETIRED = "Retired"

class DriverStatusEnum(str, enum.Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    OFF_DUTY = "Off Duty"
    SUSPENDED = "Suspended"

class TripStatusEnum(str, enum.Enum):
    DRAFT = "Draft"
    DISPATCHED = "Dispatched"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class MaintenanceStatusEnum(str, enum.Enum):
    OPEN = "Open"
    CLOSED = "Closed"


# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)


class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    registration_number = Column(String, unique=True, index=True, nullable=False)
    model = Column(String, nullable=False)
    type = Column(String, nullable=False)
    max_load = Column(Float, nullable=False) # in kg
    odometer = Column(Float, nullable=False, default=0.0)
    acquisition_cost = Column(Float, nullable=False)
    status = Column(Enum(VehicleStatusEnum), default=VehicleStatusEnum.AVAILABLE, nullable=False)
    
    trips = relationship("Trip", back_populates="vehicle")
    maintenance_logs = relationship("MaintenanceLog", back_populates="vehicle")
    fuel_logs = relationship("FuelLog", back_populates="vehicle")


class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    license_number = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    license_category = Column(String, nullable=False)
    expiry_date = Column(Date, nullable=False)
    contact = Column(String, nullable=False)
    safety_score = Column(Integer, default=100)
    status = Column(Enum(DriverStatusEnum), default=DriverStatusEnum.AVAILABLE, nullable=False)

    trips = relationship("Trip", back_populates="driver")


class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    source = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    cargo_weight = Column(Float, nullable=False)
    planned_distance = Column(Float, nullable=False)
    status = Column(Enum(TripStatusEnum), default=TripStatusEnum.DRAFT, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    vehicle = relationship("Vehicle", back_populates="trips")
    driver = relationship("Driver", back_populates="trips")


class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    description = Column(String, nullable=False)
    cost = Column(Float, nullable=False)
    status = Column(Enum(MaintenanceStatusEnum), default=MaintenanceStatusEnum.OPEN, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    vehicle = relationship("Vehicle", back_populates="maintenance_logs")


class FuelLog(Base):
    __tablename__ = "fuel_logs"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    liters = Column(Float, nullable=False)
    cost = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    expense_type = Column(String, default="Fuel", nullable=False)

    vehicle = relationship("Vehicle", back_populates="fuel_logs")
