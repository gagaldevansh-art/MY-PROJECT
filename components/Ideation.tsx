import React, { useEffect, useState } from 'react';
import { generateBrainstormIdeas } from '../services/geminiService';

const Ideation: React.FC = () => {
    const [ideas, setIdeas] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const loadIdeas = async () => {
        setLoading(true);
        const newIdeas = await generateBrainstormIdeas();
        setIdeas(newIdeas);
        setLoading(false);
    };

    useEffect(() => {
        loadIdeas();
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-brand-dark">Content Brainstorm</h2>
                    <p className="text-gray-500">Trending topics tailored for students.</p>
                </div>
                <button 
                    onClick={loadIdeas}
                    className="text-brand-pink font-bold hover:bg-pink-50 px-4 py-2 rounded-lg transition-colors"
                >
                    <i className={`fa-solid fa-arrows-rotate mr-2 ${loading ? 'fa-spin' : ''}`}></i>
                    Refresh
                </button>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-400">Loading ideas...</div>
                ) : (
                    ideas.map((idea, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-brand-pink/50 transition-all">
                            <span className="font-medium text-lg text-gray-700">
                                <span className="text-brand-pink font-bold mr-4">0{index + 1}</span>
                                {idea}
                            </span>
                            <button className="opacity-0 group-hover:opacity-100 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all transform translate-x-4 group-hover:translate-x-0">
                                Use This
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Ideation;
