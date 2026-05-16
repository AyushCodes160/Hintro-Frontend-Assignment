export const API_BASE = "https://mock-backend-hintro.vercel.app";

export type UserId = "u1" | "u2";

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  login_method: string;
  status: string;
  is_hintro_admin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CallStats {
  totalSessions: number;
  averageDuration: number;
  totalAIInteractions: number;
  lastSession: string[];
}

export interface CallSession {
  _id: string;
  user_id: string;
  status: string;
  client: string;
  description: string;
  started_at: string;
  ended_at: string;
  total_duration_seconds: number;
  ai_interactions: number;
  participants: { name: string; isUser: boolean }[];
}

export interface CallHistory {
  callSessions: CallSession[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

async function request<T>(path: string, userId: UserId): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "x-user-id": userId },
  });
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  profile: (u: UserId) => request<Profile>("/api/auth/profile", u),
  stats: (u: UserId) => request<CallStats>("/api/call-sessions/stats", u),
  history: (u: UserId, limit = 10) => request<CallHistory>(`/api/call-sessions?limit=${limit}`, u),
};
