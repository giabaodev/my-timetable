export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // btoa(password) for mock
  avatar?: string;
  provider: "email" | "google";
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  expiresAt: string; // ISO date
}

const USERS_KEY = "schedulr_users";
const SESSION_KEY = "schedulr_session";

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

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
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

function saveSession(session: AuthSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function createSession(user: User): AuthSession {
  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
  saveSession(session);
  return session;
}

// -- Auth actions --

export type AuthResult =
  | { ok: true; session: AuthSession }
  | { ok: false; error: string };

export function registerUser(
  name: string,
  email: string,
  password: string,
): AuthResult {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "Oops, that email's already taken 👀" };
  }
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash: btoa(password),
    provider: "email",
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  return { ok: true, session: createSession(user) };
}

export function loginUser(email: string, password: string): AuthResult {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return { ok: false, error: "No account found with that email" };
  }
  if (user.passwordHash !== btoa(password)) {
    return { ok: false, error: "Incorrect password — try again?" };
  }
  return { ok: true, session: createSession(user) };
}

export function googleLogin(profile: {
  name: string;
  email: string;
  picture?: string;
}): AuthResult {
  const users = getUsers();
  let user = users.find(
    (u) => u.email.toLowerCase() === profile.email.toLowerCase(),
  );
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      name: profile.name,
      email: profile.email.toLowerCase(),
      passwordHash: "",
      avatar: profile.picture,
      provider: "google",
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, user]);
  } else if (profile.picture && !user.avatar) {
    user.avatar = profile.picture;
    const updatedUser = user;
    saveUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  }
  return { ok: true, session: createSession(user) };
}
