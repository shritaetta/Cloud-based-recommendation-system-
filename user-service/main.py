from contextlib import asynccontextmanager

from fastapi import FastAPI

from api import auth, profile
from core.database import engine, Base

# IMPORTANT: import model so metadata registers table
from models.user import User


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="User Service",
    lifespan=lifespan
)

app.include_router(auth.router, tags=["auth"])
app.include_router(profile.router, tags=["profile"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "user-service"}