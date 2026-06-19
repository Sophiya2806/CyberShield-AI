from fastapi import APIRouter
from app.models import LogEntry
from app.ml import detector
from app.services.rules_engine import RulesEngine
from app.ai import AIExplanationEngine
from app.services.database import get_db
from datetime import datetime
from typing import List, Dict, Any

router = APIRouter()

@router.post("/")
async def analyze_logs(logs: List[LogEntry]):
    log_dicts = [log.dict() for log in logs]
    
    ml_results = detector.predict(log_dicts)
    rule_results = RulesEngine.check_rules(log_dicts)
    
    final_threats = []
    
    for ml_threat in ml_results:
        ai_explanation = AIExplanationEngine.generate_explanation(ml_threat)
        
        final_threat = {
            **ml_threat,
            **ai_explanation,
            "detected_at": datetime.utcnow().isoformat()
        }
        
        final_threats.append(final_threat)
    
    db = get_db()
    for threat in final_threats:
        db.threats.insert_one(threat)
    
    return {"threats": final_threats, "rule_results": rule_results}

@router.get("/quick")
async def quick_analyze():
    db = get_db()
    logs = list(db.logs.find().sort("timestamp", -1).limit(100))
    
    for log in logs:
        log.pop("_id", None)
    
    if not logs:
        return {"threats": [], "message": "No logs available for analysis"}
    
    ml_results = detector.predict(logs)
    rule_results = RulesEngine.check_rules(logs)
    
    final_threats = []
    
    for ml_threat in ml_results:
        ai_explanation = AIExplanationEngine.generate_explanation(ml_threat)
        
        final_threat = {
            **ml_threat,
            **ai_explanation,
            "detected_at": datetime.utcnow().isoformat()
        }
        
        final_threats.append(final_threat)
    
    for threat in final_threats:
        existing = db.threats.find_one({"ip": threat["ip"], "attack_type": threat["attack_type"]})
        if not existing:
            db.threats.insert_one(threat)
    
    return {"threats": final_threats, "rule_results": rule_results}
