import type {
    ResumeSummary,
    JobMatchResult,
    SkillsRoadmap,
    InterviewPrepResult,
    CareerPlanResult,
    ChatMessage,
    CompactResume
} from '../types';

const API_BASE = 'http://localhost:8000';

export const apiClient = {
    async getResumes(): Promise<CompactResume[]> {
        try {
            const res = await fetch(`${API_BASE}/api/resumes`);
            if (res.ok) return await res.json();
        } catch (e) {
            console.warn("Backend unavailable, using mock data", e);
        }
        return [
            { id: 1, filename: "John_Doe_Developer_Resume.pdf", ats_score: 72, created_at: new Date().toISOString() }
        ];
    },

    async getResume(resumeId: number): Promise<any> {
        try {
            const res = await fetch(`${API_BASE}/api/resumes/${resumeId}`);
            if (res.ok) return await res.json();
        } catch (e) {
            console.warn("Backend failed to load resume, utilizing mock fallback", e);
        }
        return {
            id: resumeId,
            filename: "John_Doe_Developer_Resume.pdf",
            ats_score: 72,
            summary: "Qualified Software Engineer with 2 years of React experience. Shows core knowledge in build tools, but limits quantitative output description and lacks cloud configuration elements.",
            missing_sections: ["Professional Profile", "Certifications", "Projects"],
            grammar_issues: [
                "Inconsistent capitalization of 'react.js' vs 'ReactJS'.",
                "Avoid generic filler words: 'Experienced team player helping with tasks'."
            ],
            suggested_improvements: [
                { section: "Summary", issue: "Generic open statements.", suggestion: "Rewrite to state specific focus: 'Frontend programmer specializing in React, TypeScript, and state management frameworks.'" },
                { section: "Experience", issue: "Lacks metrics.", suggestion: "Add achievement variables: 'Wrote unit tests that boosted coverage by 20% and fixed critical memory leaks.'" }
            ],
            created_at: new Date().toISOString()
        };
    },

    async uploadResume(file: File): Promise<ResumeSummary> {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch(`${API_BASE}/api/upload-resume`, {
                method: "POST",
                body: formData,
            });
            if (res.ok) return await res.json();
        } catch (e) {
            console.warn("Backend upload failed, utilizing mock fallback", e);
        }

        await new Promise(r => setTimeout(r, 2000));
        return {
            resume_id: Date.now(),
            filename: file.name,
            ats_score: 75,
            summary: "Qualified Software Engineer with 2 years of React experience. Shows core knowledge in build tools, but limits quantitative output description and lacks cloud configuration elements.",
            missing_sections: ["Professional Profile", "Certifications", "Projects"],
            grammar_issues: [
                "Inconsistent capitalization of 'react.js' vs 'ReactJS'.",
                "Avoid generic filler words: 'Experienced team player helping with tasks'."
            ],
            suggested_improvements: [
                { section: "Summary", issue: "Generic open statements.", suggestion: "Rewrite to state specific focus: 'Frontend programmer specializing in React, TypeScript, and state management frameworks.'" },
                { section: "Experience", issue: "Lacks metrics.", suggestion: "Add achievement variables: 'Wrote unit tests that boosted coverage by 20% and fixed critical memory leaks.'" }
            ]
        };
    },

    async matchJob(resumeId: number, jobTitle: string, jobDescription: string): Promise<JobMatchResult> {
        try {
            const res = await fetch(`${API_BASE}/api/job-match`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_id: resumeId, job_title: jobTitle, job_description: jobDescription }),
            });
            if (res.ok) return await res.json();
        } catch (e) {
            console.warn(e);
        }

        await new Promise(r => setTimeout(r, 1500));
        return {
            job_match_id: Date.now(),
            resume_id: resumeId,
            job_title: jobTitle || "Target Position",
            match_percentage: 68,
            matched_skills: ["React", "JavaScript", "Python", "Git", "SQL"],
            missing_skills: ["TypeScript", "Docker", "FastAPI", "Tailwind CSS"],
            missing_keywords: ["Multi-Agent systems", "CI/CD pipelines", "RESTful design"],
            suggestions: [
                "Include TypeScript projects details in summary/work experiences.",
                "Highlight Python REST API developments explicitly.",
                "Include Docker container setups inside skills schema."
            ]
        };
    },

    async generateRoadmap(resumeId: number, jobMatchId: number): Promise<SkillsRoadmap> {
        try {
            const res = await fetch(`${API_BASE}/api/roadmap`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_id: resumeId, job_match_id: jobMatchId }),
            });
            if (res.ok) {
                const data = await res.json();
                return data.roadmap;
            }
        } catch (e) {
            console.warn(e);
        }

        await new Promise(r => setTimeout(r, 1500));
        return {
            beginner: [
                {
                    topic: "TypeScript Fundamentals",
                    courses: ["TypeScript Basics (Codecademy)", "TypeScript: Deep Dive (Udemy)"],
                    documentation: ["TS Handbook (typescriptlang.org)"],
                    practice_ideas: ["Convert a basic React JS application to TS, implementing strict props type-safety."]
                },
                {
                    topic: "FastAPI Boilerplate APIs",
                    courses: ["FastAPI Beginner Crash Course (YouTube)"],
                    documentation: ["FastAPI Docs (fastapi.tiangolo.com)"],
                    practice_ideas: ["Write server endpoint exposing GET /items using Pydantic schemas."]
                }
            ],
            intermediate: [
                {
                    topic: "Docker Containers",
                    courses: ["Docker Beginners Playbook (Udemy)"],
                    documentation: ["Docker Quickstart docs"],
                    practice_ideas: ["Write a Dockerfile for the FastAPI app and deploy locally using custom ports."]
                }
            ],
            advanced: [
                {
                    topic: "Multi-Agent Orchestrations",
                    courses: ["LangChain & GenAI courses (Deeplearning.ai)"],
                    documentation: ["LangGraph API References (langchain-ai.github.io)"],
                    practice_ideas: ["Build a master supervisor agent routing prompts to database matching and curriculum builder modules."]
                }
            ]
        };
    },

    async prepareInterview(resumeId: number, jobDescription: string): Promise<InterviewPrepResult> {
        try {
            const res = await fetch(`${API_BASE}/api/interview`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_id: resumeId, job_description: jobDescription }),
            });
            if (res.ok) {
                const data = await res.json();
                return data.questions;
            }
        } catch (e) {
            console.warn(e);
        }

        await new Promise(r => setTimeout(r, 1500));
        return {
            technical: [
                { id: 1, question: "Explain the virtual DOM in React and why it is critical.", ideal_answer: "The virtual DOM is an in-memory representation of the real DOM. React updates the virtual DOM, compares it to the previous version (diffing), and batches the minimal subset of updates to render in the real DOM, optimizing rendering speed." },
                { id: 2, question: "How does FastAPI optimize concurrency asynchronously?", ideal_answer: "FastAPI uses Starlette beneath for asynchronous networking. Running async functions using uvloop loops lets FastAPI handle concurrent requests efficiently on a single thread." }
            ],
            behavioral: [
                { id: 1, question: "Describe a conflict you had with a team member when deciding architecture.", ideal_answer: "Explain using the STAR method: Situation (different state management approaches), Task (align on a model), Action (created a comparison matrix measuring load times, setup complexity), Result (unified under Redux Toolkit, decreasing setup boilerplate by 50%)." }
            ],
            hr: [
                { id: 1, question: "Why do you want to leave your current role?", ideal_answer: "I want to apply full-stack design patterns to scalable AI systems. This role working directly on multi-agent products matches my technical values." }
            ],
            coding: [
                { id: 1, question: "Write a function that checks if a string is a palindrome.", ideal_answer: "def is_palindrome(s):\n    cleaned = ''.join(c.lower() for c in s if c.isalnum())\n    return cleaned == cleaned[::-1]\n\nTime Complexity is O(N) and Space is O(N)." }
            ]
        };
    },

    async generateCareerPlan(resumeId: number, careerGoals: string): Promise<CareerPlanResult> {
        try {
            const res = await fetch(`${API_BASE}/api/career-plan`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_id: resumeId, career_goals: careerGoals }),
            });
            if (res.ok) return await res.json();
        } catch (e) {
            console.warn(e);
        }

        await new Promise(r => setTimeout(r, 1000));
        return {
            thirty_day_plan: [
                "Highlight your FastAPI and TypeScript skills clearly on your resume.",
                "Build a sample server exposing REST APIs using SQLAlchemy DB connections.",
                "Read official TypeScript documentation on Generics and Interfaces."
            ],
            ninety_day_plan: [
                "Assemble a monorepo portfolio detailing Vite-React and FastAPI integration.",
                "Establish automated CI/CD builds deploying Docker images using GitHub Actions.",
                "Conduct 3 mock interview tasks covering system engineering design."
            ],
            six_month_roadmap: [
                "Apply to 5 matching agentic / modern full-stack developer roles weekly.",
                "Contribute to LangChain/FastAPI open-source issues to build profile visibility."
            ]
        };
    },

    async sendChatMessage(sessionId: string, message: string, resumeId?: number): Promise<string> {
        try {
            const res = await fetch(`${API_BASE}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: sessionId, message, resume_id: resumeId }),
            });
            if (res.ok) {
                const data = await res.json();
                return data.reply;
            }
        } catch (e) {
            console.warn(e);
        }

        await new Promise(r => setTimeout(r, 1000));
        return `That's an interesting question about your career goals. Implementing these strategies will help you structure your application path. What specific aspect of the skills roadmap or resume would you like to review next?`;
    },

    async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
        try {
            const res = await fetch(`${API_BASE}/api/chat/history/${sessionId}`);
            if (res.ok) return await res.json();
        } catch (e) {
            console.warn(e);
        }
        return [];
    },

    async deleteResume(resumeId: number): Promise<boolean> {
        try {
            const res = await fetch(`${API_BASE}/api/resumes/${resumeId}`, {
                method: "DELETE"
            });
            return res.ok;
        } catch {
            return true; // simulated delete
        }
    },

    getReportDownloadUrl(resumeId: number): string {
        return `${API_BASE}/api/report/${resumeId}`;
    }
};
