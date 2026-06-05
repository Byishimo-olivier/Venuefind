import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../components/ui/chart';
import type { Venue } from '../../data/venues';
import { deleteVenue, updateVenue } from '../../services/venues';
import { OwnerShell, MetricCard } from './OwnerShell';
import { bookingExportRows, exportCsv, filterBookings, filterVenues, formatRwf, useOwnerData, useOwnerSearch, useOwnerSummary, venueExportRows } from './ownerData';
import { getCurrentCoordinates } from '../../utils/geolocation';

type MonthlyBookingData = {
  month: string;
  bookings: number;
  revenue: number;
};

const demandChartConfig = {
  bookings: {
    label: 'Bookings',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export default function OwnerDashboard() {
  const { venues, bookings, isLoading, error } = useOwnerData();
  const { query, setQuery } = useOwnerSearch();
  const [localVenues, setLocalVenues] = useState<Venue[]>([]);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [venueDraft, setVenueDraft] = useState<Partial<Venue>>({});
  const [busyVenueId, setBusyVenueId] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const filteredVenues = filterVenues(localVenues, query);
  const filteredBookings = filterBookings(bookings, query);
  const summary = useOwnerSummary(filteredVenues, filteredBookings);
  const monthlyBookingData = buildMonthlyBookingData(filteredBookings);

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
    setActionMessage('');
    setActionError('');
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
    <OwnerShell>
      <section className="owner-content">
        <div className="owner-heading">
          <div><p>Financial Intelligence</p><h1>Executive Dashboard</h1></div>
          <div>
            <button type="button" onClick={() => setQuery('')}>Clear Search</button>
            <button className="gold" type="button" onClick={() => exportCsv('owner-dashboard-summary', [
              { metric: 'Total Revenue', value: summary.totalRevenue },
              { metric: 'Total Bookings', value: summary.totalBookings },
              { metric: 'Confirmed Guests', value: summary.guestCount },
              { metric: 'Average Ticket', value: summary.averageTicket },
            ])}>Export Summary</button>
          </div>
        </div>

        {isLoading && <p>Loading owner dashboard...</p>}
        {error && <p className="field-error centered">{error}</p>}
        {actionMessage && <p className="owner-action-message">{actionMessage}</p>}
        {actionError && <p className="field-error centered">{actionError}</p>}

        <div className="owner-metrics-grid">
          <MetricCard label="Total Revenue" value={formatRwf(summary.totalRevenue)} delta={`${summary.totalBookings} bookings`} />
          <MetricCard label="Confirmed Guests" value={String(summary.guestCount)} accent="gold" delta={`${summary.upcomingBookings} upcoming`} />
          <MetricCard label="Booking Conversion" value={`${summary.conversionRate}%`} delta={`${summary.confirmedBookings} confirmed`} />
          <MetricCard label="Average Ticket" value={formatRwf(summary.averageTicket)} accent="gold" delta={`${filteredVenues.length} venues`} />
        </div>

        <div className="forecast-grid">
          <section className="forecast-card owner-chart-card">
            <div className="card-title"><h2>Venue Demand Forecasting</h2><p>Booking volume and revenue by month from live reservations.</p></div>
            <div className="owner-chart-wrap">
              <DemandChart data={monthlyBookingData} />
            </div>
          </section>
          <aside className="top-venues-card">
            <h2>Top Venues</h2>
            {summary.topVenues.slice(0, 4).map(({ venue, revenue, bookings: bookingCount }) => (
              <article key={venue.id}>
                <img src={venue.heroImage || 'https://images.pexels.com/photos/265947/pexels-photo-265947.jpeg?auto=compress&cs=tinysrgb&w=120'} alt="" />
                <div><strong>{venue.name}</strong><span>{venue.category || 'Venue'}</span></div>
                <b>{formatRwf(revenue)}<small>{bookingCount} bookings</small></b>
                <div className="owner-row-actions">
                  <button type="button" onClick={() => openEdit(venue)} disabled={busyVenueId === venue.id}>Edit</button>
                  <button className="danger" type="button" onClick={() => removeVenue(venue)} disabled={busyVenueId === venue.id}>Delete</button>
                </div>
              </article>
            ))}
            {!isLoading && summary.topVenues.length === 0 && <p>No venue performance yet.</p>}
            <Link to="/owner/portfolio">View All Listings</Link>
          </aside>
        </div>

        <section className="insight-card">
          <div>
            <h2>Custom Intelligence Builder</h2>
            <p>Aggregate booking, venue, and revenue data for stakeholder reports.</p>
            <div className="insight-controls">
              <select><option>Revenue by Category</option></select>
              <select><option>Rolling 12 Months</option></select>
              <button type="button" onClick={() => exportCsv('owner-bookings', bookingExportRows(filteredBookings))}>Export Bookings</button>
              <button className="ghost" type="button" onClick={() => exportCsv('owner-venues', venueExportRows(filteredVenues))}>Export Venues</button>
            </div>
          </div>
          <aside>
            <h3>Suggested Reports</h3>
            <p>{summary.pendingBookings} bookings awaiting deposit</p>
            <p>{summary.pendingVenues} listings in review</p>
            <p>{formatRwf(summary.pendingRevenue)} outstanding balance</p>
          </aside>
        </section>
        {editingVenue && (
          <div className="owner-modal-backdrop" role="presentation">
            <section className="owner-modal" role="dialog" aria-modal="true" aria-labelledby="edit-dashboard-venue-title">
              <header>
                <h2 id="edit-dashboard-venue-title">Edit Venue</h2>
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
    </OwnerShell>
  );
}

function buildMonthlyBookingData(bookings: ReturnType<typeof filterBookings>): MonthlyBookingData[] {
  const validDates = bookings
    .map((booking) => new Date(`${booking.date}T00:00:00`))
    .filter((date) => !Number.isNaN(date.getTime()));
  const endDate = validDates.length
    ? new Date(Math.max(...validDates.map((date) => date.getTime())))
    : new Date();
  const monthStarts = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(endDate.getFullYear(), endDate.getMonth() - (5 - index), 1);
    return date;
  });

  return monthStarts.map((date) => {
    const monthBookings = bookings.filter((booking) => {
      const bookingDate = new Date(`${booking.date}T00:00:00`);
      return bookingDate.getFullYear() === date.getFullYear() && bookingDate.getMonth() === date.getMonth();
    });

    return {
      month: date.toLocaleString('en-US', { month: 'short' }),
      bookings: monthBookings.length,
      revenue: monthBookings.reduce((total, booking) => total + Number(booking.totals?.total || 0), 0),
    };
  });
}

function DemandChart({ data }: { data: MonthlyBookingData[] }) {
  return (
    <ChartContainer config={demandChartConfig} className="owner-recharts">
      <BarChart accessibilityLayer data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#eef1f5" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12, fill: '#5b6b80' }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#5b6b80' }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="bookings" fill="var(--color-bookings)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
