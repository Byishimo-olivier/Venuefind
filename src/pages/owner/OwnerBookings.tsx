import { Link } from 'react-router-dom';
import { ProviderShell } from './ProviderShell';
import { formatDate, formatRwf, labelStatus, statusClass, useOwnerData, useOwnerSummary } from './ownerData';

export default function OwnerBookings() {
  const { venues, bookings, isLoading, error } = useOwnerData();
  const summary = useOwnerSummary(venues, bookings);

  return (
    <ProviderShell>
      <section className="bookings-wrap">
        <div className="bookings-top">
          <h1>Bookings</h1>
          <p>Curate and manage your event calendar with precision.</p>
          <div><Link to="/owner/transactions">Export Ledger</Link><Link to="/owner/register" className="gold">Manual Entry</Link></div>
        </div>
        <div className="booking-filter-tabs">
          <button className="active">All Bookings ({bookings.length})</button>
          <button>Confirmed ({summary.confirmedBookings})</button>
          <button>Pending Deposit ({summary.pendingBookings})</button>
          <button>Completed ({summary.completedBookings})</button>
          <span>More Filters</span>
        </div>
        {isLoading && <p>Loading bookings...</p>}
        {error && <p className="field-error centered">{error}</p>}
        <section className="transaction-table-card booking-directory">
          <table>
            <thead><tr><th>Client & Event</th><th>Date & Time</th><th>Guests</th><th>Total Value</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td><strong>{booking.venueName}</strong><span>{booking.customerName || booking.customerEmail || 'Customer'}</span></td>
                  <td>{formatDate(booking.date)}<span>{booking.startTime} - {booking.durationHours}h</span></td>
                  <td>{booking.guestCount}</td>
                  <td>{formatRwf(booking.totals?.total)}</td>
                  <td><em className={statusClass(booking.status)}>{labelStatus(booking.status)}</em></td>
                  <td><Link to={`/venues/${booking.venueId}/confirmed?bookingId=${encodeURIComponent(booking.id)}`}>View</Link></td>
                </tr>
              ))}
              {!isLoading && bookings.length === 0 && (
                <tr><td colSpan={6}>No bookings have been made for your venues yet.</td></tr>
              )}
            </tbody>
          </table>
        </section>
        <div className="booking-stats">
          <article className="dark"><span>Upcoming Revenue</span><strong>{formatRwf(summary.pendingRevenue)}</strong><small>{summary.upcomingBookings} active bookings</small></article>
          <article><span>Confirmed Guests</span><strong>{summary.guestCount}</strong><i><b style={{ width: `${Math.min(summary.occupancy, 100)}%` }} /></i></article>
          <article className="gold"><span>Active Capacity</span><strong>{summary.occupancy}%</strong><small>Optimize Calendar</small></article>
        </div>
      </section>
    </ProviderShell>
  );
}
