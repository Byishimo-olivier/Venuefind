import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Venue } from '../../data/venues';
import { clearAuthSession, getAuthUser } from '../../services/api';
import { listVenues } from '../../services/venues';
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

export default function VenueHome() {
  const [location, setLocation] = useState('Kigali, Rwanda');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
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

  const featuredVenue = venues[0];
  const stackedVenues = venues.slice(1, 3);
  const provinceCards = Object.entries(provinceImages).map(([name, image]) => {
    const count = venues.filter((venue) => venue.province === name).length;
    return {
      name,
      image,
      count: `${count} ${count === 1 ? 'venue' : 'venues'}`,
    };
  });

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/venues/search?location=${encodeURIComponent(location)}`);
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
          </form>
        </div>

        <div className="venue-hero-media">
          <img src={heroImage} alt="Modern glass venue at dusk" />
          <div className="recommendation-card">
            <span>Database Listings</span>
            <strong>{isLoadingVenues ? 'Loading venues...' : `${venues.length} venues available`}</strong>
            <p>{venueLoadError || 'Live venue records from the backend are shown below.'}</p>
          </div>
        </div>
      </section>

      <section className="recent-section">
        <div className="section-title-row">
          <div>
            <h2>Saved Venue Listings</h2>
            <p>{isLoadingVenues ? 'Loading venues saved by owners.' : 'Live listings from the backend database.'}</p>
          </div>
          <Link to="/venues/search">Browse all saved venues</Link>
        </div>
        {venues.length > 0 ? (
          <div className="recent-grid">
            {venues.map((venue) => (
            <Link to={`/venues/${venue.id}`} key={venue.id}>
              <button aria-label={`Save ${venue.name}`}>Save</button>
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
          <p className="empty-venues">{venueLoadError || 'No venues found in the backend database yet.'}</p>
        )}
      </section>

      {featuredVenue && (
        <section className="recommendations">
          <div className="section-title-row">
            <div>
              <h2>Recommended for You</h2>
              <p>Recommended from live venue records.</p>
            </div>
            <Link to="/venues/search">View all recommendations</Link>
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
          {venues.slice(0, 3).map((venue) => (
            <Link to={`/venues/${venue.id}`} key={venue.id}>
              <button aria-label={`Save ${venue.name}`}>Save</button>
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
    </main>
  );
}

export function VenueHeader() {
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleLogout = () => {
    clearAuthSession();
    setShowProfile(false);
    navigate('/login');
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/venues/search?location=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
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
        <form className="header-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search venues..."
            aria-label="Search venues"
          />
          <button type="submit" aria-label="Search">Search</button>
        </form>
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
