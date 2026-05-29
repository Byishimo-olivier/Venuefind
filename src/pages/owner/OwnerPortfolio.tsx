import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ProviderShell } from './ProviderShell';
import { exportCsv, filterVenues, useOwnerData, useOwnerSearch, venueExportRows } from './ownerData';

const fallbackImage =
  'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=500';

export default function OwnerPortfolio() {
  const { venues, isLoading, error } = useOwnerData();
  const { query, setQuery } = useOwnerSearch();
  const [statusFilter, setStatusFilter] = useState('all');
  const activeCount = venues.filter((venue) => venue.status === 'approved' || venue.status === 'Approved').length;
  const pendingCount = venues.filter((venue) => venue.status === 'pending' || venue.status === 'Pending Approval').length;
  const searchedVenues = filterVenues(venues, query);
  const filteredVenues = searchedVenues.filter((venue) => {
    const status = String(venue.status || '').toLowerCase();
    if (statusFilter === 'active') return ['approved', 'active'].includes(status);
    if (statusFilter === 'pending') return status.includes('pending');
    if (statusFilter === 'archived') return status.includes('archived');
    return true;
  });

  return (
    <ProviderShell>
      <section className="portfolio-wrap">
        <div className="provider-toolbar">
          <input placeholder="Search your venues..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <button type="button" onClick={() => exportCsv('owner-venues', venueExportRows(filteredVenues))}>Export CSV</button>
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
          <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All Venues ({venues.length})</button>
          <button className={statusFilter === 'active' ? 'active' : ''} onClick={() => setStatusFilter('active')}>Active Listings ({activeCount})</button>
          <button className={statusFilter === 'pending' ? 'active' : ''} onClick={() => setStatusFilter('pending')}>Pending Review ({pendingCount})</button>
          <button className={statusFilter === 'archived' ? 'active' : ''} onClick={() => setStatusFilter('archived')}>Archived (0)</button>
          <span>Sort by: <b>Most Recent</b></span>
        </nav>

        {isLoading && <p>Loading your venues...</p>}
        {error && <p className="field-error centered">{error}</p>}

        <div className="owner-listing-table-wrap">
          <table className="owner-listing-table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Location</th>
                <th>Status</th>
                <th>Capacity</th>
                <th>Rate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVenues.map((venue) => (
                <tr key={venue.id}>
                  <td>
                    <div className="owner-listing-cell">
                      <img src={venue.heroImage || fallbackImage} alt="" />
                      <div>
                        <strong>{venue.name}</strong>
                        <span>{venue.category}</span>
                      </div>
                    </div>
                  </td>
                  <td>{venue.location}</td>
                  <td><span className={`owner-status-pill ${String(venue.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`}>{venue.status || 'Pending'}</span></td>
                  <td>{venue.capacity}</td>
                  <td>{venue.rating || 'New'}</td>
                  <td><Link to={`/venues/${venue.id}`}>Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>

          {!isLoading && filteredVenues.length === 0 && !error && (
            <article className="expand-card">
              <strong>New</strong>
              <h2>{venues.length ? 'No matching venues' : 'No venues yet'}</h2>
              <p>{venues.length ? 'Adjust search or filters to find another listing.' : 'List a new luxury space and connect with premium event planners.'}</p>
              <Link to="/owner/register">Start Listing</Link>
            </article>
          )}

          {filteredVenues.length > 0 && (
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
