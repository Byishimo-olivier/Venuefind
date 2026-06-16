import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cancelBooking, refundBooking, type Booking } from '../../services/bookings';
import { ProviderShell } from './ProviderShell';
import { bookingExportRows, exportCsv, filterBookings, formatDate, formatRwf, labelStatus, statusClass, useOwnerData, useOwnerSearch, useOwnerSummary } from './ownerData';

export default function OwnerBookings() {
  const { venues, bookings, isLoading, error } = useOwnerData();
  const { query } = useOwnerSearch();
  const [localBookings, setLocalBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [busyBookingId, setBusyBookingId] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const summary = useOwnerSummary(venues, localBookings);
  const searchedBookings = filterBookings(localBookings, query);
  const filteredBookings = searchedBookings.filter((booking) => {
    if (statusFilter === 'confirmed') return booking.status === 'confirmed';
    if (statusFilter === 'pending') return String(booking.status || '').includes('pending');
    if (statusFilter === 'completed') return booking.status === 'completed' || booking.paymentStatus === 'paid';
    if (statusFilter === 'cancelled') return booking.status === 'cancelled' || booking.paymentStatus === 'refunded';
    return true;
  });

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  const replaceBooking = (updated: Booking) => {
    setLocalBookings((current) => current.map((booking) => booking.id === updated.id ? updated : booking));
  };

  const cancelOwnerBooking = async (booking: Booking) => {
    const confirmed = window.confirm(`Cancel booking ${booking.confirmationNumber} for ${booking.venueName}?`);
    if (!confirmed) return;
    const reason = window.prompt(
      'Add the cancellation reason. For policy violations, mention which venue policy was not obeyed.',
      booking.cancellationReason || '',
    );
    if (reason === null) return;

    setBusyBookingId(booking.id);
    setActionError('');
    try {
      const updated = await cancelBooking(booking.id, {
        category: 'policy_violation',
        reason,
      });
      replaceBooking(updated);
      setActionMessage(`Booking ${booking.confirmationNumber} was cancelled.`);
    } catch (cancelError) {
      setActionError(cancelError instanceof Error ? cancelError.message : 'Unable to cancel booking.');
    } finally {
      setBusyBookingId('');
    }
  };

  const refundOwnerBooking = async (booking: Booking) => {
    const amount = Number(booking.amountPaid || 0);
    const confirmed = window.confirm(`Return ${formatRwf(amount)} to ${booking.customerName || booking.customerEmail || 'this client'}?`);
    if (!confirmed) return;

    setBusyBookingId(booking.id);
    setActionError('');
    try {
      const updated = await refundBooking(booking.id);
      replaceBooking(updated);
      setActionMessage(`Refund recorded for booking ${booking.confirmationNumber}.`);
    } catch (refundError) {
      setActionError(refundError instanceof Error ? refundError.message : 'Unable to return client money.');
    } finally {
      setBusyBookingId('');
    }
  };

  return (
    <ProviderShell>
      <section className="bookings-wrap">
        <div className="bookings-top">
          <h1>Bookings</h1>
          <p>Curate and manage your event calendar with precision.</p>
          <div><button type="button" onClick={() => exportCsv('owner-bookings', bookingExportRows(filteredBookings))}>Export Ledger</button><Link to="/owner/register" className="gold">Manual Entry</Link></div>
        </div>
        <div className="booking-filter-tabs">
          <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All Bookings ({localBookings.length})</button>
          <button className={statusFilter === 'confirmed' ? 'active' : ''} onClick={() => setStatusFilter('confirmed')}>Confirmed ({summary.confirmedBookings})</button>
          <button className={statusFilter === 'pending' ? 'active' : ''} onClick={() => setStatusFilter('pending')}>Pending Deposit ({summary.pendingBookings})</button>
          <button className={statusFilter === 'completed' ? 'active' : ''} onClick={() => setStatusFilter('completed')}>Completed ({summary.completedBookings})</button>
          <button className={statusFilter === 'cancelled' ? 'active' : ''} onClick={() => setStatusFilter('cancelled')}>Cancelled/Refunded</button>
          <button type="button" onClick={() => setStatusFilter('all')}>Reset Filters</button>
        </div>
        {isLoading && <p>Loading bookings...</p>}
        {error && <p className="field-error centered">{error}</p>}
        {actionMessage && <p className="owner-action-message">{actionMessage}</p>}
        {actionError && <p className="field-error centered">{actionError}</p>}
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
                  <td>
                    <div className="owner-row-actions">
                      <Link to={`/venues/${booking.venueId}/confirmed?bookingId=${encodeURIComponent(booking.id)}`}>View</Link>
                      <button
                        type="button"
                        onClick={() => cancelOwnerBooking(booking)}
                        disabled={busyBookingId === booking.id || booking.status === 'cancelled'}
                      >
                        Cancel
                      </button>
                      <button
                        className="danger"
                        type="button"
                        onClick={() => refundOwnerBooking(booking)}
                        disabled={busyBookingId === booking.id || !Number(booking.amountPaid || 0) || booking.paymentStatus === 'refunded'}
                      >
                        Refund
                      </button>
                    </div>
                    {booking.cancellationReason && <small className="booking-cancel-reason">Reason: {booking.cancellationReason}</small>}
                  </td>
                </tr>
              ))}
              {!isLoading && filteredBookings.length === 0 && (
                <tr><td colSpan={6}>{localBookings.length ? 'No bookings match your current search or filter.' : 'No bookings have been made for your venues yet.'}</td></tr>
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
