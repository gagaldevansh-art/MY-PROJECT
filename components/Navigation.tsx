import React from 'react';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: 'fa-home' },
    { id: View.STUDIO, label: 'Vibe Studio', icon: 'fa-wand-magic-sparkles', highlight: true },
    { id: View.COLLAB, label: 'Synergy Match', icon: 'fa-users' },
    { id: View.SCHEDULE, label: 'Schedule', icon: 'fa-calendar-days' },
    { id: View.IDEATION, label: 'Brainstorm', icon: 'fa-lightbulb' },
  ];

  return (
    <div className="w-full md:w-64 bg-white border-r border-gray-200 h-screen flex-shrink-0 flex flex-col fixed md:relative bottom-0 z-50 md:z-auto shadow-top md:shadow-none">
      <div className="p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-brand-pink">CampusCreator</h1>
        <p className="text-xs text-gray-500 mt-1">Empowering Student Voices</p>
      </div>

      <nav className="flex-1 flex md:flex-col justify-around md:justify-start p-2 md:p-4 gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full
              ${currentView === item.id 
                ? 'bg-brand-pink text-white shadow-lg shadow-pink-200' 
                : 'text-gray-600 hover:bg-pink-50 hover:text-brand-dark'}
              ${item.highlight && currentView !== item.id ? 'border-2 border-dashed border-brand-pink/30 bg-pink-50/50' : ''}
            `}
          >
            <i className={`fa-solid ${item.icon} ${currentView === item.id ? 'text-white' : 'text-brand-pink'}`}></i>
            <span className={`font-medium ${currentView === item.id ? '' : 'hidden md:inline'}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 hidden md:block">
        <div className="bg-gradient-to-br from-brand-pink to-brand-dark rounded-xl p-4 text-white">
            <h4 className="font-bold text-sm mb-1">Pro Tip</h4>
            <p className="text-xs opacity-90">Use the Vibe Studio to generate 3 unique angles for every idea.</p>
        </div>
      </div>
    </div>
  );
};

export default Navigation;