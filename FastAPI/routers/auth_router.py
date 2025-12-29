from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from FastAPI.database import SessionLocal
from FastAPI.database import get_db
from FastAPI.models import User
from FastAPI.schemas import LoginRequest

from FastAPI.security import verify_password

from FastAPI.security import verify_password
from FastAPI.jwt_utils import create_access_token 

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()

    if not user or not verify_password(data.password , user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({
        "sub": user.username,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role

    }
