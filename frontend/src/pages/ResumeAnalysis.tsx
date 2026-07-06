import React, { useRef, useState, useEffect } from 'react';
import {
    UploadCloud,
    AlertTriangle,
    ArrowRight,
    RefreshCw,
    Sparkles,
    FileCheck
} from 'lucide-react';
import { apiClient } from '../utils/api';
import type { ResumeSummary } from '../types';

interface ResumeAnalysisProps {
    selectedResumeId: number | null;
    setSelectedResumeId: (id: number) => void;
    setActiveTab: (tab: string) => void;
    setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

export const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({
    selectedResumeId,
    setSelectedResumeId,
    setActiveTab,
    setRefreshTrigger
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [analysisResult, setAnalysisResult] = useState<ResumeSummary | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedResumeId) {
            loadResumeAnalysis(selectedResumeId);
        } else {
            setAnalysisResult(null);
        }
    }, [selectedResumeId]);

    const loadResumeAnalysis = async (id: number) => {
        try {
            const data = await apiClient.getResume(id);
            setAnalysisResult({
                resume_id: data.id,
                filename: data.filename,
                ats_score: data.ats_score,
                summary: data.summary,
                missing_sections: data.missing_sections,
                suggested_improvements: data.suggested_improvements,
                grammar_issues: data.grammar_issues || [
                    "Check for consistent formatting of dates.",
                    "Use strong action verbs like 'Architected' instead of 'Responsible for'."
                ]
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await processFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            await processFileUpload(e.target.files[0]);
        }
    };

    const processFileUpload = async (file: File) => {
        setUploading(true);
        setProgress(15);

        // Simulate upload progress animation
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 85) {
                    clearInterval(interval);
                    return 85;
                }
                return prev + 12;
            });
        }, 150);

        try {
            const result = await apiClient.uploadResume(file);
            clearInterval(interval);
            setProgress(100);

            // small delay to show 100%
            await new Promise(r => setTimeout(r, 450));

            setAnalysisResult(result);
            setSelectedResumeId(result.resume_id);
            setRefreshTrigger(prev => prev + 1);
        } catch (e) {
            alert("Error parsing resume file. Please upload a valid PDF or Text file.");
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const triggerInput = () => {
        fileInputRef.current?.click();
    };

    // SVG Circular Gauge variables
    const score = analysisResult?.ats_score || 0;
    const radius = 60;
    const strokeWidth = 10;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const scoreColor = score >= 80
        ? 'text-emerald-500 stroke-emerald-500'
        : (score >= 60 ? 'text-amber-500 stroke-amber-500' : 'text-red-500 stroke-red-500');

    return (
        <div className="space-y-8 p-6 md:p-8">
            <div>
                <h2 className="text-3xl font-extrabold text-white">ATS Resume Optimizer</h2>
                <p className="text-slate-400 text-sm">Upload your professional resume (PDF/TXT) to evaluate grammar flaws, structures, and total score weight.</p>
            </div>

            {/* Drag & Drop Upload Block */}
            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerInput}
                className={`
          glass-card p-10 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
          ${dragActive ? 'border-indigo-500 bg-indigo-950/10 scale-[0.99]' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/10'}
          ${uploading ? 'pointer-events-none opacity-80' : ''}
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleChange}
                    accept=".pdf,.txt"
                    className="hidden"
                />

                {uploading ? (
                    <div className="space-y-4 w-full max-w-xs">
                        <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
                        <div>
                            <p className="text-xs font-semibold text-slate-200">Analyzing Resume Modules...</p>
                            <p className="text-[10px] text-slate-500 mt-1">Multi-agent parsing: structure, keywords, spelling</p>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="h-full bg-indigo-550 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-650/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-200">Drag & Drop Resume PDF/TXT here</p>
                            <p className="text-xs text-slate-500 mt-1">or click to browse from desktop</p>
                        </div>
                        <div className="text-[10px] text-slate-600 font-medium">Standard PDF format yields superior score accuracy</div>
                    </div>
                )}
            </div>

            {analysisResult && (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left panel: Score Gauge, Summary & Missing Sections */}
                    <div className="space-y-8">
                        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">Score Audit</h3>

                            {/* SVG Ring Gauge */}
                            <div className="relative flex items-center justify-center">
                                <svg className="w-36 h-36 transform -rotate-90">
                                    {/* Background Track */}
                                    <circle
                                        className="stroke-slate-800/80"
                                        fill="transparent"
                                        strokeWidth={strokeWidth}
                                        r={normalizedRadius}
                                        cx="72"
                                        cy="72"
                                    />
                                    {/* Gauge Arc */}
                                    <circle
                                        className={`${scoreColor} transition-all duration-1000 ease-out`}
                                        fill="transparent"
                                        strokeWidth={strokeWidth}
                                        strokeDasharray={circumference + ' ' + circumference}
                                        style={{ strokeDashoffset }}
                                        r={normalizedRadius}
                                        cx="72"
                                        cy="72"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-extrabold text-white">{score}</span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400/80">ATS Score</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-xs text-slate-400">
                                    {score >= 80
                                        ? "✨ Strong profile! Suitable for standard recruiter parsing."
                                        : (score >= 60 ? "⚠️ Decent fit, but requires formatting upgrades." : "❌ Fails basic parsing specifications. Rewrite immediate.")}
                                </p>
                            </div>
                        </div>

                        {/* Profile Overview */}
                        <div className="glass-card p-6 rounded-2xl space-y-4">
                            <h3 className="font-bold text-sm text-slate-200">Candidate Overview Summary</h3>
                            <p className="text-xs text-slate-350 leading-relaxed bg-slate-900/25 border border-slate-800/40 p-4 rounded-xl">
                                {analysisResult.summary}
                            </p>
                        </div>

                        {/* Missing Sections */}
                        <div className="glass-card p-6 rounded-2xl space-y-4">
                            <h3 className="font-bold text-sm text-red-400 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                Missing Core Elements
                            </h3>
                            {analysisResult.missing_sections.length === 0 ? (
                                <p className="text-xs text-emerald-400 font-medium">All standard header/experience sections detected.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {analysisResult.missing_sections.map((item, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-1 rounded bg-red-950/20 border border-red-900/30 text-red-300 text-[10px] font-bold uppercase tracking-wider"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Suggestions & Grammar Fixes */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Suggested Improvements Details */}
                        <div className="glass-card p-6 rounded-2xl space-y-4">
                            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                                <Sparkles size={16} className="text-indigo-400" />
                                Rewrite Suggestions & Target Improvements
                            </h3>

                            <div className="space-y-4">
                                {analysisResult.suggested_improvements.length === 0 ? (
                                    <p className="text-xs text-slate-500">No suggestions compiled.</p>
                                ) : (
                                    analysisResult.suggested_improvements.map((item, idx) => (
                                        <div key={idx} className="border border-slate-800/60 p-4 rounded-xl space-y-2 bg-slate-900/10">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-extrabold text-indigo-400 uppercase tracking-widest">{item.section}</span>
                                                <span className="text-[10px] text-slate-500 font-medium">Suggestion #{idx + 1}</span>
                                            </div>
                                            <div className="text-xs font-semibold text-slate-200">
                                                Issue: <span className="text-slate-400 font-normal">{item.issue}</span>
                                            </div>
                                            <div className="text-xs font-semibold text-indigo-350">
                                                Action Fix: <span className="text-slate-350 font-normal">{item.suggestion}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Grammar & Language Warnings */}
                        <div className="glass-card p-6 rounded-2xl space-y-4">
                            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                                <FileCheck size={16} className="text-slate-400" />
                                Language & Parsing Warning Notes
                            </h3>
                            <ul className="space-y-2.5">
                                {analysisResult.grammar_issues?.map((issue, idx) => (
                                    <li key={idx} className="flex gap-2.5 text-xs text-slate-400 leading-relaxed align-start">
                                        <span className="text-indigo-400 font-semibold shrink-0">•</span>
                                        <span>{issue}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Sub routing advice footer */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
                            <button
                                onClick={() => setActiveTab('match')}
                                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-850 flex items-center justify-center gap-2 text-xs font-bold text-slate-300 transition duration-200"
                            >
                                Proceed to Job Matcher
                                <ArrowRight size={14} />
                            </button>
                            <button
                                onClick={() => setActiveTab('chat')}
                                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-indigo-650/20 transition duration-200"
                            >
                                Discuss with Coach Chat
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
