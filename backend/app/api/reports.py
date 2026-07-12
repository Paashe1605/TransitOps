from typing import Any
import io
from datetime import datetime, timedelta
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.models.models import Trip, Driver, User, RoleEnum
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/export/trips")
async def export_trips_pdf(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    if current_user.role not in [RoleEnum.FLEET_MANAGER, RoleEnum.FINANCIAL_ANALYST]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    result = await db.execute(select(Trip))
    trips = result.scalars().all()

    output = io.BytesIO()
    doc = SimpleDocTemplate(output, pagesize=letter)
    elements = []
    
    styles = getSampleStyleSheet()
    elements.append(Paragraph("Trips Export Report", styles['Title']))

    data = [["ID", "Vehicle ID", "Driver ID", "Source", "Destination", "Cargo", "Distance", "Status"]]
    for trip in trips:
        data.append([
            str(trip.id),
            str(trip.vehicle_id),
            str(trip.driver_id),
            trip.source[:15],
            trip.destination[:15],
            f"{trip.cargo_weight}kg",
            f"{trip.planned_distance}km",
            trip.status
        ])

    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(table)
    doc.build(elements)

    output.seek(0)
    response = StreamingResponse(iter([output.getvalue()]), media_type="application/pdf")
    response.headers["Content-Disposition"] = "attachment; filename=trips_export.pdf"
    return response

@router.post("/notify/expiring-licenses")
async def notify_expiring_licenses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    if current_user.role not in [RoleEnum.FLEET_MANAGER, RoleEnum.SAFETY_OFFICER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Get drivers whose license expires in the next 30 days
    thirty_days_from_now = datetime.utcnow().date() + timedelta(days=30)
    result = await db.execute(select(Driver).filter(Driver.expiry_date <= thirty_days_from_now))
    drivers = result.scalars().all()

    # In a real app, this would trigger an email provider (SendGrid, AWS SES)
    # Here we simulate the notification
    notified = []
    for d in drivers:
        notified.append({
            "driver_name": d.name,
            "license_number": d.license_number,
            "expiry_date": str(d.expiry_date),
            "message": f"Email sent: License expiring soon for {d.name}"
        })

    return {"status": "success", "notifications_sent": len(notified), "details": notified}
