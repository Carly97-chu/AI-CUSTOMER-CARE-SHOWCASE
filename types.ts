export enum ViewState {
  HOME = 'HOME',
  CHAT_DEMO = 'CHAT_DEMO',
  ANALYSIS_DEMO = 'ANALYSIS_DEMO'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface AnalysisData {
  sentimentScore: number; // 0-100
  topics: { name: string; count: number }[];
  summary: string;
  urgentIssues: string[];
}

export interface MockChatLog {
  id: string;
  customer: string;
  message: string;
  timestamp: string;
}
