from sqlalchemy import Column, Integer, String
from FastAPI.database import Base

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
