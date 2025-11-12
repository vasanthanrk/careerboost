from fastapi.responses import FileResponse
from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.core.security import get_current_user  # token auth helper
from app.utils.pdf_generator import generate_pdf_from_html
from jinja2 import Environment, FileSystemLoader
from app.utils.activity_tracker import track_activity, log_user_activity
import io, os
from app.utils.change_ditect import get_changed_fields
from app.models.user_feedback import UserFeedback

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "../../templates/resumes")
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

router = APIRouter()
@router.post("/resume")
async def create_or_update_resume(request: Request,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    data = await request.json()
    # Check if resume exists for this user
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()

    if not resume:
        resume = Resume(user_id=current_user.id)
        db.add(resume)

    # ✅ Save entire JSON to single JSON column
    resume.resume_data = data  # assuming resume_data is a JSON column

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

    return resume.resume_data or {}


@router.get("/resume")
def get_resume(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return resume.resume_data or {}

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
    html_content = template.render(resume=resume.resume_data)

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

    # Check if the user already has feedback for the same type
    show_feedback = True
    existing_feedback = (db.query(UserFeedback).filter(UserFeedback.user_id == current_user.id,UserFeedback.type_used == 'resume_download').first())
    if existing_feedback:
        show_feedback = False

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=resume.pdf",
            "X-Show-Feedback": "true" if show_feedback else "false"
        }
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