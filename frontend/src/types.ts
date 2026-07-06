export interface ResumeSummary {
    resume_id: number;
    filename: string;
    ats_score: number;
    summary: string;
    missing_sections: string[];
    grammar_issues: string[];
    suggested_improvements: SuggestedImprovement[];
}

export interface SuggestedImprovement {
    section: string;
    issue: string;
    suggestion: string;
}

export interface JobMatchResult {
    job_match_id: number;
    resume_id: number;
    job_title: string;
    match_percentage: number;
    matched_skills: string[];
    missing_skills: string[];
    missing_keywords: string[];
    suggestions: string[];
}

export interface SkillsRoadmap {
    beginner: RoadmapItem[];
    intermediate: RoadmapItem[];
    advanced: RoadmapItem[];
}

export interface RoadmapItem {
    topic: string;
    courses: string[];
    documentation: string[];
    practice_ideas: string[];
}

export interface QAItem {
    id: number;
    question: string;
    ideal_answer: string;
}

export interface InterviewPrepResult {
    technical: QAItem[];
    behavioral: QAItem[];
    hr: QAItem[];
    coding: QAItem[];
}

export interface CareerPlanResult {
    thirty_day_plan: string[];
    ninety_day_plan: string[];
    six_month_roadmap: string[];
}

export interface ChatMessage {
    sender: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface CompactResume {
    id: number;
    filename: string;
    ats_score: number;
    created_at: string;
}
