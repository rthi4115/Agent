import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Layers,
    Award,
    ExternalLink,
    Code,
    Compass,
    Clock,
    Sparkles
} from 'lucide-react';
import { apiClient } from '../utils/api';
import type { SkillsRoadmap } from '../types';

interface RoadmapProps {
    selectedResumeId: number | null;
    jobMatchResult: any | null;
    setActiveTab: (tab: string) => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({
    selectedResumeId,
    jobMatchResult,
    setActiveTab
}) => {
    const [roadmap, setRoadmap] = useState<SkillsRoadmap | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedResumeId && jobMatchResult) {
            loadRoadmap();
        }
    }, [selectedResumeId, jobMatchResult]);

    const loadRoadmap = async () => {
        setLoading(true);
        try {
            const data = await apiClient.generateRoadmap(selectedResumeId!, jobMatchResult.job_match_id);
            setRoadmap(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const levels = [
        { key: 'beginner', label: 'Beginner Milestone', icon: BookOpen, color: 'text-blue-400 border-blue-500/25 bg-blue-950/10' },
        { key: 'intermediate', label: 'Intermediate Milestone', icon: Layers, color: 'text-purple-400 border-purple-500/25 bg-purple-950/10' },
        { key: 'advanced', label: 'Advanced Milestone', icon: Award, color: 'text-emerald-400 border-emerald-500/25 bg-emerald-950/10' }
    ];

    return (
        <div className="space-y-8 p-6 md:p-8">
            <div>
                <h2 className="text-3xl font-extrabold text-white">Skill Upskilling Roadmap</h2>
                <p className="text-slate-400 text-sm">Follow your orchestrated curriculum divided into Beginner, Intermediate, and Advanced milestones, detailing official articles and practice tasks.</p>
            </div>

            {!selectedResumeId || !jobMatchResult ? (
                <div className="glass-card p-10 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
                    <Compass className="w-12 h-12 text-slate-550 mx-auto animate-spin-slow" />
                    <h3 className="font-bold text-slate-350">Job Match Comparison Required</h3>
                    <p className="text-xs text-slate-500">You must execute a Job Match comparison profile first before generating custom learning curricula.</p>
                    <button
                        onClick={() => setActiveTab('match')}
                        className="px-5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-medium text-xs shadow-lg transition"
                    >
                        Go to Job Matcher
                    </button>
                </div>
            ) : loading ? (
                <div className="space-y-6 max-w-3xl mx-auto">
                    <div className="h-44 bg-slate-900/40 rounded-2xl border border-slate-800 animate-pulse" />
                    <div className="h-44 bg-slate-900/40 rounded-2xl border border-slate-800 animate-pulse shadow-md" />
                </div>
            ) : roadmap ? (
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Introductory block */}
                    <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-indigo-400 animate-pulse shrink-0" size={24} />
                            <div>
                                <h3 className="font-bold text-sm text-slate-200">Roadmap Ready</h3>
                                <p className="text-slate-450 text-[10px]">Agents evaluated {jobMatchResult.missing_skills.length} missing skill areas to compute this curriculum.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className="px-4 py-2 bg-slate-900 border border-slate-850 hover:bg-slate-850 rounded-xl text-xs font-bold text-slate-300 transition"
                        >
                            Ask Coach for Study Plan
                        </button>
                    </div>

                    {/* Timeline Milestones */}
                    <div className="relative border-l border-slate-800/80 ml-6 pl-8 space-y-12">
                        {levels.map((lvl) => {
                            const items = roadmap[lvl.key as keyof SkillsRoadmap] || [];
                            const Icon = lvl.icon;

                            if (items.length === 0) return null;

                            return (
                                <div key={lvl.key} className="relative">
                                    {/* Timeline Badge mark */}
                                    <span className="absolute -left-[50px] top-0 flex w-9 h-9 rounded-full bg-slate-950 border border-slate-800 items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-white transition">
                                        <Icon size={16} />
                                    </span>

                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                                            <span className={`px-2.5 py-1 text-[11px] font-extrabold uppercase rounded border ${lvl.color}`}>
                                                {lvl.label}
                                            </span>
                                        </h3>

                                        {/* Timeline items card stream */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {items.map((item, idx) => (
                                                <div key={idx} className="glass-card p-5 rounded-2xl space-y-4 hover:border-slate-700/50 transition">
                                                    <h4 className="font-bold text-sm text-slate-200 flex items-start gap-2">
                                                        <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                                        {item.topic}
                                                    </h4>

                                                    {/* Courses */}
                                                    {item.courses && item.courses.length > 0 && (
                                                        <div className="space-y-1.5">
                                                            <h5 className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Suggested Courses</h5>
                                                            <ul className="space-y-1 text-slate-400 text-xs">
                                                                {item.courses.map((course, cIdx) => (
                                                                    <li key={cIdx} className="flex items-center gap-1.5 hover:text-indigo-400 transition cursor-pointer">
                                                                        <BookOpen size={11} className="shrink-0 text-slate-500" />
                                                                        <span>{course}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Documentation */}
                                                    {item.documentation && item.documentation.length > 0 && (
                                                        <div className="space-y-1.5">
                                                            <h5 className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Official Documentation</h5>
                                                            <ul className="space-y-1 text-slate-400 text-xs">
                                                                {item.documentation.map((doc, dIdx) => (
                                                                    <li key={dIdx} className="flex items-center gap-1.5 hover:text-indigo-405 transition">
                                                                        <ExternalLink size={11} className="shrink-0 text-indigo-400" />
                                                                        <span className="truncate">{doc}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Practice Ideas */}
                                                    {item.practice_ideas && item.practice_ideas.length > 0 && (
                                                        <div className="space-y-1.5 bg-slate-900/30 border border-slate-850 p-3 rounded-xl">
                                                            <h5 className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                                                                <Code size={11} /> Coding Practice
                                                            </h5>
                                                            <ul className="space-y-1 text-slate-350 text-xs">
                                                                {item.practice_ideas.map((prac, pIdx) => (
                                                                    <li key={pIdx} className="flex items-start gap-1">
                                                                        <span className="text-[10px] text-emerald-400 italic">▶</span>
                                                                        <span>{prac}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 text-slate-500">
                    No upskilling roadmaps generated yet.
                </div>
            )}
        </div>
    );
};
