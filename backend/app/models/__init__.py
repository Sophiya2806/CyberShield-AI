from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class LogEntry(BaseModel):
    ip: str
    timestamp: str
    event_type: str
    source: str
    message: str
    username: Optional[str] = None

class ThreatDetection(BaseModel):
    ip: str
    is_threat: bool
    threat_level: str
    attack_type: str
    confidence: float
    explanation: str
    recommendations: List[str]

class ReportRequest(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None
