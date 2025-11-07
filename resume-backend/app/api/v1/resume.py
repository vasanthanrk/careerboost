from fastapi.responses import FileResponse
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.models.resume import Resume, ResumeExperience, ResumeEducation, ResumeSkill, ResumeProject
from app.schemas.resume_schema import ResumeCreate, ResumeResponse
from app.models.user import User
from app.core.security import get_current_user  # token auth helper
from app.utils.pdf_generator import generate_pdf_from_html
from jinja2 import Environment, FileSystemLoader
from app.utils.activity_tracker import track_activity, log_user_activity
import io, os
from app.utils.change_ditect import get_changed_fields

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "../../templates/resumes")
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

router = APIRouter()
@router.post("/resume", response_model=ResumeResponse)
def create_or_update_resume(resume_data: ResumeCreate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    # Check if resume exists for this user
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()

    if not resume:
        resume = Resume(user_id=current_user.id)
        db.add(resume)

    # Update base fields
    resume.name = resume_data.name
    resume.email = resume_data.email
    resume.phone = resume_data.phone
    resume.location = resume_data.location
    resume.summary = resume_data.summary

    # Clear existing child tables
    db.query(ResumeExperience).filter_by(resume_id=resume.id).delete()
    db.query(ResumeEducation).filter_by(resume_id=resume.id).delete()
    db.query(ResumeSkill).filter_by(resume_id=resume.id).delete()
    db.query(ResumeProject).filter_by(resume_id=resume.id).delete()

    # Add new related data
    for exp in resume_data.experiences:
        db.add(ResumeExperience(**exp.dict(), resume=resume))
    for edu in resume_data.educations:
        db.add(ResumeEducation(**edu.dict(), resume=resume))
    for skill in resume_data.skills:
        db.add(ResumeSkill(**skill.dict(), resume=resume))
    for project in resume_data.projects:
        db.add(ResumeProject(**project.dict(), resume=resume))

    changed_fields = get_changed_fields(resume)
    if changed_fields:
        log_user_activity(
            db=db, 
            user_id=current_user.id, 
            action="resume_update", 
            meta_data={"fields": changed_fields}
        )

    db.commit()
    db.refresh(resume)

    return resume


@router.get("/resume", response_model=ResumeResponse)
def get_resume(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = (
        db.query(Resume)
        .options(
            joinedload(Resume.experiences),
            joinedload(Resume.educations),
            joinedload(Resume.skills),
            joinedload(Resume.projects)
        )
        .filter(Resume.user_id == current_user.id)
        .first()
    )
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return resume

@router.get("/resume/templates")
def get_resume_templates():
    return [
        {"id": "one", "name": "Resume template one", "thumbnail": "/public/static/resume_thumbs/one.png"},
        {"id": "two", "name": "Resume template two", "thumbnail": "/public/static/resume_thumbs/two.png"},
        {"id": "three", "name": "Resume template three", "thumbnail": "/public/static/resume_thumbs/three.png"},
        {"id": "four", "name": "Resume template four", "thumbnail": "/public/static/resume_thumbs/four.png"},
        {"id": "five", "name": "Resume template five", "thumbnail": "/public/static/resume_thumbs/five.png"},
    ]

@router.get("/resume/download/{template_id}")
def download_resume(template_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    resume = db.query(Resume).filter_by(user_id=current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    template_name = f"resume_template_{template_id}.html"
    template_path = f"app/templates/resumes/{template_name}"

    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template not found")

    # Load Jinja2 template
    # template = env.get_template("resume_template_one.html")
    template = env.get_template(template_name)
    html_content = template.render(resume=resume)

    # Generate PDF
    pdf_bytes = generate_pdf_from_html(html_content)

    # Save temporarily
    file_path = f"/tmp/{current_user.id}_resume.pdf"
    with open(file_path, "wb") as f:
        f.write(pdf_bytes)

    track_activity(db, current_user.id, "resume_download")
    log_user_activity(
        db=db, 
        user_id=current_user.id, 
        action="resume_downloaded", 
        meta_data={"fields": {"template": "one"}}
    )
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"}
    )

@router.get("/resume/pdf")
def generate_resume_pdf(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume:
        return Response(status_code=404, content="Resume not found")

    print()
    # Load Jinja2 template
    template = env.get_template("resume_template_one.html")
    html_content = template.render(resume=resume)

    # Generate PDF
    pdf_bytes = generate_pdf_from_html(html_content)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"}
    )