from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from core.database import get_db
from core.deps import get_current_user_token
from schemas.internship import InternshipResponse, RecommendationRequest, RecommendationResponse, PaginatedInternships
from services.internship_service import get_internships, get_internship_by_id, get_recommendations

router = APIRouter()

@router.get("/", response_model=PaginatedInternships)
async def list_internships(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    domain: Optional[str] = None,
    location: Optional[str] = None,
    eligibility: Optional[str] = None,
    stipend: Optional[str] = None,
    duration: Optional[str] = None,
    skill_tags: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    result = await get_internships(
        db=db,
        page=page,
        page_size=page_size,
        domain=domain,
        location=location,
        eligibility=eligibility,
        stipend=stipend,
        duration=duration,
        skill_tags=skill_tags
    )
    return result

@router.get("/{id}", response_model=InternshipResponse)
async def get_internship(id: str, db: AsyncSession = Depends(get_db)):
    internship = await get_internship_by_id(db, id)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return internship

@router.post("/recommendations", response_model=List[RecommendationResponse])
async def recommend_internships(
    request: RecommendationRequest,
    token_data: dict = Depends(get_current_user_token),
    db: AsyncSession = Depends(get_db)
):
    recommendations = await get_recommendations(db, request.user_skills)
    return recommendations
