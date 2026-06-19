from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from app.services.database import get_db
from datetime import datetime

router = APIRouter()

@router.get("/")
async def get_reports():
    db = get_db()
    
    threats = list(db.threats.find().sort("detected_at", -1))
    
    for threat in threats:
        threat["_id"] = str(threat["_id"])
    
    return {"reports": threats}

@router.get("/download")
async def download_report():
    db = get_db()
    
    threats = list(db.threats.find().sort("detected_at", -1))
    stats = {
        "total_logs": db.logs.count_documents({}),
        "total_threats": db.threats.count_documents({}),
        "critical_alerts": db.threats.count_documents({"threat_level": "HIGH"})
    }
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    story.append(Paragraph("CyberShield AI - Security Report", styles['Title']))
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
    story.append(Spacer(1, 20))
    
    story.append(Paragraph("Executive Summary", styles['Heading2']))
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"Total Logs Analyzed: {stats['total_logs']}", styles['Normal']))
    story.append(Paragraph(f"Total Threats Detected: {stats['total_threats']}", styles['Normal']))
    story.append(Paragraph(f"Critical Alerts: {stats['critical_alerts']}", styles['Normal']))
    story.append(Spacer(1, 20))
    
    if threats:
        story.append(Paragraph("Detected Threats", styles['Heading2']))
        story.append(Spacer(1, 12))
        
        data = [["IP", "Attack Type", "Threat Level", "Confidence"]]
        for threat in threats[:10]:
            data.append([
                threat.get("ip", "Unknown"),
                threat.get("attack_type", "Unknown"),
                threat.get("threat_level", "Unknown"),
                f"{threat.get('confidence', 0):.1f}%"
            ])
        
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.darkblue),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 12),
            ('BOTTOMPADDING', (0,0), (-1,0), 12),
            ('BACKGROUND', (0,1), (-1,-1), colors.lightblue),
            ('GRID', (0,0), (-1,-1), 1, colors.black)
        ]))
        
        story.append(table)
    
    doc.build(story)
    buffer.seek(0)
    
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=cybershield-report-{datetime.now().strftime('%Y%m%d')}.pdf"}
    )
