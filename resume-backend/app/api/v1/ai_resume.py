from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import os, json
from app.core.config import settings
from app.core.security import get_current_user
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.utils.activity_tracker import track_activity, log_user_activity

# import openai 
import google.generativeai as genai
genai.configure(api_key=settings.GEMINI_API_KEY)

router = APIRouter()

class AIPrompt(BaseModel):
    jobRole: str
    experienceLevel: str
    additionalInfo: str | None = None


@router.post("/ai/generate")
def generate_ai_resume(prompt: AIPrompt,db: Session = Depends(get_db),  current_user=Depends(get_current_user)):
    print(settings.GEMINI_API_KEY)
    try:
        # system_prompt = f"""
        # You are an expert resume generator. Generate a professional resume for a person applying for a {prompt.jobRole}.
        # Experience level: {prompt.experienceLevel}.
        # Additional information: {prompt.additionalInfo or "None"}.

        # Respond in JSON format with fields:
        # name, summary, experiences (list of {{"title", "company", "duration", "description"}}),
        # educations (list of {{"degree", "school", "year"}}),
        # skills (list of {{"skill"}}),
        # projects (list of {{"name", "description"}})
        # """

        system_prompt = f"""
        Generate a JSON resume for a {prompt.jobRole}.
        Experience level: {prompt.experienceLevel}.
        Additional info: {prompt.additionalInfo or "None"}.

        Return JSON with the following structure:
        {{
            "name": "string",
            "summary": "string",
            "experiences": [{{"title": "string", "company": "string", "duration": "string", "description": "string"}}],
            "educations": [{{"degree": "string", "school": "string", "year": "string"}}],
            "skills": [{{"skill": "string"}}],
            "projects": [{{"name": "string", "description": "string"}}]
        }}
        """

        # Using Google Gemini API
        model = genai.GenerativeModel("gemini-2.5-flash")
        result = model.generate_content(system_prompt)
        # Clean and parse JSON safely
        text = result.text.strip()
        text = text.replace("```json", "").replace("```", "")
        data = json.loads(text)

        track_activity(db, current_user.id, "ai_resume_generate")
        log_user_activity(
            db=db, 
            user_id=current_user.id, 
            action="ai_resume_generate", 
            meta_data={"fields": 'changed_fields'}
        )

        from app.utils.ai_logger import save_ai_interaction
        ai_response = f"{text}"
        # Save the interaction
        save_ai_interaction(
            user=current_user,
            prompt=system_prompt,
            response=ai_response,
            requirement_type='resume',
            model_name="gemini-2.5-flash"
        )


        # Load OpenAI API Key from env
        # openai.api_key = os.getenv("OPENAI_API_KEY")

        # response = openai.ChatCompletion.create(
        #     model="gpt-4o-mini",  # lightweight and cost-effective
        #     messages=[
        #         {"role": "system", "content": system_prompt},
        #     ],
        #     temperature=0.7,
        # )

        # text_output = response.choices[0].message.content.strip()

        # data = json.loads(text_output)
        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
