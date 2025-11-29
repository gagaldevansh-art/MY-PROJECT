import React from 'react';
import { View } from '../types';

interface DashboardProps {
    setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Hello, Creator 👋</h2>
        <p className="text-gray-500">You have 2 posts scheduled for this week.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Action: Create */}
        <div 
            onClick={() => setView(View.STUDIO)}
            className="bg-brand-pink text-white rounded-2xl p-6 cursor-pointer transform hover:-translate-y-1 transition-all shadow-lg shadow-pink-200 group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                    <i className="fa-solid fa-plus text-xl"></i>
                </div>
                <i className="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </div>
            <h3 className="text-xl font-bold mb-1">Create New Post</h3>
            <p className="text-pink-100 text-sm">Use the Vibe Studio to generate content.</p>
        </div>

        {/* Quick Action: Ideas */}
        <div 
            onClick={() => setView(View.IDEATION)}
            className="bg-white text-gray-800 rounded-2xl p-6 cursor-pointer transform hover:-translate-y-1 transition-all shadow-sm border border-gray-100 group"
        >
             <div className="flex justify-between items-start mb-4">
                <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                    <i className="fa-solid fa-lightbulb text-xl"></i>
                </div>
            </div>
            <h3 className="text-xl font-bold mb-1">Get Inspired</h3>
            <p className="text-gray-500 text-sm">See what's trending on campus.</p>
        </div>

        {/* Stat Card */}
         <div className="bg-white text-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                    <i className="fa-solid fa-chart-simple text-xl"></i>
                </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">1.2k</h3>
            <p className="text-gray-500 text-sm">Total Reach this week</p>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Recent Drafts</h3>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {[1, 2].map((i) => (
                <div key={i} className="flex items-center p-4 border-b border-gray-50 hover:bg-gray-50">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex-shrink-0"></div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-sm">Study group announcement</h4>
                        <p className="text-xs text-gray-500">Edited 2 hours ago</p>
                    </div>
                    <button className="text-gray-400 hover:text-brand-pink">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
