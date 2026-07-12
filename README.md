# 🚛 TransitOps - Fleet Management System

![TransitOps Banner](https://via.placeholder.com/1200x300.png?text=TransitOps+-+Enterprise+Fleet+Operations)

> A modern, full-stack Fleet Management System tailored for operators to manage vehicles, dispatch trips, track maintenance, and compute financial ROI with a gorgeous glassmorphic interface.

---

## ✨ Top Features

- 📊 **Dynamic Dashboard**: Centralized operations hub tracking fleet utilization, driver status, maintenance requests, and calculating total Vehicle ROI via interactive charts.
- 🚚 **Vehicle & Driver Roster**: Comprehensive registries for fleet assets and human resources, highlighting availability and licensing statuses.
- 🗺️ **Trip Dispatching**: Full lifecycle trip management. Create a trip, assign drivers to vehicles, dispatch, and finally complete the route to generate revenue and log fuel costs.
- 🔧 **Maintenance Logbook**: Track service records and auto-repair costs. Operators can instantly log and close mechanical issues, tying expenses to the core financial algorithm.
- 💵 **Financial Hub**: Consolidated view of tolls, fuel logs, and insurance costs. Includes a highly requested one-click **Export to CSV** functionality for accounting departments.
- 🌗 **Adaptive UI (Dark & Light Mode)**: Stunning custom glass-panel aesthetics tailored with Tailwind CSS that effortlessly switches between themes for optimal viewing.

---

## 🛠️ Architecture Stack

### Frontend (Client)
- **React 18** via **Vite** for lightning-fast HMR.
- **TypeScript** for strict type safety.
- **Tailwind CSS v4** configured with custom CSS variables and glassmorphism utilities.
- **Zustand** for lightweight, decentralized state management.
- **Recharts** for rendering high-performance SVGs.
- **Lucide React** for crisp, scalable iconography.

### Backend (Server)
- **FastAPI** for high-performance, asynchronous REST APIs.
- **PostgreSQL** configured with the `asyncpg` driver for non-blocking I/O.
- **SQLAlchemy 2.0** as the ORM handling complex table relationships.
- **Pydantic V2** for request validation and serialization.
- **Pytest** for automated endpoint testing.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL (Local or Docker instance)

### 1. Database Setup
Ensure PostgreSQL is running and create a database named `transitops`. Update your `.env` connection string in the backend accordingly.

### 2. Backend Initialization
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (or venv\Scripts\activate on Windows)
pip install -r requirements.txt

# Run migrations to build the schema
alembic upgrade head

# (Optional) Seed the database with mock historical data!
python seed.py

# Boot the API server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Frontend Initialization
```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```

Navigate to `http://localhost:5173` to explore the workspace!

**Default Login Credentials:**
- **Email:** `admin@transitops.com`
- **Password:** `password123`

---

## 📖 End-to-End System Manual & Testing Guide

This section provides a comprehensive step-by-step guide to testing the fully functional TransitOps system, including mock data for easy verification.

### 1. Dashboard (Operations Hub)
**Functionality:** This is the command center. It aggregates real-time data from all other modules to provide a high-level overview of fleet utilization, financial ROI, fuel efficiency, and pending actions.
**Capabilities:** 
- Displays real-time counts of Vehicles on the road, Drivers on duty, and Maintenance status.
- Calculates dynamic Fleet ROI `((Total Revenue - Total Cost) / Asset Cost)`.
- Interactive charts for Fuel Efficiency and Operational Costs.

**Test Step:** 
- Simply open the dashboard. You should see active metrics because the seeder automatically injected historical trips, vehicles, and maintenance logs into your local database!

### 2. Vehicles & Drivers (Roster Management)
**Functionality:** Maintains a master list of all physical assets (trucks, vans) and human resources (drivers).
**Capabilities:**
- View Registration, Model, Capacity, and Status (Available, On Trip, In Shop).
- Drivers list shows License, Category, Expiry Date, and Safety Score.
- Search and filter grids.

**Test Step:**
- Navigate to the **Vehicles** tab. Verify the table is populated.
- Try searching for `Tata` in the search bar. The grid will instantly filter the results.

### 3. Trips (Dispatch Lifecycle)
**Functionality:** The core operational flow of the business. You can draft, dispatch, and complete trips.
**Capabilities:**
- Ensures only "Available" vehicles and drivers can be dispatched.
- Once a trip is completed, it asks for the revenue generated and fuel metrics, which instantly update the financial charts on the Dashboard.

**End-to-End Test (Copy-Paste this scenario):**
1. Navigate to the **Trips** tab.
2. Click **+ New Trip**.
3. *Select an Available Vehicle:* (e.g., MH-01-AB-1234)
4. *Select an Available Driver:* (e.g., Ramesh Kumar)
5. *Source:* `New Delhi`
6. *Destination:* `Chandigarh`
7. *Cargo Weight (kg):* `4500`
8. *Planned Distance (km):* `250`
9. Click **Create Trip**.
10. The trip will appear in the grid as `DRAFT`.
11. Click the **Truck Icon** (Dispatch action) on your new trip. The status changes to `DISPATCHED`.
12. Click the **Checkmark Icon** (Complete action) on the trip. The "Complete Trip" modal will appear.
13. *Enter Final Odometer (km):* `250`
14. *Enter Fuel Consumed (Liters):* `35`
15. *Enter Total Fuel Cost ($):* `120.00`
16. *Enter Trip Revenue ($):* `5500.00`
17. Click **Complete Trip**.
18. Navigate back to the **Dashboard** and observe how the **Vehicle ROI**, **Fuel Efficiency Trends**, and **Total Revenue/Costs** calculations have automatically updated!

### 4. Maintenance (Repair Logbook)
**Functionality:** Tracks when a vehicle breaks down or needs servicing.
**Capabilities:**
- Insert new repair logs and track costs.
- Set logs to Open/Closed.
- Logging a maintenance issue automatically updates the "In Shop" status and adds to the Total Fleet Costs.

**End-to-End Test:**
1. Navigate to the **Maintenance** tab.
2. Click **+ Add Log**.
3. *Vehicle:* (Select any vehicle)
4. *Description:* `AC Compressor Replacement`
5. *Cost ($):* `850.00`
6. Click **Add Maintenance Log**.
7. The log appears in the grid as `OPEN`. Notice the action button to close it when the repair is done.
8. Navigate back to the **Dashboard** and look at the "In Shop Maintenance" counter and the "Operational Cost Structure" chart—they have both updated!

### 5. Expenses (Financial Hub)
**Functionality:** A consolidated ledger of all operational costs (Fuel, Tolls, Insurance).
**Capabilities:**
- Add manual expenses.
- Export all expense records to a CSV file for external accounting software.

**End-to-End Test:**
1. Navigate to the **Expenses** tab.
2. Click **+ Add Expense**.
3. *Vehicle:* (Select any vehicle)
4. *Type:* Select `Toll`
5. *Amount ($):* `45.00`
6. *Date:* Leave as today.
7. Click **Save Expense**.
8. Click the **Export CSV** button. Open the downloaded file to verify your new entry is securely recorded and ready for accounting!

---

## 🧪 Developer Testing

The platform includes a Pytest suite targeting the core FastApi routing and database connection pooling. 
```bash
cd backend
python -m pytest tests/test_api.py
```

---

## 🔮 Future Roadmap (Phase 7)
- [ ] **Local AI (RAG) Integration**: Deploying an offline LLM (Ollama/Gemma) to analyze historical maintenance logs and fuel inefficiencies, outputting predictive cost-saving measures directly to the dashboard.
- [ ] **Live GPS Tracking**: Integrating web-sockets for real-time fleet cartography.

---

*Designed by the Advanced Agentic Coding Team.*
