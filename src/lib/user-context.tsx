import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { UserId } from "./api";

interface Ctx {
  userId: UserId;
  setUserId: (u: UserId) => void;
}

const UserContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "hintro:user-id";

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState<UserId>("u2");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved === "u1" || saved === "u2") setUserIdState(saved);
  }, []);

  const setUserId = (u: UserId) => {
    setUserIdState(u);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, u);
  };

  return <UserContext.Provider value={{ userId, setUserId }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
