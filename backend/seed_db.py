import asyncio
import os
import sys

# Add the parent directory to sys.path so 'app' can be found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine, Base
from app.models.models import User, RoleEnum
from app.core.security import get_password_hash
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def seed_db():
    async with AsyncSessionLocal() as session:
        # Create admin user
        admin = User(
            id=1,
            email="admin@transitops.com",
            password_hash=get_password_hash("password123"),
            role=RoleEnum.FLEET_MANAGER
        )
        session.add(admin)
        await session.commit()
        print("Database seeded with admin user.")

if __name__ == "__main__":
    asyncio.run(seed_db())
