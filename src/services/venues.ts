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

export async function listVenues() {
  const result = await apiRequest<VenuesResponse>('/api/venues');
  return result.venues;
}

export async function listMyVenues() {
  const result = await apiRequest<VenuesResponse>('/api/venues/mine', {
    auth: true,
  });

  return result.venues;
}
