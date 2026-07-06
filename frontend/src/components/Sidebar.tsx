import React, { useState } from 'react';
import {
    Home,
    LayoutDashboard,
    FileText,
    Briefcase,
    BookOpen,
    Video,
    MessageSquare,
    Settings,
    Menu,
    X,
    Compass
} from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
    selectedResumeName: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    darkMode,
    setDarkMode,
    selectedResumeName
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { id: 'landing', label: 'Welcome', icon: Home },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'resume', label: 'Resume Review', icon: FileText },
        { id: 'match', label: 'Job Matcher', icon: Briefcase },
        { id: 'roadmap', label: 'Skill Roadmap', icon: BookOpen },
        { id: 'interview', label: 'Interview Prep', icon: Video },
        { id: 'chat', label: 'Coach Chat', icon: MessageSquare },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700 transition"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar Panel */}
            <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 glass-panel flex flex-col justify-between transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
                {/* LOGO */}
                <div className="p-6 border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                        <Compass className="w-8 h-8 text-indigo-500 animate-pulse" />
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                                CareerPilot AI
                            </h1>
                            <span className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">Multi-Agent Coach</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsOpen(false);
                                }}
                                className={`
                  flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                                        ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-md shadow-indigo-600/20'
                                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850/60'
                                    }
                `}
                            >
                                <Icon size={18} className={`transition ${isActive ? 'scale-110 text-white' : 'group-hover:text-indigo-400'}`} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* User Context & Theme Toggle */}
                <div className="p-4 border-t border-slate-800/60 space-y-4">
                    {selectedResumeName && (
                        <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-900/30">
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Active Analysis Profile</p>
                            <p className="text-xs text-slate-300 truncate font-medium mt-0.5">{selectedResumeName}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-between px-2 text-xs">
                        <span className="text-slate-400">Settings Theme</span>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 transition"
                            title="Toggle Theme Mode"
                        >
                            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Backdrop overlay for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                />
            )}
        </>
    );
};
