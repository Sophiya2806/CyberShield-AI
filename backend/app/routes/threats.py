from fastapi import APIRouter
from app.services.database import get_db
from typing import Dict, Any

router = APIRouter()

@router.get("/")
async def get_threats():
    db = get_db()
    threats = list(db.threats.find().sort("detected_at", -1))
    
    for threat in threats:
        threat["_id"] = str(threat["_id"])
    
    return {"threats": threats}

@router.get("/stats")
async def get_threat_stats():
    db = get_db()
    
    total_logs = db.logs.count_documents({})
    total_threats = db.threats.count_documents({})
    critical_threats = db.threats.count_documents({"threat_level": "HIGH"})
    
    threats = list(db.threats.find())
    
    attack_types = {}
    for threat in threats:
        atk_type = threat.get("attack_type", "Unknown")
        attack_types[atk_type] = attack_types.get(atk_type, 0) + 1
    
    security_score = max(0, 100 - (critical_threats * 10))
    
    return {
        "total_logs": total_logs,
        "total_threats": total_threats,
        "critical_alerts": critical_threats,
        "security_score": security_score,
        "attack_types": attack_types
    }
