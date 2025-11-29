import React from 'react';

const Scheduler: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-brand-dark">Content Calendar</h2>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold">
            <i className="fa-solid fa-filter mr-2"></i> Filter
        </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {days.map(day => (
                <div key={day} className="p-4 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">
                    {day}
                </div>
            ))}
        </div>
        <div className="grid grid-cols-7 flex-1">
            {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="border-b border-r border-gray-100 min-h-[100px] p-2 relative group hover:bg-gray-50 transition-colors">
                    <span className="text-xs text-gray-400 font-medium">{i + 1}</span>
                    
                    {i === 3 && (
                        <div className="mt-2 bg-brand-pink text-white text-xs p-2 rounded shadow-sm cursor-pointer hover:scale-105 transition-transform">
                             <i className="fa-brands fa-instagram mr-1"></i> Club Fair
                        </div>
                    )}
                     {i === 14 && (
                        <div className="mt-2 bg-blue-500 text-white text-xs p-2 rounded shadow-sm cursor-pointer hover:scale-105 transition-transform">
                             <i className="fa-brands fa-linkedin mr-1"></i> Internships
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
