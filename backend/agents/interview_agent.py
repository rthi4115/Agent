from pydantic import BaseModel, Field
from typing import List
from backend.agents.base_agent import BaseAgent

class QAItem(BaseModel):
    id: int
    question: str
    ideal_answer: str

class InterviewPrepOutput(BaseModel):
    technical: List[QAItem]
    behavioral: List[QAItem]
    hr: List[QAItem]
    coding: List[QAItem]

class InterviewAgent(BaseAgent):
    def __init__(self):
        super().__init__()

    def generate_interview(self, resume_text: str, job_description: str) -> InterviewPrepOutput:
        prompt = f"""
        You are an expert Technical Interviewer.
        Based on the candidate's resume and target job description, generate tailored interview prep questions and ideal answers:
        1. Technical Questions (about candidate's stack and general computer science/software engineering topics)
        2. Behavioral Questions (following STAR method patterns: Situation, Task, Action, Result)
        3. HR Questions (about expectations, team fit, work culture, salary questions)
        4. Coding Questions (algorithmic logic, system design, or domain-specific code tasks)
        
        Resume text:
        {resume_text}
        
        Job Description:
        {job_description}
        
        Generate exactly 3 questions per category.
        Return the result in JSON format conforming to the requested schema.
        """
        
        result_dict = self._call_gemini_json(prompt, schema_class=InterviewPrepOutput)
        
        if not self.client_configured or "technical" not in result_dict:
            # fallback high quality Q&A
            return InterviewPrepOutput(
                technical=[
                    QAItem(
                        id=1,
                        question="Explain how the Event Loop works in JavaScript/Node.js.",
                        ideal_answer="JavaScript uses a single-threaded event loop to handle asynchronous execution. Asynchronous tasks (like fetch or timers) are delegated to browser APIs / Node C++ APIs. Once complete, their callbacks enter the Callback Queue. The Event Loop constantly checks if the Call Stack is empty; if it is, it pushes the first callback from the queue to the stack for execution."
                    ),
                    QAItem(
                        id=2,
                        question="What is the difference between SQL JOINs, specifically INNER vs LEFT JOIN?",
                        ideal_answer="An INNER JOIN returns only rows that have matching values in both tables. A LEFT JOIN returns all rows from the left table, and the matched rows from the right table. If there is no match on the right sides, null values are populated."
                    ),
                    QAItem(
                        id=3,
                        question="What are the key benefits of using FastAPI over Flask?",
                        ideal_answer="FastAPI offers automated OpenAPI generation, out-of-the-box pydantic input validation, asynchronous requests handling using async/await, and superior speed statistics comparable to Go/NodeJS APIs."
                    )
                ],
                behavioral=[
                    QAItem(
                        id=1,
                        question="Tell me about a time you faced a critical bug in production. How did you resolve it?",
                        ideal_answer="Situation: A billing microservice crashed because of a memory leak during high Friday traffic.\nTask: Investigate, patch, and release a fix within 2 hours to avoid transactions dropping.\nAction: Inspected memory heaps using Chrome DevTools, traced it to unclosed DB sessions inside async code, applied dependency-injection cleanup blocks, and ran locally using docker.\nResult: Released the patch in 45 minutes; memory consumption stabilized at 80MB and no database queries timed out."
                    )
                ],
                hr=[
                    QAItem(
                        id=1,
                        question="Why do you want to join our organization?",
                        ideal_answer="I have followed your recent releases in multi-agent collaboration suites. My skills in full-stack architecture and agentic workflows using FastAPI align perfectly with your technical direction, and I want my work to impact developers directly."
                    )
                ],
                coding=[
                    QAItem(
                        id=1,
                        question="Write a function in Python that takes a list of integers and returns the first duplicate element, or -1 if no duplicates exist. What is the time complexity?",
                        ideal_answer="def first_duplicate(nums):\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return num\n        seen.add(num)\n    return -1\n\nThis function runs in O(N) time and utilizes O(N) auxiliary space."
                    )
                ]
            )
            
        return InterviewPrepOutput(**result_dict)
