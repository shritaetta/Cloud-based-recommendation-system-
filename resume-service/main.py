from contextlib import asynccontextmanager
from fastapi import FastAPI
from api import resume
from core.database import engine, Base
from models.resume import Resume # Required to register the model metadata

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="Resume Service",
    lifespan=lifespan
)

app.include_router(resume.router, prefix="/api/resume", tags=["resume"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "resume-service"}
