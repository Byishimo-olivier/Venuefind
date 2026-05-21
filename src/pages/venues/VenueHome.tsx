import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Venue } from '../../data/venues';
import { getAllVenues } from '../../data/venues';
import { getAuthUser, clearAuthSession } from '../../services/api';
import { listVenues } from '../../services/venues';
import './venues.css';

const heroImage =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85';
const lodgeImage =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85';
const rooftopImage =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85';
const resortImage =
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=85';

const provinces = [
  {
    name: 'Kigali City',
    count: '128 venues',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Northern Province',
    count: '45 venues',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Eastern Province',
    count: '32 venues',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Southern Province',
    count: '28 venues',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Western Province',
    count: '56 venues',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&q=80',
  },
];

const recent = [
  {
    name: 'Kigali Heights Executive Suite',
    location: 'Kiyovu, Kigali',
    tags: 'Business · Tech',
    price: '$450 / Day',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'King’s Palace Heritage Hall',
    location: 'Nyanza, South',
    tags: 'Cultural · Legacy',
    price: '$800 / Day',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Lakeview Estate Gardens',
    location: 'Gisenyi, West',
    tags: 'Social · Outdoor',
    price: '$1,200 / Day',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=85',
  },
];

export default function VenueHome() {
  const [location, setLocation] = useState('Kigali, Rwanda');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [venues, setVenues] = useState<Venue[]>(() => getAllVenues());
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    listVenues()
      .then((items) => {
        if (isMounted) setVenues(items.length ? items : getAllVenues());
      })
      .catch(() => {
        if (isMounted) setVenues(getAllVenues());
      })
      .finally(() => {
        if (isMounted) setIsLoadingVenues(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const recentVenues = venues.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/venues/search?location=${encodeURIComponent(location)}`);
  };

  return (
    <main className="venues-page">
      <VenueHeader />

      <section className="venue-hero">
        <div className="venue-hero-copy">
          <p className="eyebrow">Smart Event Venue Discovery</p>
          <h1>Curating Rwanda's most prestigious locations for world-class gatherings.</h1>
          <p>
            Experience the precision of AI-driven recommendations tailored to your legacy events.
          </p>
          <form className="venue-search" onSubmit={handleSearch}>
            <div className="search-field">
              <label htmlFor="location">Location</label>
              <div className="search-input-wrapper">
                <span className="search-icon">📍</span>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city or venue name"
                />
              </div>
            </div>

            <div className="search-field">
              <label htmlFor="checkIn">Check In</label>
              <div className="search-input-wrapper">
                <span className="search-icon">📅</span>
                <input
                  id="checkIn"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>
            </div>

            <div className="search-field">
              <label htmlFor="checkOut">Check Out</label>
              <div className="search-input-wrapper">
                <span className="search-icon">📅</span>
                <input
                  id="checkOut"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="search-button">
              Search Venues
            </button>
          </form>
        </div>

        <div className="venue-hero-media">
          <img src={heroImage} alt="Modern glass venue at dusk" />
          <div className="recommendation-card">
            <span>AI Recommendation</span>
            <strong>Kigali Convention Centre</strong>
            <p>Ideal for high-level international summits with up to 5,000 delegates.</p>
          </div>
        </div>
      </section>

      <section className="recent-section">
        <div className="section-title-row">
          <div>
            <h2>Saved Venue Listings</h2>
            <p>{isLoadingVenues ? 'Loading venues saved by owners.' : 'Live listings from the database.'}</p>
          </div>
          <Link to="/venues/search">Browse all saved venues</Link>
        </div>
        <div className="recent-grid">
          {recentVenues.map((venue) => (
            <Link to={`/venues/${venue.id}`} key={venue.id}>
              <button aria-label={`Save ${venue.name}`}>♡</button>
              {venue.heroMediaType === 'video' ? (
                <video src={venue.heroImage} muted autoPlay loop playsInline />
              ) : (
                <img src={venue.heroImage} alt="" />
              )}
              <p className="location">{venue.location}</p>
              <h3>{venue.name}</h3>
              <div>
                <span>{venue.tags?.slice(0, 2).join(' · ') || venue.category}</span>
                <strong>{venue.price}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="recommendations">
        <div className="section-title-row">
          <div>
            <h2>Recommended for You</h2>
            <p>Based on your recent interest in luxury boutique spaces.</p>
          </div>
          <Link to="/venues/search">View all recommendations →</Link>
        </div>

        <div className="recommendation-grid">
          <Link to="/venues/akagera" className="feature-venue">
            <img src={lodgeImage} alt="Mountain lodge venue" />
            <div>
              <span>Premium Boutique</span>
              <h3>Siveta Kwitonda Lodge</h3>
              <p>Experience unparalleled intimacy and heritage-inspired design at the edge of Volcanoes National Park.</p>
              <small>40 Guests · Verified Venue</small>
            </div>
          </Link>

          <div className="stacked-venues">
            <Link to="/venues/akagera">
              <img src={rooftopImage} alt="Rooftop lounge overlooking a city" />
              <div>
                <h3>Ubumwe Grande Rooftop</h3>
                <p>Urban sophistication with 360° city views.</p>
              </div>
            </Link>
            <Link to="/venues/akagera">
              <img src={resortImage} alt="Hotel garden venue at sunset" />
              <div>
                <h3>Cleo Lake Kivu Hotel</h3>
                <p>Refined lakeside tranquility for retreats.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="province-section">
        <h2>Explore by Province</h2>
        <div className="province-grid">
          {provinces.map((province) => (
            <article key={province.name}>
              <img src={province.image} alt="" />
              <h3>{province.name}</h3>
              <p>{province.count}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="recent-section">
        <h2>Recently Viewed</h2>
        <div className="recent-grid">
          {recent.map((venue) => (
            <Link to="/venues/akagera" key={venue.name}>
              <button aria-label={`Save ${venue.name}`}>♡</button>
              <img src={venue.image} alt="" />
              <p className="location">⌖ {venue.location}</p>
              <h3>{venue.name}</h3>
              <div>
                <span>{venue.tags}</span>
                <strong>{venue.price}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="registry-band">
        <div>
          <h2>Plan your next landmark event</h2>
          <p>Join our exclusive network of event organizers and receive curated lists of new venue openings across Rwanda.</p>
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

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/venues/search?location=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="venue-header">
      <Link to="/venues" className="venue-logo">
        Virunga Venues
      </Link>
      <nav>
        <Link to="/venues" className="active">Venues</Link>
        <Link to="/venues/search">Services</Link>
        <Link to="/venues/akagera/book">Planning</Link>
        <Link to="/venues/akagera">Heritage</Link>
      </nav>
      <div className="header-actions">
        <form className="header-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venues..."
            aria-label="Search venues"
          />
          <button type="submit" aria-label="Search">
            🔍
          </button>
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
                justifyContent: 'center'
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
                marginTop: '8px'
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#666' }}>Logged in as</p>
                  <p style={{ margin: '0', fontWeight: '600', fontSize: '0.95rem' }}>{user.fullName}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#999' }}>{user.email}</p>
                </div>
                {user.role !== 'customer' && (
                  <>
                    <Link 
                      to="/owner" 
                      onClick={() => setShowProfile(false)}
                      style={{ display: 'block', padding: '10px 16px', color: '#333', textDecoration: 'none', fontSize: '0.9rem' }}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/owner/portfolio" 
                      onClick={() => setShowProfile(false)}
                      style={{ display: 'block', padding: '10px 16px', color: '#333', textDecoration: 'none', fontSize: '0.9rem', borderTop: '1px solid #eee' }}
                    >
                      My Portfolio
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: '#fff',
                    border: 'none',
                    borderTop: user.role !== 'customer' ? '1px solid #eee' : '1px solid #eee',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#d32f2f',
                    textAlign: 'left',
                    fontWeight: '500'
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
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none'
            }}
          >
            👤
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
          <Link to="/venues/akagera">Heritage Sites</Link>
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
        <span>© 2026 Smart Event Venue. A Virunga Venues Brand.</span>
        <span>Privacy Policy&nbsp;&nbsp;&nbsp;&nbsp;Terms of Service</span>
      </div>
    </footer>
  );
}
