
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import VibeStudio from './components/VibeStudio';
import Scheduler from './components/Scheduler';
import Ideation from './components/Ideation';
import CollabConnect from './components/CollabConnect';
import Login from './components/Login';
import { View } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard setView={setCurrentView} />;
      case View.STUDIO:
        return <VibeStudio />;
      case View.SCHEDULE:
        return <Scheduler />;
      case View.IDEATION:
        return <Ideation />;
      case View.COLLAB:
        return <CollabConnect />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900 animate-fade-in">
      <Navigation currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 overflow-y-auto relative w-full">
        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10">
            <h1 className="text-xl font-bold text-brand-pink">CampusCreator</h1>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
        
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
