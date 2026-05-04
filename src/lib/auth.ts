import { User } from '@/interfaces/user';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  expiresAt: string; // ISO date
}

const USERS_KEY = 'schedule_users';
const SESSION_KEY = 'schedule_session';

// -- Storage helpers --

export function getUsers(): User[] {
  if (globalThis.window === undefined) return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getSession(): AuthSession | null {
  if (globalThis.window === undefined) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

// -- Auth actions --
export type AuthResult =
  | { ok: true; session: AuthSession }
  | { ok: false; error: string };
