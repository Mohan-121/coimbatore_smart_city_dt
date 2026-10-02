from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any

from backend.app.core.security import verify_password, create_access_token, decode_access_token
from backend.app.db.session import AsyncSessionLocal
from backend.app.models.user import User
from sqlalchemy import select

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])

class LoginRequest(BaseModel):
    username: str
    password: str

DEMO_PERSONAS = [
    {"username": "admin", "role": "ADMIN", "full_name": "Municipal Chief Commissioner", "description": "Full administrative control, override signals, and export executive reports."},
    {"username": "planner", "role": "CITY_PLANNER", "full_name": "Senior Urban Planner", "description": "Can run What-If infrastructure scenarios and corridor rerouting simulations."},
    {"username": "traffic_op", "role": "TRAFFIC_OPERATOR", "full_name": "Traffic Command Controller", "description": "Can inject simulated incidents, monitor real-time bottlenecks, and manage alerts."},
    {"username": "energy_op", "role": "ENERGY_OPERATOR", "full_name": "TANGEDCO Grid Engineer", "description": "Can monitor substation headroom, EV load surges, and peak forecasts."},
    {"username": "analyst", "role": "ANALYST", "full_name": "Urban Data Scientist", "description": "Access to ML models, TreeSHAP explainability, and historical telemetry."},
    {"username": "viewer", "role": "VIEWER", "full_name": "Public / Citizen Viewer", "description": "Read-only access to city status, public map layers, and air quality index."}
]

@router.get("/demo-personas")
async def get_demo_personas():
    """Returns available municipal roles for instant 1-click evaluation switching."""
    return {"personas": DEMO_PERSONAS}

@router.post("/login")
async def login(req: LoginRequest):
    """Logs in user and returns JWT token."""
    # Check demo personas first for effortless evaluation
    for p in DEMO_PERSONAS:
        if req.username == p["username"] and (req.password == "coimbatore2026" or req.password == "demo"):
            token = create_access_token(subject=p["username"], role=p["role"])
            return {
                "access_token": token,
                "token_type": "bearer",
                "user": p
            }

    # Query DB
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.username == req.username))
        user = result.scalar_one_or_none()
        if not user or not verify_password(req.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password. (Hint: use demo accounts with password 'coimbatore2026')"
            )

        token = create_access_token(subject=user.username, role=user.role)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "username": user.username,
                "role": user.role,
                "full_name": user.full_name,
                "email": user.email
            }
        }
