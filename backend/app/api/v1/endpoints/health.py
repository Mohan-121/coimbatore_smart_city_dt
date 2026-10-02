from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from backend.app.db.session import get_db

router = APIRouter(prefix="/health", tags=["Health & Diagnostics"])

@router.get("")
async def health_check():
    """Health check endpoint returning system status and city information."""
    return {
        "status": "online",
        "city": "Coimbatore, Tamil Nadu",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "services": {
            "traffic_twin": "active",
            "energy_twin": "active",
            "environment_monitor": "active",
            "ml_engine": "active"
        }
    }

@router.get("/db")
async def db_health_check(db: AsyncSession = Depends(get_db)):
    """Database connectivity and latency check."""
    start = datetime.utcnow()
    result = await db.execute(text("SELECT 1"))
    latency_ms = (datetime.utcnow() - start).total_seconds() * 1000
    return {
        "status": "healthy",
        "database": "connected",
        "latency_ms": round(latency_ms, 2)
    }
