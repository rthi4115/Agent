from pydantic import BaseModel, Field
from typing import List
from backend.agents.base_agent import BaseAgent

class RoadmapItem(BaseModel):
    topic: str
    courses: List[str] = Field(description="Name and platform of recommended courses, e.g. ['Coursera - Python for Everybody']")
    documentation: List[str] = Field(description="Official documentation and tutorial links")
    practice_ideas: List[str] = Field(description="Practical projects or code challenges to write")

class SkillGapOutput(BaseModel):
    beginner: List[RoadmapItem]
    intermediate: List[RoadmapItem]
    advanced: List[RoadmapItem]

class SkillGapAgent(BaseAgent):
    def __init__(self):
        super().__init__()

    def generate_roadmap(self, missing_skills: List[str]) -> SkillGapOutput:
        skills_str = ", ".join(missing_skills) if missing_skills else "General Web Development and AI"
        prompt = f"""
        You are an expert Technical Curriculum Developer.
        Create a detailed learning roadmap for a student missing these technologies: {skills_str}.
        Organize the roadmap into Beginner, Intermediate, and Advanced milestones.
        For each milestone, provide concrete topics, specific recommended courses (with platform names), official documentation resources, and hands-on practice ideas.
        
        Return the result in JSON format conforming to the requested schema.
        """
        
        result_dict = self._call_gemini_json(prompt, schema_class=SkillGapOutput)
        
        if not self.client_configured or "beginner" not in result_dict:
            # high quality mock roadmap
            return SkillGapOutput(
                beginner=[
                    RoadmapItem(
                        topic="FastAPI Basics / Web API Principles",
                        courses=["FastAPI - Build Web APIs from Scratch (Udemy)", "Python FastAPI Tutorial (YouTube)"],
                        documentation=["FastAPI Official Documentation (https://fastapi.tiangolo.com/)"],
                        practice_ideas=["Create a basic CRUD API for a bookstore with JSON endpoints."]
                    ),
                    RoadmapItem(
                        topic="TypeScript Syntax & Setup",
                        courses=["TypeScript Beginners Guide (Codecademy)", "Understanding TypeScript (Udemy)"],
                        documentation=["TypeScript Handbook (https://www.typescriptlang.org/docs/)"],
                        practice_ideas=["Convert an existing JS script to TypeScript, configuring tsconfig.json."]
                    )
                ],
                intermediate=[
                    RoadmapItem(
                        topic="Docker Containerization and Docker Compose",
                        courses=["Docker and Kubernetes: The Complete Guide (Udemy)"],
                        documentation=["Docker Get Started (https://docs.docker.com/get-started/)"],
                        practice_ideas=["Create a Dockerfile for the FastAPI app and set up a docker-compose.yml with SQLite."]
                    ),
                    RoadmapItem(
                        topic="Advanced React, Redux, and TailwindCSS",
                        courses=["React Front To Back (Udemy)", "Tailwind Play (YouTube)"],
                        documentation=["React Docs (https://react.dev/)", "Tailwind CSS Docs (https://tailwindcss.com/docs)"],
                        practice_ideas=["Create a fully responsive dashboard using Tailwind and Framer Motion for pagination."]
                    )
                ],
                advanced=[
                    RoadmapItem(
                        topic="Multi-Agent Systems & LangChain/LangGraph",
                        courses=["LlamaIndex / LangChain Course (DeepLearning.AI)"],
                        documentation=["LangGraph Guides (https://langchain-ai.github.io/langgraph/)"],
                        practice_ideas=["Build a simple agent router that assigns emails to different subprocessors based on intent."]
                    )
                ]
            )
            
        return SkillGapOutput(**result_dict)
