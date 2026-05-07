from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, cast, String
from typing import List, Optional
from models.internship import Internship
from schemas.internship import RecommendationResponse

async def get_internships(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 10,
    domain: Optional[str] = None,
    location: Optional[str] = None,
    eligibility: Optional[str] = None,
    stipend: Optional[str] = None,
    duration: Optional[str] = None,
    skill_tags: Optional[str] = None
):
    query = select(Internship)
    
    filters = []
    if domain:
        filters.append(Internship.domain.ilike(f"%{domain}%"))
    if location:
        filters.append(Internship.location.ilike(f"%{location}%"))
    if eligibility:
        filters.append(Internship.eligibility.ilike(f"%{eligibility}%"))
    if stipend:
        filters.append(Internship.stipend.ilike(f"%{stipend}%"))
    if duration:
        filters.append(Internship.duration.ilike(f"%{duration}%"))
        
    if filters:
        query = query.where(and_(*filters))
        
    if skill_tags:
        query = query.where(cast(Internship.skill_tags, String).ilike(f"%{skill_tags.lower()}%"))

    # Total count
    count_query = select(func.count()).select_from(query.subquery())
    total_count = await db.scalar(count_query)

    # Paginate
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)
    
    result = await db.execute(query)
    data = result.scalars().all()

    return {
        "total_count": total_count or 0,
        "page": page,
        "page_size": page_size,
        "data": data
    }

async def get_internship_by_id(db: AsyncSession, internship_id: str):
    result = await db.execute(select(Internship).where(Internship.id == internship_id))
    return result.scalar_one_or_none()

async def get_recommendations(db: AsyncSession, user_skills: List[str]) -> List[RecommendationResponse]:
    normalized_user_skills = set([s.strip().lower() for s in user_skills])
    
    # Fetch all internships (for now, in-memory computation)
    result = await db.execute(select(Internship))
    internships = result.scalars().all()
    
    recommendations = []
    
    for item in internships:
        item_skills = set(item.skill_tags) if item.skill_tags else set()
        
        if not item_skills:
            matched = list(normalized_user_skills)
            missing = []
            match_percentage = 100.0
        else:
            matched = item_skills.intersection(normalized_user_skills)
            missing = item_skills.difference(normalized_user_skills)
            match_percentage = (len(matched) / len(item_skills)) * 100.0
            
        recommendations.append(RecommendationResponse(
            id=item.id,
            title=item.title,
            domain=item.domain,
            location=item.location,
            matched_skills=list(matched),
            missing_skills=list(missing),
            match_percentage=round(match_percentage, 2)
        ))
        
    # Sort by match percentage descending
    recommendations.sort(key=lambda x: x.match_percentage, reverse=True)
    
    return recommendations[:20] # Return top 20
