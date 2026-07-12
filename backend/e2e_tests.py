import pytest
import httpx
from datetime import datetime, date, timedelta
import asyncio

BASE_URL = "http://localhost:8000"

@pytest.fixture(scope="module")
def anyio_backend():
    return 'asyncio'

@pytest.fixture(scope="module")
async def client():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        yield client

@pytest.fixture(scope="module")
async def auth_headers(client: httpx.AsyncClient):
    # Login as admin to get the token
    response = await client.post("/api/v1/auth/login", data={
        "username": "admin@transitops.com",
        "password": "password123"
    })
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.anyio
async def test_end_to_end_flow(client: httpx.AsyncClient, auth_headers: dict):
    # 1. Create a Vehicle
    vehicle_data = {
        "registration_number": f"TEST-V-{int(datetime.utcnow().timestamp())}",
        "model": "Test Truck",
        "type": "Heavy Duty",
        "max_load": 10000.0,
        "acquisition_cost": 50000.0
    }
    resp = await client.post("/api/v1/vehicles/", json=vehicle_data, headers=auth_headers)
    assert resp.status_code == 200, f"Vehicle creation failed: {resp.text}"
    vehicle_id = resp.json()["id"]

    # 2. Add a Vehicle Document
    doc_data = {
        "vehicle_id": vehicle_id,
        "document_type": "Insurance",
        "document_name": "Test Insurance Policy",
        "expiry_date": (date.today() + timedelta(days=365)).isoformat()
    }
    resp = await client.post("/api/v1/vehicles/documents", json=doc_data, headers=auth_headers)
    assert resp.status_code == 200, f"Document creation failed: {resp.text}"

    # 3. Create a Driver
    driver_data = {
        "license_number": f"LIC-{int(datetime.utcnow().timestamp())}",
        "name": "E2E Test Driver",
        "license_category": "Class A",
        "expiry_date": (date.today() + timedelta(days=30)).isoformat(),
        "contact": "123-456-7890"
    }
    resp = await client.post("/api/v1/drivers/", json=driver_data, headers=auth_headers)
    assert resp.status_code == 200, f"Driver creation failed: {resp.text}"
    driver_id = resp.json()["id"]

    # 4. Draft a Trip
    trip_data = {
        "vehicle_id": vehicle_id,
        "driver_id": driver_id,
        "source": "City A",
        "destination": "City B",
        "cargo_weight": 5000.0,
        "planned_distance": 250.0
    }
    resp = await client.post("/api/v1/trips/", json=trip_data, headers=auth_headers)
    assert resp.status_code == 200, f"Trip creation failed: {resp.text}"
    trip_id = resp.json()["id"]

    # 5. Dispatch the Trip
    resp = await client.post(f"/api/v1/trips/{trip_id}/dispatch", headers=auth_headers)
    assert resp.status_code == 200, f"Trip dispatch failed: {resp.text}"
    
    # Verify driver and vehicle statuses are ON_TRIP
    v_resp = await client.get(f"/api/v1/vehicles/{vehicle_id}", headers=auth_headers)
    d_resp = await client.get(f"/api/v1/drivers/{driver_id}", headers=auth_headers)
    assert v_resp.json()["status"] == "On Trip"
    assert d_resp.json()["status"] == "On Trip"

    # 6. Complete the Trip
    complete_payload = {
        "final_odometer": 250.0,
        "fuel_consumed": 50.0,
        "fuel_cost": 150.0
    }
    resp = await client.post(f"/api/v1/trips/{trip_id}/complete", json=complete_payload, headers=auth_headers)
    assert resp.status_code == 200, f"Trip complete failed: {resp.text}"
    
    # Verify driver and vehicle statuses are AVAILABLE
    v_resp = await client.get(f"/api/v1/vehicles/{vehicle_id}", headers=auth_headers)
    assert v_resp.json()["status"] == "Available"

    # 7. Add Maintenance Log
    maint_data = {
        "vehicle_id": vehicle_id,
        "description": "Oil Change",
        "cost": 150.0
    }
    resp = await client.post("/api/v1/maintenance/", json=maint_data, headers=auth_headers)
    assert resp.status_code == 200
    maint_id = resp.json()["id"]

    # Verify vehicle status is IN_SHOP
    v_resp = await client.get(f"/api/v1/vehicles/{vehicle_id}", headers=auth_headers)
    assert v_resp.json()["status"] == "In Shop"

    # Close Maintenance
    resp = await client.put(f"/api/v1/maintenance/{maint_id}/close", headers=auth_headers)
    assert resp.status_code == 200
    
    # Verify vehicle status is AVAILABLE again
    v_resp = await client.get(f"/api/v1/vehicles/{vehicle_id}", headers=auth_headers)
    assert v_resp.json()["status"] == "Available"

    # 8. Add Fuel Expense
    fuel_data = {
        "vehicle_id": vehicle_id,
        "liters": 100.0,
        "cost": 350.0,
        "date": date.today().isoformat()
    }
    resp = await client.post("/api/v1/finance/expenses/fuel", json=fuel_data, headers=auth_headers)
    assert resp.status_code == 200

    print("✅ End-to-End Test Passed Successfully!")
