from sqlalchemy import Column, String, Text, DateTime, JSON
from datetime import datetime
import uuid

from core.database import Base

class Internship(Base):
    __tablename__ = "internships"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    domain = Column(String, nullable=True)
    location = Column(String, nullable=True)
    stipend = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    eligibility = Column(String, nullable=True)
    course = Column(String, nullable=True)
    domain_tag = Column(String, nullable=True)
    role_tag = Column(String, nullable=True)
    education_tag = Column(String, nullable=True)
    skill_tags = Column(JSON, nullable=True)
    combined_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
