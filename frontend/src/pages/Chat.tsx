import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    User,
    Compass,
    RefreshCw,
    Info
} from 'lucide-react';
import { apiClient } from '../utils/api';
import type { ChatMessage } from '../types';

interface ChatProps {
    selectedResumeId: number | null;
    selectedResumeName: string | null;
}

export const Chat: React.FC<ChatProps> = ({
    selectedResumeId,
    selectedResumeName
}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load initial greeting message
        setMessages([
            {
                sender: 'assistant',
                content: `Hello! I am your CareerPilot AI Coach. I have loaded your workspace context. Ask me anything about resume optimizations, how to tailor achievements to your job description, or structuring study timelines for missing skills!`,
                timestamp: new Date().toISOString()
            }
        ]);
        scrollToBottom();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || loading) return;

        const userText = inputValue;
        setInputValue('');
        setLoading(true);

        // Append user message immediately
        const userMsg: ChatMessage = {
            sender: 'user',
            content: userText,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);

        try {
            const reply = await apiClient.sendChatMessage(
                sessionId,
                userText,
                selectedResumeId || undefined
            );

            const assistantMsg: ChatMessage = {
                sender: 'assistant',
                content: reply,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, assistantMsg]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [
                ...prev,
                {
                    sender: 'assistant',
                    content: "Sorry, I am currently facing network connection issues communicating with the backend. Please check if your FastAPI server is active.",
                    timestamp: new Date().toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] p-6 md:p-8 flex flex-col space-y-6">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-white">Career Coach Chat</h2>
                    <p className="text-slate-400 text-sm">Discuss upskilling options, draft ATS cover letters, and review portfolio outlines.</p>
                </div>

                {selectedResumeName ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-900/35 text-xs text-indigo-400 font-semibold max-w-xs truncate shadow-sm">
                        <Info size={13} className="shrink-0" />
                        <span className="truncate">Context: {selectedResumeName}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/20 border border-amber-900/30 text-xs text-amber-400 font-semibold max-w-xs shadow-sm">
                        <Info size={13} className="shrink-0" />
                        <span>No Active Resume Context loaded</span>
                    </div>
                )}
            </div>

            {/* Chat Messages Panel */}
            <div className="flex-1 bg-slate-900/15 border border-slate-850/80 rounded-2xl p-6 flex flex-col space-y-4 overflow-y-auto max-h-[calc(100vh-19rem)] relative">
                <div className="space-y-4 flex-1">
                    {messages.map((msg, idx) => {
                        const isUser = msg.sender === 'user';
                        return (
                            <div
                                key={idx}
                                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                            >
                                {/* Avatar */}
                                <span className={`
                  w-8 h-8 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold
                  ${isUser
                                        ? 'bg-blue-600/10 border-blue-500/25 text-blue-400'
                                        : 'bg-indigo-600/10 border-indigo-500/25 text-indigo-400'
                                    }
                `}>
                                    {isUser ? <User size={13} /> : <Compass size={13} className="animate-spin-slow" />}
                                </span>

                                {/* Message Bubble */}
                                <div className={`
                  p-4 rounded-2xl text-xs leading-relaxed font-normal whitespace-pre-wrap
                  ${isUser
                                        ? 'bg-gradient-to-r from-blue-700/80 to-blue-600/80 text-white rounded-tr-none'
                                        : 'glass-card text-slate-205 rounded-tl-none border border-slate-800/80'
                                    }
                `}>
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })}

                    {loading && (
                        <div className="flex gap-3 max-w-md mr-auto">
                            <span className="w-8 h-8 rounded-full bg-indigo-600/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center shrink-0">
                                <Compass size={13} className="animate-spin" />
                            </span>
                            <div className="glass-card p-4 rounded-2xl rounded-tl-none text-xs text-slate-500 font-semibold italic flex items-center gap-1.5">
                                <RefreshCw size={12} className="animate-spin" />
                                Coach is typing advice...
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Form Box */}
            <form onSubmit={handleSend} className="flex gap-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask a question (e.g. 'How can I rewrite my summary to target Docker skills?')..."
                    className="flex-1 p-4 text-xs glass-input rounded-xl focus:border-indigo-400"
                    required
                />
                <button
                    type="submit"
                    disabled={loading || !inputValue.trim()}
                    className="px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition flex items-center justify-center shadow-lg shadow-indigo-650/15 disabled:opacity-40 disabled:pointer-events-none"
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};
