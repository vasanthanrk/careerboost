from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import (
    Portfolio, PortfolioPersonal, PortfolioExperience, PortfolioSkill, PortfolioProject, User
)
from app.core.security import get_current_user
from fastapi.responses import JSONResponse
import google.generativeai as genai
import os
from app.core.config import settings
from fastapi.templating import Jinja2Templates
from app.models.resume import Resume

templates = Jinja2Templates(directory="app/templates/portfolio")
genai.configure(api_key=settings.GEMINI_API_KEY)

router = APIRouter()

@router.post("/portfolio/generate")
async def generate_portfolio(data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Save or update a user's portfolio with normalized relational data.
    """
    try:
        # AI-enhance bio (optional)
        bio = data.get("bio", "")
        enhanced_bio = bio
        if bio and len(bio.split()) < 15:
            model = genai.GenerativeModel("gemini-2.5-flash")
            prompt = f"Improve this developer bio to sound professional: {bio}"
            enhanced_bio = model.generate_content(prompt).text.strip()

        # 1️⃣ Create Portfolio
        portfolio = Portfolio(
            user_id=current_user.id,
            title=f"{data.get('name', 'My Portfolio')}'s Portfolio",
            summary=enhanced_bio[:250],
            theme=data.get("theme", "modern"),
            published_url=f"/portfolio/preview/{current_user.id}",
            is_published=False
        )
        db.add(portfolio)
        db.flush()  # Get portfolio.id immediately

        # 2️⃣ Add Personal Info
        personal = PortfolioPersonal(
            portfolio_id=portfolio.id,
            name=data.get("name"),
            title=data.get("role"),
            bio=enhanced_bio,
            email=data.get("email", ""),
            location=data.get("location", ""),
            github_url=data.get("github_url", ""),
            linkedin_url=data.get("linkedin_url", ""),
            website_url=data.get("website_url", "")
        )
        db.add(personal)

        # 3️⃣ Add Skills
        for skill_name in data.get("skills", []):
            db.add(PortfolioSkill(portfolio_id=portfolio.id, name=skill_name, category="General"))

        # 4️⃣ Add Projects
        for project in data.get("projects", []):
            db.add(PortfolioProject(
                portfolio_id=portfolio.id,
                name=project.get("name"),
                description=project.get("description"),
                technologies=project.get("tech"),
                project_url=project.get("project_url", ""),
                github_url=project.get("github_url", ""),
                image_url=project.get("image_url", "")
            ))

        # 5️⃣ Add Experience
        for exp in data.get("experience", []):
            db.add(PortfolioExperience(
                portfolio_id=portfolio.id,
                job_title=exp.get("title"),
                company=exp.get("company"),
                duration=exp.get("duration"),
                description=exp.get("description"),
                achievements=""
            ))

        db.commit()
        db.refresh(portfolio)

        return JSONResponse(content={
            "id": portfolio.id,
            "name": personal.name,
            "role": personal.title,
            "bio": personal.bio,
            "theme": portfolio.theme,
            "skills": [s.name for s in portfolio.skills],
            "projects": [p.name for p in portfolio.projects],
            "experience": [e.job_title for e in portfolio.experiences],
            "preview_url": portfolio.published_url,
            "message": "Portfolio created successfully"
        })

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error generating portfolio: {str(e)}")

@router.get("/portfolio/preview")
def get_portfolio(request: Request, current_user: User = Depends(get_current_user), db: Session = Depends(get_db),):
    """
    Get the user's saved portfolio details as JSON.
    """
    portfolio = db.query(Portfolio).filter_by(user_id=current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    personal = portfolio.personal
    if not personal:
        raise HTTPException(status_code=404, detail="Portfolio personal details missing")

    personal = portfolio.personal
    theme = portfolio.theme or "modern"
    return templates.TemplateResponse(
        f"portfolio_{theme}.html",
        { 
            "request": request,
            "portfolio": portfolio,
            "personal": personal,
            "skills": [s.name for s in portfolio.skills],
            "projects": portfolio.projects,
            "experiences": portfolio.experiences,
        },
    )


@router.get("/portfolio/load")
def load_portfolio(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Load user's saved portfolio.
    If portfolio does not exist, fallback to resume data.
    """
    portfolio = db.query(Portfolio).filter_by(user_id=current_user.id).first()

    # ✅ CASE 1: Portfolio exists → return it
    if portfolio:
        personal = portfolio.personal
        skills = [s.name for s in portfolio.skills]
        experiences = [
            {
                "title": e.job_title,
                "company": e.company,
                "duration": e.duration,
                "description": e.description,
            }
            for e in portfolio.experiences
        ]
        projects = [
            {
                "name": p.name,
                "description": p.description,
                "tech": p.technologies,
            }
            for p in portfolio.projects
        ]

        return {
            "name": personal.name if personal else "",
            "role": personal.title if personal else "",
            "bio": personal.bio if personal else "",
            "theme": portfolio.theme or "modern",
            "skills": skills,
            "projects": projects,
            "experience": experiences,
            "source": "portfolio",
        }

    # ✅ CASE 2: No portfolio → fallback to Resume data
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No portfolio or resume found")

    resume_skills = [s.skill for s in resume.skills] if hasattr(resume, "skills") else []
    resume_experiences = [
        {
            "title": exp.title,
            "company": exp.company,
            "duration": f"{exp.start_date} - {exp.end_date}" if hasattr(exp, "start_date") else "",
            "description": exp.description or "",
        }
        for exp in getattr(resume, "experiences", [])
    ]
    resume_projects = [
        {
            "name": p.name,
            "description": p.description or "",
            "tech": ", ".join(p.technologies) if hasattr(p, "technologies") else "",
        }
        for p in getattr(resume, "projects", [])
    ]

    # Auto-filled fallback response
    return {
        "name": resume.name or "",
        "role": resume.name or "Software Developer",
        "bio": resume.summary or "",
        "theme": "modern",
        "skills": resume_skills,
        "projects": resume_projects,
        "experience": resume_experiences,
        "source": "resume",
    }