import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Venue } from '../../data/venues';
import { clearAuthSession, getAuthUser } from '../../services/api';
import { addFavoriteVenue, listFavoriteVenueIds, removeFavoriteVenue } from '../../services/favorites';
import { listVenues } from '../../services/venues';
import { AiRecommendations, VenueAssistant } from './VenueAssistant';
import { FavoriteButton } from './FavoriteButton';
import './venues.css';

const heroImage =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85';

const provinceImages: Record<string, string> = {
  'Kigali City': 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=500&q=80',
  'Northern Province': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80',
  'Eastern Province': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=500&q=80',
  'Southern Province': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80',
  'Western Province': 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&q=80',
};

type HomeFilters = {
  location: string;
  checkInDate: string;
  checkOutDate: string;
};

const emptyHomeFilters: HomeFilters = {
  location: '',
  checkInDate: '',
  checkOutDate: '',
};

function VenueMedia({ venue }: { venue: Venue }) {
  return venue.heroMediaType === 'video' ? (
    <video src={venue.heroImage} muted autoPlay loop playsInline />
  ) : (
    <img src={venue.heroImage} alt="" />
  );
}

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function hasActiveHomeFilters(filters: HomeFilters) {
  return Boolean(filters.location.trim() || filters.checkInDate || filters.checkOutDate);
}

function venueMatchesLocation(venue: Venue, locationQuery: string) {
  const terms = locationQuery
    .toLowerCase()
    .split(/[\s,]+/)
    .map((term) => term.trim())
    .filter(Boolean)
    .filter((term) => term !== 'rwanda');

  if (terms.length === 0) return true;

  const searchableText = [
    venue.name,
    venue.location,
    venue.province,
    venue.category,
    venue.label,
    venue.setting,
    venue.description,
    ...(venue.tags || []),
  ].join(' ').toLowerCase();

  return terms.every((term) => searchableText.includes(term));
}

function getSearchPath(filters: HomeFilters) {
  const params = new URLSearchParams();
  if (filters.location.trim()) params.set('location', filters.location.trim());
  if (filters.checkInDate) params.set('checkIn', filters.checkInDate);
  if (filters.checkOutDate) params.set('checkOut', filters.checkOutDate);
  const query = params.toString();
  return `/venues/all${query ? `?${query}` : ''}`;
}

export default function VenueHome() {
  const [location, setLocation] = useState('Kigali, Rwanda');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [activeFilters, setActiveFilters] = useState<HomeFilters>(emptyHomeFilters);
  const [filterError, setFilterError] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [favoriteVenueIds, setFavoriteVenueIds] = useState<string[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [venueLoadError, setVenueLoadError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    listVenues()
      .then((items) => {
        if (!isMounted) return;
        setVenues(items);
        setVenueLoadError('');
      })
      .catch((error) => {
        if (!isMounted) return;
        setVenues([]);
        setVenueLoadError(error instanceof Error ? error.message : 'Could not load backend venues.');
      })
      .finally(() => {
        if (isMounted) setIsLoadingVenues(false);
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

  const hasFilters = hasActiveHomeFilters(activeFilters);
  const visibleVenues = venues.filter((venue) => venueMatchesLocation(venue, activeFilters.location));
  const featuredVenue = visibleVenues[0];
  const stackedVenues = visibleVenues.slice(1, 3);
  const searchPath = getSearchPath(activeFilters);
  const provinceCards = Object.entries(provinceImages).map(([name, image]) => {
    const count = visibleVenues.filter((venue) => venue.province === name).length;
    return {
      name,
      image,
      count: `${count} ${count === 1 ? 'venue' : 'venues'}`,
    };
  });

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    if (checkInDate && checkOutDate && checkOutDate < checkInDate) {
      setFilterError('Check-out date must be after check-in date.');
      return;
    }

    setActiveFilters({ location, checkInDate, checkOutDate });
    setFilterError('');
  };

  const clearFilters = () => {
    setLocation('');
    setCheckInDate('');
    setCheckOutDate('');
    setActiveFilters(emptyHomeFilters);
    setFilterError('');
  };

  const toggleFavorite = async (venueId: string) => {
    if (!getAuthUser()) {
      navigate(`/login?redirect=${encodeURIComponent('/venues')}`);
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

      <section className="venue-hero">
        <div className="venue-hero-copy">
          <p className="eyebrow">Smart Event Venue Discovery</p>
          <h1>Curating Rwanda's most prestigious locations for world-class gatherings.</h1>
          <p>Experience database-backed venue recommendations tailored to your event.</p>
          <form className="venue-search" onSubmit={handleSearch}>
            <div className="search-field">
              <label htmlFor="location">Location</label>
              <div className="search-input-wrapper">
                <span className="search-icon">Pin</span>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Enter city or venue name"
                />
              </div>
            </div>

            <div className="search-field">
              <label htmlFor="checkIn">Check In</label>
              <div className="search-input-wrapper">
                <span className="search-icon">Date</span>
                <input
                  id="checkIn"
                  type="date"
                  value={checkInDate}
                  onChange={(event) => setCheckInDate(event.target.value)}
                />
              </div>
            </div>

            <div className="search-field">
              <label htmlFor="checkOut">Check Out</label>
              <div className="search-input-wrapper">
                <span className="search-icon">Date</span>
                <input
                  id="checkOut"
                  type="date"
                  value={checkOutDate}
                  onChange={(event) => setCheckOutDate(event.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="search-button">Search Venues</button>
            {hasFilters && (
              <button type="button" className="clear-filter-button" onClick={clearFilters}>Clear</button>
            )}
          </form>
          {filterError && <p className="filter-feedback error">{filterError}</p>}
          {hasFilters && !filterError && (
            <p className="filter-feedback">
              Showing {visibleVenues.length} {visibleVenues.length === 1 ? 'venue' : 'venues'}
              {activeFilters.location.trim() ? ` for "${activeFilters.location.trim()}"` : ''}
              {activeFilters.checkInDate ? ` from ${activeFilters.checkInDate}` : ''}
              {activeFilters.checkOutDate ? ` to ${activeFilters.checkOutDate}` : ''}.
            </p>
          )}
        </div>

        <div className="venue-hero-media">
          <img src={heroImage} alt="Modern glass venue at dusk" />
          <div className="recommendation-card">
            <span>Database Listings</span>
            <strong>{isLoadingVenues ? 'Loading venues...' : `${visibleVenues.length} venues available`}</strong>
            <p>{venueLoadError || (hasFilters ? 'Filtered live venue records from the backend are shown below.' : 'Live venue records from the backend are shown below.')}</p>
          </div>
        </div>
      </section>

      <section className="recent-section">
        <div className="section-title-row">
          <div>
            <h2>Venue Listings</h2>
            <p>{isLoadingVenues ? 'Loading venues from owners.' : hasFilters ? 'Live listings matching your filters.' : 'Live listings from the backend database.'}</p>
          </div>
          <Link to={searchPath}>Browse all venues</Link>
        </div>
        {visibleVenues.length > 0 ? (
          <div className="recent-grid">
            {visibleVenues.map((venue) => (
            <Link to={`/venues/${venue.id}`} key={venue.id}>
              <FavoriteButton isSaved={favoriteVenueIds.includes(venue.id)} label={venue.name} onToggle={() => toggleFavorite(venue.id)} />
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
          <p className="empty-venues">{venueLoadError || (hasFilters ? 'No venues match those filters yet.' : 'No venues found in the backend database yet.')}</p>
        )}
      </section>

      {featuredVenue && (
        <section className="recommendations">
          <div className="section-title-row">
            <div>
              <h2>Recommended for You</h2>
              <p>Recommended from live venue records.</p>
            </div>
            <Link to={searchPath}>View all recommendations</Link>
          </div>

          <div className="recommendation-grid">
            <Link to={`/venues/${featuredVenue.id}`} className="feature-venue">
              <VenueMedia venue={featuredVenue} />
              <div>
                <span>{featuredVenue.tier || featuredVenue.category}</span>
                <h3>{featuredVenue.name}</h3>
                <p>{featuredVenue.description}</p>
                <small>{featuredVenue.capacity} - {featuredVenue.status}</small>
              </div>
            </Link>

            <div className="stacked-venues">
              {stackedVenues.map((venue) => (
                <Link to={`/venues/${venue.id}`} key={venue.id}>
                  <VenueMedia venue={venue} />
                  <div>
                    <h3>{venue.name}</h3>
                    <p>{venue.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <AiRecommendations venues={visibleVenues} />

      <section className="province-section">
        <h2>Explore by Province</h2>
        <div className="province-grid">
          {provinceCards.map((province) => (
            <article key={province.name}>
              <img src={province.image} alt="" />
              <h3>{province.name}</h3>
              <p>{province.count}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="recent-section">
        <h2>Recently Added</h2>
        <div className="recent-grid">
          {visibleVenues.slice(0, 3).map((venue) => (
            <Link to={`/venues/${venue.id}`} key={venue.id}>
              <FavoriteButton isSaved={favoriteVenueIds.includes(venue.id)} label={venue.name} onToggle={() => toggleFavorite(venue.id)} />
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
      </section>

      <section className="registry-band">
        <div>
          <h2>Plan your next landmark event</h2>
          <p>Join our event organizer network and receive curated lists of new venue openings across Rwanda.</p>
          <form>
            <input type="email" placeholder="Enter your email" />
            <button type="button">Join Registry</button>
          </form>
        </div>
      </section>

      <VenueFooter />
      <VenueAssistant venues={visibleVenues.length > 0 ? visibleVenues : venues} />
    </main>
  );
}

export function VenueHeader() {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleLogout = () => {
    clearAuthSession();
    setShowProfile(false);
    navigate('/login');
  };

  return (
    <header className="venue-header">
      <Link to="/venues" className="venue-logo">Virunga Venues</Link>
      <nav>
        <Link to="/venues" className="active">Venues</Link>
        <Link to="/venues/search">Services</Link>
        <Link to="/venues/search">Planning</Link>
        <Link to="/venues/search">Heritage</Link>
      </nav>
      <div className="header-actions">
        <Link to="/venues/search" className="header-search-icon" aria-label="Search venues">
          <SearchIcon />
        </Link>
        {user ? (
          <div className="profile-menu" style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              aria-label="User profile"
              style={{
                background: '#1a1a1a',
                border: 'none',
                cursor: 'pointer',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getInitials(user.fullName)}
            </button>
            {showProfile && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: '200px',
                zIndex: 1000,
                marginTop: '8px',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#666' }}>Logged in as</p>
                  <p style={{ margin: '0', fontWeight: '600', fontSize: '0.95rem' }}>{user.fullName}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#999' }}>{user.email}</p>
                </div>
                {user.role !== 'customer' && (
                  <>
                    <Link to="/owner" onClick={() => setShowProfile(false)} style={{ display: 'block', padding: '10px 16px', color: '#333', textDecoration: 'none', fontSize: '0.9rem' }}>Dashboard</Link>
                    <Link to="/owner/portfolio" onClick={() => setShowProfile(false)} style={{ display: 'block', padding: '10px 16px', color: '#333', textDecoration: 'none', fontSize: '0.9rem', borderTop: '1px solid #eee' }}>My Portfolio</Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: '#fff',
                    border: 'none',
                    borderTop: '1px solid #eee',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#d32f2f',
                    textAlign: 'left',
                    fontWeight: '500',
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            aria-label="Account"
            style={{
              background: '#f5f5f5',
              border: 'none',
              cursor: 'pointer',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#173c2e',
            }}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </svg>
  );
}

export function VenueFooter() {
  return (
    <footer className="venue-footer">
      <div className="footer-grid">
        <div>
          <h2>Virunga Venues</h2>
          <p>Connecting international standards with Rwandan heritage since 2024.</p>
        </div>
        <div>
          <h3>Discovery</h3>
          <Link to="/venues/search">Featured Venues</Link>
          <Link to="/venues">Explore Provinces</Link>
          <Link to="/venues/search">Heritage Sites</Link>
          <Link to="/venues/search">Retreat Centers</Link>
        </div>
        <div>
          <h3>For Partners</h3>
          <Link to="/owner/register">List your Venue</Link>
          <Link to="/owner">Provider Dashboard</Link>
          <Link to="/owner/portfolio">Service Marketplace</Link>
          <Link to="/owner/analytics">Case Studies</Link>
        </div>
        <div>
          <h3>Contact</h3>
          <p>Kigali Heights, 4th Floor</p>
          <p>contact@virungavenues.rw</p>
          <p>+250 788 000 000</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Copyright 2026 Smart Event Venue. A Virunga Venues Brand.</span>
        <span>Privacy Policy&nbsp;&nbsp;&nbsp;&nbsp;Terms of Service</span>
      </div>
    </footer>
  );
}
