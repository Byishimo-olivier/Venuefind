import { apiRequest } from './api';

type FavoritesResponse = {
  venueIds: string[];
};

const fallbackKey = 'smart-event-favorite-venue-ids';

function readFallbackFavorites() {
  try {
    return JSON.parse(window.localStorage.getItem(fallbackKey) || '[]') as string[];
  } catch {
    return [];
  }
}

function writeFallbackFavorites(venueIds: string[]) {
  window.localStorage.setItem(fallbackKey, JSON.stringify([...new Set(venueIds)]));
}

function isMissingFavoritesRoute(error: unknown) {
  return error instanceof Error && /route not found|not found|404/i.test(error.message);
}

export async function listFavoriteVenueIds() {
  try {
    const result = await apiRequest<FavoritesResponse>('/api/favorites', {
      auth: true,
    });
    writeFallbackFavorites(result.venueIds);
    return result.venueIds;
  } catch (error) {
    if (isMissingFavoritesRoute(error)) return readFallbackFavorites();
    throw error;
  }
}

export async function addFavoriteVenue(venueId: string) {
  try {
    const result = await apiRequest<FavoritesResponse>(`/api/favorites/${encodeURIComponent(venueId)}`, {
      method: 'POST',
      auth: true,
    });
    writeFallbackFavorites(result.venueIds);
    return result.venueIds;
  } catch (error) {
    if (!isMissingFavoritesRoute(error)) throw error;
    const venueIds = [...readFallbackFavorites(), venueId];
    writeFallbackFavorites(venueIds);
    return [...new Set(venueIds)];
  }
}

export async function removeFavoriteVenue(venueId: string) {
  try {
    const result = await apiRequest<FavoritesResponse>(`/api/favorites/${encodeURIComponent(venueId)}`, {
      method: 'DELETE',
      auth: true,
    });
    writeFallbackFavorites(result.venueIds);
    return result.venueIds;
  } catch (error) {
    if (!isMissingFavoritesRoute(error)) throw error;
    const venueIds = readFallbackFavorites().filter((id) => id !== venueId);
    writeFallbackFavorites(venueIds);
    return venueIds;
  }
}
