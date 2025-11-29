import React, { useState } from 'react';
import { findCollaborators } from '../services/geminiService';
import { Collaborator } from '../types';

const CollabConnect: React.FC = () => {
    const [myNiche, setMyNiche] = useState('');
    const [followers, setFollowers] = useState('1k - 5k');
    const [partners, setPartners] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(false);
    const [connectedIds, setConnectedIds] = useState<string[]>([]);

    const handleSearch = async () => {
        if (!myNiche) return;
        setLoading(true);
        setPartners([]);
        const results = await findCollaborators(myNiche, followers);
        setPartners(results);
        setLoading(false);
    };

    const handleConnect = (partner: Collaborator) => {
        if (partner.isPaid) {
            const confirmed = window.confirm(`This collaboration is with a Pro creator.\n\nFee: ${partner.price}\n\nDo you want to proceed with payment?`);
            if (!confirmed) return;
            
            // In a real app, trigger payment gateway here
            alert("Payment successful! Request sent.");
        }
        
        setConnectedIds(prev => [...prev, partner.handle]);
        
        if (!partner.isPaid) {
            alert(`Request sent to ${partner.handle}! They will be notified of your collab idea.`);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">Synergy Match <i className="fa-solid fa-users text-brand-pink ml-2"></i></h2>
                <p className="text-gray-600 text-lg">Find peers to grow with or pros to learn from (and pay for exposure).</p>
            </div>

            {/* Profile Inputs */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Find Your Tribe</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">My Content Category</label>
                        <input 
                            type="text" 
                            value={myNiche}
                            onChange={(e) => setMyNiche(e.target.value)}
                            placeholder="e.g. Study Vlogs, Tech Reviews, Dance"
                            className="w-full p-3 rounded-lg border border-gray-200 focus:border-brand-pink focus:ring-1 focus:ring-pink-200 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">My Follower Range</label>
                        <select 
                            value={followers} 
                            onChange={(e) => setFollowers(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:border-brand-pink focus:ring-1 focus:ring-pink-200 outline-none bg-white"
                        >
                            <option>0 - 500</option>
                            <option>500 - 1k</option>
                            <option>1k - 5k</option>
                            <option>5k - 10k</option>
                            <option>10k+</option>
                        </select>
                    </div>
                    <button 
                        onClick={handleSearch}
                        disabled={loading || !myNiche}
                        className="bg-brand-dark text-white p-3 rounded-lg font-bold hover:bg-brand-pink transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-magnifying-glass"></i>}
                        Find Partners
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {partners.map((partner, index) => (
                    <div key={index} className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-shadow relative overflow-hidden ${partner.isPaid ? 'border-amber-200' : 'border-gray-100'}`}>
                        
                        {/* Pro Badge */}
                        {partner.isPaid && (
                            <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-bl-xl border-b border-l border-amber-200">
                                <i className="fa-solid fa-crown mr-1"></i> PRO CREATOR
                            </div>
                        )}

                        {/* Avatar & Stats */}
                        <div className="flex flex-col items-center md:items-start min-w-[120px]">
                            <div className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center text-xl font-bold text-white shadow-inner ${partner.isPaid ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-pink-200 to-purple-200'}`}>
                                {partner.name.charAt(0)}
                            </div>
                            <h4 className="font-bold text-gray-900">{partner.name}</h4>
                            <p className="text-xs text-gray-500 mb-2">{partner.handle}</p>
                            
                            <div className="flex gap-2 text-xs">
                                <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                                    <i className="fa-solid fa-user-group mr-1"></i> {partner.followers}
                                </span>
                                <span className="bg-green-50 px-2 py-1 rounded text-green-700 font-medium">
                                    <i className="fa-solid fa-chart-line mr-1"></i> {partner.engagement}
                                </span>
                            </div>
                        </div>

                        {/* Match Info */}
                        <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink border border-pink-100 bg-pink-50 px-2 py-0.5 rounded-full">
                                    {partner.niche}
                                </span>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-green-600 flex items-center gap-1 justify-end">
                                        <i className="fa-solid fa-leaf"></i> {partner.matchScore}% Match
                                    </span>
                                    <span className={`text-xs font-bold ${partner.isPaid ? 'text-amber-600' : 'text-gray-400'}`}>
                                        {partner.price}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                                <p className="text-xs font-bold text-blue-800 mb-1">💡 Collab Idea:</p>
                                <p className="text-sm text-blue-900 font-medium italic">"{partner.collabIdea}"</p>
                            </div>
                            
                            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                                <strong className="text-gray-700">Why it works:</strong> {partner.reason}
                            </p>

                            <button 
                                onClick={() => handleConnect(partner)}
                                disabled={connectedIds.includes(partner.handle)}
                                className={`mt-auto w-full py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${
                                    connectedIds.includes(partner.handle) 
                                    ? 'bg-gray-100 text-gray-400 cursor-default' 
                                    : partner.isPaid 
                                        ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-200'
                                        : 'bg-black text-white hover:bg-brand-pink shadow-md'
                                }`}
                            >
                                {connectedIds.includes(partner.handle) ? (
                                    <><i className="fa-solid fa-check mr-2"></i> Request Sent</>
                                ) : (
                                    partner.isPaid ? (
                                        <><i className="fa-solid fa-lock mr-2"></i> Pay {partner.price} & Connect</>
                                    ) : (
                                        'Connect & Collab'
                                    )
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {partners.length === 0 && !loading && (
                <div className="text-center py-16 opacity-40">
                    <i className="fa-solid fa-handshake-simple text-6xl text-gray-300 mb-4"></i>
                    <p className="text-lg font-medium text-gray-400">Enter your niche to find collaboration opportunities.</p>
                </div>
            )}
        </div>
    );
};

export default CollabConnect;