
import React from 'react';
import { View, UserRole } from '../types';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
  role: UserRole;
}

// Added interface to support optional highlight property
interface NavItem {
  id: View;
  label: string;
  icon: string;
  highlight?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, role }) => {
  const creatorItems: NavItem[] = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: 'fa-home' },
    { id: View.STUDIO, label: 'Vibe Studio', icon: 'fa-wand-magic-sparkles', highlight: true },
    { id: View.COLLAB, label: 'Synergy Match', icon: 'fa-users' },
    { id: View.SCHEDULE, label: 'Schedule', icon: 'fa-calendar-days' },
    { id: View.IDEATION, label: 'Brainstorm', icon: 'fa-lightbulb' },
  ];

  const adminItems: NavItem[] = [
    { id: View.ADMIN, label: 'Admin Console', icon: 'fa-gauge-high' },
    { id: View.DASHBOARD, label: 'Student View', icon: 'fa-eye' },
  ];

  const navItems = role === 'admin' ? adminItems : creatorItems;

  return (
    <div className={`w-full md:w-64 border-r border-gray-200 h-screen flex-shrink-0 flex flex-col fixed md:relative bottom-0 z-50 md:z-auto shadow-top md:shadow-none ${role === 'admin' ? 'bg-slate-900 text-white' : 'bg-white'}`}>
      <div className="p-6 hidden md:block">
        <h1 className={`text-2xl font-bold ${role === 'admin' ? 'text-indigo-400' : 'text-brand-pink'}`}>CampusCreator</h1>
        <p className={`text-xs mt-1 ${role === 'admin' ? 'text-slate-400' : 'text-gray-500'}`}>
            {role === 'admin' ? 'System Administration' : 'Empowering Student Voices'}
        </p>
      </div>

      <nav className="flex-1 flex md:flex-col justify-around md:justify-start p-2 md:p-4 gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full
              ${role === 'admin'
                ? (currentView === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white')
                : (currentView === item.id 
                    ? 'bg-brand-pink text-white shadow-lg shadow-pink-200' 
                    : 'text-gray-600 hover:bg-pink-50 hover:text-brand-dark')
              }
              ${item.highlight && currentView !== item.id && role !== 'admin' ? 'border-2 border-dashed border-brand-pink/30 bg-pink-50/50' : ''}
            `}
          >
            <i className={`fa-solid ${item.icon} ${currentView === item.id ? 'text-white' : (role === 'admin' ? 'text-indigo-400' : 'text-brand-pink')}`}></i>
            <span className={`font-medium ${currentView === item.id ? '' : 'hidden md:inline'}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 hidden md:block">
        <div className={`rounded-xl p-4 ${role === 'admin' ? 'bg-slate-800 border border-slate-700' : 'bg-gradient-to-br from-brand-pink to-brand-dark text-white'}`}>
            <h4 className={`font-bold text-sm mb-1 ${role === 'admin' ? 'text-white' : ''}`}>
                {role === 'admin' ? 'System Status' : 'Pro Tip'}
            </h4>
            <p className={`text-xs opacity-90 ${role === 'admin' ? 'text-slate-400' : ''}`}>
                {role === 'admin' ? 'All systems operational. No outages reported.' : 'Use the Vibe Studio to generate 3 unique angles for every idea.'}
            </p>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
