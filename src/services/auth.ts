import { apiRequest, saveAuthSession, type AuthUser } from './api';

type AuthResponse = {
  token: string;
  user: AuthUser;
  emailSent?: boolean;
  message?: string;
};

type ResetResponse = {
  message: string;
  resetToken?: string;
};

export async function register(input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}) {
  const result = await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  saveAuthSession(result.token, result.user);
  return result;
}

export async function login(input: { email: string; password: string }) {
  const result = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  saveAuthSession(result.token, result.user);
  return result;
}

export async function continueWithGoogle(mode: 'login' | 'signup') {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (clientId && window.google?.accounts?.id) {
    const credential = await getGoogleCredential(clientId);
    const result = await apiRequest<AuthResponse>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential, role: 'customer' }),
    });
    saveAuthSession(result.token, result.user);
    return result;
  }

  const result = await apiRequest<AuthResponse>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({
      role: 'customer',
      profile: {
        email: `google.${mode}@example.com`,
        name: mode === 'signup' ? 'Google Guest' : 'Google User',
        email_verified: true,
        sub: `dev-google-${mode}`,
      },
    }),
  });
  saveAuthSession(result.token, result.user);
  return result;
}

export async function forgotPassword(email: string) {
  return apiRequest<ResetResponse>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string) {
  return apiRequest<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

export async function verifyAccount(code: string, method: 'authenticator' | 'sms') {
  const result = await apiRequest<{ user: AuthUser }>('/api/auth/verify', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ code, method }),
  });

  const token = window.localStorage.getItem('smart-event-auth-token');
  if (token) saveAuthSession(token, result.user);
  return result;
}

export async function resendVerificationCode() {
  const result = await apiRequest<{ user: AuthUser; emailSent?: boolean; message?: string }>('/api/auth/verification-code', {
    method: 'POST',
    auth: true,
  });

  return result;
}

function getGoogleCredential(clientId: string) {
  return new Promise<string>((resolve, reject) => {
    const googleId = window.google?.accounts?.id;
    if (!googleId) {
      reject(new Error('Google sign-in is not available.'));
      return;
    }

    googleId.initialize({
      client_id: clientId,
      callback: (response: { credential?: string }) => {
        if (response.credential) resolve(response.credential);
        else reject(new Error('Google did not return a credential.'));
      },
    });
    googleId.prompt((notification: { isNotDisplayed?: () => boolean; isSkippedMoment?: () => boolean }) => {
      if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
        reject(new Error('Google sign-in was not completed.'));
      }
    });
  });
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
          prompt: (callback?: (notification: { isNotDisplayed?: () => boolean; isSkippedMoment?: () => boolean }) => void) => void;
        };
      };
    };
  }
}
