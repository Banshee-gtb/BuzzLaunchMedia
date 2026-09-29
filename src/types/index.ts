export interface HireRequest {
  id?: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  industry?: string;
  location?: string;
  website?: string;
  social_links?: string;
  services_required?: string[];
  business_goals?: string;
  project_description?: string;
  timeline?: string;
  budget_range?: string;
  status?: string;
  created_at?: string;
}

export interface JoinApplication {
  id?: string;
  full_name: string;
  email: string;
  phone?: string;
  role_applied: string;
  skills?: string[];
  experience_years?: string;
  portfolio_links?: string;
  availability?: string;
  why_join?: string;
  additional_info?: string;
  resume_path?: string;
  status?: string;
  created_at?: string;
}

export interface Review {
  id?: string;
  author_name: string;
  author_role?: string;
  author_company?: string;
  content: string;
  rating?: number;
  is_published?: boolean;
  created_at?: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  display_order?: number;
}

export interface AdminSetting {
  key: string;
  value: string;
}

export interface AnalyticsEvent {
  id?: string;
  event_type: string;
  page?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
