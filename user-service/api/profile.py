from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from core.database import get_db
from core.deps import get_current_user_token
from models.user import User, Profile
from schemas.user import ProfileResponse, ProfileUpdate

router = APIRouter()

@router.get("/profile", response_model=ProfileResponse)
async def get_profile(token_data: dict = Depends(get_current_user_token), db: AsyncSession = Depends(get_db)):
    user_id = token_data.get("sub")
    result = await db.execute(select(Profile).where(Profile.user_id == user_id))
    profile = result.scalars().first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    return profile

@router.put("/profile", response_model=ProfileResponse)
async def update_profile(profile_data: ProfileUpdate, token_data: dict = Depends(get_current_user_token), db: AsyncSession = Depends(get_db)):
    user_id = token_data.get("sub")
    result = await db.execute(select(Profile).where(Profile.user_id == user_id))
    profile = result.scalars().first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    if profile_data.education is not None:
        profile.education = profile_data.education
    if profile_data.skills is not None:
        profile.skills = profile_data.skills
    if profile_data.resume_metadata is not None:
        profile.resume_metadata = profile_data.resume_metadata
        
    await db.commit()
    await db.refresh(profile)
    
    return profile
