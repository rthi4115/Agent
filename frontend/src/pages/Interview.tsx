import React, { useState, useEffect } from 'react';
import {
    Video,
    HelpCircle,
    ArrowLeft,
    ArrowRight,
    Sparkles,
    Check
} from 'lucide-react';
import { apiClient } from '../utils/api';
import type { InterviewPrepResult, QAItem } from '../types';

interface InterviewProps {
    selectedResumeId: number | null;
    jobMatchResult: any | null;
    setActiveTab: (tab: string) => void;
}

type CategoryType = 'technical' | 'behavioral' | 'hr' | 'coding';

export const Interview: React.FC<InterviewProps> = ({
    selectedResumeId,
    jobMatchResult,
    setActiveTab
}) => {
    const [data, setData] = useState<InterviewPrepResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState<CategoryType>('technical');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        if (selectedResumeId && jobMatchResult) {
            loadQuestions();
        }
    }, [selectedResumeId, jobMatchResult]);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            const questionsData = await apiClient.prepareInterview(
                selectedResumeId!,
                jobMatchResult?.job_description || "Software Engineer role specs"
            );
            setData(questionsData);
            setCurrentIdx(0);
            setShowAnswer(false);
            setUserAnswer('');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (cat: CategoryType) => {
        setActiveCategory(cat);
        setCurrentIdx(0);
        setShowAnswer(false);
        setUserAnswer('');
    };

    const handleNext = () => {
        const list = data ? data[activeCategory] : [];
        if (currentIdx < list.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setShowAnswer(false);
            setUserAnswer('');
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
            setShowAnswer(false);
            setUserAnswer('');
        }
    };

    const getActiveList = (): QAItem[] => {
        if (!data) return [];
        return data[activeCategory] || [];
    };

    const curList = getActiveList();
    const currentQuestion = curList[currentIdx];

    const categories = [
        { key: 'technical', label: 'Technical' },
        { key: 'behavioral', label: 'Behavioral' },
        { key: 'hr', label: 'HR / Culture' },
        { key: 'coding', label: 'Coding / Logic' }
    ];

    return (
        <div className="space-y-8 p-6 md:p-8">
            <div>
                <h2 className="text-3xl font-extrabold text-white">Interview Simulator</h2>
                <p className="text-slate-400 text-sm">Review potential interview questions tailored to your skills and comparison parameters. Compare answers with ideal response formats.</p>
            </div>

            {!selectedResumeId || !jobMatchResult ? (
                <div className="glass-card p-10 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
                    <Video className="w-12 h-12 text-slate-550 mx-auto" />
                    <h3 className="font-bold text-slate-350">Job Comparison Context Needed</h3>
                    <p className="text-xs text-slate-500">You must execute a Job Match comparison profile first before compiling custom interview decks.</p>
                    <button
                        onClick={() => setActiveTab('match')}
                        className="px-5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-medium text-xs shadow-lg transition"
                    >
                        Match Job
                    </button>
                </div>
            ) : loading ? (
                <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
                    <RefreshCwIcon className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
                    <p className="text-xs text-slate-400">Synthesizing tailor Q&A objects using target JD requirements...</p>
                </div>
            ) : data && currentQuestion ? (
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Category Tabs banner */}
                    <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80 gap-1 overflow-x-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => handleCategoryChange(cat.key as CategoryType)}
                                className={`
                  flex-1 py-2 px-3 text-xs font-semibold rounded-lg text-center whitespace-nowrap transition
                  ${activeCategory === cat.key
                                        ? 'bg-slate-800 text-white font-extrabold shadow'
                                        : 'text-slate-400 hover:text-slate-205 hover:bg-slate-850/60'
                                    }
                `}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Core Simulator Presentation Frame */}
                    <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-slate-700/30">
                        {/* Card progression details */}
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-extrabold text-indigo-400 uppercase tracking-widest">{activeCategory} Question</span>
                            <span className="text-slate-500 font-bold bg-slate-900/60 px-2 py-0.5 rounded-lg">
                                Card {currentIdx + 1} of {curList.length}
                            </span>
                        </div>

                        {/* Question description */}
                        <div className="space-y-3">
                            <h3 className="text-lg md:text-xl font-bold text-slate-100 flex items-start gap-2.5">
                                <HelpCircle className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                                {currentQuestion.question}
                            </h3>
                        </div>

                        {/* Input responder frame */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Draft Your Answer</label>
                            <textarea
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Type your notes or bullet points here to evaluate..."
                                className="w-full h-32 p-3.5 text-xs glass-input rounded-xl resize-none focus:border-indigo-400"
                            />
                        </div>

                        {/* Actions panel */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            {/* Pagination indicators */}
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentIdx === 0}
                                    className="flex-1 sm:flex-initial p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-350 disabled:opacity-30 transition"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={currentIdx === curList.length - 1}
                                    className="flex-1 sm:flex-initial p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-350 disabled:opacity-30 transition"
                                >
                                    <ArrowRight size={16} />
                                </button>
                            </div>

                            {/* Action trigger */}
                            <button
                                onClick={() => setShowAnswer(!showAnswer)}
                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-505 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-1.5"
                            >
                                {showAnswer ? "Hide Coach Answer" : "Reveal Ideal Answer"}
                            </button>
                        </div>

                        {/* Reveal block */}
                        {showAnswer && (
                            <div className="border-t border-slate-800/80 pt-6 space-y-4 animate-fade-in">
                                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                                    <Sparkles size={14} className="animate-pulse" />
                                    Coach Ideal Answer Guidance
                                </div>
                                <div className="bg-slate-900/35 border border-slate-800/40 p-4 rounded-xl text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                                    {currentQuestion.ideal_answer}
                                </div>

                                {userAnswer.trim().length > 5 && (
                                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/20 flex gap-2">
                                        <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Submit selfcheck</h4>
                                            <p className="text-[11px] text-slate-400 font-medium">Excellent study practice. Review how your answer maps to our core bullets above to refine your STAR method metrics.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 text-slate-500">
                    No questions populated.
                </div>
            )}
        </div>
    );
};

// Simple spinner component since refresh icons are required
const RefreshCwIcon = ({ className }: { className?: string }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    );
};
