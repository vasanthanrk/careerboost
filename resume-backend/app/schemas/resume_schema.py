from pydantic import BaseModel
from typing import List, Optional

class ResumeExperienceCreate(BaseModel):
    title: str
    company: str
    duration: str
    description: Optional[str] = None


class ResumeEducationCreate(BaseModel):
    degree: str
    school: str
    year: str


class ResumeSkillCreate(BaseModel):
    skill: str


class ResumeProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ResumeBase(BaseModel):
    name: str
    email: str
    phone: str
    location: str
    summary: str
    experiences: List[ResumeExperienceCreate] = []
    educations: List[ResumeEducationCreate] = []
    skills: List[ResumeSkillCreate] = []
    projects: List[ResumeProjectCreate] = []


class ResumeCreate(ResumeBase):
    pass


class ResumeResponse(ResumeBase):
    id: int

    class Config:
        orm_mode = True
