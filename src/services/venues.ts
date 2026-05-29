import { apiRequest } from './api';
import type { Venue } from '../data/venues';

type VenueResponse = {
  venue: Venue;
};

type VenuesResponse = {
  venues: Venue[];
};

export async function createVenue(input: Partial<Venue>) {
  const result = await apiRequest<VenueResponse>('/api/venues', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(input),
  });

  return result.venue;
}

export async function getVenue(id: string) {
  const result = await apiRequest<VenueResponse>(`/api/venues/${encodeURIComponent(id)}`);
  return result.venue;
}

export async function listVenues(options: { limit?: number; skip?: number } = {}) {
  const params = new URLSearchParams();

  if (options.limit) params.set('limit', String(options.limit));
  if (options.skip) params.set('skip', String(options.skip));

  const query = params.toString();
  const result = await apiRequest<VenuesResponse>(`/api/venues${query ? `?${query}` : ''}`);
  return result.venues;
}

export async function listMyVenues() {
  const result = await apiRequest<VenuesResponse>('/api/venues/mine', {
    auth: true,
  });

  return result.venues;
}
