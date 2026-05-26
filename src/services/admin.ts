import { apiRequest } from './api';
import type { AuthUser } from './api';
import type { Booking, Payment } from './bookings';
import type { Venue } from '../data/venues';

export type AdminSummary = {
  totalUsers: number;
  customers: number;
  owners: number;
  admins: number;
  verifiedUsers: number;
  totalVenues: number;
  activeVenues: number;
  pendingVenues: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  paidRevenue: number;
  commission: number;
  pendingPayouts: number;
  conversionRate: number;
};

export type AdminTopVenue = Venue & {
  bookingCount: number;
  revenue: number;
};

export type ProvinceSummary = {
  province: string;
  venues: number;
  bookings: number;
  revenue: number;
};

export type AdminOverview = {
  summary: AdminSummary;
  users: AuthUser[];
  venues: Venue[];
  pendingVenues: Venue[];
  bookings: Booking[];
  payments: Payment[];
  topVenues: AdminTopVenue[];
  provinceSummary: ProvinceSummary[];
};

type AdminOverviewResponse = {
  overview: AdminOverview;
};

export async function getAdminOverview() {
  const result = await apiRequest<AdminOverviewResponse>('/api/admin/overview', {
    auth: true,
  });

  return result.overview;
}

export function formatRwf(value: number) {
  return new Intl.NumberFormat('en-RW', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'RWF',
  }).format(Number.isFinite(value) ? value : 0);
}
