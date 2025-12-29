from fastapi import APIRouter, Depends, HTTPException
from FastAPI.dependencies import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/")
def get_dashboard(user=Depends(get_current_user)):
    if user["role"] != "maintenance":
        raise HTTPException(status_code=403, detail="Access denied")

    return {
        "message": "Dashboard data",
        "user": user["sub"]
    }
