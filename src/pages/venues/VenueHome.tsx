import { Link } from 'react-router-dom';
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
          <form className="venue-search">
            <label>
              <span aria-hidden="true">⌖</span>
              Kigali, Rwanda
            </label>
            <label>
              <span aria-hidden="true">□</span>
              Select dates
            </label>
            <Link to="/venues/search">Search</Link>
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

export function VenueHeader() {
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
        <Link to="/venues/search" aria-label="Search venues">⌕</Link>
        <Link to="/login" aria-label="Account">◎</Link>
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
