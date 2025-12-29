from fastapi import FastAPI
from FastAPI.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

from FastAPI.routers.auth_router import router as auth_router
from FastAPI.routers.dashboard_router import router as dashboard_router
from FastAPI.routers.operator_router import router as operator_router

app = FastAPI(title="Bus Predictive Maintenance API")

# Create tables
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(operator_router)

#CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 