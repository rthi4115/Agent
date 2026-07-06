from pydantic import BaseModel, Field
from typing import List
from backend.agents.base_agent import BaseAgent

class CareerPlanOutput(BaseModel):
    thirty_day_plan: List[str]
    ninety_day_plan: List[str]
    six_month_roadmap: List[str]

class CareerPlannerAgent(BaseAgent):
    def __init__(self):
        super().__init__()

    def generate_plan(self, resume_text: str, career_goals: str) -> CareerPlanOutput:
        goals_str = career_goals if career_goals else "Become a full-stack engineer and land a high-paying job."
        prompt = f"""
        You are an expert Career Coach.
        Based on the candidate's resume and their career goals, create a structured career planner roadmap split into:
        1. 30 Day Plan: Focus on building core foundations, patching immediate resume/skill gaps, and doing basic tutorials.
        2. 90 Day Plan: Focus on intermediate skill expansion, building concrete portfolio projects, and optimizing digital profiles (LinkedIn, GitHub).
        3. 6 Month Roadmap: Focus on job applications, interview prep, mock sessions, open-source contributions, and landing roles.
        
        Resume text:
        {resume_text}
        
        Career Goals:
        {goals_str}
        
        Return the result in JSON format conforming to the requested schema.
        """
        
        result_dict = self._call_gemini_json(prompt, schema_class=CareerPlanOutput)
        
        if not self.client_configured or "thirty_day_plan" not in result_dict:
            # fallback high quality Career Plan
            return CareerPlanOutput(
                thirty_day_plan=[
                    "Assess all skills and select 2 primary languages (e.g. JavaScript, Python) to master.",
                    "Optimize core sections of your resume (layout, contact parameters, profile summaries).",
                    "Complete a basic tutorial in FastAPI and build your first endpoint returning JSON."
                ],
                ninety_day_plan=[
                    "Build a fully-functional portfolio project combining React/TypeScript front-end with a FastAPI backend.",
                    "Dockerize your portfolio project and deploy it to a free tier platform like Render or Fly.io.",
                    "Clean up GitHub repositories, write comprehensive README.md summaries, and update LinkedIn profile."
                ],
                six_month_roadmap=[
                    "Apply to 5 high-fitting developer matching roles per week.",
                    "Conduct at least 2 mock interview sessions per week focusing on core behavioral and technical topics.",
                    "Contribute to an open-source project or build a secondary niche SaaS app using a new stack."
                ]
            )
            
        return CareerPlanOutput(**result_dict)
