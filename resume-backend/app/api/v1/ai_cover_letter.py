from fastapi import APIRouter, HTTPException, Depends, Response
from pydantic import BaseModel
import google.generativeai as genai
import os
from app.core.security import get_current_user  # optional if user-specific
from app.core.config import settings
from jinja2 import Environment, FileSystemLoader
from app.utils.activity_tracker import track_activity, log_user_activity
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.utils.pdf_generator import generate_pdf_from_html

genai.configure(api_key=settings.GEMINI_API_KEY)
TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "../../templates/cover-letter")
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

router = APIRouter()
class CoverLetterRequest(BaseModel):
    jobRole: str
    companyName: str
    jobDescription: str | None = None
    tone: str | None = "professional"

@router.post("/ai/cover-letter")
def generate_cover_letter(request: CoverLetterRequest, current_user=Depends(get_current_user),db: Session = Depends(get_db)):
    """
    Generate a personalized cover letter using Gemini AI.
    """

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")

        prompt = f"""
            Write a personalized and well-structured cover letter.

            Details:
            - Job Role: {request.jobRole}
            - Company: {request.companyName}
            - Job Description: {request.jobDescription or "Not provided"}
            - Desired Tone: {request.tone or "professional"}

            Guidelines:
            - Use a {request.tone or "professional"} tone throughout.
            - Make it concise but engaging.
            - Highlight relevant skills naturally.
            - Sign with "Sincerely, [Candidate Name]".
            """

        result = model.generate_content(prompt)

        if not result.text:
            raise HTTPException(status_code=500, detail="Failed to generate content.")

        text = result.text.strip()
        text = text.replace("```json", "").replace("```", "")

        from app.utils.ai_logger import save_ai_interaction
        ai_response = f"{text}"
        
        # Save the interactions
        save_ai_interaction(user=current_user,prompt=prompt,response=ai_response,requirement_type='cover_letter',model_name="gemini-2.5-flash")
        track_activity(db, current_user.id, "ai_cover_letter_generate")
        log_user_activity(db=db, user_id=current_user.id, action="ai_cover_letter_generate", meta_data={"fields": 'changed_fields'})

        return {"cover_letter": text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class CoverLetterPdfRequest(BaseModel):
    coverLetter: str
    jobRole: str
    companyName: str
    jobDescription: str | None = None
    tone: str | None = "professional"
   
@router.post("/ai/cover-letter/pdf")
def generate_cover_letter_pdf(request: CoverLetterPdfRequest, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    # Render HTML for PDF
    """
    Generate a downloadable PDF for the cover letter.
    """
    try:
       
        # Render HTML for PDF
        template = env.get_template("cover_letter_template.html")
        html_content = template.render(
            jobRole=request.jobRole,
            companyName=request.companyName,
            jobDescription=request.jobDescription,
            tone=request.tone,
            cover_letter=request.coverLetter,
            candidate_name=current_user.full_name if hasattr(current_user, "full_name") else "John Doe"
        )

        # Generate PDF
        pdf_bytes = generate_pdf_from_html(html_content)

        track_activity(db, current_user.id, "cover_letter_download")
        log_user_activity(
            db=db, 
            user_id=current_user.id, 
            action="cover_letter_download", 
            meta_data={"fields": 'changed_fields'}
        )
        # Return file download
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="CoverLetter_{request.jobRole}.pdf"'
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))