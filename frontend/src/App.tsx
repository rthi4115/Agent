import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { ResumeAnalysis } from './pages/ResumeAnalysis';
import { JobMatch } from './pages/JobMatch';
import { Roadmap } from './pages/Roadmap';
import { Interview } from './pages/Interview';
import { Chat } from './pages/Chat';
import { Settings } from './pages/Settings';
import { apiClient } from './utils/api';
import type { JobMatchResult } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [selectedResumeName, setSelectedResumeName] = useState<string | null>(null);
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Sync selected resume name when selectedResumeId changes
  useEffect(() => {
    if (selectedResumeId) {
      apiClient.getResume(selectedResumeId)
        .then(details => setSelectedResumeName(details.filename))
        .catch(() => setSelectedResumeName(`Resume Profile #${selectedResumeId}`));
    } else {
      setSelectedResumeName(null);
      setJobMatchResult(null);
    }
  }, [selectedResumeId]);

  // Handle theme application
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.backgroundColor = '#0B0F19';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#F9FAFB';
    }
  }, [darkMode]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <Landing onStart={() => setActiveTab('dashboard')} />;
      case 'dashboard':
        return (
          <Dashboard
            selectedResumeId={selectedResumeId}
            setSelectedResumeId={setSelectedResumeId}
            setActiveTab={setActiveTab}
            triggerRefresh={refreshTrigger}
          />
        );
      case 'resume':
        return (
          <ResumeAnalysis
            selectedResumeId={selectedResumeId}
            setSelectedResumeId={setSelectedResumeId}
            setActiveTab={setActiveTab}
            setRefreshTrigger={setRefreshTrigger}
          />
        );
      case 'match':
        return (
          <JobMatch
            selectedResumeId={selectedResumeId}
            setActiveTab={setActiveTab}
            setJobMatchResult={setJobMatchResult}
          />
        );
      case 'roadmap':
        return (
          <Roadmap
            selectedResumeId={selectedResumeId}
            jobMatchResult={jobMatchResult}
            setActiveTab={setActiveTab}
          />
        );
      case 'interview':
        return (
          <Interview
            selectedResumeId={selectedResumeId}
            jobMatchResult={jobMatchResult}
            setActiveTab={setActiveTab}
          />
        );
      case 'chat':
        return (
          <Chat
            selectedResumeId={selectedResumeId}
            selectedResumeName={selectedResumeName}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <Landing onStart={() => setActiveTab('dashboard')} />;
    }
  };

  const showSidebar = activeTab !== 'landing';

  return (
    <div className={`min-h-screen text-slate-105 ${darkMode ? 'dark bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      {showSidebar ? (
        <div className="flex">
          {/* Nav Sidebar wrapper */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            selectedResumeName={selectedResumeName}
          />
          {/* Main workspace container */}
          <main className="flex-1 min-h-screen md:pl-64 transition-all duration-300">
            {renderActivePage()}
          </main>
        </div>
      ) : (
        renderActivePage()
      )}
    </div>
  );
}

export default App;
