import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Venue } from '../../data/venues';
import { getVenue as getVenueFromApi } from '../../services/venues';
import { listVenueReviews } from '../../services/reviews';
import type { ReviewSummary, VenueReview } from '../../services/reviews';
import './venues.css';

const defaultSummary: ReviewSummary = {
  average: 'New',
  count: 0,
  categories: {
    cleanliness: 'New',
    service: 'New',
    value: 'New',
    location: 'New',
  },
};

function renderStars(value: string | number) {
  const rating = Math.round(Number(value) || 0);
  return `${'★'.repeat(rating)}${'☆'.repeat(Math.max(0, 5 - rating))}`;
}

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(value));
}

function ratingWidth(value: string) {
  const rating = Number(value);
  return Number.isFinite(rating) ? `${Math.min(100, Math.max(0, (rating / 5) * 100))}%` : '0%';
}

export default function VenueReviews() {
  const { venueId = '' } = useParams();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [reviews, setReviews] = useState<VenueReview[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>(defaultSummary);
  const [status, setStatus] = useState('Loading reviews...');

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([getVenueFromApi(venueId), listVenueReviews(venueId)])
      .then(([venueResult, reviewResult]) => {
        if (!isMounted) return;

        if (venueResult.status === 'fulfilled') {
          setVenue(venueResult.value);
        } else {
          setVenue(null);
        }

        if (reviewResult.status === 'fulfilled') {
          setReviews(reviewResult.value.reviews);
          setSummary(reviewResult.value.summary);
          setStatus('');
        } else {
          setStatus('Reviews are unavailable right now.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [venueId]);

  const featuredReview = reviews[0];
  const otherReviews = reviews.slice(1);
  const venueName = venue?.name || 'this venue';

  return (
    <main className="reviews-page">
      <ReviewsHeader venueId={venueId} />
      <section className="reviews-wrap">
        <div className="reviews-hero">
          <div>
            <h1>Guest Perspectives</h1>
            <p>Unfiltered experiences from events at {venueName}.</p>
          </div>
          <aside className="rating-summary">
            <strong>{summary.average}</strong>
            {summary.count > 0 && <span>/ 5</span>}
            <p>{renderStars(summary.average)}</p>
            <small>{summary.count ? `Based on ${summary.count} verified reviews` : 'No reviews yet'}</small>
          </aside>
        </div>

        <div className="reviews-layout">
          <aside className="detailed-ratings">
            <h2>Detailed Ratings</h2>
            {[
              ['Cleanliness', summary.categories.cleanliness],
              ['Service', summary.categories.service],
              ['Value', summary.categories.value],
              ['Location', summary.categories.location],
            ].map(([label, value]) => (
              <div className="rating-row" key={label}>
                <span>{label}</span>
                <i><b style={{ width: ratingWidth(value) }} /></i>
                <em>{value}</em>
              </div>
            ))}
          </aside>

          <section className="review-stream">
            <div className="review-tabs">
              <button className="active">All Reviews</button>
              <button>With Photos</button>
              <button>Events</button>
              <Link to={`/venues/${venueId}/review/new`}>Leave your Review</Link>
            </div>

            {status && <p className="review-status">{status}</p>}

            {!status && !featuredReview && (
              <article className="plain-review empty-review">
                <h2>No reviews yet</h2>
                <p>Be the first guest to share an experience for this venue.</p>
              </article>
            )}

            {featuredReview && (
              <article className="featured-review">
                <div className="review-copy">
                  <div className="reviewer-line">
                    <span className="review-avatar">{featuredReview.reviewerName.slice(0, 1)}</span>
                    <div>
                      <strong>{featuredReview.reviewerName}</strong>
                      <small>{featuredReview.reviewerRole} · {formatReviewDate(featuredReview.createdAt)}</small>
                    </div>
                    <b>{renderStars(featuredReview.rating)}</b>
                  </div>
                  <h2>{featuredReview.title}</h2>
                  <p>{featuredReview.body}</p>
                  <blockquote>
                    <strong>{featuredReview.eventType}</strong>
                    Rated {featuredReview.rating}/5 overall.
                  </blockquote>
                </div>
                {featuredReview.mediaUrl || venue?.heroImage ? (
                  <img src={featuredReview.mediaUrl || venue?.heroImage} alt={`${venueName} reviewed event setup`} />
                ) : null}
              </article>
            )}

            {otherReviews.map((review) => (
              <article className="plain-review" key={review.id}>
                <div className="reviewer-line">
                  <span className="review-avatar">{review.reviewerName.slice(0, 1)}</span>
                  <div><strong>{review.reviewerName}</strong><small>{review.reviewerRole} · {formatReviewDate(review.createdAt)}</small></div>
                  <b>{renderStars(review.rating)}</b>
                </div>
                <h2>{review.title}</h2>
                <p>{review.body}</p>
              </article>
            ))}
          </section>
        </div>
      </section>
      <ReviewsFooter />
    </main>
  );
}

export function ReviewsHeader({ venueId = '' }: { venueId?: string }) {
  return (
    <header className="reviews-header">
      <Link to="/venues" className="reviews-logo">VenueElite</Link>
      <nav>
        <Link to="/venues">Discover</Link>
        <Link to="/venues/search">Collections</Link>
        <Link className="active" to={`/venues/${venueId}/reviews`}>Reviews</Link>
        <Link to={`/venues/${venueId}/book`}>Concierge</Link>
      </nav>
      <div>
        <input placeholder="Search venues..." />
        <Link to="/owner/register">List Your Venue</Link>
        <span>Account</span>
      </div>
    </header>
  );
}

export function ReviewsFooter() {
  return (
    <footer className="reviews-footer">
      <strong>VenueElite</strong>
      <span>© 2026 VenueElite Discovery. The Digital Concierge Framework.</span>
      <nav>Privacy Policy&nbsp;&nbsp;&nbsp;Terms of Service&nbsp;&nbsp;&nbsp;Press Kit&nbsp;&nbsp;&nbsp;Contact Support</nav>
    </footer>
  );
}
