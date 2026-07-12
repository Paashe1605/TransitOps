# Master Implementation Plan: TransitOps

This plan serves as the definitive guide for the TransitOps hackathon project. It encompasses every requirement from the problem statement and strategically divides the workload among the 4 team members so everyone can work in parallel using Feature Branches.

## 🚨 User Review Required
> [!IMPORTANT]
> Paaras, please review this master plan. Once you approve it, I will commit this document into the repository (as `docs/MASTER_PLAN.md`) and push it to GitHub so your entire team can pull it. I will also provide the exact setup instructions for your team in the chat.

## 👥 Team Workflow & Division of Labor

We will use the **Feature Branch Workflow**. Everyone will `git pull origin main`, create a branch for their module (e.g., `git checkout -b feature/ui-theme`), build it, and push it for Paaras to merge.

### 1. Paaras (Team Leader)
**Role:** Architecture, Orchestration, and Core Infrastructure.
- **Completed:** Base FastAPI setup, PostgreSQL Docker container, React (Vite) initialization, JWT Auth, and RBAC.
- **Next Tasks:** 
  - Update `requirements.txt` and `package.json` with all finalized dependencies.
  - Oversee PR reviews and merge conflicts.
  - Implement the **Email Reminders** (Bonus Feature) for expiring licenses using a background task (e.g., Celery or FastAPI BackgroundTasks).
  - Implement **PDF Export** (Bonus Feature) for reports.
  - **Local AI Agent (RAG):** Integrate the local LLM (Ollama/Gemma) into the backend. Create an AI Assistant on the Dashboard that can analyze the fleet's data (e.g., "Which vehicles are costing us the most in maintenance?") using the real-time PostgreSQL data.

### 2. Prachi (Frontend & UI/UX Expert)
**Role:** High-class Frontend enhancements and Analytics.
- **Tasks:**
  - **Theming:** Apply a cohesive, premium color scheme (vibrant, modern glassmorphism) using Tailwind v4.
  - **Dark Mode:** Implement the Dark Mode toggle (Bonus Feature).
  - **Dashboard Analytics:** Build the interactive charts (Bonus Feature) for Fleet Utilization, Fuel Efficiency, and Operational Costs using a library like Recharts or Chart.js.
  - **UX:** Add search, filters, and sorting to all data tables (Bonus Feature).

### 3. Yash (Core Business Logic)
**Role:** Core CRUD and Trip Management Workflow.
- **Tasks:**
  - **Vehicle Registry & Drivers:** Build full CRUD APIs and UI pages for Vehicles and Drivers.
  - **Trip Management:** Implement the Trip creation flow.
  - **Business Rules Enforcement:**
    - Ensure Vehicle Registration Number is unique.
    - Validate Cargo Weight ≤ Vehicle Maximum Capacity.
    - Prevent dispatching if Vehicle is *In Shop* or *Retired*, or Driver is *Suspended* or *Expired*.
  - **Status Transitions:** Automate status changes (e.g., Dispatching changes Vehicle/Driver to *On Trip*; Completing reverts them to *Available*).

### 4. Tushar (Maintenance & Expenses)
**Role:** Maintenance workflow and Financials.
- **Tasks:**
  - **Maintenance Workflow:** Build the Maintenance Log API. Ensure creating a log switches the Vehicle to *In Shop*.
  - **Fuel & Expenses:** Build tracking for fuel logs and tolls, and calculate Vehicle ROI and Operational Costs.

---

## 🏗️ Technical Architecture Details

### Database Entities (PostgreSQL via SQLAlchemy)
- `Users` & `Roles` (Already built)
- `Vehicles`: id, registration_number (unique), model, type, max_capacity, odometer, acquisition_cost, status.
- `Drivers`: id, name, license_number, license_category, license_expiry, contact, safety_score, status.
- `Trips`: id, source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status.
- `MaintenanceLogs`: id, vehicle_id, description, cost, date, status.
- `FuelLogs` & `Expenses`: id, vehicle_id, liters, cost, date, type.

### Verification Plan for the Team
- **Prachi:** Verify UI responds perfectly across desktop and mobile, and Dark Mode persists.
- **Yash:** Write API integration tests (using FastAPI `TestClient`) to ensure a trip *cannot* be dispatched if the vehicle is over capacity.
- **Tushar:** Verify that creating a maintenance log successfully triggers the Vehicle status update, and test the Local AI response latency.
