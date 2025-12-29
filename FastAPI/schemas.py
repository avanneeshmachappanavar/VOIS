from pydantic import BaseModel

# AUTH SCHEMA
class LoginRequest(BaseModel):
    username: str
    password: str

# BUS SCHEMA
class BusData(BaseModel):
    bus_id: int
    mileage: float
    temperature: float
