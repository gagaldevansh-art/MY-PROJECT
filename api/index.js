
const express = require('express');
const cors = require('cors');
const { GoogleGenAI, Type } = require('@google/genai');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
// Vercel will look for API_KEY in your Project Settings > Environment Variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- In-Memory Database Note ---
// On Vercel, serverless functions are stateless. This array will reset frequently.
// For persistent data, you would normally connect to a database like MongoDB or PostgreSQL.
let scheduledPosts = [];

// --- Routes ---

app.get('/api/status', (req, res) => {
    res.json({ status: "Backend Operational" });
});

// 1. Generate Personas
app.post('/api/generate/personas', async (req, res) => {
  const { topic } = req.body;
  
  if (!topic) return res.status(400).json({ error: "Topic is required" });

  try {
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

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8
      }
    });

    res.json(response.text ? JSON.parse(response.text) : []);
  } catch (error) {
    console.error("Error generating personas:", error);
    res.status(500).json({ error: "AI Generation failed" });
  }
});

// 2. Generate Image
app.post('/api/generate/image', async (req, res) => {
  const { prompt } = req.body;
  try {
    const modelId = "gemini-2.5-flash-image";
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts: [{ text: prompt }] }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    let imageUrl = `https://picsum.photos/800/800?random=${Math.random()}`;

    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Image generation failed" });
  }
});

// 3. Brainstorm Ideas
app.get('/api/ideas', async (req, res) => {
  try {
    const modelId = "gemini-2.5-flash";
    const prompt = "List 5 trending social media ideas for students. JSON Array of strings.";
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });
    
    res.json(response.text ? JSON.parse(response.text) : []);
  } catch (error) {
    res.status(500).json({ error: "Failed to get ideas" });
  }
});

// 4. Collab Match
app.post('/api/collab/search', async (req, res) => {
  const { niche, followers } = req.body;
  try {
    const modelId = "gemini-2.5-flash";
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
          User Niche: "${niche}", Followers: "${followers}".
          Generate 4 fictional collaborators (2 Peers/Free, 2 Pro/Paid).
          Return JSON.
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    res.json(response.text ? JSON.parse(response.text) : []);
  } catch (error) {
    res.status(500).json({ error: "Collab search failed" });
  }
});

// 5. Schedule Post
app.post('/api/schedule', (req, res) => {
    const post = req.body;
    post.id = Date.now().toString();
    post.status = 'Scheduled';
    scheduledPosts.push(post);
    res.json({ success: true, post });
});

app.get('/api/schedule', (req, res) => {
    res.json(scheduledPosts);
});

// 6. Admin Stats
app.get('/api/admin/stats', (req, res) => {
    res.json({
        totalUsers: 1452,
        totalPostsGenerated: 8932,
        apiCallsThisMonth: 12503,
        systemHealth: 'Healthy',
        revenue: '$4,250'
    });
});

// 7. Admin Users
app.get('/api/admin/users', (req, res) => {
    const users = [
        { id: '1', name: 'Alex Johnson', email: 'alex.j@uni.edu', role: 'Student', status: 'Active', joinedDate: '2023-09-01' },
        { id: '2', name: 'Sarah Lee', email: 'sarah.l@tech.edu', role: 'Pro', status: 'Active', joinedDate: '2023-09-15' },
        { id: '3', name: 'Mike Chen', email: 'mike.c@art.edu', role: 'Student', status: 'Suspended', joinedDate: '2023-10-02' },
        { id: '4', name: 'Emily Davis', email: 'emily.d@uni.edu', role: 'Student', status: 'Active', joinedDate: '2023-10-05' },
        { id: '5', name: 'Admin User', email: 'admin@campuscreator.com', role: 'Admin', status: 'Active', joinedDate: '2023-08-01' },
    ];
    res.json(users);
});

// Export app for Vercel
module.exports = app;
