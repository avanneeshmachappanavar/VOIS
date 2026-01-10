from fastapi import APIRouter , Depends , HTTPException , status 
from sqlalchemy.orm import Session
from FastAPI.database import get_db
from FastAPI.dependencies import get_current_user
from FastAPI.models import OperatorInput 
#ml->
from FastAPI.ml.model import predict_failure
from FastAPI.ml.feature_mapper import map_operator_to_ml


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

    logs = db.query(OperatorInput).all()
    total_logs = len(logs)

    high_risk = 0
    ml_results = []

    RISK_THRESHOLD = 0.75
 
    next_maintenance_km = None ; 

    for log in logs:
        ml_input = map_operator_to_ml({
            "mileage": log.mileage,
            "temperature": log.temperature,
            "oil_level": log.oil_level
        })

        prediction, probability = predict_failure(ml_input)

        if probability >= RISK_THRESHOLD:
            high_risk += 1
        
        if probability >= RISK_THRESHOLD and next_maintenance_km is None:
            next_maintenance_km = log.mileage + 500  
        else:
            next_maintenance_km= log.mileage + 3000

        ml_results.append({
            "bus_id": log.bus_id,
            "probability": round(probability, 3),
            "risk": "HIGH" if probability >= RISK_THRESHOLD else "LOW"
        })

    return {
        "total_logs": total_logs,
        "high_risk_vehicles": high_risk,
        "next_maintenance_km": next_maintenance_km,
        "system_status": "OPERATIONAL",
        "ml_results": ml_results
    }

