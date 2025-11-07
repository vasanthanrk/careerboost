from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Resume, JobFitAnalysis
from app.core.security import get_current_user
import google.generativeai as genai
import fitz  # PyMuPDF for PDFs
import docx
import json
import re
from app.core.config import settings
from app.utils.activity_tracker import track_activity
from app.utils.activity_tracker import log_user_activity

router = APIRouter()

# 🔑 Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)


# --- Utility functions ---
def extract_text_from_pdf(file: UploadFile) -> str:
    """Extract readable text from a PDF file"""
    try:
        pdf_bytes = file.file.read()
        pdf = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page in pdf:
            text += page.get_text("text")
        pdf.close()
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF file: {str(e)}")


def extract_text_from_docx(file: UploadFile) -> str:
    """Extract readable text from a DOCX file"""
    try:
        doc = docx.Document(file.file)
        text = "\n".join([p.text for p in doc.paragraphs])
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read DOCX file: {str(e)}")


# --- Main Route ---
@router.post("/job/analyze")
async def analyze_job_description(job_description: str = Form(""),file: UploadFile = File(None),db: Session = Depends(get_db),current_user=Depends(get_current_user)):
    """
    Analyze a job description (uploaded file or pasted text)
    against the user's resume using Google Gemini.
    """

    # 🧩 Step 1: Load user's resume
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found. Please create one first.")

    # 🧩 Step 2: Extract text from job description
    jd_text = job_description.strip()
    if file:
        if file.filename.endswith(".pdf"):
            jd_text = extract_text_from_pdf(file)
        elif file.filename.endswith((".docx", ".doc")):
            jd_text = extract_text_from_docx(file)
        else:
            raise HTTPException(status_code=400, detail="Only PDF or DOCX files are supported.")

    if not jd_text or len(jd_text) < 50:
        raise HTTPException(status_code=400, detail="Job description is too short or empty.")
    
    # 🧩 Step 3: Build resume summary
    resume_summary = f"""
    Name: {resume.name}
    Summary: {resume.summary}
    Skills: {', '.join([s.skill for s in resume.skills])}
    Experience: {', '.join([f"{e.title} at {e.company}" for e in resume.experiences])}
    Education: {', '.join([f"{e.degree} - {e.school}" for e in resume.educations])}
    Projects: {', '.join([p.name for p in resume.projects])}
    """

    # 🧩 Step 4: Build AI prompt
    prompt = f"""
    You are an expert AI job match analyzer.
    Compare the following job description with this candidate’s resume.
    Provide a **valid JSON** response only, with this structure:

    {{
        "match_score": (integer 0–100),
        "matched_skills": [list of matched skills],
        "missing_skills": [list of missing skills],
        "recommendations": [
            {{
                "title": "short suggestion",
                "description": "detailed recommendation",
                "priority": "high"|"medium"|"low"
            }}
        ],
        "score_breakdown": {{
            "required_skills_match": (integer 0–100),
            "experience_level_match": (integer 0–100),
            "education_requirements_match": (integer 0–100),
            "preferred_qualifications_match": (integer 0–100)
        }}
    }}

    --- Job Description ---
    {jd_text}

    --- Candidate Resume ---
    {resume_summary}
    """
    
    text = ''
    # 🧩 Step 5: Call Gemini API
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")  # ✅ current supported model
        result = model.generate_content(prompt)

        # Extract and parse JSON safely
        text = result.text.strip()
        text = text.replace("```json", "").replace("```", "")
        json_match = re.search(r"\{.*\}", text, re.DOTALL)
        if not json_match:
            raise ValueError("AI did not return valid JSON")

        data = json.loads(json_match.group(0))

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
    
    # 🧩 Step 6: Save analysis results in the database
    analysis_entry = JobFitAnalysis(
        user_id=current_user.id,
        resume_id=resume.id,
        job_description=jd_text,
        match_score=data.get("match_score", 0),
        matched_skills=data.get("matched_skills", []),
        missing_skills=data.get("missing_skills", []),
        recommendations=data.get("recommendations", []),
    )

    db.add(analysis_entry)
    db.commit()

    from app.utils.ai_logger import save_ai_interaction
    ai_response = f"{text}"
    # Save the interaction
    save_ai_interaction(
        user=current_user,
        prompt=prompt,
        response=ai_response,
        requirement_type='job_fit',
        model_name="gemini-2.5-flash"
    )

    track_activity(db, current_user.id, "job_fit_analysis")
    log_user_activity(
        db=db, 
        user_id=current_user.id, 
        action="job_fit_analysis", 
        meta_data={"match_score": data.get("match_score", 0)}
    )
    return data
