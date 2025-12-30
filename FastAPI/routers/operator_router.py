from fastapi import APIRouter, Depends , HTTPException , status
from sqlalchemy.orm import Session
from FastAPI.database import get_db
from FastAPI.models import OperatorInput
from FastAPI.schemas import OperatorInputCreate
from FastAPI.dependencies import get_current_user
from typing import List

router = APIRouter(
    prefix="/operator",
    tags=["Operator"]
)

@router.post("/input")
def submit_operator_input(
    data: OperatorInputCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    if user["role"] != "operator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    record = OperatorInput(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)

    return {"message": "Data submitted successfully"}

@router.get("/history")
def get_operator_history(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    if user["role"] != "operator":
        raise HTTPException(status_code=403, detail="Not authorized")

    logs = (
        db.query(OperatorInput)
        .order_by(OperatorInput.created_at.desc())
        .limit(20)
        .all()
    )

    return logs