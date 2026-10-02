import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.services.connection_manager import ws_manager
from backend.app.simulation.engine import twin_simulator
from backend.app.core.logging import logger

router = APIRouter(tags=["WebSocket Real-Time Telemetry"])

@router.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """
    Bidirectional WebSocket connection streaming live 1-2 Hz digital twin state.
    """
    await ws_manager.connect(websocket)
    try:
        # Push immediate snapshot
        initial_state = await twin_simulator.step()
        await websocket.send_json({
            "type": "INITIAL_SYNC",
            "data": initial_state
        })

        while True:
            # Handle incoming client commands or ping
            try:
                # Wait for client message with 2 second timeout
                client_msg = await asyncio.wait_for(websocket.receive_json(), timeout=2.0)
                msg_type = client_msg.get("type", "")
                if msg_type == "PING":
                    await websocket.send_json({"type": "PONG"})
            except asyncio.TimeoutError:
                # Periodic broadcast tick
                latest_state = await twin_simulator.step()
                await websocket.send_json({
                    "type": "TWIN_SYNC",
                    "timestamp": latest_state["timestamp"],
                    "city_congestion_index": latest_state["city_congestion_index"],
                    "avg_speed_kmh": latest_state["avg_speed_kmh"],
                    "total_energy_mw": latest_state["total_energy_mw"],
                    "aqi": latest_state["aqi"],
                    "active_incidents": latest_state["active_incidents"],
                    "corridors": latest_state["corridors"]
                })
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket telemetry error: {e}")
        ws_manager.disconnect(websocket)
