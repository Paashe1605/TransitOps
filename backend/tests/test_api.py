import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.api.deps import get_current_user
from app.models.models import User, RoleEnum

def override_get_current_user():
    return User(id=1, email="admin@transitops.com", role=RoleEnum.FLEET_MANAGER)

app.dependency_overrides[get_current_user] = override_get_current_user

@pytest.mark.asyncio
async def test_get_vehicles():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test/api/v1") as ac:
        response = await ac.get("/vehicles/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_drivers():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test/api/v1") as ac:
        response = await ac.get("/drivers/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_trips():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test/api/v1") as ac:
        response = await ac.get("/trips/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_maintenance():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test/api/v1") as ac:
        response = await ac.get("/maintenance/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_expenses():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test/api/v1") as ac:
        response = await ac.get("/finance/expenses")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_operational_costs():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test/api/v1") as ac:
        response = await ac.get("/finance/operational-costs")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
