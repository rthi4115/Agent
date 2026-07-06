# 🎯 CareerPilot AI — Multi-Agent Career Coaching Platform

<div align="left">
  <img src="https://img.shields.io/badge/CareerPilot--AI-Multi--Agent%20Career%20Coach-blueviolet?style=for-the-badge" alt="CareerPilot AI" />
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status Active" />
  <img src="https://img.shields.io/badge/Tech%20Stack-React%2019%20%7C%20Vite%20%7C%20FastAPI%20%7C%20SQLite-blue?style=for-the-badge" alt="Tech Stack" />
  <img src="https://img.shields.io/badge/AI-Gemini%201.5%20Flash-orange?style=for-the-badge" alt="AI Agent Pipeline" />
</div>

---

**CareerPilot AI** is an advanced, production-ready career development platform that automates candidate profiling, resume optimization, job-to-resume matching, skill assessment, custom learning curriculum roadmaps, and adaptive mock interview training. Driven by a cooperative network of **Google Gemini 1.5 Flash** agent nodes, it empowers candidates with the exact steps required to land their dream software engineering roles.

## 🚀 Key Features

*   **ATS Resume Optimizer & Parser**: Reads PDF and plain text formats, analyzes formatting gaps, spelling/grammar inconsistencies, and scores your ATS compatibility out of `100`.
*   **Recruiter Job Matcher**: Scores how well your qualifications align with pasted descriptions, highlighting missing keywords, critical skill gaps, and custom optimizations.
*   **Dynamic Learning Timeline**: Auto-curates targeted courses, official API tutorials, and sandboxed coding challenges segmented by Beginner, Intermediate, and Advanced milestones.
*   **Interview Coach Simulator**: Interactive training simulator offering behavioral, coding, HR, and technical logic questions tailored specifically to your resume and target role.
*   **Interactive Advisor (Coach Chat)**: Pre-loaded with contextual memory of your profile to offer immediate guidance, query feedback, and resume assistance.

---

## 🛠️ Technological Stack

*   **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Framer Motion (Transitions), Recharts (Skills Radar, Action metrics)
*   **Backend**: FastAPI, SQLAlchemy ORM (SQLite engine), Google Generative AI Python SDK, PyPDF (Text extracting)
*   **Deployment**: Docker containerization (Nginx SPA proxy, multi-stage backend wrapper), Docker Compose orchestration

---

## 🏗️ Folder Structure

```text
/agent
├── backend/
│   ├── agents/          # Cooperative AI Agent Modules (BaseAgent, Resume Agent, Job Agent...)
│   ├── database/        # SQLite Database models and session factories
│   ├── uploads/         # Raw uploaded resume repository (.gitkept)
│   ├── reports/         # Dynamic PDF Report generator outputs (.gitkept)
│   ├── config.py        # Environmental variables configurations
│   ├── main.py          # FastAPI application definitions & endpoints
│   └── requirements.txt # Python dependency file
├── frontend/
│   ├── src/
│   │   ├── components/  # Layout sidebars, settings badges, and loading views
│   │   ├── pages/       # Dashboard, Optimizer, Matcher, Roadmap, Trainer panels
│   │   ├── types.ts     # System-wide static typing interfaces
│   │   └── main.tsx     # SPA React Entry points
│   └── Dockerfile       # Nginx multi-stage client builder
└── docker-compose.yml   # Multi-service network orchestration
```

---

## ⚙️ Running Locally

### Prerequisites
*   A valid **Google Gemini API Key** (placed in `backend/.env`).

### Quick Start (Development)

1.  **Start the Backend**:
    ```bash
    cd backend
    pip install -r requirements.txt
    python -m uvicorn main:app --reload --port 8000
    ```

2.  **Start the Frontend**:
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```
    Access the system cockpit dashboard on: `http://localhost:5173/`

### Production Run (Docker Compose)
Run the entire server stack locally with a single command:
```bash
docker-compose up --build
```
This serves the client statically through Nginx on port `80` web sockets, proxies backend queries to FastAPI, and launches a self-contained environment.
