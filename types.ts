export enum View {
  DASHBOARD = 'DASHBOARD',
  STUDIO = 'STUDIO', // The Unique Feature
  SCHEDULE = 'SCHEDULE',
  IDEATION = 'IDEATION',
  COLLAB = 'COLLAB',
  ADMIN = 'ADMIN'
}

export type UserRole = 'creator' | 'admin';

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

export interface AdminStats {
  totalUsers: number;
  totalPostsGenerated: number;
  apiCallsThisMonth: number;
  systemHealth: 'Healthy' | 'Degraded' | 'Down';
  revenue: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Pro' | 'Admin';
  status: 'Active' | 'Suspended';
  joinedDate: string;
}