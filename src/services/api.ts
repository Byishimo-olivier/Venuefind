const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const tokenKey = 'smart-event-auth-token';
const userKey = 'smart-event-auth-user';

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  provider: string;
  verified: boolean;
};

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export function getAuthToken() {
  return window.localStorage.getItem(tokenKey);
}

export function getAuthUser(): AuthUser | null {
  const stored = window.localStorage.getItem(userKey);
  return stored ? JSON.parse(stored) as AuthUser : null;
}

export function saveAuthSession(token: string, user: AuthUser) {
  window.localStorage.setItem(tokenKey, token);
  window.localStorage.setItem(userKey, JSON.stringify(user));
}

export function clearAuthSession() {
  window.localStorage.removeItem(tokenKey);
  window.localStorage.removeItem(userKey);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined;

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth) {
    const token = getAuthToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Request failed. Please try again.');
  }

  return data as T;
}
