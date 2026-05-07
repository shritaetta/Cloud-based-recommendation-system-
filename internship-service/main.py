from contextlib import asynccontextmanager
from fastapi import FastAPI
import logging

from api import internships
from core.database import engine, Base, AsyncSessionLocal
from scripts.import_internships import import_data
from models.internship import Internship

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with AsyncSessionLocal() as session:
        await import_data(session)
        
    yield

app = FastAPI(
    title="Internship Service",
    lifespan=lifespan
)

app.include_router(internships.router, prefix="/api/internships", tags=["internships"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "internship-service"}
