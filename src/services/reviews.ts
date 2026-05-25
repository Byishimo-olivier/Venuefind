import { apiRequest } from './api';

export type VenueReview = {
  id: string;
  venueId: string;
  reviewerName: string;
  reviewerRole: string;
  eventType: string;
  title: string;
  body: string;
  rating: number;
  cleanliness: number;
  service: number;
  value: number;
  location: number;
  mediaUrl: string;
  createdAt: string;
};

export type ReviewSummary = {
  average: string;
  count: number;
  categories: {
    cleanliness: string;
    service: string;
    value: string;
    location: string;
  };
};

type ReviewsResponse = {
  reviews: VenueReview[];
  summary: ReviewSummary;
};

type CreateReviewResponse = {
  review: VenueReview;
  summary: ReviewSummary;
};

export type CreateReviewInput = {
  reviewerName: string;
  reviewerRole: string;
  eventType: string;
  title: string;
  body: string;
  rating: number;
  cleanliness: number;
  service: number;
  value: number;
  location: number;
  mediaUrl?: string;
};

export async function listVenueReviews(venueId: string) {
  return apiRequest<ReviewsResponse>(`/api/venues/${encodeURIComponent(venueId)}/reviews`);
}

export async function createVenueReview(venueId: string, input: CreateReviewInput) {
  return apiRequest<CreateReviewResponse>(`/api/venues/${encodeURIComponent(venueId)}/reviews`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
