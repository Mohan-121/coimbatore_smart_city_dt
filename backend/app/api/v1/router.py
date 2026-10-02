from fastapi import APIRouter
from backend.app.api.v1.endpoints import (
    health,
    gis,
    traffic,
    energy,
    environment,
    scenarios,
    alerts,
    simulation,
    assistant,
    websocket,
    auth,
    reports
)

api_router = APIRouter()

# Mount all endpoint routers
api_router.include_router(health.router)
api_router.include_router(gis.router)
api_router.include_router(traffic.router)
api_router.include_router(energy.router)
api_router.include_router(environment.router)
api_router.include_router(scenarios.router)
api_router.include_router(alerts.router)
api_router.include_router(simulation.router)
api_router.include_router(assistant.router)
api_router.include_router(websocket.router)
api_router.include_router(auth.router)
api_router.include_router(reports.router)
