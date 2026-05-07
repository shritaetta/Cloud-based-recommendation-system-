from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ProfileUpdate(BaseModel):
    education: Optional[Dict[str, Any]] = None
    skills: Optional[List[str]] = None
    resume_metadata: Optional[Dict[str, Any]] = None

class ProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    education: Optional[Dict[str, Any]]
    skills: Optional[List[str]]
    resume_metadata: Optional[Dict[str, Any]]
    
    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
