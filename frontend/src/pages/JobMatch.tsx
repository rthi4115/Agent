import React, { useState } from 'react';
import {
    Briefcase,
    Sparkles,
    CheckCircle2,
    XOctagon,
    ArrowRight,
    FileSearch,
    Activity
} from 'lucide-react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { apiClient } from '../utils/api';
import type { JobMatchResult } from '../types';

interface JobMatchProps {
    selectedResumeId: number | null;
    setActiveTab: (tab: string) => void;
    setJobMatchResult: (result: JobMatchResult) => void;
}

export const JobMatch: React.FC<JobMatchProps> = ({
    selectedResumeId,
    setActiveTab,
    setJobMatchResult
}) => {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [matching, setMatching] = useState(false);
    const [result, setResult] = useState<JobMatchResult | null>(null);

    const handleMatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedResumeId) {
            alert("Please upload and select a resume profile first!");
            return;
        }
        if (!jobDescription || jobDescription.trim().length < 20) {
            alert("Please paste a detailed job description to ensure matching statistics accuracy.");
            return;
        }

        setMatching(true);
        try {
            const data = await apiClient.matchJob(selectedResumeId, jobTitle, jobDescription);
            setResult(data);
            setJobMatchResult(data); // share globally
        } catch (err) {
            console.error(err);
            alert("Error matching job descriptions. Try again.");
        } finally {
            setMatching(false);
        }
    };

    // Pie chart data representation
    const score = result?.match_percentage || 0;
    const pieData = [
        { name: 'Match', value: score, color: '#2563EB' },
        { name: 'Gap', value: 100 - score, color: '#1E293B' }
    ];

    return (
        <div className="space-y-8 p-6 md:p-8">
            <div>
                <h2 className="text-3xl font-extrabold text-white">Job Matching Evaluator</h2>
                <p className="text-slate-400 text-sm">Input your target job postings and description criteria to simulate recruiter ATS filters and calculate keyword compatibility gaps.</p>
            </div>

            {!selectedResumeId ? (
                <div className="glass-card p-10 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
                    <FileSearch className="w-12 h-12 text-slate-550 mx-auto" />
                    <h3 className="font-bold text-slate-350">No Active Resume Loaded</h3>
                    <p className="text-xs text-slate-500">You must upload and analyze a resume file profile before executing job matching evaluations.</p>
                    <button
                        onClick={() => setActiveTab('resume')}
                        className="px-5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-medium text-xs shadow-lg transition"
                    >
                        Upload Resume
                    </button>
                </div>
            ) : (
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Paste Form (Grid 2/5) */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleMatch} className="glass-card p-6 rounded-2xl space-y-4">
                            <h3 className="font-bold text-sm text-slate-205">Define Job Parameters</h3>

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Target Job Title</label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="e.g. Senior Backend Engineer"
                                    className="w-full p-3 text-xs glass-input rounded-xl focus:border-indigo-400"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Job Description Criteria</label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste complete copy/paste text from job board (requirements, stack, experience metrics)..."
                                    className="w-full h-80 p-3.5 text-xs glass-input rounded-xl resize-none focus:border-indigo-400"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={matching}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                            >
                                {matching ? (
                                    <>
                                        <Activity className="w-4 h-4 animate-spin" />
                                        Executing Comparison...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Verify Match Stats
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Results Display (Grid 3/5) */}
                    <div className="lg:col-span-3 space-y-8">
                        {result ? (
                            <div className="space-y-8">
                                {/* Match Score & Summary */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Recharts Pie Chart Gauge */}
                                    <div className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450 mb-3">JD Alignment</span>
                                        <div className="w-28 h-28 relative flex items-center justify-center">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={36}
                                                        outerRadius={45}
                                                        startAngle={90}
                                                        endAngle={-270}
                                                        dataKey="value"
                                                    >
                                                        <Cell fill="#2563EB" />
                                                        <Cell fill="rgba(255,255,255,0.06)" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute text-xl font-extrabold text-white">{score}%</div>
                                        </div>
                                    </div>

                                    {/* Highlights Summary */}
                                    <div className="md:col-span-2 glass-card p-5 rounded-2xl space-y-3.5">
                                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-450">Competency Statement</h4>
                                        <p className="text-xs text-slate-350 leading-relaxed">
                                            Your profile covers {result.matched_skills.length} standard skill markers requested, representing a {score}% overlap compatibility. Patching the noted keyword omissions will raise ATS filters positioning.
                                        </p>
                                    </div>
                                </div>

                                {/* Side by side skills grids */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Matched Skills */}
                                    <div className="glass-card p-5 rounded-2xl space-y-3">
                                        <h4 className="font-extrabold text-xs text-emerald-400 flex items-center gap-1.5">
                                            <CheckCircle2 size={15} />
                                            Aligned Core Skills ({result.matched_skills.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {result.matched_skills.length === 0 ? (
                                                <span className="text-xs text-slate-500">None detected.</span>
                                            ) : (
                                                result.matched_skills.map((item, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 rounded bg-emerald-950/20 border border-emerald-900/30 text-emerald-350 text-[10px] font-semibold">
                                                        {item}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Missing Skills */}
                                    <div className="glass-card p-5 rounded-2xl space-y-3">
                                        <h4 className="font-extrabold text-xs text-red-400 flex items-center gap-1.5">
                                            <XOctagon size={15} />
                                            Omitted Technologies ({result.missing_skills.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {result.missing_skills.length === 0 ? (
                                                <span className="text-xs text-slate-500">None detected.</span>
                                            ) : (
                                                result.missing_skills.map((item, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 rounded bg-red-950/20 border border-red-900/30 text-red-350 text-[10px] font-semibold">
                                                        {item}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Missing Keywords cloud */}
                                <div className="glass-card p-5 rounded-2xl space-y-3">
                                    <h4 className="font-extrabold text-xs text-indigo-400 uppercase tracking-widest">
                                        Omitted ATS Placement Phrases / Keywords
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missing_keywords.map((word, idx) => (
                                            <span key={idx} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold italic">
                                                "{word}"
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Tips Suggestions page */}
                                <div className="glass-card p-5 rounded-2xl space-y-3.5">
                                    <h4 className="font-extrabold text-xs uppercase tracking-widest text-slate-205 mb-2">Tailoring Suggestions</h4>
                                    <ul className="space-y-2">
                                        {result.suggestions.map((sug, idx) => (
                                            <li key={idx} className="flex gap-2.5 text-xs text-slate-400 leading-relaxed font-medium">
                                                <span className="text-indigo-400 font-bold shrink-0">•</span>
                                                <span>{sug}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Redirect steps */}
                                <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
                                    <button
                                        onClick={() => setActiveTab('roadmap')}
                                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-850 flex items-center justify-center gap-2 text-xs font-bold text-slate-350 transition"
                                    >
                                        Build Upskilling Roadmap
                                        <ArrowRight size={14} />
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('interview')}
                                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white flex items-center justify-center gap-2 text-xs font-bold hover:shadow-lg hover:shadow-indigo-650/15 transition animate-pulse"
                                    >
                                        Prepare Interview Mocks
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] border border-slate-900 border-dashed rounded-2xl flex flex-col justify-center items-center text-center p-6 text-slate-500">
                                <Briefcase className="w-10 h-10 mb-2 text-slate-650" />
                                <p className="text-xs">Paste your target job posting criteria and execute matching comparison analysis.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
