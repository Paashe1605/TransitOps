import asyncio
from app.db.session import AsyncSessionLocal
from app.models.models import User, RoleEnum
from app.core.security import get_password_hash

async def test():
    async with AsyncSessionLocal() as db:
        new_user = User(
            email='admin@transitops.com',
            password_hash=get_password_hash('password123'),
            role=RoleEnum.FLEET_MANAGER
        )
        db.add(new_user)
        await db.commit()
        print('success')

asyncio.run(test())
