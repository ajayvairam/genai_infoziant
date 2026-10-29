import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { WorkspacePage } from './pages/WorkspacePage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { SampleLibraryPage } from './pages/SampleLibraryPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [activeSample, setActiveSample] = useState(null);

  const handleNewAnalysis = () => {
    setActiveSample(null);
    setActiveTab('workspace');
  };

  const handleLoadSampleFromLibrary = (sample) => {
    setActiveSample(sample);
    setActiveTab('workspace');
  };

  const handleSelectHistoryItem = (item) => {
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar onNewAnalysis={handleNewAnalysis} />

      {/* Main Body with Sidebar + Workspace/Page */}
      <div className="flex-1 flex flex-col md:flex-row w-full mx-auto max-w-7xl">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Dynamic Main Workspace Page */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {activeTab === 'workspace' && (
            <WorkspacePage key={activeSample ? activeSample.id : 'empty-workspace'} initialSample={activeSample} />
          )}

          {activeTab === 'dashboard' && (
            <DashboardPage
              onNavigateToWorkspace={handleNewAnalysis}
              onSelectHistoryItem={handleSelectHistoryItem}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPage />
          )}

          {activeTab === 'samples' && (
            <SampleLibraryPage onLoadSample={handleLoadSampleFromLibrary} />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NotificationProvider>
  );
}

