
import React from 'react';
import { View } from '../types';

interface DashboardProps {
    setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-bold text-gray-800">Hello, Creator 👋</h2>
            <p className="text-gray-500">You have 2 posts scheduled for this week.</p>
        </div>
        <div className="hidden md:block text-right">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Streak</p>
            <div className="flex items-center gap-2 text-orange-500 font-bold">
                <i className="fa-solid fa-fire"></i> 5 Days
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Engagement Chart (New) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[250px]">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-800">Engagement Overview</h3>
                <select className="bg-gray-50 border border-gray-100 text-xs rounded-lg p-2 outline-none">
                    <option>Last 7 Days</option>
                    <option>Last Month</option>
                </select>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 px-2">
                {[35, 50, 45, 80, 65, 90, 75].map((val, i) => (
                    <div key={i} className="w-full flex flex-col items-center gap-2 group">
                        <div 
                            className="w-full bg-pink-100 rounded-t-lg relative group-hover:bg-brand-pink transition-colors duration-300"
                            style={{ height: `${val * 1.5}px` }}
                        >
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {val}
                             </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{['M','T','W','T','F','S','S'][i]}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="flex flex-col gap-6">
             <div className="bg-white text-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
                 <div className="flex justify-between items-start mb-2">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                        <i className="fa-solid fa-chart-simple text-xl"></i>
                    </div>
                    <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded">+12%</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">1.2k</h3>
                <p className="text-gray-500 text-sm">Total Reach this week</p>
            </div>

            <div 
                onClick={() => setView(View.STUDIO)}
                className="bg-brand-pink text-white rounded-2xl p-6 cursor-pointer transform hover:-translate-y-1 transition-all shadow-lg shadow-pink-200 group flex-1"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                        <i className="fa-solid fa-plus text-xl"></i>
                    </div>
                    <i className="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>
                <h3 className="text-xl font-bold mb-1">Create New</h3>
                <p className="text-pink-100 text-sm">Launch Vibe Studio</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Drafts */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
             <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                 <h3 className="font-bold text-gray-800">Recent Drafts</h3>
                 <button className="text-xs text-brand-pink font-bold">View All</button>
             </div>
             <div>
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex-shrink-0 flex items-center justify-center text-gray-400">
                            <i className="fa-solid fa-image"></i>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-sm group-hover:text-brand-pink transition-colors">Study group announcement</h4>
                            <p className="text-xs text-gray-500">Edited 2 hours ago</p>
                        </div>
                        <button className="text-gray-300 hover:text-brand-pink">
                            <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                    </div>
                ))}
             </div>
          </div>

          {/* Upcoming Collabs (New Widget) */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
             <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2">
                     <i className="fa-solid fa-handshake text-purple-500"></i> Collab Requests
                 </h3>
                 <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-0.5 rounded-full">1 New</span>
             </div>
             <div className="p-4">
                 <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-white flex items-center justify-center font-bold">
                         J
                     </div>
                     <div className="flex-1">
                         <p className="text-sm font-bold text-gray-800">Jake_Vlogs wants to connect</p>
                         <p className="text-xs text-gray-500">"Let's do a library tour..."</p>
                     </div>
                     <div className="flex gap-2">
                         <button className="w-8 h-8 rounded-full bg-white border border-gray-200 text-red-400 hover:text-red-500 hover:border-red-200 shadow-sm"><i className="fa-solid fa-xmark"></i></button>
                         <button className="w-8 h-8 rounded-full bg-purple-500 text-white hover:bg-purple-600 shadow-sm shadow-purple-200"><i className="fa-solid fa-check"></i></button>
                     </div>
                 </div>
                 
                 <button onClick={() => setView(View.COLLAB)} className="w-full text-center text-sm text-purple-500 font-bold mt-2 hover:text-purple-700">Find more partners</button>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
