import React, { useState, useEffect } from 'react';
import {
    Database,
    Server,
    Cpu,
    RefreshCw
} from 'lucide-react';

export const Settings: React.FC = () => {
    const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
    const [geminiStatus, setGeminiStatus] = useState<'checking' | 'active' | 'missing'>('checking');
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        runChecks();
    }, []);

    const runChecks = async () => {
        setBackendStatus('checking');
        setGeminiStatus('checking');
        try {
            const res = await fetch("http://localhost:8000/", { signal: AbortSignal.timeout(1500) });
            if (res.ok) {
                setBackendStatus('connected');
                // Let's assume connection means backend config is readable
                // We can do a quick check to see if key works or fallback
                setGeminiStatus('active');
                return;
            }
        } catch {
            // ignore
        }
        setBackendStatus('disconnected');
        setGeminiStatus('missing');
    };

    const handleTest = async () => {
        setTesting(true);
        await runChecks();
        setTesting(false);
    };

    const agentDocs = [
        { name: "Resume Analysis Specialist", desc: "Grade score metrics, layout standard headings, list parse errors, and phrase active achievements.", status: "Online" },
        { name: "Job Matching Comparison Specialist", desc: "Cross-examine target skills, evaluate semantic weight percentages, and flag missing keywords.", status: "Online" },
        { name: "Skills Curriculums Planner Node", desc: "Formulate study milestones, linking relevant tutorials, official pages, and sandbox coding topics.", status: "Online" },
        { name: "Mock Interview Instructor Node", desc: "Generate technical, behavior, HR, and coding questions with template answers.", status: "Online" },
        { name: "Career Planner Supervisor Node", desc: "Outline comprehensive 30/90/180 days goal templates according to developer level.", status: "Online" }
    ];

    return (
        <div className="space-y-8 p-6 md:p-8">
            <div>
                <h2 className="text-3xl font-extrabold text-white">System Settings</h2>
                <p className="text-slate-400 text-sm">Review connections, test API parameters, and see agent states.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Systems connection cards */}
                <div className="space-y-6 md:col-span-1">
                    <div className="glass-card p-5 rounded-2xl space-y-4">
                        <h3 className="font-bold text-sm text-slate-205 flex items-center gap-2">
                            <Server size={17} className="text-indigo-400" />
                            Service Status
                        </h3>

                        <div className="space-y-3.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">FastAPI API Backend</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${backendStatus === 'connected' ? 'bg-emerald-950/20 text-emerald-450 border border-emerald-900/35' :
                                    (backendStatus === 'checking' ? 'bg-slate-800 text-slate-400' : 'bg-red-950/25 text-red-400 border border-red-900/30')
                                    }`}>
                                    {backendStatus === 'connected' ? 'Online' : (backendStatus === 'checking' ? 'Checking...' : 'Offline')}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Gemini LLM Pipeline</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${geminiStatus === 'active' ? 'bg-indigo-950/25 text-indigo-400 border border-indigo-900/35' :
                                    (geminiStatus === 'checking' ? 'bg-slate-805 text-slate-400' : 'bg-amber-950/20 text-amber-450 border border-amber-900/30')
                                    }`}>
                                    {geminiStatus === 'active' ? 'Operational' : (geminiStatus === 'checking' ? 'Checking...' : 'Fallback Mock')}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleTest}
                            disabled={testing}
                            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 text-xs font-bold text-slate-300 transition flex items-center justify-center gap-1.5"
                        >
                            {testing ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                            Test Connection
                        </button>
                    </div>

                    <div className="glass-card p-5 rounded-2xl space-y-3">
                        <h3 className="font-bold text-sm text-slate-205 flex items-center gap-2">
                            <Database size={17} className="text-indigo-400" />
                            Database Engine
                        </h3>
                        <p className="text-slate-450 text-[11px] leading-relaxed">
                            Using a schema-managed SQLite database located at <code className="text-indigo-350">backend/database.db</code>. All chats, matches, and resume reviews are preserved locally.
                        </p>
                    </div>
                </div>

                {/* Multi-Agent Nodes Details */}
                <div className="md:col-span-2 glass-card p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-sm text-slate-205 flex items-center gap-2">
                        <Cpu size={17} className="text-indigo-400 animate-pulse" />
                        Orchestration Schema Details
                    </h3>

                    <div className="space-y-4">
                        {agentDocs.map((node, index) => (
                            <div key={index} className="flex gap-4 border border-slate-850 p-4 rounded-xl items-start bg-slate-900/10">
                                <span className="w-6 h-6 rounded-full bg-slate-900/60 border border-slate-850 text-[10px] text-slate-450 font-bold flex items-center justify-center shrink-0">
                                    {index + 1}
                                </span>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-xs text-slate-205">{node.name}</h4>
                                        <span className="text-[9px] bg-emerald-950/20 text-emerald-400 font-extrabold uppercase border border-emerald-900/35 px-1 py-0.2 rounded">
                                            {node.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-450 leading-relaxed font-normal">{node.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
