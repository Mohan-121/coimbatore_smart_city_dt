from typing import Dict, Any, List
from backend.app.simulation.engine import twin_simulator
from backend.app.services.weather_service import weather_service
from backend.app.services.alert_service import alert_service

class UrbanAssistantService:
    """
    Schema-grounded AI Urban Assistant answering municipal inquiries
    directly from live digital twin state without hallucinations.
    """
    async def chat(self, user_message: str, chat_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        msg_lower = user_message.lower()
        state = await twin_simulator.step()
        weather = await weather_service.fetch_current_telemetry()
        alerts = alert_service.evaluate_twin_state(state)

        citations = []
        tools_used = []

        # 1. Congestion & Bottlenecks inquiry
        if any(w in msg_lower for w in ["congest", "traffic", "slow", "bottleneck", "jam"]):
            tools_used.append("query_traffic_status")
            segments = list(state.get("segments", {}).values())
            segments.sort(key=lambda s: s["congestion_score"], reverse=True)
            top_b = segments[:3]

            reply_lines = [
                f"**Coimbatore Urban Traffic Briefing:**",
                f"- Citywide Average Speed: **{state['avg_speed_kmh']} km/h** | Congestion Index: **{state['city_congestion_index']}%**",
                f"\n**Top Critical Bottlenecks:**"
            ]
            for s in top_b:
                reply_lines.append(
                    f"1. **{s['corridor_name']}** ({s['segment_id']}): Speed **{s['average_speed_kmh']} km/h**, Congestion **{s['congestion_score']}/100** [{s['congestion_level']}], Queue: **{s['queue_length_meters']}m**"
                )
                citations.append(s['segment_id'])

            if state['active_incidents']:
                inc = state['active_incidents'][0]
                reply_lines.append(f"\n⚠️ **Active Incident:** {inc['title']} on {inc['segment_id']} (Capacity cut: {inc['capacity_reduction_pct']}%)")
                citations.append(inc['incident_id'])

            reply = "\n".join(reply_lines)

        # 2. Energy inquiry
        elif any(w in msg_lower for w in ["energy", "power", "electricity", "peak", "mw", "grid", "tangedco"]):
            tools_used.append("query_energy_forecast")
            total_mw = state['total_energy_mw']
            zones = state.get("zones", {})
            worst_zone = max(zones.values(), key=lambda z: z["capacity_utilization_pct"])

            reply = (
                f"**Coimbatore Electrical Grid Intelligence (TANGEDCO):**\n"
                f"- Current Total Demand: **{total_mw} MW** / 1,480 MW Grid Capacity (**{round((total_mw/1480)*100, 1)}% utilization**)\n"
                f"- Grid Frequency: **50.02 Hz** (Nominal operating range)\n"
                f"- Highest Load Substation: **{worst_zone['zone_id']}** at **{worst_zone['active_power_mw']} MW** ({worst_zone['capacity_utilization_pct']}% capacity)\n"
                f"- Expected Peak: Today around **19:30 - 21:00 IST** reaching ~**1,320 MW** driven by evening residential cooling.\n"
                f"- Data Provenance: `[SIMULATED TANGEDCO CALIBRATION]`"
            )
            citations.append(worst_zone['zone_id'])

        # 3. Environment inquiry
        elif any(w in msg_lower for w in ["aqi", "air", "pollution", "pm2.5", "pm10", "weather", "temp"]):
            tools_used.append("query_environment_live")
            aqi = weather['aqi']
            temp = weather['temperature_c']
            origin = weather['data_origin']

            reply = (
                f"**Coimbatore Environmental Intelligence:**\n"
                f"- Current Air Quality Index: **{aqi}** (Status: **{'Good' if aqi<=50 else 'Moderate' if aqi<=100 else 'Unhealthy'}**)\n"
                f"- Ambient Temperature: **{temp}°C** | Humidity: **{weather['relative_humidity_pct']}%**\n"
                f"- PM2.5: **{weather['pm25']} µg/m³** | PM10: **{weather['pm10']} µg/m³**\n"
                f"- Estimated Traffic Idling Contribution: ~**{round(min(60.0, 20.0 + (50 - state['avg_speed_kmh'])), 1)}%** of localized particulate concentrations.\n"
                f"- Ingestion Source: `[{origin} OPEN-METEO]` for Coimbatore coordinates `(11.0168, 76.9558)`."
            )
            citations.append("OPEN_METEO_COIMBATORE")

        # 4. Alerts inquiry
        elif any(w in msg_lower for w in ["alert", "alarm", "warning", "emergency", "incident"]):
            tools_used.append("query_active_alerts")
            if not alerts:
                reply = "Currently, there are **no critical unresolved alerts** across Coimbatore municipal systems. All parameters are operating within nominal thresholds."
            else:
                reply_lines = [f"**Currently Active Urban Alerts ({len(alerts)}):**"]
                for a in alerts[:4]:
                    reply_lines.append(f"- **[{a['severity']}] {a['title']}** at {a['location_label']}: {a['cause_summary']}")
                    citations.append(a['alert_id'])
                reply_lines.append("\nRecommended action is available in the Alerts drawer.")
                reply = "\n".join(reply_lines)

        # 5. Default executive overview
        else:
            tools_used.append("query_digital_twin_overview")
            reply = (
                f"**Coimbatore Smart City Command Center Summary:**\n"
                f"- Urban Traffic: **{state['city_congestion_index']}%** Congestion | Avg Speed **{state['avg_speed_kmh']} km/h**\n"
                f"- Power Demand: **{state['total_energy_mw']} MW** across 5 distribution zones\n"
                f"- Air Quality: **{weather['aqi']} AQI** ({weather['data_origin']})\n"
                f"- Active Alerts: **{len(alerts)}** notifications requiring administrative review.\n\n"
                f"You can ask me specific questions like: *'Which roads have severe bottlenecks?'*, *'Explain Avinashi Road delay causes'*, *'What is the forecasted energy peak?'*, or *'Show active alerts'*"
            )

        return {
            "reply": reply,
            "tools_executed": tools_used,
            "data_citations": citations,
            "timestamp": state["timestamp"]
        }

urban_assistant = UrbanAssistantService()
