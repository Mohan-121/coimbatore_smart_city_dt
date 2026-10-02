import asyncio
import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

from backend.app.core.logging import setup_logging, logger
from backend.app.db.session import engine
from backend.app.db.base import Base

setup_logging()

async def init_models():
    logger.info("Initializing database tables for Coimbatore Smart City Digital Twin...")
    async with engine.begin() as conn:
        # Create all tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized successfully!")

if __name__ == "__main__":
    asyncio.run(init_models())
