
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import VibeStudio from './components/VibeStudio';
import Scheduler from './components/Scheduler';
import Ideation from './components/Ideation';
import CollabConnect from './components/CollabConnect';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { View, UserRole } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('creator');
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const handleLogin = (role: UserRole) => {
      setUserRole(role);
      setIsLoggedIn(true);
      // If admin, default to admin panel
      if (role === 'admin') {
          setCurrentView(View.ADMIN);
      } else {
          setCurrentView(View.DASHBOARD);
      }
  };

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
      case View.ADMIN:
        return <AdminPanel />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900 animate-fade-in">
      <Navigation currentView={currentView} setView={setCurrentView} role={userRole} />
      <main className="flex-1 overflow-y-auto relative w-full">
        {/* Mobile Header */}
        <div className={`md:hidden p-4 flex justify-between items-center border-b sticky top-0 z-10 ${userRole === 'admin' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-200'}`}>
            <h1 className={`text-xl font-bold ${userRole === 'admin' ? 'text-indigo-400' : 'text-brand-pink'}`}>CampusCreator</h1>
            <div className={`w-8 h-8 rounded-full ${userRole === 'admin' ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
        </div>
        
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
