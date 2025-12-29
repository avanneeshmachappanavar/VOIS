from sqlalchemy import Column, Integer, Float , String ,  DateTime
from FastAPI.database import Base
from datetime import datetime

# AUTH MODELS
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    password = Column(String(255))
    role = Column(String(20))  # operator / maintenance


# BUS MODELS
class Bus(Base):
    __tablename__ = "buses"
    id = Column(Integer, primary_key=True)
    bus_number = Column(String(20))

class OperatorInput(Base):
    __tablename__ = "operator_inputs"

    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, index=True)
    mileage = Column(Float)
    temperature = Column(Float)
    oil_level = Column(String(20))
    remarks = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)