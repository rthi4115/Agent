import io
import json
import uuid
import os
from typing import List, Optional
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.config import UPLOADS_DIR, REPORTS_DIR, PORT
from backend.database.db import get_db, engine, Base
from backend.database import models
from backend.agents import (
    ResumeAnalysisAgent,
    JobMatchAgent,
    SkillGapAgent,
    InterviewAgent,
    CareerPlannerAgent
)
from backend.report_generator import generate_pdf_report
from pypdf import PdfReader

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CareerPilot AI API",
    description="Multi-agent career analysis engine APIs powered by Gemini",
    version="1.0.0"
)

# Enable CORS for frontend interactions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session context cache for chat memory fallback
chat_sessions = {}

# ----------------- PYDANTIC REQUEST SCHEMAS -----------------

class JobMatchRequest(BaseModel):
    resume_id: int
    job_title: Optional[str] = "Target Job Role"
    job_description: str

class SkillGapRequest(BaseModel):
    resume_id: int
    job_match_id: int

class InterviewRequest(BaseModel):
    resume_id: int
    job_description: str

class CareerPlanRequest(BaseModel):
    resume_id: int
    career_goals: str

class ChatRequest(BaseModel):
    session_id: str
    message: str
    resume_id: Optional[int] = None


# ----------------- PARSING HELPER -----------------

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extracts text from PDF workspace using pypdf"""
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF document: {str(e)}")


# ----------------- ENDPOINTS -----------------

@app.get("/")
def read_root():
    return {"message": "Welcome to CareerPilot AI Multi-Agent API server is running!"}


@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    POST: Uploads resume PDF, extracts text, calls Resume Agent, stores in DB, and returns the evaluation.
    """
    if not file.filename.endswith('.pdf') and not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Only PDF or TXT files are accepted.")
    
    contents = await file.read()
    if file.filename.endswith('.pdf'):
        extracted_text = extract_text_from_pdf(contents)
    else:
        extracted_text = contents.decode("utf-8", errors="ignore")
        
    if not extracted_text:
        raise HTTPException(status_code=400, detail="The uploaded file contains no readable text.")

    # Save to disk as reference
    saved_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOADS_DIR, saved_filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    # Initialize Resume Agent and analyze
    agent = ResumeAnalysisAgent()
    analysis = agent.analyze(extracted_text)

    # Save resume data to database
    db_resume = models.Resume(
        filename=file.filename,
        extracted_text=extracted_text,
        ats_score=analysis.ats_score,
        summary=analysis.summary,
        missing_sections=json.dumps(analysis.missing_sections),
        suggested_improvements=json.dumps([imp.dict() for imp in analysis.suggested_improvements]),
        created_at=None # auto-generated
    )
    
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    return {
        "resume_id": db_resume.id,
        "filename": db_resume.filename,
        "ats_score": db_resume.ats_score,
        "summary": db_resume.summary,
        "missing_sections": analysis.missing_sections,
        "grammar_issues": analysis.grammar_issues,
        "suggested_improvements": [imp.dict() for imp in analysis.suggested_improvements]
    }


@app.post("/api/job-match")
def job_match(request: JobMatchRequest, db: Session = Depends(get_db)):
    """
    POST: Matches resume against a pasted Job Description and updates DB.
    """
    db_resume = db.query(models.Resume).filter(models.Resume.id == request.resume_id).first()
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume record not found.")

    agent = JobMatchAgent()
    match_result = agent.match(db_resume.extracted_text, request.job_description)

    db_match = models.JobMatch(
        resume_id=request.resume_id,
        job_title=request.job_title,
        job_description=request.job_description,
        match_percentage=match_result.match_percentage,
        matched_skills=json.dumps(match_result.matched_skills),
        missing_skills=json.dumps(match_result.missing_skills),
        missing_keywords=json.dumps(match_result.missing_keywords),
        suggestions=json.dumps(match_result.suggestions)
    )
    db.add(db_match)
    db.commit()
    db.refresh(db_match)

    return {
        "job_match_id": db_match.id,
        "resume_id": db_match.resume_id,
        "job_title": db_match.job_title,
        "match_percentage": db_match.match_percentage,
        "matched_skills": match_result.matched_skills,
        "missing_skills": match_result.missing_skills,
        "missing_keywords": match_result.missing_keywords,
        "suggestions": match_result.suggestions
    }


@app.post("/api/roadmap")
def get_roadmap(request: SkillGapRequest, db: Session = Depends(get_db)):
    """
    POST: Processes missing skills in target job match and generates roadmaps.
    """
    db_match = db.query(models.JobMatch).filter(models.JobMatch.id == request.job_match_id).first()
    if not db_match:
        raise HTTPException(status_code=404, detail="Job Match record not found.")

    missing_skills = json.loads(db_match.missing_skills) if db_match.missing_skills else []

    agent = SkillGapAgent()
    roadmap_result = agent.generate_roadmap(missing_skills)

    # Save to db
    roadmap_json_str = json.dumps({
        "beginner": [item.dict() for item in roadmap_result.beginner],
        "intermediate": [item.dict() for item in roadmap_result.intermediate],
        "advanced": [item.dict() for item in roadmap_result.advanced]
    })

    db_gap = models.SkillGap(
        resume_id=request.resume_id,
        job_match_id=request.job_match_id,
        roadmap_json=roadmap_json_str
    )
    db.add(db_gap)
    db.commit()
    db.refresh(db_gap)

    return {
        "skill_gap_id": db_gap.id,
        "roadmap": {
            "beginner": [item.dict() for item in roadmap_result.beginner],
            "intermediate": [item.dict() for item in roadmap_result.intermediate],
            "advanced": [item.dict() for item in roadmap_result.advanced]
        }
    }


@app.post("/api/interview")
def get_interview(request: InterviewRequest, db: Session = Depends(get_db)):
    """
    POST: Prepares interview prep simulator Q&A objects.
    """
    db_resume = db.query(models.Resume).filter(models.Resume.id == request.resume_id).first()
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume record not found.")

    agent = InterviewAgent()
    interview_result = agent.generate_interview(db_resume.extracted_text, request.job_description)

    questions_json_str = json.dumps({
        "technical": [q.dict() for q in interview_result.technical],
        "behavioral": [q.dict() for q in interview_result.behavioral],
        "hr": [q.dict() for q in interview_result.hr],
        "coding": [q.dict() for q in interview_result.coding]
    })

    db_prep = models.InterviewPrep(
        resume_id=request.resume_id,
        questions_json=questions_json_str
    )
    db.add(db_prep)
    db.commit()
    db.refresh(db_prep)

    return {
        "interview_prep_id": db_prep.id,
        "questions": {
            "technical": [q.dict() for q in interview_result.technical],
            "behavioral": [q.dict() for q in interview_result.behavioral],
            "hr": [q.dict() for q in interview_result.hr],
            "coding": [q.dict() for q in interview_result.coding]
        }
    }


@app.post("/api/career-plan")
def get_career_plan(request: CareerPlanRequest, db: Session = Depends(get_db)):
    """
    POST: Formulates long-term developer 30/90/180 paths based on candidate profile.
    """
    db_resume = db.query(models.Resume).filter(models.Resume.id == request.resume_id).first()
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume record not found.")

    agent = CareerPlannerAgent()
    plan_result = agent.generate_plan(db_resume.extracted_text, request.career_goals)

    plan_json_str = json.dumps({
        "thirty_day_plan": plan_result.thirty_day_plan,
        "ninety_day_plan": plan_result.ninety_day_plan,
        "six_month_roadmap": plan_result.six_month_roadmap
    })

    db_plan = models.CareerPlan(
        resume_id=request.resume_id,
        plan_json=plan_json_str
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)

    return {
        "career_plan_id": db_plan.id,
        "thirty_day_plan": plan_result.thirty_day_plan,
        "ninety_day_plan": plan_result.ninety_day_plan,
        "six_month_roadmap": plan_result.six_month_roadmap
    }


@app.post("/api/chat")
def chat_with_coach(request: ChatRequest, db: Session = Depends(get_db)):
    """
    POST: Conversational chat agent route with interactive history memory.
    """
    # Fetch Resume context if provided
    resume_context = ""
    if request.resume_id:
        db_resume = db.query(models.Resume).filter(models.Resume.id == request.resume_id).first()
        if db_resume:
            resume_context = f"\nResume Candidate Context:\n{db_resume.extracted_text[:3000]}\n"
    
    # Save User message to database
    user_msg_db = models.ChatMessage(
        session_id=request.session_id,
        sender="user",
        content=request.message
    )
    db.add(user_msg_db)
    db.commit()

    # Load recent conversation history (max 8 messages)
    history_msgs = db.query(models.ChatMessage)\
        .filter(models.ChatMessage.session_id == request.session_id)\
        .order_by(models.ChatMessage.created_at.asc())\
        .all()
    
    history_str = ""
    for msg in history_msgs[:-1]: # exclude the user message just added
        history_str += f"{msg.sender.capitalize()}: {msg.content}\n"

    system_instructions = (
        "You are 'CareerPilot AI Coach', a supportive, expert career development assistant.\n"
        "Give professional, concise, encouraging, and structured advice.\n"
        "Leverage the candidate's Resume details and query context if provided.\n"
    )

    full_prompt = (
        f"{system_instructions}\n"
        f"{resume_context}\n"
        f"Conversation History:\n{history_str}\n"
        f"User: {request.message}\n"
        f"Assistant:"
    )

    # Initialize Gemini model to generate text
    from backend.agents.base_agent import BaseAgent
    agent = BaseAgent()
    assistant_response = agent._call_gemini_text(full_prompt)

    # Save Assistant message
    assistant_msg_db = models.ChatMessage(
        session_id=request.session_id,
        sender="assistant",
        content=assistant_response
    )
    db.add(assistant_msg_db)
    db.commit()

    return {
        "session_id": request.session_id,
        "reply": assistant_response
    }


@app.get("/api/chat/history/{session_id}")
def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    """
    GET: Retrieves the message stream for a chat session.
    """
    msgs = db.query(models.ChatMessage)\
        .filter(models.ChatMessage.session_id == session_id)\
        .order_by(models.ChatMessage.created_at.asc())\
        .all()
    
    return [
        {"sender": m.sender, "content": m.content, "timestamp": m.created_at.isoformat()}
        for m in msgs
    ]


@app.get("/api/resumes")
def list_resumes(db: Session = Depends(get_db)):
    """
    GET: Lists all parsed resumes.
    """
    resumes = db.query(models.Resume).order_by(models.Resume.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "ats_score": r.ats_score,
            "created_at": r.created_at.isoformat()
        } for r in resumes
    ]


@app.get("/api/resumes/{resume_id}")
def get_resume(resume_id: int, db: Session = Depends(get_db)):
    """
    GET: Details page fetch for single resume review.
    """
    r = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Resume not found")

    return {
        "id": r.id,
        "filename": r.filename,
        "extracted_text": r.extracted_text,
        "ats_score": r.ats_score,
        "summary": r.summary,
        "missing_sections": json.loads(r.missing_sections) if r.missing_sections else [],
        "suggested_improvements": json.loads(r.suggested_improvements) if r.suggested_improvements else [],
        "created_at": r.created_at.isoformat()
    }


@app.delete("/api/resumes/{resume_id}")
def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    """
    DELETE: Delete single resume review.
    """
    r = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    db.delete(r)
    db.commit()
    return {"message": "Success! Resume deleted successfully."}


@app.get("/api/report/{resume_id}")
def download_resume_report(resume_id: int, db: Session = Depends(get_db)):
    """
    GET: Compiles detailed report summarizing all agent results and downloads PDF.
    """
    resume_obj = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not resume_obj:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Fetch corresponding match, gaps, planning items (newest matching parameters)
    match_obj = db.query(models.JobMatch).filter(models.JobMatch.resume_id == resume_id).order_by(models.JobMatch.created_at.desc()).first()
    gap_obj = db.query(models.SkillGap).filter(models.SkillGap.resume_id == resume_id).order_by(models.SkillGap.created_at.desc()).first()
    plan_obj = db.query(models.CareerPlan).filter(models.CareerPlan.resume_id == resume_id).order_by(models.CareerPlan.created_at.desc()).first()

    report_filename = f"report_{resume_id}.pdf"
    report_path = os.path.join(REPORTS_DIR, report_filename)

    generate_pdf_report(
        dest_path=report_path,
        resume_obj=resume_obj,
        job_match_obj=match_obj,
        skill_gap_obj=gap_obj,
        career_plan_obj=plan_obj
    )

    if not os.path.exists(report_path):
        raise HTTPException(status_code=500, detail="Report generation failed.")

    return FileResponse(
        report_path, 
        media_type="application/pdf", 
        filename=f"CareerPilot_AI_Report_{resume_id}.pdf"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=PORT, reload=True)
