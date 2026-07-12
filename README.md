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
