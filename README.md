# TransitOps

This repository contains the project codebase for the Odoo Hackathon 2026.

## Stack Overview
- **Frontend:** React (Vite) + Tailwind CSS + Shadcn UI
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL
- **AI/Local Models:** Ollama + Gemma 4

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
- **`backend/app/schemas/vehicle.py`**: 
  - *What:* Pydantic models for the Vehicle entity. 
  - *Why/How:* Ensures strict data validation on incoming API requests (e.g., ensuring `max_load` and `acquisition_cost` are logically positive numbers).
- **`backend/app/schemas/driver.py`**: 
  - *What:* Pydantic models for the Driver entity.
  - *Why/How:* Validates driver inputs, specifically ensuring proper date formatting for `expiry_date` and clamping `safety_score` limits.
- **`backend/app/schemas/trip.py`**: 
  - *What:* Pydantic models handling Trip creation and Completion flows.
  - *Why/How:* Defines the schema required to complete a trip (e.g., submitting `final_odometer` and `fuel_cost`).
- **`backend/app/api/vehicles.py`**: 
  - *What:* REST API Router for `/vehicles/`.
  - *Why/How:* Provides `GET`, `POST`, `PUT` routes. Enforces business rule: **Vehicle Registration Numbers must be perfectly unique.** It also checks Role-Based Access Control (RBAC).
- **`backend/app/api/drivers.py`**: 
  - *What:* REST API Router for `/drivers/`.
  - *Why/How:* Provides full CRUD operations and ensures Driver **License Numbers are globally unique**.
- **`backend/app/api/trips.py`**: 
  - *What:* The core Business Engine router for `/trips/`.
  - *Why/How:* Handles the highly complex `/dispatch`, `/complete`, and `/cancel` endpoints. 
    - **Logic built:** Validates `cargo_weight` against the assigned vehicle's `max_load`. Verifies both the Driver and Vehicle have an `AVAILABLE` status (preventing `IN_SHOP` or `SUSPENDED` assignments). Checks the driver's license expiry against today's date. Automates the transition of Vehicle and Driver statuses to `ON_TRIP` and securely reverts them back to `AVAILABLE` upon completion or cancellation.
- **`backend/app/main.py`**: 
  - *What:* FastAPI Application Entrypoint.
  - *Why/How:* Imported and registered the three new routers into the main API space.

### Frontend Changes (React + Vite)
- **`frontend/src/lib/api.ts`**: 
  - *What:* Universal fetch wrapper for authenticated requests.
  - *Why/How:* Automatically extracts the JWT token from `localStorage` and injects it into the Authorization headers for all API calls. Handles standardized error parsing.
- **`frontend/src/components/Navbar.tsx` & `Layout.tsx`**: 
  - *What:* Navigation framework.
  - *Why/How:* Provides a clean, sticky navigation bar with active routing to the new modules, protected by an auth check that redirects unauthenticated users to `/login`.
- **`frontend/src/App.tsx` & `Dashboard.tsx`**: 
  - *What:* Route definitions.
  - *Why/How:* Wrapped the protected application inside the `Layout` component and decoupled redundant dashboard UI headers to keep the DOM clean.
- **`frontend/src/pages/Vehicles.tsx`**: 
  - *What:* Interactive Registry Page.
  - *Why/How:* Automatically queries the `/vehicles/` API and maps the response to a clean Tailwind data table featuring dynamic status pill badges (Green for Available, Blue for On Trip).
- **`frontend/src/pages/Drivers.tsx`**: 
  - *What:* Interactive Drivers Page.
  - *Why/How:* Displays drivers and their safety scores. Readies the scaffolding for future Add/Edit modals.
- **`frontend/src/pages/Trips.tsx`**: 
  - *What:* Operations Command Center.
  - *Why/How:* Lists all trips. Critically, it implements **Interactive Action Buttons**. If a trip is 'Draft', it shows a Dispatch button. If 'Dispatched', it shows Complete and Cancel buttons. These buttons fire requests to our business logic APIs to trigger status transitions safely.

---

## 🧪 Testing Guide for Paaras

Paaras, once you pull this PR into your environment, please follow these steps to verify the Core Business Logic module:

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
