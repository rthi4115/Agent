import React from 'react';
import { motion } from 'framer-motion';
import {
    Compass,
    ArrowRight,
    CheckCircle,
    FileText,
    Brain,
    TrendingUp,
    HelpCircle,
    Award,
    Briefcase,
    Video,
    MessageSquare
} from 'lucide-react';

interface LandingProps {
    onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants: any = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen text-slate-100 overflow-x-hidden selection:bg-indigo-600">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-0 -z-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

            {/* Modern Navbar */}
            <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900">
                <div className="flex items-center gap-2">
                    <Compass className="w-8 h-8 text-indigo-500 animate-spin-slow" />
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        CareerPilot AI
                    </span>
                </div>
                <button
                    onClick={onStart}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/35 transition duration-200"
                >
                    Initialize Coach
                </button>
            </nav>

            {/* Hero Section */}
            <header className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
                <motion.div
                    className="flex-1 space-y-6 text-center md:text-left"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-400">
                        <Award className="w-3.5 h-3.5" />
                        Kaggle AI Agents Hackathon Capstone
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                        Navigate Your Career with <br className="hidden lg:inline" />
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                            Multi-Agent Intelligence
                        </span>
                    </h1>
                    <p className="text-md sm:text-lg text-slate-400 max-w-xl mx-auto md:mx-0 leading-relaxed">
                        Upload your resume, paste job descriptions, and let an orchestrated network of five dedicated AI agents analyze scores, craft roadmaps, and prep mock questions.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                        <button
                            onClick={onStart}
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold flex items-center justify-center gap-2 group shadow-lg shadow-indigo-650/40 transition duration-200"
                        >
                            Start Free Evaluation
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition" />
                        </button>
                        <a
                            href="#how-it-works"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white font-medium border border-slate-850 text-center transition duration-200"
                        >
                            See Architecture
                        </a>
                    </div>
                </motion.div>

                {/* Hero Vector Graphic */}
                <motion.div
                    className="flex-1 w-full max-w-lg"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="relative glass-panel rounded-3xl p-8 shadow-2xl shadow-indigo-500/5 aspect-square flex flex-col justify-between">
                        <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl">
                            <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-blue-500" />
                                <div>
                                    <div className="text-xs font-semibold text-slate-400">ATS Profile Scanner</div>
                                    <div className="h-2 w-32 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                                        <div className="h-full bg-blue-500 width-[78%] animate-pulse" style={{ width: '78%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-blue-400">78%</span>
                        </div>

                        <div className="flex gap-4 justify-center items-center my-6">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <Brain className="w-8 h-8" />
                            </div>
                            <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
                            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                <Briefcase className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl">
                            <div className="flex justify-between text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">
                                <span>Orchestrated Roadmap Plan</span>
                                <span>Active</span>
                            </div>
                            <ul className="text-xs text-slate-300 space-y-1.5">
                                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Day 1-30: Patch Docker & TS Gaps</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Day 31-90: Build FastAPI Dashboard</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Statistics Section */}
            <section className="bg-slate-950/60 border-y border-slate-900 py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-extrabold text-white">5</div>
                        <div className="text-xs text-slate-550 font-semibold tracking-wider uppercase mt-1">AI Agents Orchestrated</div>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-white">70%+</div>
                        <div className="text-xs text-slate-550 font-semibold tracking-wider uppercase mt-1">Average ATS Boost</div>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-white">&lt; 3 Sec</div>
                        <div className="text-xs text-slate-550 font-semibold tracking-wider uppercase mt-1">Review Processing Time</div>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-white">100%</div>
                        <div className="text-xs text-slate-550 font-semibold tracking-wider uppercase mt-1">Structured Outputs</div>
                    </div>
                </div>
            </section>

            {/* Feature Cards Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-extrabold">Professional Network of Specialized Agents</h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm">
                        Unlike unified LLM dialogs, CareerPilot segregates pipeline tasks to professional nodes generating structured JSON objects.
                    </p>
                </div>

                <motion.div
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Agent 1 */}
                    <motion.div className="glass-card hover:bg-slate-900/60 p-6 rounded-2xl space-y-4 hover:-translate-y-1 transition duration-200" variants={itemVariants}>
                        <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">1. Resume Analysis Agent</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Scans profile markdown layouts, grades templates against ATS parsing specifications, filters passive phrasing, and highlights missing standards.
                        </p>
                    </motion.div>

                    {/* Agent 2 */}
                    <motion.div className="glass-card hover:bg-slate-900/60 p-6 rounded-2xl space-y-4 hover:-translate-y-1 transition duration-200" variants={itemVariants}>
                        <div className="w-12 h-12 bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">2. Job Match Agent</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Cross-references job description semantic requirements and highlights missing technology tags, phrases, and keyword matches.
                        </p>
                    </motion.div>

                    {/* Agent 3 */}
                    <motion.div className="glass-card hover:bg-slate-900/60 p-6 rounded-2xl space-y-4 hover:-translate-y-1 transition duration-200" variants={itemVariants}>
                        <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">3. Skill Gap Agent</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Generates targeted upskilling curricula divided into Beginner, Intermediate, and Advanced lanes containing courses, docs, and project topics.
                        </p>
                    </motion.div>

                    {/* Agent 4 */}
                    <motion.div className="glass-card hover:bg-slate-900/60 p-6 rounded-2xl space-y-4 hover:-translate-y-1 transition duration-200" variants={itemVariants}>
                        <div className="w-12 h-12 bg-orange-600/10 border border-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center">
                            <Video className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">4. Interview Prep Agent</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Extracts target specifications and designs tailored Tech, Behavioral, HR, and coding questions alongside ideal response outlines.
                        </p>
                    </motion.div>

                    {/* Agent 5 */}
                    <motion.div className="glass-card hover:bg-slate-900/60 p-6 rounded-2xl space-y-4 hover:-translate-y-1 transition duration-200" variants={itemVariants}>
                        <div className="w-12 h-12 bg-pink-600/10 border border-pink-500/20 text-pink-400 rounded-xl flex items-center justify-center">
                            <Compass className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">5. Career Planner Agent</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Formulates structured 30-day, 90-day, and 180-day career roadmap action items centered on the candidate's long-term milestone goals.
                        </p>
                    </motion.div>

                    {/* Chat Integration */}
                    <motion.div className="glass-card hover:bg-slate-900/60 p-6 rounded-2xl space-y-4 hover:-translate-y-1 transition duration-200" variants={itemVariants}>
                        <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Advisor Interactive Coach</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Conversational dashboard chat with active file contexts and historical memory to clarify roadmap structures and rewrite achievements.
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* How It Works (Workflow / Architecture Description) */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">How CareerPilot AI System Works</h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm">Design architecture layout orchestrating AI Agents.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-3 relative">
                        <span className="text-5xl font-extrabold text-slate-800">01</span>
                        <h3 className="font-bold text-lg">Analyze Resume</h3>
                        <p className="text-slate-400 text-xs">Upload your resume. Our parsing pipeline extracts data representing skills, positions, and formatting scores, saving profiles in the SQLite database.</p>
                    </div>
                    <div className="space-y-3 relative">
                        <span className="text-5xl font-extrabold text-slate-800">02</span>
                        <h3 className="font-bold text-lg">Compare Target Description</h3>
                        <p className="text-slate-400 text-xs">Input JD details. Job matching agents extract essential keywords, calculate skill alignment gaps, and pinpoint missing parameters.</p>
                    </div>
                    <div className="space-y-3 relative">
                        <span className="text-5xl font-extrabold text-slate-800">03</span>
                        <h3 className="font-bold text-lg">Generate Roadmap & Prepare</h3>
                        <p className="text-slate-400 text-xs">Get intermediate curriculums and customized questions. Interact with the chat coach, then download compiled resume reports instantly.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-slate-950/40 border-y border-slate-900 py-20">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    <h2 className="text-3xl font-bold text-center">User Success Stories</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass-card p-6 rounded-2xl space-y-4">
                            <p className="text-slate-300 italic text-sm">
                                "The Skill Gap Agent generated a curriculum that fit my missing Docker and FastAPI needs perfectly. Landed a Junior Cloud role within two months. Highly recommended!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 font-bold">
                                    SK
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">Siddharth Kumar</h4>
                                    <p className="text-xs text-slate-400">Junior Django Developer</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl space-y-4">
                            <p className="text-slate-300 italic text-sm">
                                "We matched our student resumes with custom agency JDs. CareerPilot saved our college graduates hours in tailoring descriptions and practicing behavioral Qs."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-605/30 flex items-center justify-center text-blue-400 font-bold">
                                    AM
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">Aarthi G.</h4>
                                    <p className="text-xs text-slate-400">Career Placement coordinator</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="max-w-4xl mx-auto px-6 py-20 space-y-12">
                <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    <div className="glass-card p-5 rounded-xl space-y-2">
                        <h4 className="font-bold flex items-center gap-2 text-sm text-indigo-400">
                            <HelpCircle className="w-4 h-4 shrink-0" /> How does it differ from standard ChatGPT?
                        </h4>
                        <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                            Standard chatbots try to handle multiple instructions in one buffer memory which makes responses generic. CareerPilot divides tasks between specialized nodes that write structured outputs, enabling tailored timelines and dedicated interview mocks.
                        </p>
                    </div>
                    <div className="glass-card p-5 rounded-xl space-y-2">
                        <h4 className="font-bold flex items-center gap-2 text-sm text-indigo-400">
                            <HelpCircle className="w-4 h-4 shrink-0" /> Can I run it fully locally?
                        </h4>
                        <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                            Yes. CareerPilot supports SQLite database logging and can execute fully locally using Docker Compose, integrating custom Gemini APIs via environment properties.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-900 py-10 bg-slate-950/60">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-bold text-slate-300">CareerPilot AI</span>
                    </div>
                    <p className="text-xs text-slate-500">© 2026 CareerPilot AI App. Created for Kaggle Multi-Agent Course. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
