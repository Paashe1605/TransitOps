# 🚛 TransitOps - Fleet Management System

![TransitOps Banner](https://via.placeholder.com/1200x300.png?text=TransitOps+-+Enterprise+Fleet+Operations)

> A modern, full-stack Fleet Management System tailored for operators to manage vehicles, dispatch trips, track maintenance, and compute financial ROI with a gorgeous glassmorphic interface.

---

## ✨ Top Features

- 📊 **Dynamic Dashboard**: Centralized operations hub tracking fleet utilization, driver status, maintenance requests, and calculating total Vehicle ROI via interactive charts.
- 🚚 **Vehicle & Driver Roster**: Comprehensive registries for fleet assets and human resources, highlighting availability and licensing statuses.
- 🗺️ **Trip Dispatching**: Full lifecycle trip management. Create a trip, assign drivers to vehicles, dispatch, and finally complete the route to generate revenue.
- 🔧 **Maintenance Logbook**: Track service records and auto-repair costs. Operators can instantly log and close mechanical issues, tying expenses to the core financial algorithm.
- 💵 **Financial Hub**: Consolidated view of tolls, fuel logs, and insurance costs. Includes a highly requested one-click **Export to CSV** functionality for accounting departments.
- 🌗 **Adaptive UI (Dark & Light Mode)**: Stunning custom glass-panel aesthetics tailored with Tailwind CSS that effortlessly switches between themes for optimal viewing.

---

## 🛠️ Architecture Stack

### Frontend (Client)
- **React 18** via **Vite** for lightning-fast HMR.
- **TypeScript** for strict type safety.
- **Tailwind CSS** configured with custom CSS variables and glassmorphism utilities.
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

*(Use `admin@transitops.com` / `password123` for the default seeded super-user).*

---

## 🧪 Testing

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
