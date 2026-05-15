import { Link } from 'react-router-dom';
import { ProviderShell } from './ProviderShell';

const venues = [
  ['Kigali Heights', 'Kiyovu, Kigali, Rwanda', 'FRW 4.2M', '500 Pax', '4.9'],
  ['Grand Ballroom', 'Nyarutarama, Kigali, Rwanda', 'FRW 2.8M', '350 Pax', '4.7'],
  ['Serenity Garden', 'Rebero Hill, Kigali, Rwanda', 'FRW 1.1M', '200 Pax', '5.0'],
];

export default function OwnerPortfolio() {
  return (
    <ProviderShell>
      <section className="portfolio-wrap">
        <div className="provider-toolbar"><input placeholder="Search your venues..." /><span>♧ ◉</span></div>
        <div className="portfolio-heading"><div><p>Marketplace · Portfolio</p><h1>Your Portfolio</h1><span>Overview of your curated event spaces across Rwanda.</span></div><Link to="/owner/register">⊕ Add New Venue</Link></div>
        <nav className="portfolio-tabs"><button className="active">All Venues (12)</button><button>Active Listings (8)</button><button>Pending Review (3)</button><button>Archived (1)</button><span>Sort by: <b>Most Recent⌄</b></span></nav>
        <div className="portfolio-grid">
          {venues.map(([name, location, revenue, capacity, rating]) => (
            <article className="property-card" key={name}>
              <div className="property-preview"><span className="online">● Online</span><img src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=500" alt="" /></div>
              <h2>{name}<b>★ {rating}</b></h2>
              <p>⌖ {location}</p>
              <div><span>Monthly Revenue<strong>{revenue}</strong></span><span>Capacity<strong>{capacity}</strong></span></div>
              <footer><span>👤👤</span><Link to="/owner/analytics">View Analytics →</Link></footer>
            </article>
          ))}
          <article className="expand-card"><strong>▤</strong><h2>Expand Your Portfolio</h2><p>List a new luxury space and connect with premium event planners.</p><Link to="/owner/register">Start Listing</Link></article>
        </div>
      </section>
    </ProviderShell>
  );
}
