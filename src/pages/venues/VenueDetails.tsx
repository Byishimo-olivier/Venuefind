import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import type { Venue } from '../../data/venues';
import { getVenue as getVenueFromApi, listVenues } from '../../services/venues';
import { listVenueReviews } from '../../services/reviews';
import type { VenueReview } from '../../services/reviews';
import { VenueAssistant } from './VenueAssistant';
import { VenueHeader } from './VenueHome';
import './venues.css';

const fallbackVenueImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900"%3E%3Cdefs%3E%3ClinearGradient id="sky" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop stop-color="%23d9c07a"/%3E%3Cstop offset=".48" stop-color="%236d8c75"/%3E%3Cstop offset="1" stop-color="%23173c2e"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1400" height="900" fill="url(%23sky)"/%3E%3Cpath d="M0 610c170-105 280-115 430-45 155 72 270 58 410-20 165-92 335-85 560 25v330H0z" fill="%23254f3b" opacity=".82"/%3E%3Cpath d="M190 520h820l120 210H70z" fill="%2310211a" opacity=".8"/%3E%3Cpath d="M250 350h610l185 170H170z" fill="%23f3e1ad" opacity=".86"/%3E%3Cpath d="M300 520h95v150h-95zM460 520h95v150h-95zM620 520h95v150h-95zM780 520h95v150h-95z" fill="%23f7c66f" opacity=".82"/%3E%3Ccircle cx="1090" cy="210" r="72" fill="%23f5d482" opacity=".9"/%3E%3C/svg%3E';

const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.src = fallbackVenueImage;
};

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url) || url.startsWith('data:video/');
}

function getTelHref(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, '');
  return normalized ? `tel:${normalized}` : '#';
}

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(value));
}

export default function VenueDetails() {
  const { venueId } = useParams();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [more, setMore] = useState<Venue[]>([]);
  const [reviews, setReviews] = useState<VenueReview[]>([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [status, setStatus] = useState('Loading venue...');

  useEffect(() => {
    if (!venueId) return;

    let isMounted = true;
    getVenueFromApi(venueId)
      .then((apiVenue) => {
        if (!isMounted) return;
        setVenue(apiVenue);
        setStatus('');
      })
      .catch((error) => {
        if (!isMounted) return;
        setVenue(null);
        setStatus(error instanceof Error ? error.message : 'Venue not found.');
      });

    listVenues()
      .then((items) => {
        if (isMounted) setMore(items.filter((item) => item.id !== venueId).slice(0, 3));
      })
      .catch(() => {
        if (isMounted) setMore([]);
      });

    return () => {
      isMounted = false;
    };
  }, [venueId]);

  useEffect(() => {
    if (!venueId) return;

    let isMounted = true;
    listVenueReviews(venueId)
      .then((result) => {
        if (isMounted) setReviews(result.reviews.slice(0, 2));
      })
      .catch(() => {
        if (isMounted) setReviews([]);
      });

    return () => {
      isMounted = false;
    };
  }, [venueId]);

  if (!venue) {
    return (
      <main className="venue-detail-page">
        <VenueHeader />
        <section className="detail-wrap">
          <p className="empty-venues">{status || 'Venue not found.'}</p>
          <Link to="/venues/search">Browse available venues</Link>
        </section>
      </main>
    );
  }

  const gallery = venue.galleryMedia?.length
    ? venue.galleryMedia
    : (venue.galleryImages.length ? venue.galleryImages : [venue.heroImage, venue.heroImage]).map((url) => ({
        url,
        type: isVideoUrl(url) ? 'video' as const : 'image' as const,
      }));
  const allMedia = [
    { url: venue.heroImage, type: venue.heroMediaType, name: 'Cover' },
    ...gallery.filter((item) => item.url !== venue.heroImage),
  ].filter((item) => item.url);
  const selectedMedia = allMedia[selectedMediaIndex] || allMedia[0];

  return (
    <main className="venue-detail-page">
      <VenueHeader />
      <div className="detail-wrap">
        <p className="breadcrumb">Venues / {venue.province} / {venue.name}</p>

        <section className="detail-hero-grid">
          <div className="detail-hero">
            {venue.heroMediaType === 'video' ? (
              <video src={venue.heroImage} muted autoPlay loop playsInline controls />
            ) : (
              <img src={venue.heroImage} alt={`${venue.name} event space`} onError={handleImageError} />
            )}
            <div>
              <span>{venue.category}</span>
              <h1>{venue.name}</h1>
              <p>{venue.location}</p>
            </div>
          </div>
          <div className="detail-side-media">
            <article>
              {allMedia[1]?.type === 'video' ? (
                <video src={allMedia[1].url} muted controls playsInline />
              ) : (
                <img src={allMedia[1]?.url || fallbackVenueImage} alt={`${venue.name} gallery`} onError={handleImageError} />
              )}
              <button type="button" onClick={() => setSelectedMediaIndex(0)}>View All ({allMedia.length})</button>
            </article>
            <article className="virtual-tour">
              {allMedia[2]?.type === 'video' ? (
                <video src={allMedia[2].url} muted controls playsInline />
              ) : (
                <img src={allMedia[2]?.url || fallbackVenueImage} alt={`${venue.name} tour`} onError={handleImageError} />
              )}
              <div>
                <strong>{allMedia[2]?.type === 'video' ? 'Video' : 'Media'}</strong>
                <h2>{allMedia[2]?.type === 'video' ? 'Venue Video' : 'Venue Gallery'}</h2>
                <p>Explore {venue.setting.toLowerCase()}</p>
              </div>
            </article>
          </div>
        </section>

        {allMedia.length > 0 && (
          <section className="venue-media-gallery" id="venue-media-gallery">
            <div className="section-title-row">
              <h2>All Media</h2>
              <span>{allMedia.length} media files</span>
            </div>

            <div className="venue-media-viewer">
              <div className="venue-media-stage">
                {selectedMedia?.type === 'video' ? (
                  <video src={selectedMedia.url} controls playsInline />
                ) : (
                  <img src={selectedMedia?.url || fallbackVenueImage} alt={`${venue.name} selected media`} onError={handleImageError} />
                )}
              </div>

              <div className="venue-media-thumbs">
                {allMedia.map((item, index) => (
                  <button
                    type="button"
                    className={index === selectedMediaIndex ? 'active' : ''}
                    key={`${item.url.slice(0, 32)}-${index}`}
                    onClick={() => setSelectedMediaIndex(index)}
                    aria-label={`Show ${item.type} ${index + 1}`}
                  >
                    {item.type === 'video' ? (
                      <video src={item.url} muted playsInline />
                    ) : (
                      <img src={item.url} alt="" onError={handleImageError} />
                    )}
                    <span>{index === 0 ? 'Cover' : item.type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="media-preview-strip">
              {allMedia.map((item, index) => (
                <button
                  type="button"
                  className={index === selectedMediaIndex ? 'active' : ''}
                  key={`${item.url.slice(0, 32)}-strip-${index}`}
                  onClick={() => setSelectedMediaIndex(index)}
                >
                  {item.type === 'video' ? (
                    <video src={item.url} muted playsInline />
                  ) : (
                    <img src={item.url} alt={`${venue.name} media ${index + 1}`} onError={handleImageError} />
                  )}
                  <small>{index === 0 ? 'Cover' : item.type}</small>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="detail-content-grid">
          <section className="detail-main">
            <section className="essence-section">
              <h2>The Venue Experience</h2>
              <p>{venue.description}</p>
              <div className="venue-facts">
                <div><span>Capacity</span><strong>{venue.capacity}</strong></div>
                <div><span>Venue Type</span><strong>{venue.label}</strong></div>
                <div><span>Setting</span><strong>{venue.setting}</strong></div>
              </div>
            </section>

            <section>
              <h2 className="detail-section-title">Premium Amenities</h2>
              <div className="amenity-grid">
                {venue.amenities.map((amenity) => (
                  <article key={amenity.title}>
                    <span>{amenity.icon}</span>
                    <h3>{amenity.title}</h3>
                    <p>{amenity.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="reviews-section">
              <div className="reviews-heading">
                <div>
                  <h2>Professional Reviews</h2>
                  <p>Endorsed by Rwanda's event planners</p>
                </div>
                <strong>{venue.rating === 'New' ? 'New listing' : `Star ${venue.rating}`} <span>({venue.reviews} Reviews)</span></strong>
              </div>
              {reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="review-avatar">{review.reviewerName.slice(0, 1)}</div>
                  <div>
                    <div className="review-meta">
                      <strong>{review.reviewerName}</strong>
                      <span>{formatReviewDate(review.createdAt)}</span>
                    </div>
                    <p>"{review.body}"</p>
                    <small>{review.reviewerRole}</small>
                  </div>
                </article>
              ))}
              {!reviews.length && (
                <article className="review-card">
                  <div className="review-avatar">N</div>
                  <div>
                    <div className="review-meta">
                      <strong>No reviews yet</strong>
                      <span>New</span>
                    </div>
                    <p>"Be the first guest to share your experience at this venue."</p>
                    <small>Guest feedback</small>
                  </div>
                </article>
              )}
            </section>
          </section>

          <aside className="booking-aside">
            <div className="pricing-card">
              <span>Base Pricing</span>
              <h2>{venue.price} <small>/ day</small></h2>
              <p>Pricing varies by season and guest count.</p>
              <dl>
                <div><dt>Venue Hire</dt><dd>Included</dd></div>
                <div><dt>Cleaning Fee</dt><dd>{venue.cleaningFee}</dd></div>
                <div><dt>Decor Package</dt><dd>{venue.decorFee}</dd></div>
              </dl>
              <Link to={`/venues/${venue.id}/book`} className="request-button">Request Booking Details</Link>
              <button>Download Brochure (PDF)</button>
            </div>
            <div className="mini-map-card">
              <div>
                <span>Pin</span>
                <Link to="/venues/search">View on Map</Link>
              </div>
            </div>
            <div className="concierge-card">
              <strong>Call</strong>
              <p>
                {venue.contactPerson}<br />
                <a href={getTelHref(venue.phone)}>{venue.phone}</a>
              </p>
            </div>
          </aside>
        </div>

        <section className="more-escapes">
          <div className="section-title-row">
            <h2>Explore More Escapes</h2>
            <Link to="/venues/search">Browse All Venues</Link>
          </div>
          <div className="more-grid">
            {more.map((item) => (
              <Link to={`/venues/${item.id}`} key={item.id}>
                {item.heroMediaType === 'video' ? (
                  <video src={item.heroImage} muted autoPlay loop playsInline />
                ) : (
                  <img src={item.heroImage} alt="" onError={handleImageError} />
                )}
                <span>{item.province}</span>
                <h3>{item.name}</h3>
                <p>{item.category}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <footer className="detail-footer">
        <div>
          <h2>Virunga Venues</h2>
          <p>Curating Rwanda's most prestigious spaces for corporate milestones, cultural celebrations, and life's grandest moments.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/venues/search">Our Portfolio</Link>
          <Link to={`/venues/${venue.id}/book`}>Planning Services</Link>
          <Link to="/venues/search">Cultural Guidance</Link>
          <Link to={`/venues/${venue.id}/reviews`}>Sustainability</Link>
        </div>
        <div>
          <h3>Company</h3>
          <Link to="/venues">About Us</Link>
          <Link to="/owner/register">Partner With Us</Link>
          <Link to="/owner/analytics">Press & Media</Link>
          <Link to="/login">Contact Support</Link>
        </div>
      </footer>
      <VenueAssistant venues={[venue, ...more]} />
    </main>
  );
}
