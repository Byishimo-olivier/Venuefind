import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import type { Venue } from '../../data/venues';
import { listVenues } from '../../services/venues';
import { VenueAssistant } from './VenueAssistant';
import { VenueFooter, VenueHeader } from './VenueHome';
import './venues.css';

const heritageHero = 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85';

function getPreviewMedia(venue: Venue) {
  const galleryMedia = Array.isArray(venue.galleryMedia) ? venue.galleryMedia.filter((item) => item?.url) : [];
  const galleryImage = Array.isArray(venue.galleryImages) ? venue.galleryImages.find(Boolean) : '';

  if (galleryMedia.length > 0) return galleryMedia[0];
  if (galleryImage) return { url: galleryImage, type: 'image' as const };
  return { url: venue.heroImage, type: venue.heroMediaType || 'image' as const };
}

function isHeritageVenue(venue: Venue) {
  const text = [
    venue.name,
    venue.category,
    venue.label,
    venue.setting,
    venue.description,
    venue.tier,
    ...(venue.tags || []),
  ].join(' ').toLowerCase();

  return ['heritage', 'cultural', 'traditional', 'luxury stay', 'retreat'].some((term) => text.includes(term));
}

function VenueMedia({ venue }: { venue: Venue }) {
  const media = getPreviewMedia(venue);
  return media.type === 'video' ? <video src={media.url} muted autoPlay loop playsInline /> : <img src={media.url} alt="" />;
}

export default function VenueHeritage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    listVenues({ limit: 100 })
      .then((items) => {
        if (!isMounted) return;
        setVenues(items);
        setError('');
      })
      .catch((loadError) => {
        if (!isMounted) return;
        setVenues([]);
        setError(loadError instanceof Error ? loadError.message : 'Could not load backend venues.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const heritageVenues = useMemo(() => venues.filter(isHeritageVenue), [venues]);
  const featuredVenue = heritageVenues[0] || venues[0];

  return (
    <main className="venues-page">
      <VenueHeader />
      <section className="heritage-hero">
        <img src={featuredVenue?.heroImage || heritageHero} alt="" />
        <div>
          <p className="eyebrow">Rwanda Heritage</p>
          <h1>Host moments shaped by place, culture, and memory.</h1>
          <p>Explore venues with heritage character, retreat settings, cultural hospitality, and refined stays for landmark gatherings.</p>
          <Link to="/venues/planning">Plan with all venues</Link>
        </div>
      </section>

      <section className="heritage-story">
        <article>
          <span>01</span>
          <h2>Cultural Setting</h2>
          <p>Shortlist spaces that carry a stronger sense of place for ceremonies, retreats, and hosted experiences.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Guest Journey</h2>
          <p>Compare locations by province, capacity, and style before sending guests into booking and event details.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Verified Venues</h2>
          <p>Every card comes from live owner listings, so customers see the same inventory used across planning.</p>
        </article>
      </section>

      <section className="recent-section heritage-listing">
        <div className="section-title-row">
          <div>
            <h2>Heritage Venues</h2>
            <p>{isLoading ? 'Loading heritage-ready listings.' : `${heritageVenues.length} heritage-focused venues available.`}</p>
          </div>
          <Link to="/venues/planning">Browse all customer venues</Link>
        </div>

        {heritageVenues.length > 0 ? (
          <div className="recent-grid">
            {heritageVenues.map((venue) => (
              <Link to={`/venues/${venue.id}`} key={venue.id}>
                <VenueMedia venue={venue} />
                <p className="location">{venue.location}</p>
                <h3>{venue.name}</h3>
                <div>
                  <span>{venue.tags?.slice(0, 2).join(' - ') || venue.category}</span>
                  <strong>{venue.price}</strong>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-venues">{error || 'No heritage venues match the live listings yet.'}</p>
        )}
      </section>

      <VenueFooter />
      <VenueAssistant venues={heritageVenues.length > 0 ? heritageVenues : venues} />
    </main>
  );
}
