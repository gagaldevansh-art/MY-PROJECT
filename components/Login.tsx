
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isPulled, setIsPulled] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handlePull = () => {
    if (isFormVisible) return; // Already pulled
    
    setIsPulled(true);
    
    // Reset pull animation state after it plays
    setTimeout(() => {
      setIsPulled(false);
      setIsFormVisible(true);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth delay
    setTimeout(() => {
        onLogin();
    }, 500);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-gray-50 to-pink-50 flex flex-col items-center justify-center z-[100]">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* The Hanging String Mechanism */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer group transition-transform duration-300 ${isFormVisible ? '-translate-y-full opacity-0' : ''}`}
        onClick={handlePull}
      >
        {/* The String Line */}
        <div className={`w-1 bg-gray-800 origin-top shadow-sm ${isPulled ? 'animate-string-pull' : 'animate-string-sway'} h-64 md:h-80 relative`}>
             {/* The Handle/Knob */}
            <div className="w-8 h-8 rounded-full bg-brand-pink border-4 border-white shadow-lg absolute -bottom-4 -left-3.5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            </div>
        </div>
        
        {/* Tooltip */}
        <div className={`mt-8 bg-white px-4 py-2 rounded-full shadow-md text-sm font-bold text-gray-500 animate-bounce transition-opacity duration-300 ${isPulled ? 'opacity-0' : 'opacity-100'}`}>
            Pull to Start
        </div>
      </div>

      {/* Intro Text (Fades out when form appears) */}
      <div className={`text-center transition-all duration-700 ${isFormVisible ? 'opacity-0 scale-90 translate-y-20' : 'opacity-100'}`}>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-2 font-serif tracking-tight">CampusCreator</h1>
        <p className="text-xl text-gray-500">Amplify your student voice.</p>
      </div>

      {/* The Dropdown Login Card */}
      <div className={`absolute top-0 w-full md:w-[450px] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isFormVisible ? 'translate-y-[20vh]' : '-translate-y-[150%]'}`}>
         
         {/* Rope connecting card to top (visual only) */}
         <div className="absolute -top-[100vh] left-1/2 -translate-x-1/2 w-1 bg-gray-300 h-[100vh] z-0"></div>

         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 mx-4">
            <div className="bg-brand-pink p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-black/5"></div>
                <h2 className="text-3xl font-bold text-white relative z-10">Welcome Back</h2>
                <p className="text-pink-100 relative z-10 text-sm mt-1">Ready to create?</p>
            </div>
            
            <div className="p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Student ID / Email</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all"
                            placeholder="user@university.edu"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button type="submit" className="bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-transform active:scale-95 shadow-lg">
                        Login
                    </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px bg-gray-100 flex-1"></div>
                    <span className="text-xs text-gray-400 font-medium">OR</span>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>

                <button 
                    onClick={onLogin}
                    className="w-full bg-pink-50 text-brand-pink font-bold py-3 rounded-xl hover:bg-pink-100 transition-colors border border-pink-100 flex items-center justify-center gap-2"
                >
                    <i className="fa-regular fa-user"></i>
                    Continue as Guest
                </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Login;
