import React, { useEffect, useState } from 'react';
import {
    FileText,
    Award,
    TrendingUp,
    Clock,
    Briefcase,
    Trash2,
    Download,
    AlertCircle
} from 'lucide-react';
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import type { CompactResume } from '../types';
import { apiClient } from '../utils/api';

interface DashboardProps {
    selectedResumeId: number | null;
    setSelectedResumeId: (id: number | null) => void;
    setActiveTab: (tab: string) => void;
    triggerRefresh: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
    selectedResumeId,
    setSelectedResumeId,
    setActiveTab,
    triggerRefresh
}) => {
    const [resumes, setResumes] = useState<CompactResume[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDetails, setSelectedDetails] = useState<any>(null);

    useEffect(() => {
        loadResumes();
    }, [triggerRefresh]);

    useEffect(() => {
        if (selectedResumeId) {
            loadResumeDetails(selectedResumeId);
        } else {
            setSelectedDetails(null);
        }
    }, [selectedResumeId]);

    const loadResumes = async () => {
        setLoading(true);
        const data = await apiClient.getResumes();
        setResumes(data);
        if (data.length > 0 && !selectedResumeId) {
            setSelectedResumeId(data[0].id);
        }
        setLoading(false);
    };

    const loadResumeDetails = async (id: number) => {
        const details = await apiClient.getResume(id);
        setSelectedDetails(details);
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this resume profile?")) {
            await apiClient.deleteResume(id);
            if (selectedResumeId === id) {
                setSelectedResumeId(null);
            }
            loadResumes();
        }
    };

    // Mock Radar Data based on ATS Score
    const radarData = [
        { subject: 'Technical Stack', A: selectedDetails?.ats_score ? Math.min(selectedDetails.ats_score + 5, 95) : 70, B: 90, fullMark: 100 },
        { subject: 'Impact Writing', A: selectedDetails?.ats_score ? Math.max(selectedDetails.ats_score - 10, 50) : 60, B: 90, fullMark: 100 },
        { subject: 'Formatting', A: selectedDetails?.ats_score ? Math.min(selectedDetails.ats_score + 10, 98) : 85, B: 95, fullMark: 100 },
        { subject: 'Completeness', A: selectedDetails?.ats_score ? Math.max(selectedDetails.ats_score - 5, 65) : 75, B: 95, fullMark: 100 },
        { subject: 'Clarity', A: selectedDetails?.ats_score ? Math.min(selectedDetails.ats_score + 8, 95) : 80, B: 90, fullMark: 100 },
    ];

    // Bar Data: Quantifying suggestions by category
    const barData = [
        { name: 'Summary', improvements: selectedDetails?.suggested_improvements?.filter((i: any) => i.section.toLowerCase().includes('summary')).length || 1, color: '#3B82F6' },
        { name: 'Work Exp', improvements: selectedDetails?.suggested_improvements?.filter((i: any) => i.section.toLowerCase().includes('experience') || i.section.toLowerCase().includes('work')).length || 2, color: '#7C3AED' },
        { name: 'Skills', improvements: selectedDetails?.suggested_improvements?.filter((i: any) => i.section.toLowerCase().includes('skills')).length || 1, color: '#10B981' },
        { name: 'Format', improvements: selectedDetails?.missing_sections?.length || 2, color: '#F59E0B' },
    ];

    return (
        <div className="space-y-8 p-6 md:p-8">
            {/* Header Panel */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-white">Career Pilot Dashboard</h2>
                    <p className="text-slate-400 text-sm">Analyze overall profile analytics, manage resumes, and track upskilling checklists.</p>
                </div>
                {selectedResumeId && (
                    <a
                        href={apiClient.getReportDownloadUrl(selectedResumeId)}
                        download
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-650/30 transition duration-200"
                    >
                        <Download size={16} />
                        Download PDF Report
                    </a>
                )}
            </div>

            {loading ? (
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="h-64 bg-slate-900/40 rounded-2xl animate-pulse border border-slate-800" />
                        <div className="h-44 bg-slate-900/40 rounded-2xl animate-pulse border border-slate-800" />
                    </div>
                    <div className="h-96 bg-slate-900/40 rounded-2xl animate-pulse border border-slate-800" />
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Analytics Stream */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stat Cards Row */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="glass-card p-5 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between text-blue-400">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ATS Rating</span>
                                    <Award size={20} />
                                </div>
                                <div className="text-3xl font-extrabold text-white">
                                    {selectedDetails ? `${selectedDetails.ats_score}/100` : '--'}
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-550 transition-all duration-500"
                                        style={{ width: selectedDetails ? `${selectedDetails.ats_score}%` : '0%' }}
                                    />
                                </div>
                            </div>

                            <div className="glass-card p-5 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between text-purple-400">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Layout Issues</span>
                                    <AlertCircle size={20} />
                                </div>
                                <div className="text-3xl font-extrabold text-white">
                                    {selectedDetails ? selectedDetails.suggested_improvements?.length : '--'}
                                </div>
                                <div className="text-[10px] text-slate-450 font-medium">Critical sections requiring edits.</div>
                            </div>

                            <div className="glass-card p-5 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between text-emerald-400">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Missing Elements</span>
                                    <TrendingUp size={20} />
                                </div>
                                <div className="text-3xl font-extrabold text-white">
                                    {selectedDetails ? selectedDetails.missing_sections?.length : '--'}
                                </div>
                                <div className="text-[10px] text-slate-450 font-medium">Keywords/headings omitted.</div>
                            </div>
                        </div>

                        {/* Charts Panel */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Radar Chart */}
                            <div className="glass-card p-5 rounded-2xl space-y-4">
                                <div>
                                    <h3 className="font-bold text-sm text-slate-200">Skills Alignment Matrix</h3>
                                    <p className="text-slate-450 text-[10px]">Scanned layout strengths compared to standard guidelines.</p>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                            <PolarGrid stroke="#374151" />
                                            <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" tick={{ fontSize: 9 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#374151" tick={{ fontSize: 8 }} />
                                            <Radar name="Candidate" dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.35} />
                                            <Radar name="Target Bench" dataKey="B" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} />
                                            <Tooltip contentStyle={{ background: '#1F2937', borderColor: '#374151', color: '#FFF', fontSize: 10 }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div className="glass-card p-5 rounded-2xl space-y-4">
                                <div>
                                    <h3 className="font-bold text-sm text-slate-200">Improvements Count</h3>
                                    <p className="text-slate-450 text-[10px]">Items requiring modifications by category section.</p>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 9 }} />
                                            <YAxis stroke="#9CA3AF" tick={{ fontSize: 9 }} />
                                            <Tooltip contentStyle={{ background: '#1F2937', borderColor: '#374151', color: '#FFF', fontSize: 10 }} />
                                            <Bar dataKey="improvements" fill="#2563EB" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Suggestions Quicklist */}
                        {selectedDetails && (
                            <div className="glass-card p-5 rounded-2xl space-y-4">
                                <h3 className="font-bold text-sm text-slate-200">High-Priority Action Suggestions</h3>
                                <div className="space-y-3">
                                    {selectedDetails.suggested_improvements?.slice(0, 3).map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-3 bg-slate-900/35 border border-slate-800/40 p-3.5 rounded-xl text-xs">
                                            <div className="w-5 h-5 shrink-0 rounded-full bg-indigo-900/40 text-indigo-400 flex items-center justify-center font-bold">
                                                {idx + 1}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="font-bold text-slate-200">{item.section} Section</div>
                                                <div className="font-medium text-slate-300">Issue: <span className="text-slate-400 font-normal">{item.issue}</span></div>
                                                <div className="font-medium text-indigo-305">Fix: <span className="text-slate-350 font-normal">{item.suggestion}</span></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar: Resume Uploads Stream */}
                    <div className="space-y-6">
                        <div className="glass-card p-5 rounded-2xl space-y-4">
                            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                                <FileText className="text-indigo-400" size={17} />
                                Analyses Library ({resumes.length})
                            </h3>

                            {resumes.length === 0 ? (
                                <div className="text-center py-6 text-slate-500 text-xs">
                                    No active profiles scanned yet.
                                    <button
                                        onClick={() => setActiveTab('resume')}
                                        className="block text-indigo-400 font-semibold hover:underline mt-2 mx-auto"
                                    >
                                        Upload Resume
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                                    {resumes.map((r) => {
                                        const isSelected = selectedResumeId === r.id;
                                        return (
                                            <div
                                                key={r.id}
                                                onClick={() => setSelectedResumeId(r.id)}
                                                className={`
                          p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition group
                          ${isSelected
                                                        ? 'bg-indigo-950/20 border-indigo-500/50 shadow-md'
                                                        : 'bg-slate-900/30 border-slate-800/40 hover:border-slate-700/60'
                                                    }
                        `}
                                            >
                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-indigo-400 transition">
                                                        {r.filename}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                                                        <span className="flex items-center gap-1"><Clock size={11} /> {new Date(r.created_at).toLocaleDateString()}</span>
                                                        <span className="font-bold bg-slate-850 px-1.5 py-0.5 rounded text-indigo-450 border border-slate-800/60">ATS {r.ats_score}%</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => handleDelete(r.id, e)}
                                                    className="p-1 px-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-850 transition shrink-0 ml-2"
                                                    title="Delete profile"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <button
                                onClick={() => setActiveTab('resume')}
                                className="w-full py-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 text-xs font-bold text-indigo-400 transition"
                            >
                                + Optimize New Resume
                            </button>
                        </div>

                        {/* Quick Actions Panel */}
                        <div className="glass-card p-5 rounded-2xl space-y-4">
                            <h3 className="font-bold text-xs text-indigo-400 uppercase tracking-widest">Workspace Core Tools</h3>
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <button
                                    onClick={() => setActiveTab('match')}
                                    disabled={!selectedResumeId}
                                    className="p-3.5 rounded-xl bg-slate-900/35 border border-slate-800 hover:border-indigo-900/40 text-xs font-semibold transition text-slate-250 disabled:opacity-40 disabled:pointer-events-none"
                                >
                                    <Briefcase size={16} className="mx-auto mb-1.5 text-blue-400" />
                                    Job Matcher
                                </button>
                                <button
                                    onClick={() => setActiveTab('roadmap')}
                                    disabled={!selectedResumeId}
                                    className="p-3.5 rounded-xl bg-slate-900/35 border border-slate-800 hover:border-indigo-900/40 text-xs font-semibold transition text-slate-250 disabled:opacity-40 disabled:pointer-events-none"
                                >
                                    <TrendingUp size={16} className="mx-auto mb-1.5 text-emerald-400" />
                                    Skill Roadmap
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
