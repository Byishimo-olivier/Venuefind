import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import type { Venue } from '../../data/venues';
import { getAuthUser } from '../../services/api';
import { addFavoriteVenue, listFavoriteVenueIds, removeFavoriteVenue } from '../../services/favorites';
import { listVenues } from '../../services/venues';
import { FavoriteButton } from './FavoriteButton';
import { VenueAssistant } from './VenueAssistant';
import { VenueFooter, VenueHeader } from './VenueHome';
import './venues.css';

const provinceOptions = ['All Provinces', 'Kigali City', 'Eastern Province', 'Northern Province', 'Western Province', 'Southern Province'];
const categoryOptions = ['All Types', 'Garden Venue', 'Conference Hall', 'Corporate Hub', 'Indoor/Outdoor', 'Heritage & Luxury Stay'];
const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Capacity: High to Low'];

function parseNumber(value: string) {
  const amount = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

function venueMatchesSearch(venue: Venue, search: string) {
  const terms = search
    .toLowerCase()
    .split(/[\s,]+/)
    .map((term) => term.trim())
    .filter(Boolean)
    .filter((term) => term !== 'rwanda');

  if (!terms.length) return true;

  const text = [
    venue.name,
    venue.location,
    venue.province,
    venue.category,
    venue.label,
    venue.setting,
    venue.description,
    ...(venue.tags || []),
  ].join(' ').toLowerCase();

  return terms.every((term) => text.includes(term));
}

function venueMatchesCategory(venue: Venue, category: string) {
  if (category === 'All Types') return true;
  const text = [venue.category, venue.label, venue.setting, ...(venue.tags || [])].join(' ').toLowerCase();
  return text.includes(category.toLowerCase());
}

function VenuePreview({ venue }: { venue: Venue }) {
  return venue.heroMediaType === 'video' ? (
    <video src={venue.heroImage} muted autoPlay loop playsInline />
  ) : (
    <img src={venue.heroImage} alt="" />
  );
}

export default function VenueAllList() {
  const [searchParams] = useSearchParams();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [favoriteVenueIds, setFavoriteVenueIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(() => searchParams.get('location') || '');
  const [province, setProvince] = useState('All Provinces');
  const [category, setCategory] = useState('All Types');
  const [sortBy, setSortBy] = useState('Recommended');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    listVenues()
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

  useEffect(() => {
    if (!getAuthUser()) return;
    let isMounted = true;
    listFavoriteVenueIds()
      .then((ids) => {
        if (isMounted) setFavoriteVenueIds(ids);
      })
      .catch(() => {
        if (isMounted) setFavoriteVenueIds([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleVenues = useMemo(() => {
    const filtered = venues.filter((venue) => (
      venueMatchesSearch(venue, search) &&
      (province === 'All Provinces' || venue.province === province) &&
      venueMatchesCategory(venue, category)
    ));

    return [...filtered].sort((a, b) => {
      if (sortBy === 'Price: Low to High') return parseNumber(a.price) - parseNumber(b.price);
      if (sortBy === 'Price: High to Low') return parseNumber(b.price) - parseNumber(a.price);
      if (sortBy === 'Capacity: High to Low') return parseNumber(b.capacity) - parseNumber(a.capacity);
      return Number(b.rating !== 'New') - Number(a.rating !== 'New') || parseNumber(a.price) - parseNumber(b.price);
    });
  }, [category, province, search, sortBy, venues]);

  const toggleFavorite = async (venueId: string) => {
    if (!getAuthUser()) {
      navigate(`/login?redirect=${encodeURIComponent('/venues/all')}`);
      return;
    }

    const isSaved = favoriteVenueIds.includes(venueId);
    setFavoriteVenueIds((current) => isSaved ? current.filter((id) => id !== venueId) : [...current, venueId]);
    try {
      const ids = isSaved ? await removeFavoriteVenue(venueId) : await addFavoriteVenue(venueId);
      setFavoriteVenueIds(ids);
    } catch (_error) {
      setFavoriteVenueIds((current) => isSaved ? [...current, venueId] : current.filter((id) => id !== venueId));
    }
  };

  return (
    <main className="venues-page">
      <VenueHeader />
      <section className="all-venues-wrap">
        <div className="all-venues-heading">
          <div>
            <p className="eyebrow">Customer Venue Directory</p>
            <h1>Browse all venues</h1>
            <p>{isLoading ? 'Loading live venues from the backend.' : `${visibleVenues.length} of ${venues.length} venues available.`}</p>
          </div>
          <Link to="/venues/search">View Map</Link>
        </div>

        <div className="all-venue-filters">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, city, province, or style" />
          <select value={province} onChange={(event) => setProvince(event.target.value)} aria-label="Province">
            {provinceOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Venue type">
            {categoryOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort venues">
            {sortOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>

        {visibleVenues.length > 0 ? (
          <div className="all-venue-grid">
            {visibleVenues.map((venue) => (
              <Link className="all-venue-card" to={`/venues/${venue.id}`} key={venue.id}>
                <div className="all-venue-media">
                  <VenuePreview venue={venue} />
                  <span>{venue.label || venue.category}</span>
                  <FavoriteButton isSaved={favoriteVenueIds.includes(venue.id)} label={venue.name} onToggle={() => toggleFavorite(venue.id)} />
                </div>
                <div className="all-venue-info">
                  <p>{venue.location}</p>
                  <h2>{venue.name}</h2>
                  <div className="tag-row">
                    {(venue.tags || []).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="all-venue-meta">
                    <strong>{venue.price}</strong>
                    <span>{venue.capacity}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-venues">{error || 'No venues match those filters yet.'}</p>
        )}
      </section>
      <VenueFooter />
      <VenueAssistant venues={visibleVenues.length > 0 ? visibleVenues : venues} />
    </main>
  );
}
