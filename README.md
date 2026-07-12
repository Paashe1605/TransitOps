# TransitOps

This repository contains the project codebase for the Odoo Hackathon 2026.

## Stack Overview
- **Frontend:** React (Vite) + Tailwind CSS v4 + Zustand + React Router
- **Backend:** FastAPI (Python) + PostgreSQL + Alembic
- **AI/Local Models:** Ollama (Gemma) + LangChain

## Setup Instructions for the Team (Prachi, Yash, Tushar)

To start working on your assigned feature modules, follow these steps exactly:

### 1. Clone & Branch
```bash
git clone https://github.com/Paashe1605/TransitOps.git
cd TransitOps
# ALWAYS create a feature branch for your work!
git checkout -b feature/your-module-name
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
# Start the FastAPI Server
uvicorn app.main:app --reload
```
The API will be running at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be running at `http://localhost:5173`. 
*Note: Test credentials are `admin@transitops.com` / `password123`*

### 4. Database Setup
Make sure you have Docker Desktop running. Paaras has already generated the migrations.
If you need to spin up the local DB:
```bash
docker-compose up -d
```

## Master Implementation Plan
Please read `docs/MASTER_PLAN.md` to see exactly what you are building and what your assigned role is.

---

# 🚀 Yash's Module: Core Business Logic & CRUD

This section outlines the complete implementation of the **Core Business Logic** module, which was built exactly to the specifications of the problem statement and the `MASTER_PLAN.md`.

## 🎯 Task Accomplishments
According to the master plan, Yash was responsible for:
1. **Vehicle Registry & Driver Management:** Building full CRUD APIs and corresponding React UI pages.
2. **Trip Management Flow:** Constructing the trip lifecycle APIs and interfaces.
3. **Business Rules Enforcement Engine:** Implementing strict constraints on cargo weight, license expiry, and vehicle/driver availability.
4. **Automated Status Transitions:** Building triggers that automatically transition Vehicle and Driver states based on the Trip lifecycle (e.g., `Available` -> `On Trip`).

All of these tasks have been **100% completed** in this feature branch.

## 📂 Detailed File Manifest: What, Why, and How

### Backend Changes (FastAPI)
- **`backend/app/schemas/vehicle.py`**: Pydantic models for the Vehicle entity. 
- **`backend/app/schemas/driver.py`**: Pydantic models for the Driver entity.
- **`backend/app/schemas/trip.py`**: Pydantic models handling Trip creation and Completion flows.
- **`backend/app/api/vehicles.py`**: REST API Router for `/vehicles/`. Enforces business rule: **Vehicle Registration Numbers must be perfectly unique.** 
- **`backend/app/api/drivers.py`**: REST API Router for `/drivers/`. Ensures Driver **License Numbers are globally unique**.
- **`backend/app/api/trips.py`**: The core Business Engine router for `/trips/`. Handles `/dispatch`, `/complete`, and `/cancel`. Validates `cargo_weight` against the assigned vehicle's `max_load`. Verifies Driver and Vehicle have an `AVAILABLE` status. Automates the transition of Vehicle and Driver statuses.
- **`backend/app/main.py`**: Imported and registered the three new routers into the main API space.

### Frontend Changes (React + Vite)
- **`frontend/src/lib/api.ts`**: Universal fetch wrapper for authenticated requests.
- **`frontend/src/components/Navbar.tsx` & `Layout.tsx`**: Navigation framework protected by an auth check.
- **`frontend/src/App.tsx` & `Dashboard.tsx`**: Route definitions and layout decoupling.
- **`frontend/src/pages/Vehicles.tsx`**: Interactive Registry Page querying `/vehicles/` API.
- **`frontend/src/pages/Drivers.tsx`**: Interactive Drivers Page.
- **`frontend/src/pages/Trips.tsx`**: Operations Command Center with Interactive Action Buttons (Dispatch, Complete, Cancel).

---

## 🧪 Testing Guide for Paaras
### 1. Boot up the Ecosystem
Ensure your Docker Desktop is running, then boot both ends:
```powershell
docker-compose up -d

# Backend (Terminal 1)
cd backend
.\venv\Scripts\Activate
alembic upgrade head
uvicorn app.main:app --reload

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### 2. Manual Verification Checklist
- [ ] **Login:** Navigate to `http://localhost:5173` and log in. Verify the Navbar appears and allows navigation to Vehicles, Drivers, and Trips.
- [ ] **Create Entities:** Since we haven't built the UI Modals yet, use the Swagger UI (`http://localhost:8000/docs`) to manually POST:
  - 1 Vehicle with a `max_load` of `500`.
  - 1 Driver with an `expiry_date` in the future.
  - 1 Draft Trip assigning that vehicle and driver, with a `cargo_weight` of `600`.
- [ ] **Verify Business Rule 1 (Cargo Weight):** Go to the React frontend **Trips** page. Click the "Dispatch" icon on the draft trip. The UI should alert you with an error from the backend stating the cargo exceeds maximum capacity.
- [ ] **Verify Business Rule 2 (Automated Status Transitions):** Go back to Swagger, update the trip's cargo weight to `400`. Go to the React UI and click Dispatch again. 
  - **Expected:** The Trip becomes `Dispatched`. Navigate to the Vehicles and Drivers pages; both entities should now automatically display a blue `On Trip` badge.
- [ ] **Verify Business Rule 3 (Completion Restoration):** Go to the Trips page and click the Complete icon. 
  - **Expected:** The Trip becomes `Completed`. Navigate to the Vehicles and Drivers pages; both entities should be restored to `Available`.
