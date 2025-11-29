
import React, { useEffect, useState } from 'react';
import { fetchAdminStats, fetchUsers } from '../services/geminiService';
import { AdminStats, User } from '../types';

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        fetchAdminStats(),
        fetchUsers()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="p-10 text-center text-indigo-500"><i className="fa-solid fa-circle-notch fa-spin text-2xl"></i> Loading Admin Data...</div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-bold text-indigo-900">Admin Console</h2>
            <p className="text-indigo-600/60 font-medium">System Overview & User Management</p>
        </div>
        <div className="flex gap-3">
             <button className="bg-white text-indigo-900 px-4 py-2 rounded-lg text-sm font-bold border border-indigo-100 shadow-sm">
                <i className="fa-solid fa-download mr-2"></i> Export Report
            </button>
             <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors">
                <i className="fa-solid fa-gear mr-2"></i> Settings
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
            { label: 'Total Students', value: stats?.totalUsers, icon: 'fa-users', color: 'bg-blue-500' },
            { label: 'Posts Generated', value: stats?.totalPostsGenerated, icon: 'fa-layer-group', color: 'bg-purple-500' },
            { label: 'API Requests', value: stats?.apiCallsThisMonth, icon: 'fa-server', color: 'bg-orange-500' },
            { label: 'Monthly Revenue', value: stats?.revenue, icon: 'fa-dollar-sign', color: 'bg-green-500' },
        ].map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{item.label}</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{item.value?.toLocaleString()}</h3>
                </div>
                <div className={`${item.color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md`}>
                    <i className={`fa-solid ${item.icon}`}></i>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         {/* Growth Chart (Simulated) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">User Growth (Last 7 Days)</h3>
                <span className="text-green-500 text-sm font-bold"><i className="fa-solid fa-arrow-trend-up"></i> +12.5%</span>
             </div>
             <div className="h-64 flex items-end justify-between gap-4">
                {[45, 60, 55, 75, 80, 95, 120].map((h, i) => (
                    <div key={i} className="w-full bg-indigo-50 hover:bg-indigo-100 rounded-t-lg relative group transition-all" style={{ height: `${h}%` }}>
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {h * 10} Users
                         </div>
                    </div>
                ))}
             </div>
             <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
             </div>
        </div>

        {/* System Health */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-gray-800 mb-6">System Health</h3>
             <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">API Latency</span>
                        <span className="font-bold text-green-600">45ms</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[20%]"></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Database Load</span>
                        <span className="font-bold text-yellow-600">62%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full w-[62%]"></div>
                    </div>
                </div>
                 <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Storage</span>
                        <span className="font-bold text-indigo-600">88%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[88%]"></div>
                    </div>
                </div>
             </div>
             
             <div className="mt-8 bg-indigo-50 rounded-xl p-4 flex items-start gap-3">
                 <i className="fa-solid fa-circle-check text-green-500 mt-1"></i>
                 <div>
                     <h4 className="font-bold text-indigo-900 text-sm">All Systems Operational</h4>
                     <p className="text-indigo-700/70 text-xs">Last check: 2 minutes ago</p>
                 </div>
             </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h3 className="font-bold text-gray-800">User Directory</h3>
             <div className="relative">
                 <input type="text" placeholder="Search users..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500" />
                 <i className="fa-solid fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
             </div>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                 <thead>
                     <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                         <th className="p-4 font-semibold">User</th>
                         <th className="p-4 font-semibold">Role</th>
                         <th className="p-4 font-semibold">Status</th>
                         <th className="p-4 font-semibold">Joined</th>
                         <th className="p-4 font-semibold text-right">Actions</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-sm">
                     {users.map((user) => (
                         <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                             <td className="p-4">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                         {user.name.charAt(0)}
                                     </div>
                                     <div>
                                         <p className="font-bold text-gray-800">{user.name}</p>
                                         <p className="text-gray-500 text-xs">{user.email}</p>
                                     </div>
                                 </div>
                             </td>
                             <td className="p-4">
                                 <span className={`px-2 py-1 rounded text-xs font-bold ${
                                     user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                                     user.role === 'Pro' ? 'bg-amber-100 text-amber-700' : 
                                     'bg-blue-50 text-blue-700'
                                 }`}>
                                     {user.role}
                                 </span>
                             </td>
                             <td className="p-4">
                                 <span className={`flex items-center gap-2 ${user.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                                     <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                     {user.status}
                                 </span>
                             </td>
                             <td className="p-4 text-gray-600">{user.joinedDate}</td>
                             <td className="p-4 text-right">
                                 <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                                     <i className="fa-solid fa-ellipsis-vertical"></i>
                                 </button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
};

export default AdminPanel;
