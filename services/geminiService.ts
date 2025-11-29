import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent, Collaborator, SocialPost, AdminStats, User } from "../types";

// Determine API URL based on environment
// We check window.location to see if we are running locally or in production (Vercel)
const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// If local, point to the dedicated backend server on port 3001
// If production (Vercel), use relative path '/api' which routes to Serverless Functions
const API_URL = isLocal ? 'http://localhost:3001/api' : '/api';

// Initialize client-side fallback
// Note: In a real app, never expose API_KEY in client-side code if possible. 
// This is a fallback for the prototype if the backend is unreachable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Calls the backend to generate personas, falls back to client-side API on failure
 */
export const generatePersonas = async (topic: string): Promise<GeneratedContent[]> => {
  try {
    // Try Backend first
    const response = await fetch(`${API_URL}/generate/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
    });
    
    if (!response.ok) throw new Error("Backend unavailable");
    return await response.json();
  } catch (error) {
    console.warn("Backend unavailable, falling back to client-side Gemini:", error);
    
    // Fallback: Direct Client-Side Call
    const modelId = "gemini-2.5-flash";
    const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            persona: { type: Type.STRING },
            caption: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            visualPrompt: { type: Type.STRING }
          },
          required: ["persona", "caption", "hashtags", "visualPrompt"]
        }
    };

    const prompt = `
      You are a social media expert for university students. 
      Topic: "${topic}"
      Create 3 distinct social media content variations.
      1. "The Advocate": Serious, impactful.
      2. "The Chill Vibes": Aesthetic, lowercase.
      3. "The Hype": High energy, emojis.
      Return JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8
            }
        });
        return response.text ? JSON.parse(response.text) : [];
    } catch (clientError) {
        console.error("Client-side fallback also failed:", clientError);
        return [];
    }
  }
};

/**
 * Calls the backend to generate an image, falls back to client-side API on failure
 */
export const generateSocialImage = async (visualPrompt: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/generate/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: visualPrompt })
    });

    if (!response.ok) throw new Error("Backend unavailable");
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.warn("Backend unavailable, falling back to client-side Image Gen:", error);
    
    // Fallback: Direct Client-Side Call
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: visualPrompt }] }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return `https://picsum.photos/800/800?random=${Math.random()}`;
    } catch (e) {
        return `https://picsum.photos/800/800?random=${Math.random()}`;
    }
  }
};

/**
 * Calls the backend for ideas, falls back to client-side API on failure
 */
export const generateBrainstormIdeas = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_URL}/ideas`);
        if (!response.ok) throw new Error("Backend unavailable");
        return await response.json();
    } catch (e) {
        // Fallback
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "List 5 trending social media ideas for students.",
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            });
            return response.text ? JSON.parse(response.text) : ["Day in the life", "Study tips"];
        } catch (err) {
            return ["Day in the life vlog", "Study tips speedrun", "Campus food review", "OOTD Student Edition", "Club spotlight"];
        }
    }
};

/**
 * Calls the backend for collaborators, falls back to client-side API on failure
 */
export const findCollaborators = async (userNiche: string, userFollowers: string): Promise<Collaborator[]> => {
    try {
        const response = await fetch(`${API_URL}/collab/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ niche: userNiche, followers: userFollowers })
        });
        
        if (!response.ok) throw new Error("Backend unavailable");
        return await response.json();
    } catch (error) {
        console.warn("Backend unavailable, falling back to client-side Collab Search");
        
        // Fallback
        const responseSchema = {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                handle: { type: Type.STRING },
                followers: { type: Type.STRING },
                engagement: { type: Type.STRING },
                niche: { type: Type.STRING },
                matchScore: { type: Type.INTEGER },
                collabIdea: { type: Type.STRING },
                reason: { type: Type.STRING },
                price: { type: Type.STRING },
                isPaid: { type: Type.BOOLEAN }
              },
              required: ["name", "handle", "followers", "engagement", "niche", "matchScore", "collabIdea", "reason", "price", "isPaid"]
            }
        };
      
        const prompt = `
              User Niche: "${userNiche}", Followers: "${userFollowers}".
              Generate 4 fictional collaborators (2 Peers/Free, 2 Pro/Paid).
              Return JSON.
        `;
    
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                }
            });
            return response.text ? JSON.parse(response.text) : [];
        } catch (err) {
            console.error(err);
            return [];
        }
    }
}

/**
 * New function to save scheduled posts to the backend
 */
export const schedulePost = async (post: any): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/schedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        });
        return response.ok;
    } catch (error) {
        console.warn("Backend unavailable, simulating schedule locally");
        return true;
    }
}

/**
 * Fetches admin statistics
 */
export const fetchAdminStats = async (): Promise<AdminStats> => {
    try {
        const response = await fetch(`${API_URL}/admin/stats`);
        if (!response.ok) throw new Error("Backend unavailable");
        return await response.json();
    } catch (e) {
        return {
            totalUsers: 1452,
            totalPostsGenerated: 8932,
            apiCallsThisMonth: 12503,
            systemHealth: 'Healthy',
            revenue: '$4,250'
        };
    }
}

/**
 * Fetches user list for admin
 */
export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await fetch(`${API_URL}/admin/users`);
        if (!response.ok) throw new Error("Backend unavailable");
        return await response.json();
    } catch (e) {
        return [
             { id: '1', name: 'Alex Johnson', email: 'alex.j@uni.edu', role: 'Student', status: 'Active', joinedDate: '2023-09-01' },
             { id: '2', name: 'Sarah Lee', email: 'sarah.l@tech.edu', role: 'Pro', status: 'Active', joinedDate: '2023-09-15' },
        ];
    }
}