from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.models import LogEntry
from app.log_parser import LogParser
from app.services.database import get_db
from datetime import datetime
import random

router = APIRouter()

@router.post("/upload")
async def upload_logs(file: Optional[UploadFile] = File(None), raw_logs: Optional[str] = Form(None)):
    db = get_db()
    parsed_logs = []
    
    if raw_logs:
        parsed_logs = LogParser.parse_multiple_logs(raw_logs)
    elif file:
        content = await file.read()
        log_text = content.decode("utf-8", errors="ignore")
        parsed_logs = LogParser.parse_multiple_logs(log_text)
    
    for log in parsed_logs:
        log["created_at"] = datetime.utcnow().isoformat()
        db.logs.insert_one(log)
    
    return {"message": f"Successfully processed {len(parsed_logs)} logs", "logs": parsed_logs}

@router.post("/sample")
async def generate_sample_logs():
    db = get_db()
    sample_logs = []
    
    ips = ["192.168.1.10", "10.0.0.5", "172.16.0.20", "192.168.1.20", "8.8.8.8", "203.0.113.42"]
    sources = ["Apache", "Windows", "Firewall"]
    
    normal_messages = [
        "Successful login from {ip}",
        "Connection allowed from {ip}",
        "User authenticated successfully from {ip}",
        "File accessed from {ip}"
    ]
    
    attack_messages = [
        "Failed login attempt from {ip}",
        "Login failed for user admin from {ip}",
        "Connection blocked from {ip} (suspicious activity)",
        "Multiple failed logins from {ip}"
    ]
    
    for i in range(30):
        ip = random.choice(ips)
        source = random.choice(sources)
        
        if i < 20:
            message = random.choice(normal_messages).format(ip=ip)
            event_type = random.choice(["login_success", "firewall_allow", "file_access"])
        else:
            message = random.choice(attack_messages).format(ip=ip)
            event_type = random.choice(["login_failure", "firewall_deny"])
        
        log_entry = {
            "ip": ip,
            "timestamp": (datetime.utcnow() - datetime.timedelta(minutes=random.randint(0, 60))).isoformat(),
            "event_type": event_type,
            "source": source,
            "message": message,
            "username": "admin" if "admin" in message else None,
            "created_at": datetime.utcnow().isoformat()
        }
        
        db.logs.insert_one(log_entry)
        sample_logs.append(log_entry)
    
    return {"message": f"Generated {len(sample_logs)} sample logs", "logs": sample_logs}

@router.get("/")
async def get_logs(limit: int = 100):
    db = get_db()
    logs = list(db.logs.find().sort("timestamp", -1).limit(limit))
    
    for log in logs:
        log["_id"] = str(log["_id"])
    
    return {"logs": logs}
