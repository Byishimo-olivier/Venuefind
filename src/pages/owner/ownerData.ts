import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Venue } from '../../data/venues';
import { apiRequest } from '../../services/api';
import { listBookings } from '../../services/bookings';
import type { Booking } from '../../services/bookings';
import { listMyVenues } from '../../services/venues';

export type OwnerData = {
  venues: Venue[];
  bookings: Booking[];
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  subscriptionStartedAt?: string;
  subscriptionTrialEndsAt?: string;
  subscriptionNextBillingAt?: string;
  isLoading: boolean;
  error: string;
};

type OwnerOverviewResponse = {
  venues: Venue[];
  bookings: Booking[];
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  subscriptionStartedAt?: string;
  subscriptionTrialEndsAt?: string;
  subscriptionNextBillingAt?: string;
};

const defaultSubscription = {
  subscriptionPlan: 'starter',
  subscriptionStatus: 'active',
  subscriptionStartedAt: '',
  subscriptionTrialEndsAt: '',
  subscriptionNextBillingAt: '',
};

async function getOwnerOverview() {
  return apiRequest<OwnerOverviewResponse>('/api/owner/overview', {
    auth: true,
  });
}

export function useOwnerData(): OwnerData {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>('starter');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('active');
  const [subscriptionStartedAt, setSubscriptionStartedAt] = useState<string>('');
  const [subscriptionTrialEndsAt, setSubscriptionTrialEndsAt] = useState<string>('');
  const [subscriptionNextBillingAt, setSubscriptionNextBillingAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    getOwnerOverview()
      .catch(() => Promise.all([listMyVenues(), listBookings()]).then(([venueItems, bookingItems]) => ({
        bookings: bookingItems,
        ...defaultSubscription,
        venues: venueItems,
      })))
      .then(({ venues: venueItems, bookings: bookingItems, subscriptionPlan: plan, subscriptionStatus: status, subscriptionStartedAt: started, subscriptionTrialEndsAt: trialEnds, subscriptionNextBillingAt: nextBilling }) => {
        if (!isMounted) return;
        setVenues(venueItems);
        setBookings(bookingItems);
        setSubscriptionPlan(plan || 'starter');
        setSubscriptionStatus(status || 'active');
        setSubscriptionStartedAt(started || '');
        setSubscriptionTrialEndsAt(trialEnds || '');
        setSubscriptionNextBillingAt(nextBilling || '');
      })
      .catch((loadError) => {
        if (!isMounted) return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load owner data.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    venues,
    bookings,
    subscriptionPlan,
    subscriptionStatus,
    subscriptionStartedAt,
    subscriptionTrialEndsAt,
    subscriptionNextBillingAt,
    isLoading,
    error,
  };
}

export function useOwnerSummary(venues: Venue[], bookings: Booking[]) {
  return useMemo(() => {
    const activeStatuses = new Set(['confirmed', 'pending_deposit']);
    const confirmedStatuses = new Set(['confirmed']);
    const completedStatuses = new Set(['completed', 'paid']);
    const pendingStatuses = new Set(['pending_deposit', 'pending']);
    const totalRevenue = bookings.reduce((total, booking) => {
      if (booking.status === 'cancelled') return total;
      return total + Number(booking.totals?.total || 0);
    }, 0);
    const paidRevenue = bookings.reduce((total, booking) => total + Number(booking.amountPaid || 0), 0);
    const pendingRevenue = Math.max(totalRevenue - paidRevenue, 0);
    const confirmedBookings = bookings.filter((booking) => confirmedStatuses.has(booking.status)).length;
    const upcomingBookings = bookings.filter((booking) => activeStatuses.has(booking.status)).length;
    const completedBookings = bookings.filter((booking) => completedStatuses.has(booking.status) || booking.paymentStatus === 'paid').length;
    const pendingBookings = bookings.filter((booking) => pendingStatuses.has(booking.status)).length;
    const guestCount = bookings.reduce((total, booking) => total + Number(booking.guestCount || 0), 0);
    const averageTicket = bookings.length ? Math.round(totalRevenue / bookings.length) : 0;
    const conversionRate = bookings.length ? Math.round((confirmedBookings / bookings.length) * 100) : 0;
    const activeVenues = venues.filter((venue) => ['approved', 'active'].includes(String(venue.status || '').toLowerCase())).length;
    const pendingVenues = venues.filter((venue) => String(venue.status || '').toLowerCase().includes('pending')).length;
    const capacity = venues.reduce((total, venue) => {
      const amount = Number(String(venue.capacity || '').replace(/[^0-9.]/g, ''));
      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);
    const occupancy = capacity ? Math.min(100, Math.round((guestCount / capacity) * 100)) : 0;
    const topVenues = venues
      .map((venue) => {
        const venueBookings = bookings.filter((booking) => booking.venueId === venue.id);
        const revenue = venueBookings.reduce((total, booking) => total + Number(booking.totals?.total || 0), 0);
        return { venue, bookings: venueBookings.length, revenue };
      })
      .sort((a, b) => b.revenue - a.revenue || b.bookings - a.bookings);

    return {
      activeVenues,
      averageTicket,
      capacity,
      completedBookings,
      confirmedBookings,
      conversionRate,
      guestCount,
      occupancy,
      paidRevenue,
      pendingBookings,
      pendingRevenue,
      pendingVenues,
      topVenues,
      totalBookings: bookings.length,
      totalRevenue,
      upcomingBookings,
    };
  }, [venues, bookings]);
}

export function formatRwf(value?: number) {
  return new Intl.NumberFormat('en-RW', {
    currency: 'RWF',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(Number(value || 0));
}

export function formatDate(value?: string) {
  if (!value) return 'Date pending';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function labelStatus(value?: string) {
  return String(value || 'pending')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function statusClass(value?: string) {
  const status = String(value || '').toLowerCase();
  if (status.includes('pending')) return 'pending';
  if (status.includes('cancel')) return 'refunded';
  if (status.includes('paid') || status.includes('complete') || status.includes('confirm')) return 'completed';
  return status || 'pending';
}

export function useOwnerSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  function setQuery(value: string) {
    const next = new URLSearchParams(searchParams);
    if (value.trim()) {
      next.set('q', value);
    } else {
      next.delete('q');
    }
    setSearchParams(next, { replace: true });
  }

  return { query, setQuery };
}

function matchesQuery(values: Array<string | number | undefined | null>, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return values.some((value) => String(value || '').toLowerCase().includes(normalized));
}

export function filterVenues(venues: Venue[], query: string) {
  return venues.filter((venue) => matchesQuery([
    venue.name,
    venue.category,
    venue.location,
    venue.province,
    venue.status,
    venue.capacity,
    venue.price,
  ], query));
}

export function filterBookings(bookings: Booking[], query: string) {
  return bookings.filter((booking) => matchesQuery([
    booking.confirmationNumber,
    booking.customerName,
    booking.customerEmail,
    booking.customerPhone,
    booking.venueName,
    booking.venueLocation,
    booking.date,
    booking.status,
    booking.paymentStatus,
    booking.totals?.total,
  ], query));
}

export function exportCsv(filename: string, rows: Array<Record<string, string | number | undefined | null>>) {
  const headers = Object.keys(rows[0] || { message: 'No data' });
  const sourceRows = rows.length ? rows : [{ message: 'No data' }];
  const csv = [
    headers.join(','),
    ...sourceRows.map((row) => headers.map((header) => {
      const value = String(row[header] ?? '');
      return `"${value.replace(/"/g, '""')}"`;
    }).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function venueExportRows(venues: Venue[]) {
  return venues.map((venue) => ({
    id: venue.id,
    name: venue.name,
    category: venue.category,
    location: venue.location,
    province: venue.province,
    capacity: venue.capacity,
    price: venue.price,
    status: venue.status,
  }));
}

export function bookingExportRows(bookings: Booking[]) {
  return bookings.map((booking) => ({
    id: booking.id,
    confirmationNumber: booking.confirmationNumber,
    venue: booking.venueName,
    customer: booking.customerName || booking.customerEmail || 'Customer',
    date: booking.date,
    startTime: booking.startTime,
    guests: booking.guestCount,
    total: booking.totals?.total,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
  }));
}
