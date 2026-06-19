from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app.routes import auth, logs, analyze, threats, reports

load_dotenv()

app = FastAPI(
    title="CyberShield AI - Intelligent Security Log Analyzer",
    version="1.0.0",
    description="AI-powered cybersecurity platform for threat detection and analysis"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(logs.router, prefix="/api/logs", tags=["Logs"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["Analysis"])
app.include_router(threats.router, prefix="/api/threats", tags=["Threats"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {
        "message": "CyberShield AI - Security Log Analyzer API",
        "version": "1.0.0",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
