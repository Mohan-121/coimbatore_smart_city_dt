from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict
from backend.app.services.assistant_service import urban_assistant

router = APIRouter(prefix="/assistant", tags=["AI Urban Assistant"])

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []

@router.post("/chat")
async def chat_with_assistant(req: ChatRequest):
    """
    Interacts with the grounded AI Urban Assistant.
    Extracts intent, queries real-time database state, and formats municipal briefings.
    """
    res = await urban_assistant.chat(req.message, req.history)
    return res
