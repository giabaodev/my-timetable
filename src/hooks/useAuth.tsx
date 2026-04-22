"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { getSession, clearSession, type AuthSession } from "@/lib/auth";

interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [currentSession, setCurrentSession] = useState<AuthSession | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentSession(getSession());
    setIsLoading(false);
  }, []);

  const setSession = useCallback((s: AuthSession) => {
    setCurrentSession(s);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setCurrentSession(null);
  }, []);

  const value = useMemo(
    () => ({ session: currentSession, isLoading, setSession, logout }),
    [currentSession, isLoading, setSession, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
