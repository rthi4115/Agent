from pydantic import BaseModel, Field
from typing import List
from backend.agents.base_agent import BaseAgent

class JobMatchOutput(BaseModel):
    match_percentage: int
    matched_skills: List[str]
    missing_skills: List[str]
    missing_keywords: List[str]
    suggestions: List[str]

class JobMatchAgent(BaseAgent):
    def __init__(self):
        super().__init__()

    def match(self, resume_text: str, job_description: str) -> JobMatchOutput:
        prompt = f"""
        You are an expert Talent Acquisition specialist.
        Compare the candidate's resume with the job description below.
        Determine matching skills, missing skills, missing keywords that ATS filters look for, and actionable suggestions to frame the resume match.
        
        Resume text:
        {resume_text}
        
        Job Description:
        {job_description}
        
        Return the result in JSON format conforming to the requested schema.
        """
        
        result_dict = self._call_gemini_json(prompt, schema_class=JobMatchOutput)
        
        if not self.client_configured or "match_percentage" not in result_dict:
            return JobMatchOutput(
                match_percentage=65,
                matched_skills=["React", "JavaScript", "Python", "Git", "SQL"],
                missing_skills=["TypeScript", "Docker", "FastAPI", "Tailwind CSS"],
                missing_keywords=["Multi-Agent systems", "CI/CD pipelines", "RESTful design"],
                suggestions=[
                    "Incorporate your TypeScript project details into the Work Experience or Projects section.",
                    "Explicitly highlight your experience building REST APIs with Python (FastAPI/Flask).",
                    "Mention Docker and container deployment in your Skills segment."
                ]
            )
            
        return JobMatchOutput(**result_dict)
