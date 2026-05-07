import os
import uuid
from typing import Optional
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from models.resume import Resume
from services.extractor import extract_text_from_pdf, extract_skills_from_text, extract_education_from_text

UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 5 * 1024 * 1024 # 5 MB

async def process_resume_upload(user_id: uuid.UUID, file: UploadFile, db: AsyncSession) -> Resume:
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    
    file_content = await file.read()
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit.")
        
    file_id = uuid.uuid4()
    filename = f"{user_id}_{file_id}.pdf"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as f:
        f.write(file_content)
        
    await db.execute(
        update(Resume)
        .where(Resume.user_id == user_id)
        .values(is_active=False)
    )
    
    text = extract_text_from_pdf(file_path)
    skills = extract_skills_from_text(text)
    education = extract_education_from_text(text)
    
    new_resume = Resume(
        user_id=user_id,
        filename=file.filename,
        file_path=file_path,
        extracted_text=text,
        skills=skills,
        education_keywords=education,
        is_active=True
    )
    
    db.add(new_resume)
    await db.commit()
    await db.refresh(new_resume)
    
    return new_resume

async def analyze_resume_match(job_description: str, resume: Resume) -> dict:
    if not resume or not resume.skills:
        return {
            "match_percentage": 0.0,
            "matched_skills": [],
            "missing_skills": [],
            "recommendation_score": 0.0
        }
        
    required_skills = set(extract_skills_from_text(job_description))
    user_skills = set(resume.skills)
    
    if not required_skills:
        return {
            "match_percentage": 100.0,
            "matched_skills": list(user_skills),
            "missing_skills": [],
            "recommendation_score": 10.0
        }
    
    matched = required_skills.intersection(user_skills)
    missing = required_skills.difference(user_skills)
    
    match_percentage = (len(matched) / len(required_skills)) * 100
    recommendation_score = match_percentage / 10.0
    
    return {
        "match_percentage": round(match_percentage, 2),
        "matched_skills": list(matched),
        "missing_skills": list(missing),
        "recommendation_score": round(recommendation_score, 2)
    }
