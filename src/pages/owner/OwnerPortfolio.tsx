import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Venue } from '../../data/venues';
import { deleteVenue, updateVenue } from '../../services/venues';
import { ProviderShell } from './ProviderShell';
import { exportCsv, filterVenues, useOwnerData, useOwnerSearch, venueExportRows } from './ownerData';
import { getCurrentCoordinates } from '../../utils/geolocation';

const fallbackImage =
  'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=500';

export default function OwnerPortfolio() {
  const { venues, isLoading, error } = useOwnerData();
  const { query, setQuery } = useOwnerSearch();
  const [localVenues, setLocalVenues] = useState<Venue[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [venueDraft, setVenueDraft] = useState<Partial<Venue>>({});
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyVenueId, setBusyVenueId] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const activeCount = localVenues.filter((venue) => venue.status === 'approved' || venue.status === 'Approved').length;
  const pendingCount = localVenues.filter((venue) => venue.status === 'pending' || venue.status === 'Pending Approval').length;
  const searchedVenues = filterVenues(localVenues, query);
  const filteredVenues = searchedVenues.filter((venue) => {
    const status = String(venue.status || '').toLowerCase();
    if (statusFilter === 'active') return ['approved', 'active'].includes(status);
    if (statusFilter === 'pending') return status.includes('pending');
    if (statusFilter === 'archived') return status.includes('archived');
    return true;
  });

  useEffect(() => {
    setLocalVenues(venues);
  }, [venues]);

  const openEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setVenueDraft({
      capacity: venue.capacity,
      category: venue.category,
      description: venue.description,
      latitude: venue.latitude || '',
      longitude: venue.longitude || '',
      location: venue.location,
      name: venue.name,
      price: venue.price,
      province: venue.province,
      setting: venue.setting,
    });
    setActionError('');
    setActionMessage('');
    setLocationStatus('');
  };

  const updateDraft = (field: keyof Venue, value: string) => {
    setVenueDraft((current) => ({ ...current, [field]: value }));
  };

  const saveVenueEdit = async () => {
    if (!editingVenue) return;
    setBusyVenueId(editingVenue.id);
    setActionError('');
    try {
      const updated = await updateVenue(editingVenue.id, venueDraft);
      setLocalVenues((current) => current.map((venue) => venue.id === updated.id ? updated : venue));
      setEditingVenue(null);
      setActionMessage(`${updated.name} was updated.`);
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : 'Unable to update venue.');
    } finally {
      setBusyVenueId('');
    }
  };

  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    setLocationStatus('');

    try {
      const coordinates = await getCurrentCoordinates();
      setVenueDraft((current) => ({
        ...current,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      }));
      setLocationStatus('Location added.');
    } catch (locationError) {
      setLocationStatus(locationError instanceof Error ? locationError.message : 'Unable to get your location.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const removeVenue = async (venue: Venue) => {
    const confirmed = window.confirm(`Delete ${venue.name}? This removes it from customer listings.`);
    if (!confirmed) return;

    setBusyVenueId(venue.id);
    setActionError('');
    try {
      await deleteVenue(venue.id);
      setLocalVenues((current) => current.filter((item) => item.id !== venue.id));
      setActionMessage(`${venue.name} was deleted.`);
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'Unable to delete venue.');
    } finally {
      setBusyVenueId('');
    }
  };

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
          <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All Venues ({localVenues.length})</button>
          <button className={statusFilter === 'active' ? 'active' : ''} onClick={() => setStatusFilter('active')}>Active Listings ({activeCount})</button>
          <button className={statusFilter === 'pending' ? 'active' : ''} onClick={() => setStatusFilter('pending')}>Pending Review ({pendingCount})</button>
          <button className={statusFilter === 'archived' ? 'active' : ''} onClick={() => setStatusFilter('archived')}>Archived (0)</button>
          <span>Sort by: <b>Most Recent</b></span>
        </nav>

        {isLoading && <p>Loading your venues...</p>}
        {error && <p className="field-error centered">{error}</p>}
        {actionMessage && <p className="owner-action-message">{actionMessage}</p>}
        {actionError && <p className="field-error centered">{actionError}</p>}

        <div className="owner-listing-table-wrap">
          <table className="owner-listing-table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Location</th>
                <th>Status</th>
                <th>Capacity</th>
                <th>Rate</th>
                <th>Actions</th>
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
                  <td>
                    <div className="owner-row-actions">
                      <Link to={`/venues/${venue.id}`}>Open</Link>
                      <button type="button" onClick={() => openEdit(venue)} disabled={busyVenueId === venue.id}>Edit</button>
                      <button className="danger" type="button" onClick={() => removeVenue(venue)} disabled={busyVenueId === venue.id}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!isLoading && filteredVenues.length === 0 && !error && (
            <article className="expand-card">
              <strong>New</strong>
              <h2>{localVenues.length ? 'No matching venues' : 'No venues yet'}</h2>
              <p>{localVenues.length ? 'Adjust search or filters to find another listing.' : 'List a new luxury space and connect with premium event planners.'}</p>
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

        {editingVenue && (
          <div className="owner-modal-backdrop" role="presentation">
            <section className="owner-modal" role="dialog" aria-modal="true" aria-labelledby="edit-venue-title">
              <header>
                <h2 id="edit-venue-title">Edit Venue</h2>
                <button type="button" onClick={() => setEditingVenue(null)} aria-label="Close edit venue">Close</button>
              </header>
              <div className="owner-edit-grid">
                <label>Name<input value={venueDraft.name || ''} onChange={(event) => updateDraft('name', event.target.value)} /></label>
                <label>Category<input value={venueDraft.category || ''} onChange={(event) => updateDraft('category', event.target.value)} /></label>
                <label>Location<input value={venueDraft.location || ''} onChange={(event) => updateDraft('location', event.target.value)} /></label>
                <div className="coordinate-heading wide">
                  <span>Coordinates</span>
                  <button type="button" onClick={handleGetLocation} disabled={isGettingLocation}>
                    {isGettingLocation ? 'Getting location...' : 'Get location'}
                  </button>
                </div>
                <label>Latitude<input value={venueDraft.latitude || ''} onChange={(event) => updateDraft('latitude', event.target.value)} /></label>
                <label>Longitude<input value={venueDraft.longitude || ''} onChange={(event) => updateDraft('longitude', event.target.value)} /></label>
                {locationStatus && <p className={locationStatus === 'Location added.' ? 'location-status wide' : 'field-error wide'}>{locationStatus}</p>}
                <label>Province<input value={venueDraft.province || ''} onChange={(event) => updateDraft('province', event.target.value)} /></label>
                <label>Capacity<input value={venueDraft.capacity || ''} onChange={(event) => updateDraft('capacity', event.target.value)} /></label>
                <label>Rate<input value={venueDraft.price || ''} onChange={(event) => updateDraft('price', event.target.value)} /></label>
                <label>Setting<input value={venueDraft.setting || ''} onChange={(event) => updateDraft('setting', event.target.value)} /></label>
                <label className="wide">Description<textarea value={venueDraft.description || ''} onChange={(event) => updateDraft('description', event.target.value)} /></label>
              </div>
              <footer>
                <button type="button" onClick={() => setEditingVenue(null)}>Cancel</button>
                <button className="primary" type="button" onClick={saveVenueEdit} disabled={busyVenueId === editingVenue.id}>
                  {busyVenueId === editingVenue.id ? 'Saving...' : 'Save Changes'}
                </button>
              </footer>
            </section>
          </div>
        )}
      </section>
    </ProviderShell>
  );
}
