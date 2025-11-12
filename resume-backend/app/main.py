from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import health, auth, resume, ai_resume, ai_cover_letter, job_analyzer, linkedin_optimizer, portfolio, user, feedback, user_metrics, ats
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(
    title="CareerBoost AI Backend",
    description="Backend API for AI Resume & Career Booster Platform",
    version="1.0.0"
)

# --- CORS Setup ---
origins = [o.strip() for o in os.getenv("CORS_ORIGINS","").split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Ensure upload folder exists
os.makedirs("uploads/avatars", exist_ok=True)

app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
app.include_router(resume.router, prefix="/api/v1", tags=["Resume"])
app.include_router(ai_resume.router, prefix="/api/v1", tags=["Ai Resume"])
app.include_router(ai_cover_letter.router, prefix="/api/v1", tags=["Ai Cover Letter"])
app.include_router(job_analyzer.router, prefix="/api/v1", tags=["Job Analyzer"])
app.include_router(linkedin_optimizer.router, prefix="/api/v1", tags=["LinkedIn Optimizer"])
app.include_router(portfolio.router, prefix="/api/v1", tags=["Portfolio"])
app.include_router(user.router, prefix="/api/v1", tags=["User Settings"])
app.include_router(feedback.router, prefix="/api/v1", tags=["User FeedBack"])
app.include_router(user_metrics.router, prefix="/api/v1", tags=["User metrics"])
app.include_router(ats.router, prefix="/api/v1", tags=["ats"])

# Serve uploaded avatars
# ✅ Mount uploads folder to serve files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {"message": "CareerBoost AI Backend Running"}
