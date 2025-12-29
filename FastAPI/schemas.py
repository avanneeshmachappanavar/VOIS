from pydantic import BaseModel
from datetime import datetime

# AUTH SCHEMA
class LoginRequest(BaseModel):
    username: str
    password: str

# BUS SCHEMA
class BusData(BaseModel):
    bus_id: int
    mileage: float
    temperature: float

# OPERATOR SCHEMA
class OperatorInputCreate(BaseModel):
    bus_id: int
    mileage: float
    temperature: float
    oil_level: str
    remarks: str | None = None 
