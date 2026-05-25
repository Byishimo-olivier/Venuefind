import { apiRequest } from './api';

export type BookingAddon = {
  id: string;
  name: string;
  description: string;
  amount: number;
};

export type BookingTotals = {
  currency: string;
  baseVenueFee: number;
  cleaningFee: number;
  decorFee: number;
  addonsTotal: number;
  subtotal: number;
  vatRate: number;
  vat: number;
  total: number;
  depositRate: number;
  depositDue: number;
  balanceDue: number;
};

export type Booking = {
  id: string;
  confirmationNumber: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  ownerId?: string | null;
  venueId: string;
  venueName: string;
  venueLocation: string;
  venueImage: string;
  date: string;
  startTime: string;
  durationHours: number;
  guestCount: number;
  addons: BookingAddon[];
  totals: BookingTotals;
  status: string;
  paymentStatus: string;
  amountPaid?: number;
  balanceRemaining?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Payment = {
  id: string;
  bookingId: string | null;
  amount: number;
  currency: string;
  method: string;
  status: string;
};

type AddonsResponse = {
  addons: BookingAddon[];
};

type AvailabilityResponse = {
  availability: {
    venueId: string;
    month: string | null;
    blocked: Array<{
      date: string;
      startTime: string;
      durationHours: number;
      status: string;
    }>;
  };
};

type BookingResponse = {
  booking: Booking;
};

type BookingsResponse = {
  bookings: Booking[];
};

type PaymentResponse = {
  payment: Payment;
};

export async function listBookingAddons(venueId?: string) {
  const query = venueId ? `?venueId=${encodeURIComponent(venueId)}` : '';
  const result = await apiRequest<AddonsResponse>(`/api/bookings/addons${query}`);
  return result.addons;
}

export async function getBookingAvailability(venueId: string, month: string) {
  const result = await apiRequest<AvailabilityResponse>(`/api/bookings/availability?venueId=${encodeURIComponent(venueId)}&month=${encodeURIComponent(month)}`);
  return result.availability;
}

export async function createBooking(input: {
  venueId: string;
  date: string;
  startTime: string;
  durationHours: number;
  guestCount: number;
  addons: string[];
}) {
  const result = await apiRequest<BookingResponse>('/api/bookings', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(input),
  });

  return result.booking;
}

export async function listBookings() {
  const result = await apiRequest<BookingsResponse>('/api/bookings', {
    auth: true,
  });

  return result.bookings;
}

export async function getBooking(id: string) {
  const result = await apiRequest<BookingResponse>(`/api/bookings/${encodeURIComponent(id)}`, {
    auth: true,
  });

  return result.booking;
}

export async function cancelBooking(id: string) {
  const result = await apiRequest<BookingResponse>(`/api/bookings/${encodeURIComponent(id)}/cancel`, {
    method: 'PATCH',
    auth: true,
  });

  return result.booking;
}

export async function createPaymentIntent(input: {
  bookingId: string;
  amount?: number;
  method: string;
}) {
  const result = await apiRequest<PaymentResponse>('/api/payments/intent', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(input),
  });

  return result.payment;
}

export async function confirmPayment(paymentId: string) {
  const result = await apiRequest<PaymentResponse>(`/api/payments/${encodeURIComponent(paymentId)}/confirm`, {
    method: 'POST',
    auth: true,
  });

  return result.payment;
}
