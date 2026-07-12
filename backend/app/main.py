from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import auth, users, vehicles, drivers, trips, maintenance, finance, reports

@app.get("/")
def read_root():
    return {"message": "Welcome to the TransitOps API"}

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(vehicles.router, prefix=f"{settings.API_V1_STR}/vehicles", tags=["vehicles"])
app.include_router(drivers.router, prefix=f"{settings.API_V1_STR}/drivers", tags=["drivers"])
app.include_router(trips.router, prefix=f"{settings.API_V1_STR}/trips", tags=["trips"])
app.include_router(maintenance.router, prefix=f"{settings.API_V1_STR}/maintenance", tags=["maintenance"])
app.include_router(finance.router, prefix=f"{settings.API_V1_STR}/finance", tags=["finance"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["reports"])
