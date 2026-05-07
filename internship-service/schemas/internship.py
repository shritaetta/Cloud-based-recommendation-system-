from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class InternshipResponse(BaseModel):
    id: str
    title: Optional[str] = None
    description: Optional[str] = None
    domain: Optional[str] = None
    location: Optional[str] = None
    stipend: Optional[str] = None
    duration: Optional[str] = None
    eligibility: Optional[str] = None
    course: Optional[str] = None
    domain_tag: Optional[str] = None
    role_tag: Optional[str] = None
    education_tag: Optional[str] = None
    skill_tags: Optional[List[str]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class RecommendationRequest(BaseModel):
    user_skills: List[str]

class RecommendationResponse(BaseModel):
    id: str
    title: Optional[str] = None
    domain: Optional[str] = None
    location: Optional[str] = None
    matched_skills: List[str]
    missing_skills: List[str]
    match_percentage: float

class PaginatedInternships(BaseModel):
    total_count: int
    page: int
    page_size: int
    data: List[InternshipResponse]
