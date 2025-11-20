from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone:str
    career_level: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    career_level: Optional[str] = None
    token: Optional[str] = None

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str