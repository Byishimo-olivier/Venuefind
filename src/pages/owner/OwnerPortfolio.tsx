import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Venue } from '../../data/venues';
import { listMyVenues } from '../../services/venues';
import { ProviderShell } from './ProviderShell';

const fallbackImage =
  'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=500';

export default function OwnerPortfolio() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    listMyVenues()
      .then((items) => {
        if (isMounted) setVenues(items);
      })
      .catch((loadError) => {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Unable to load your venues.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeCount = venues.filter((venue) => venue.status === 'approved' || venue.status === 'Approved').length;
  const pendingCount = venues.filter((venue) => venue.status === 'pending' || venue.status === 'Pending Approval').length;

  return (
    <ProviderShell>
      <section className="portfolio-wrap">
        <div className="provider-toolbar">
          <input placeholder="Search your venues..." />
          <span>Filter</span>
        </div>

        <div className="portfolio-heading">
          <div>
            <p>Marketplace · Portfolio</p>
            <h1>Your Portfolio</h1>
            <span>Overview of your curated event spaces across Rwanda.</span>
          </div>
          <Link to="/owner/register">Add New Venue</Link>
        </div>

        <nav className="portfolio-tabs">
          <button className="active">All Venues ({venues.length})</button>
          <button>Active Listings ({activeCount})</button>
          <button>Pending Review ({pendingCount})</button>
          <button>Archived (0)</button>
          <span>Sort by: <b>Most Recent</b></span>
        </nav>

        {isLoading && <p>Loading your venues...</p>}
        {error && <p className="field-error centered">{error}</p>}

        <div className="portfolio-grid">
          {venues.map((venue) => (
            <article className="property-card" key={venue.id}>
              <div className="property-preview">
                <span className="online">{venue.status || 'Pending'}</span>
                <img src={venue.heroImage || fallbackImage} alt="" />
              </div>
              <h2>{venue.name}<b>{venue.rating || 'New'}</b></h2>
              <p>{venue.location}</p>
              <div>
                <span>Base Price<strong>{venue.price}</strong></span>
                <span>Capacity<strong>{venue.capacity}</strong></span>
              </div>
              <footer>
                <span>{venue.category}</span>
                <Link to={`/venues/${venue.id}`}>View Listing</Link>
              </footer>
            </article>
          ))}

          {!isLoading && venues.length === 0 && !error && (
            <article className="expand-card">
              <strong>New</strong>
              <h2>No venues yet</h2>
              <p>List a new luxury space and connect with premium event planners.</p>
              <Link to="/owner/register">Start Listing</Link>
            </article>
          )}

          {venues.length > 0 && (
            <article className="expand-card">
              <strong>New</strong>
              <h2>Expand Your Portfolio</h2>
              <p>List a new luxury space and connect with premium event planners.</p>
              <Link to="/owner/register">Start Listing</Link>
            </article>
          )}
        </div>
      </section>
    </ProviderShell>
  );
}
