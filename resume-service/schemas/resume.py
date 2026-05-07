from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

class ResumeResponse(BaseModel):
    id: UUID
    user_id: UUID
    filename: str
    skills: Optional[List[str]] = None
    education_keywords: Optional[List[str]] = None
    uploaded_at: datetime
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class AnalyzeResumeRequest(BaseModel):
    job_description: str

class AnalyzeResumeResponse(BaseModel):
    match_percentage: float
    matched_skills: List[str]
    missing_skills: List[str]
    recommendation_score: float
