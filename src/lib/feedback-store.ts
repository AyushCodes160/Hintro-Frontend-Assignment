export interface FeedbackEntry {
  id: string;
  rating: number; // 1-5
  category: string;
  message: string;
  createdAt: string;
}

const KEY = "hintro:feedback";

export function getFeedback(): FeedbackEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FeedbackEntry[]) : [];
  } catch {
    return [];
  }
}

export function addFeedback(entry: Omit<FeedbackEntry, "id" | "createdAt">): FeedbackEntry {
  const full: FeedbackEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const list = [full, ...getFeedback()];
  window.localStorage.setItem(KEY, JSON.stringify(list));
  return full;
}
