import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ProviderShell } from './ProviderShell';
import { bookingExportRows, exportCsv, filterBookings, formatDate, formatRwf, labelStatus, statusClass, useOwnerData, useOwnerSearch, useOwnerSummary } from './ownerData';

export default function OwnerBookings() {
  const { venues, bookings, isLoading, error } = useOwnerData();
  const { query } = useOwnerSearch();
  const [statusFilter, setStatusFilter] = useState('all');
  const summary = useOwnerSummary(venues, bookings);
  const searchedBookings = filterBookings(bookings, query);
  const filteredBookings = searchedBookings.filter((booking) => {
    if (statusFilter === 'confirmed') return booking.status === 'confirmed';
    if (statusFilter === 'pending') return String(booking.status || '').includes('pending');
    if (statusFilter === 'completed') return booking.status === 'completed' || booking.paymentStatus === 'paid';
    return true;
  });

  return (
    <ProviderShell>
      <section className="bookings-wrap">
        <div className="bookings-top">
          <h1>Bookings</h1>
          <p>Curate and manage your event calendar with precision.</p>
          <div><button type="button" onClick={() => exportCsv('owner-bookings', bookingExportRows(filteredBookings))}>Export Ledger</button><Link to="/owner/register" className="gold">Manual Entry</Link></div>
        </div>
        <div className="booking-filter-tabs">
          <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All Bookings ({bookings.length})</button>
          <button className={statusFilter === 'confirmed' ? 'active' : ''} onClick={() => setStatusFilter('confirmed')}>Confirmed ({summary.confirmedBookings})</button>
          <button className={statusFilter === 'pending' ? 'active' : ''} onClick={() => setStatusFilter('pending')}>Pending Deposit ({summary.pendingBookings})</button>
          <button className={statusFilter === 'completed' ? 'active' : ''} onClick={() => setStatusFilter('completed')}>Completed ({summary.completedBookings})</button>
          <button type="button" onClick={() => setStatusFilter('all')}>Reset Filters</button>
        </div>
        {isLoading && <p>Loading bookings...</p>}
        {error && <p className="field-error centered">{error}</p>}
        <section className="transaction-table-card booking-directory">
          <table>
            <thead><tr><th>Client & Event</th><th>Date & Time</th><th>Guests</th><th>Total Value</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td><strong>{booking.venueName}</strong><span>{booking.customerName || booking.customerEmail || 'Customer'}</span></td>
                  <td>{formatDate(booking.date)}<span>{booking.startTime} - {booking.durationHours}h</span></td>
                  <td>{booking.guestCount}</td>
                  <td>{formatRwf(booking.totals?.total)}</td>
                  <td><em className={statusClass(booking.status)}>{labelStatus(booking.status)}</em></td>
                  <td><Link to={`/venues/${booking.venueId}/confirmed?bookingId=${encodeURIComponent(booking.id)}`}>View</Link></td>
                </tr>
              ))}
              {!isLoading && filteredBookings.length === 0 && (
                <tr><td colSpan={6}>{bookings.length ? 'No bookings match your current search or filter.' : 'No bookings have been made for your venues yet.'}</td></tr>
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
