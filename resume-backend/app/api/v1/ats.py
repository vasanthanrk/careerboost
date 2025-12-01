# app/api/v1/ats.py
import os
import io
import json
import fitz  # PyMuPDF
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML
from datetime import datetime
from app.models.resume import Resume
from app.utils.change_ditect import get_changed_fields
from app.utils.activity_tracker import track_activity, log_user_activity

import google.generativeai as genai

from app.core.database import get_db
from app.core.security import get_current_user  # your function
from app.models.ats import ATSResult
from app.core.config import settings

router = APIRouter()

# configure gemini API key
genai.configure(api_key=settings.GEMINI_API_KEY)

# Dir for resume HTML templates
TEMPLATES_DIR = os.getenv("RESUME_TEMPLATES_DIR", "./templates/resume_templates")
# Dir to store generated PDFs (optional)
OUTPUT_PDF_DIR = os.getenv("ATSSAVE_DIR", "./generated_pdfs")
os.makedirs(OUTPUT_PDF_DIR, exist_ok=True)

jinja_env = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),
    autoescape=select_autoescape(["html", "xml"]),
)

def extract_text_from_upload(file: UploadFile) -> str:
    """Extract text using fitz/PyMuPDF for PDF; for docx fallback to python-docx if needed."""
    try:
        content = file.file.read()
        if file.content_type == "application/pdf" or file.filename.lower().endswith(".pdf"):
            doc = fitz.open(stream=content, filetype="pdf")
            pages = []
            for p in doc:
                text = p.get_text("text") or ""
                pages.append(text)
            return "\n".join(pages).strip()
        # if docx
        if file.content_type in (
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ) or file.filename.lower().endswith((".doc", ".docx")):
            # light-weight fallback using python-docx
            try:
                from docx import Document
                doc = Document(io.BytesIO(content))
                return "\n".join([p.text for p in doc.paragraphs]).strip()
            except Exception:
                raise HTTPException(status_code=400, detail="Unable to extract text from DOC/DOCX")
        # else treat as plain text
        return content.decode("utf-8", errors="ignore").strip()
    finally:
        # ensure file pointer reset/closed
        try:
            file.file.close()
        except Exception:
            pass

def call_gemini_analyze(resume_text: str, current_user):
    """
    Call Gemini with a strict JSON return instruction.
    Parse and return a dict.
    """
    today_date = datetime.now().strftime("%B %d, %Y")
    prompt = f"""You are an advanced Applicant Tracking System (ATS) evaluator and resume optimizer.

    Analyze the following resume text and return an objective, machine-readable evaluation and a reconstructed improved resume.

    Follow these precise instructions:

    Follow these precise instructions:

    The current date is **{today_date}**.
    Do not use or assume any future dates beyond this date. 
    If any job experience has an end date later than today, replace it with "Present".

    Continue with your analysis below:

    ### OUTPUT FORMAT
    Return a **single JSON object** with exactly these top-level keys:
    - "overall": integer (0–100) — total ATS compatibility score.
    - "breakdown": object with keys:
        - "formatting", "keywords", "experience", "education", "skills", "contact"
        - Each key’s value must be an integer (0–100).
    - "missingData": array of objects:
    - Each object must include:
        - "category": string (e.g. "Skills", "Experience", "Formatting")
        - "items": array of strings describing issues or missing information
        - "severity": one of "critical", "warning", or "info".
    - "suggestions": array of short actionable suggestion strings to improve the resume.
    - "improvedResume": need tobe ATS based data. object with the following schema strictly (even if some fields are empty):
    - "summary" should be a concise professional summary relevant to the job role avoiding unnecessary elaboration .
    - all the discriptions should be concise and to the point, avoiding unnecessary elaboration."
    - keywords need to be specific to the job role and industry, and no need to include what have in skills section."
    ```json{{
        "overall": 0-100,
        "breakdown": {{
            "formatting": 0-100,
            "keywords": 0-100,
            "experience": 0-100,
            "education": 0-100,
            "skills": 0-100,
            "contact": 0-100
        }},
        "missingData": [
            {{
            "category": "string",
            "items": ["string", "..."],
            "severity": "critical|warning|info"
            }}
        ],
        "suggestions": ["string", "..."],
        "improvedResume": {{
            "name": "string",
            "email": "string",
            "phone": "string",
            "location": "string",
            "summary": "string",
            "jobrole": "string",
            "linkedin_url":"string",
            "git_url":"string",
            "portfolio_url":"string",
            "experiences": [
            {{
                "title": "string",
                "company": "string",
                "duration": "string",
                "description": "string"
            }}
            ],
            "educations": [
            {{
                "degree": "string",
                "school": "string",
                "year": "string"
            }}
            ],
            "skills": [
            {{
                "skill": "string"
            }}
            ],
            "projects": [
            {{
                "name": "string",
                "description": "string"
            }}
            ],
            "certifications": [
            {{
                "name": "string",
                "issuer": "string",
                "year": "string"
            }}
            ],
            "languages": [
            {{
                "language": "string",
                "proficiency": "string"
            }}
            ],
            "achievements": [
            {{
                "title": "string",
                "description": "string"
            }}
            ],
            "keywords": ["string", "..."]
        }}
    }}
    Resume:
    {resume_text}
    """

    model = genai.GenerativeModel("gemini-2.5-flash")  # pick model you have access to
    resp = model.generate_content(prompt)
    text = resp.text.strip()
    text = text.replace("```json", "").replace("```", "")
    try:
        data = json.loads(text)
    except Exception as e:
        # include raw text in exception so debugging easier
        raise ValueError(f"Failed to parse Gemini JSON. error={e}; raw_output={text[:1000]}")
    
    from app.utils.ai_logger import save_ai_interaction
    ai_response = f"{text}"
    # Save the interaction
    save_ai_interaction(
        user=current_user,
        prompt=prompt,
        response=ai_response,
        requirement_type='ats_check',
        model_name="gemini-2.5-flash"
    )
    return data

@router.post("/ats/check")
async def ats_check(file: UploadFile = File(...), db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """
    Upload resume file -> run Gemini ATS analysis -> store ATSResult -> return JSON with result and id.
    """
    # 1) extract text
    resume_text = extract_text_from_upload(file)
    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract any text from uploaded file")

    # 2) call Gemini
    try:
        analysis = call_gemini_analyze(resume_text, current_user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {e}")

    # 3) normalize expected fields
    overall = analysis.get("overall")
    breakdown = analysis.get("breakdown")
    missing_data = analysis.get("missingData") or analysis.get("missing_data") or []
    suggestions = analysis.get("suggestions") or []
    improved_resume = analysis.get("improvedResume") or analysis.get("improved_resume") or ""

    ats = db.query(ATSResult).filter(ATSResult.user_id == current_user.id).first()
    if not ats:
        ats = ATSResult(user_id=current_user.id)
        db.add(ats)
        
    # 4) persist to DB
    ats.user_id=current_user.id,
    ats.overall=int(overall) if overall is not None else None,
    ats.breakdown=breakdown,
    ats.missing_data=missing_data,
    ats.suggestions=suggestions,
    ats.improved_resume=improved_resume,

    db.commit()
    db.refresh(ats)

    changed_fields = get_changed_fields(ats)
    if changed_fields:
        log_user_activity(
            db=db, 
            user_id=current_user.id, 
            action="ats_check", 
            meta_data={"fields": changed_fields}
        )

    # Save to resume also
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume:
        resume = Resume(user_id=current_user.id)
        db.add(resume)

    # Save entire JSON to single JSON column
    resume.resume_data = improved_resume  # assuming resume_data is a JSON column
    db.commit()
    db.refresh(resume)

    track_activity(db, current_user.id, "ats_using")

    changed_fields = get_changed_fields(resume)
    if changed_fields:
        log_user_activity(
            db=db, 
            user_id=current_user.id, 
            action="resume_update", 
            meta_data={"fields": changed_fields}
        )

    return {
        "status": "success", 
        "ats_id": ats.id, 
        "analysis": {
            "overall": ats.overall,
            "breakdown": ats.breakdown,
            "missing_data": ats.missing_data,
            "suggestions": ats.suggestions,
            "improvedResume":ats.improved_resume,
        }
    }