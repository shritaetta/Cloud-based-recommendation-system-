import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database import get_db
from core.deps import get_current_user_token
from models.resume import Resume
from schemas.resume import ResumeResponse, AnalyzeResumeRequest, AnalyzeResumeResponse
from services.resume_service import process_resume_upload, analyze_resume_match

router = APIRouter()

@router.post("/upload-resume", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    token_data: dict = Depends(get_current_user_token),
    db: AsyncSession = Depends(get_db)
):
    user_id = uuid.UUID(token_data.get("sub"))
    resume = await process_resume_upload(user_id, file, db)
    return resume

@router.get("/{user_id}", response_model=ResumeResponse)
async def get_resume(
    user_id: uuid.UUID,
    token_data: dict = Depends(get_current_user_token),
    db: AsyncSession = Depends(get_db)
):
    token_user_id = uuid.UUID(token_data.get("sub"))
    if user_id != token_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this resource")
        
    result = await db.execute(
        select(Resume).where(Resume.user_id == user_id, Resume.is_active == True)
    )
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    return resume

@router.post("/analyze-resume", response_model=AnalyzeResumeResponse)
async def analyze_resume(
    request: AnalyzeResumeRequest,
    token_data: dict = Depends(get_current_user_token),
    db: AsyncSession = Depends(get_db)
):
    user_id = uuid.UUID(token_data.get("sub"))
    
    result = await db.execute(
        select(Resume).where(Resume.user_id == user_id, Resume.is_active == True)
    )
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Active resume not found for analysis. Please upload one first.")
        
    analysis = await analyze_resume_match(request.job_description, resume)
    return analysis
