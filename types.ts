export enum View {
  DASHBOARD = 'DASHBOARD',
  STUDIO = 'STUDIO', // The Unique Feature
  SCHEDULE = 'SCHEDULE',
  IDEATION = 'IDEATION',
  COLLAB = 'COLLAB'
}

export interface GeneratedContent {
  persona: string;
  caption: string;
  hashtags: string[];
  visualPrompt: string;
  imageUrl?: string; // Populated after second API call
}

export interface SocialPost {
  id: string;
  content: string;
  date: string; // ISO date string
  platform: 'Instagram' | 'TikTok' | 'LinkedIn';
  status: 'Draft' | 'Scheduled' | 'Published';
}

export interface Collaborator {
  name: string;
  handle: string;
  followers: string;
  engagement: string;
  niche: string;
  matchScore: number;
  collabIdea: string;
  reason: string;
  price: string;
  isPaid: boolean;
}