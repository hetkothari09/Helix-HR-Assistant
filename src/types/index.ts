export type UserRole = 'hr' | 'employee';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  department?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  rating?: 'up' | 'down';
  created_at: string;
}

export interface EmployeeProfile {
  id: string;
  user_id: string;
  skills: string[];
  projects: string[];
  certifications: string[];
  resume_url?: string;
  recommendations?: CareerRecommendation[];
  updated_at: string;
}

export interface CareerRecommendation {
  next_role: string;
  skill_gaps: string[];
  suggested_projects: string[];
  suggested_training: string[];
}

export interface AnalyticsData {
  total_queries: number;
  avg_response_time: number;
  satisfaction_rate: number;
  active_users: number;
  total_employees: number;
}
