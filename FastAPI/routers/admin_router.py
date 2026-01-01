from fastapi import APIRouter , Depends , HTTPException , status 
from sqlalchemy.orm import Session
from FastAPI.database import get_db
from FastAPI.dependencies import get_current_user
from FastAPI.models import OperatorInput 

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
) 

def require_admin(user: dict):
    if user["role"] != "maintenance":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    if user["role"] != "maintenance":
        raise HTTPException(status_code=403, detail="Not authorized")

    total_logs = db.query(OperatorInput).count()

    return {
        "total_logs": total_logs,
        "high_risk_vehicles": None,      # ML will fill later
        "next_maintenance_km": None,     # ML will fill later
        "system_status": "OPERATIONAL"
    }
