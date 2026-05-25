import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Venue } from '../../data/venues';
import { getVenue as getVenueFromApi } from '../../services/venues';
import { createVenueReview } from '../../services/reviews';
import { ReviewsHeader } from './VenueReviews';
import './venues.css';

type RatingField = 'rating' | 'cleanliness' | 'service' | 'value' | 'location';

const ratingLabels: Array<[RatingField, string]> = [
  ['rating', 'Overall Experience'],
  ['cleanliness', 'Cleanliness & Ambiance'],
  ['service', 'Staff & Service'],
  ['value', 'Value for Investment'],
  ['location', 'Location'],
];

function StarInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label>
      <span>{label}</span>
      <b className="star-input">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            type="button"
            className={rating <= value ? 'active' : ''}
            key={rating}
            onClick={() => onChange(rating)}
            aria-label={`${label}: ${rating} out of 5`}
          >
            ★
          </button>
        ))}
      </b>
    </label>
  );
}

export default function VenueReviewForm() {
  const { venueId = '' } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('');
  const [eventType, setEventType] = useState('Event');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [ratings, setRatings] = useState<Record<RatingField, number>>({
    rating: 5,
    cleanliness: 5,
    service: 5,
    value: 5,
    location: 5,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getVenueFromApi(venueId)
      .then((apiVenue) => {
        if (isMounted) setVenue(apiVenue);
      })
      .catch(() => {
        if (isMounted) setVenue(null);
      });

    return () => {
      isMounted = false;
    };
  }, [venueId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!title.trim() || body.trim().length < 20) {
      setError('Add a title and at least 20 characters of review detail.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createVenueReview(venueId, {
        reviewerName,
        reviewerRole,
        eventType,
        title,
        body,
        mediaUrl,
        ...ratings,
      });
      navigate(`/venues/${venueId}/reviews`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Could not submit review.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="review-form-page">
      <ReviewsHeader venueId={venueId} />
      {!venue ? (
        <section className="review-form-wrap">
          <p className="empty-venues">Venue not found in the backend database.</p>
        </section>
      ) : (
      <section className="review-form-wrap">
        <aside className="review-venue-card">
          <div>
            <img src={venue.heroImage} alt="" />
            <span>{venue.tier}</span>
            <h2>{venue.name}</h2>
            <p>{venue.location}</p>
          </div>
          <article>
            <h3>Your Review Matters</h3>
            <p>Sharing your detailed experience helps future guests make informed decisions and allows venue partners to improve their service.</p>
            <small>Verified Guest Review</small>
          </article>
        </aside>

        <form className="review-form-card" onSubmit={handleSubmit}>
          <h1>Share Your Experience</h1>
          <p>Detail your event experience at {venue.name}.</p>

          <section>
            <h2>Rate Your Visit</h2>
            <div className="rate-grid">
              {ratingLabels.map(([field, label]) => (
                <StarInput
                  key={field}
                  label={label}
                  value={ratings[field]}
                  onChange={(value) => setRatings((current) => ({ ...current, [field]: value }))}
                />
              ))}
            </div>
          </section>

          <section>
            <h2>The Details</h2>
            <label>
              Your Name
              <input value={reviewerName} onChange={(event) => setReviewerName(event.target.value)} placeholder="Guest Reviewer" />
            </label>
            <label>
              Review Context
              <input value={reviewerRole} onChange={(event) => setReviewerRole(event.target.value)} placeholder="Verified Wedding Client" />
            </label>
            <label>
              Event Type
              <input value={eventType} onChange={(event) => setEventType(event.target.value)} placeholder="Wedding, summit, retreat..." />
            </label>
            <label>
              Review Title
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Summarize your experience" />
            </label>
            <label>
              Detailed Experience
              <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="What stood out to you? Mention amenities, staff interactions, or details that shaped your event." />
            </label>
            <small>{body.trim().length}/20 characters minimum.</small>
          </section>

          <section>
            <h2>Photos & Videos</h2>
            <p>Paste a media URL from your event if you want it shown with your review.</p>
            <label>
              Media URL
              <input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} placeholder="https://example.com/event-photo.jpg" />
            </label>
          </section>

          {error && <p className="review-error">{error}</p>}

          <div className="review-actions">
            <Link to={`/venues/${venueId}/reviews`}>Cancel</Link>
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Review'}</button>
          </div>
        </form>
      </section>
      )}
    </main>
  );
}
