
import React, { useState } from 'react';
import { generatePersonas, generateSocialImage, schedulePost } from '../services/geminiService';
import { GeneratedContent } from '../types';

// Extended interface to handle local editing state (specifically for hashtag string manipulation)
interface EditableGeneratedContent extends GeneratedContent {
  hashtagsString: string;
}

const VibeStudio: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [results, setResults] = useState<EditableGeneratedContent[]>([]);

  const handleMagic = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setResults([]);
    
    try {
      // Step 1: Text Generation
      setLoadingStep('Analyzing vibe & generating personas...');
      const textResults = await generatePersonas(topic);
      
      // Transform to editable format (create string representation of hashtags)
      const editableResults: EditableGeneratedContent[] = textResults.map(item => ({
        ...item,
        hashtagsString: item.hashtags.map(t => `#${t}`).join(' ')
      }));
      
      // Temporary display while images load
      setResults(editableResults);
      
      // Step 2: Image Generation (Parallel)
      setLoadingStep('Creating custom visuals for each persona...');
      
      const resultsWithImages = await Promise.all(
        editableResults.map(async (item) => {
          const imageUrl = await generateSocialImage(item.visualPrompt);
          return { ...item, imageUrl };
        })
      );

      setResults(resultsWithImages);
    } catch (err) {
      console.error(err);
      alert("Something went wrong with the AI magic. Ensure your backend server is running on port 3001.");
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const updateResult = (index: number, field: keyof EditableGeneratedContent, value: string) => {
    const newResults = [...results];
    
    if (field === 'hashtagsString') {
        newResults[index] = {
            ...newResults[index],
            hashtagsString: value,
            // Sync the array version for data consistency
            hashtags: value.split(/\s+/).filter(t => t.trim().length > 0).map(t => t.replace(/^#/, ''))
        };
    } else {
        newResults[index] = { ...newResults[index], [field]: value };
    }
    
    setResults(newResults);
  };

  const handleSchedule = async (item: EditableGeneratedContent) => {
      const formattedTags = item.hashtags.map(t => `#${t}`).join(' ');
      
      // Call Backend to save
      const success = await schedulePost({
          persona: item.persona,
          caption: item.caption,
          hashtags: item.hashtags,
          imageUrl: item.imageUrl
      });

      if (success) {
          alert(`🎉 Saved to Database!\n\nScheduled for ${item.persona}.`);
      } else {
          alert("Failed to connect to backend server.");
      }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">Vibe Check & Transformation Studio</h2>
        <p className="text-gray-600 text-lg">Don't just post. Turn one idea into 3 distinct content strategies instantly.</p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 mb-10">
        <label className="block text-sm font-bold text-gray-700 mb-2">What's happening on campus? / What's your idea?</label>
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The library is open 24/7 now during finals..."
            className="flex-1 p-4 rounded-xl border border-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-pink-200 outline-none transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleMagic()}
          />
          <button 
            onClick={handleMagic}
            disabled={isLoading || !topic.trim()}
            className="bg-brand-dark hover:bg-brand-pink text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-pink-200"
          >
            {isLoading ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Processing</>
            ) : (
              <><i className="fa-solid fa-wand-magic-sparkles"></i> Transform Vibe</>
            )}
          </button>
        </div>
        {isLoading && (
            <div className="mt-4 text-brand-pink font-medium animate-pulse text-center">
                {loadingStep}
            </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full group">
            {/* Persona Header */}
            <div className={`p-4 ${
                index === 0 ? 'bg-blue-50 text-blue-800' :
                index === 1 ? 'bg-purple-50 text-purple-800' :
                'bg-orange-50 text-orange-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
                    <i className={`fa-solid ${
                        index === 0 ? 'fa-bullhorn' :
                        index === 1 ? 'fa-moon' :
                        'fa-fire'
                    }`}></i>
                    {item.persona}
                </div>
                <div className="text-xs opacity-50 font-normal"><i className="fa-solid fa-pen mr-1"></i>Edit</div>
              </div>
            </div>

            {/* Image Area */}
            <div className="aspect-square bg-gray-100 relative group/image">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.persona} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <i className="fa-solid fa-image fa-2x animate-pulse"></i>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                 <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover/image:translate-y-0 transition-transform">
                    Download Image
                 </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col gap-4">
              
              {/* Editable Caption */}
              <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Caption</label>
                    <span className={`text-[10px] font-medium ${item.caption.length > 200 ? 'text-red-400' : 'text-gray-300'}`}>{item.caption.length} chars</span>
                  </div>
                  <textarea 
                    value={item.caption}
                    onChange={(e) => updateResult(index, 'caption', e.target.value)}
                    className="w-full text-sm text-gray-800 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-brand-pink focus:ring-1 focus:ring-brand-pink rounded-lg p-3 transition-all resize-none outline-none leading-relaxed"
                    rows={4}
                    placeholder="Write a caption..."
                  />
              </div>

              {/* Editable Hashtags */}
              <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Hashtags</label>
                   <textarea
                    value={item.hashtagsString}
                    onChange={(e) => updateResult(index, 'hashtagsString', e.target.value)}
                    className="w-full text-xs text-brand-pink font-semibold bg-pink-50/30 border border-transparent hover:border-pink-100 focus:bg-white focus:border-brand-pink focus:ring-1 focus:ring-brand-pink rounded-lg p-3 transition-all resize-none outline-none"
                    rows={2}
                    placeholder="#hashtags"
                  />
              </div>

              <button 
                onClick={() => handleSchedule(item)}
                className="mt-auto w-full py-2.5 border-2 border-brand-pink text-brand-pink rounded-lg font-bold hover:bg-brand-pink hover:text-white transition-all text-sm shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fa-regular fa-calendar-check"></i>
                Select & Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {results.length === 0 && !isLoading && (
        <div className="text-center py-20 opacity-50">
            <i className="fa-solid fa-layer-group text-6xl text-gray-300 mb-4"></i>
            <p className="text-xl font-medium text-gray-400">Enter a topic to generate 3 unique personas.</p>
        </div>
      )}
    </div>
  );
};

export default VibeStudio;
