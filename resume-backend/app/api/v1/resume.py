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
import io, os, base64
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
    res_data = resume.resume_data or {}
    if data['template'] != 'one' or data['template'] != 'two' or data['template'] != 'three':
        res_data['premium_template'] = True

    return res_data or {}


@router.get("/resume")
def get_resume(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()

    if not resume:
        return {}
    
    return resume.resume_data or {}

@router.get("/resume/templates")
def get_resume_templates():
    return [
        {"id": "one", "name": "Resume template one", "thumbnail": "/static/resume_thumbs/one.png", 'tier': 'free', 'category': 'modern'},
        {"id": "two", "name": "Resume template two", "thumbnail": "/static/resume_thumbs/two.png", 'tier': 'free', 'category': 'modern'},
        {"id": "three", "name": "Resume template three", "thumbnail": "/static/resume_thumbs/three.png", 'tier': 'free', 'category': 'modern'},
        {"id": "four", "name": "Resume template four", "thumbnail": "/static/resume_thumbs/four.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "five", "name": "Resume template five", "thumbnail": "/static/resume_thumbs/five.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "six", "name": "Resume template six", "thumbnail": "/static/resume_thumbs/six.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "seven", "name": "Resume template seven", "thumbnail": "/static/resume_thumbs/seven.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "eight", "name": "Resume template eight", "thumbnail": "/static/resume_thumbs/eight.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "nine", "name": "Resume template nine", "thumbnail": "/static/resume_thumbs/nine.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "ten", "name": "Resume template ten", "thumbnail": "/static/resume_thumbs/ten.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "eleven", "name": "Resume template eleven", "thumbnail": "/static/resume_thumbs/eleven.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "twelve", "name": "Resume template twelve", "thumbnail": "/static/resume_thumbs/twelve.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "thirteen", "name": "Resume template thirteen", "thumbnail": "/static/resume_thumbs/thirteen.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "fourteen", "name": "Resume template fourteen", "thumbnail": "/static/resume_thumbs/fourteen.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "fifteen", "name": "Resume template fifteen", "thumbnail": "/static/resume_thumbs/fifteen.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "sixteen", "name": "Resume template sixteen", "thumbnail": "/static/resume_thumbs/sixteen.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "seventeen", "name": "Resume template seventeen", "thumbnail": "/static/resume_thumbs/seventeen.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "eighteen", "name": "Resume template eighteen", "thumbnail": "/static/resume_thumbs/eighteen.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "nineteen", "name": "Resume template nineteen", "thumbnail": "/static/resume_thumbs/nineteen.png", 'tier': 'premium', 'category': 'classical'},
        {"id": "twenty", "name": "Resume template twenty", "thumbnail": "/static/resume_thumbs/twenty.png", 'tier': 'premium', 'category': 'classical'},
    ]

@router.get("/resume/preview/{template_id}")
def resume_preview(template_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
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

    # Return Base64 for safe inline preview
    base64_pdf = base64.b64encode(pdf_bytes).decode("utf-8")

    return {"pdf": base64_pdf}


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