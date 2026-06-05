import type { Payment } from './bookings';
import { getAuthToken } from './api';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export type PaymentMethod = 'card' | 'phone';

export interface PaymentConfig {
  method: PaymentMethod;
  amount: number;
  currency: string;
  bookingId?: string;
  venueId?: string;
  phoneNumber?: string;
}

export interface PaymentResponse {
  payment: Payment & {
    redirectUrl?: string;
    provider?: string;
    providerId?: string;
  };
}

/**
 * Get headers with authorization token
 */
function getHeaders(contentType = 'application/json'): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': contentType,
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Parse JSON response body safely
 */
async function parseJsonBody(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn('Failed to parse JSON response:', error, text);
    return null;
  }
}

export async function createPaymentIntent(config: PaymentConfig) {
  const response = await fetch(`${apiBaseUrl}/api/payments/intent`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(config),
  });

  const body = await parseJsonBody(response);
  if (!response.ok) {
    const message = body?.error?.message || body?.error || body?.message || response.statusText || 'Failed to create payment intent';
    throw new Error(message);
  }

  if (!body) {
    throw new Error('Failed to parse payment intent response from server.');
  }

  return body as PaymentResponse;
}

/**
 * Confirm a payment (for PesaPal card payments or Paypack mobile after approval)
 */
export async function confirmPayment(paymentId: string) {
  const response = await fetch(
    `${apiBaseUrl}/api/payments/${encodeURIComponent(paymentId)}/confirm`,
    {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({}),
    }
  );

  const body = await parseJsonBody(response);
  if (!response.ok) {
    const message = body?.error?.message || body?.error || body?.message || response.statusText || 'Payment confirmation failed';
    throw new Error(message);
  }

  if (!body) {
    throw new Error('Failed to parse payment confirmation response from server.');
  }

  return body as PaymentResponse;
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentId: string) {
  const response = await fetch(
    `${apiBaseUrl}/api/payments/${encodeURIComponent(paymentId)}`,
    {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    }
  );

  const body = await parseJsonBody(response);
  if (!response.ok) {
    const message = body?.error?.message || body?.error || body?.message || response.statusText || 'Failed to get payment status';
    throw new Error(message);
  }

  if (!body) {
    throw new Error('Failed to parse payment status response from server.');
  }

  return body as PaymentResponse;
}

/**
 * Redirect to PesaPal for card payment
 */
export function redirectToPesaPal(redirectUrl: string) {
  window.location.href = redirectUrl;
}

/**
 * Redirect to Paypack checkout for mobile payment when a redirect URL is provided
 */
export function redirectToPayPal(redirectUrl: string) {
  window.location.href = redirectUrl;
}

/**
 * Poll payment status (for phone/mobile payments)
 */
export async function pollPaymentStatus(
  paymentId: string,
  maxAttempts = 30,
  interval = 2000
) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const result = await getPaymentStatus(paymentId);
      if (result.payment.status === 'paid') {
        return result.payment;
      }
    } catch (error) {
      console.error('Error polling payment status:', error);
    }

    // Wait before next attempt
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error('Payment confirmation timeout. Please check your payment status.');
}

/**
 * Initialize card payment via PesaPal
 */
export async function initiatePesapalCardPayment(config: PaymentConfig) {
  if (config.method !== 'card') {
    throw new Error('PesaPal card payment requires method: "card"');
  }

  const paymentResponse = await createPaymentIntent(config);
  
  if (!paymentResponse.payment.redirectUrl) {
    throw new Error('PesaPal did not return a checkout link. Please try again or contact support.');
  }

  redirectToPesaPal(paymentResponse.payment.redirectUrl);
  return paymentResponse.payment;
}

/**
 * Initiate mobile payment via Paypack
 */
export async function initiatePayPalMobilePayment(config: PaymentConfig) {
  if (config.method !== 'phone') {
    throw new Error('Paypack mobile payment requires method: "phone"');
  }

  const paymentResponse = await createPaymentIntent(config);

  if (paymentResponse.payment.redirectUrl) {
    redirectToPayPal(paymentResponse.payment.redirectUrl);
  }

  return paymentResponse.payment;
}
