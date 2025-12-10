export enum AppView {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export enum ToolType {
  MARKET_ANALYSIS = 'MARKET_ANALYSIS',
  COPYWRITER = 'COPYWRITER',
  STRATEGY_CHAT = 'STRATEGY_CHAT'
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: number;
}

export interface SiteConfig {
  name: string;
  description: string;
  welcomeMessage: string;
  primaryColor: string;
  contactPhone: string;
  address: string;
}

export interface AdminState {
  isSetup: boolean;
  isAuthenticated: boolean;
  username?: string;
}

export interface GeneratedContent {
  text: string;
}

export interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  recommendation: string;
  sentiment: string;
}

export interface GeneratedCopy {
  headline: string;
  body: string;
  ctas: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}