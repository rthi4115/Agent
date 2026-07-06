from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, create_engine
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database.db import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    extracted_text = Column(Text, nullable=False)
    ats_score = Column(Integer, default=0)
    summary = Column(Text, nullable=True)
    missing_sections = Column(Text, nullable=True)  # JSON String
    suggested_improvements = Column(Text, nullable=True)  # JSON String
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    job_matches = relationship("JobMatch", back_populates="resume", cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="resume", cascade="all, delete-orphan")
    interviews = relationship("InterviewPrep", back_populates="resume", cascade="all, delete-orphan")
    career_plans = relationship("CareerPlan", back_populates="resume", cascade="all, delete-orphan")


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_title = Column(String(255), nullable=True)
    job_description = Column(Text, nullable=False)
    match_percentage = Column(Integer, default=0)
    matched_skills = Column(Text, nullable=True)  # JSON String
    missing_skills = Column(Text, nullable=True)  # JSON String
    missing_keywords = Column(Text, nullable=True)  # JSON String
    suggestions = Column(Text, nullable=True)  # JSON String
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="job_matches")
    skill_gaps = relationship("SkillGap", back_populates="job_match", cascade="all, delete-orphan")


class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_match_id = Column(Integer, ForeignKey("job_matches.id", ondelete="CASCADE"), nullable=True)
    roadmap_json = Column(Text, nullable=False)  # JSON String (Beginner, Intermediate, Advanced details)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="skill_gaps")
    job_match = relationship("JobMatch", back_populates="skill_gaps")


class InterviewPrep(Base):
    __tablename__ = "interview_preps"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    questions_json = Column(Text, nullable=False)  # JSON String (List of Q&A objects)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="interviews")


class CareerPlan(Base):
    __tablename__ = "career_plans"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    plan_json = Column(Text, nullable=False)  # JSON String (30-day, 90-day, 180-day goals)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="career_plans")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), nullable=False, index=True)
    sender = Column(String(50), nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
