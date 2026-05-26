import { Link } from 'react-router-dom';
import { useState } from 'react';
import { OwnerShell, MetricCard } from './OwnerShell';
import { bookingExportRows, exportCsv, filterBookings, formatDate, formatRwf, labelStatus, statusClass, useOwnerData, useOwnerSearch, useOwnerSummary } from './ownerData';

export default function OwnerTransactions() {
  const { venues, bookings, isLoading, error } = useOwnerData();
  const { query } = useOwnerSearch();
  const [statusFilter, setStatusFilter] = useState('all');
  const searchedBookings = filterBookings(bookings, query);
  const filteredBookings = searchedBookings.filter((booking) => {
    const status = String(booking.paymentStatus || booking.status || '').toLowerCase();
    if (statusFilter === 'completed') return status.includes('paid') || status.includes('confirm');
    if (statusFilter === 'pending') return status.includes('pending') || status.includes('unpaid');
    if (statusFilter === 'refunded') return status.includes('refund') || status.includes('cancel');
    return true;
  });
  const summary = useOwnerSummary(venues, filteredBookings);

  return (
    <OwnerShell section="Transaction Log">
      <section className="owner-content">
        <div className="owner-heading"><div><h1>Financial History</h1><p>Review your venue's fiscal health and manage transactional documents.</p></div></div>
        {isLoading && <p>Loading financial history...</p>}
        {error && <p className="field-error centered">{error}</p>}
        <div className="owner-metrics-grid finance">
          <MetricCard label="Total Fiscal Volume" value={formatRwf(summary.totalRevenue)} accent="gold" delta={`${summary.totalBookings} invoices`} />
          <MetricCard label="Pending Invoices" value={formatRwf(summary.pendingRevenue)} delta={`${summary.pendingBookings} active`} />
          <article className="settlement-card"><span>Last Settlement</span><strong>{formatRwf(summary.paidRevenue)}</strong><button>{summary.confirmedBookings} confirmed</button></article>
          <article className="create-invoice">+<strong>Create New Invoice</strong><span>Manual transaction entry</span></article>
        </div>
        <section className="transaction-table-card">
          <div className="table-toolbar">
            <div>
              <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All</button>
              <button className={statusFilter === 'completed' ? 'active' : ''} onClick={() => setStatusFilter('completed')}>Completed</button>
              <button className={statusFilter === 'pending' ? 'active' : ''} onClick={() => setStatusFilter('pending')}>Pending</button>
              <button className={statusFilter === 'refunded' ? 'active' : ''} onClick={() => setStatusFilter('refunded')}>Refunded</button>
            </div>
            <button type="button" onClick={() => exportCsv('owner-transactions', bookingExportRows(filteredBookings))}>Export CSV</button>
          </div>
          <table>
            <thead><tr><th>Invoice ID</th><th>Client Name</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td><strong>{booking.confirmationNumber || booking.id}</strong><span>{booking.venueName}</span></td>
                  <td>{booking.customerName || booking.customerEmail || 'Customer'}</td>
                  <td>{formatDate(booking.date)}</td>
                  <td>{formatRwf(booking.totals?.total)}</td>
                  <td><em className={statusClass(booking.paymentStatus || booking.status)}>{labelStatus(booking.paymentStatus || booking.status)}</em></td>
                  <td><Link to={`/venues/${booking.venueId}/confirmed?bookingId=${encodeURIComponent(booking.id)}`}>View</Link></td>
                </tr>
              ))}
              {!isLoading && filteredBookings.length === 0 && (
                <tr><td colSpan={6}>{bookings.length ? 'No transactions match your current filters.' : 'No transaction history yet.'}</td></tr>
              )}
            </tbody>
          </table>
        </section>
        <div className="finance-bottom">
          <article className="tax-card"><h2>Automate your quarterly tax reconciliation</h2><p>Export the live booking ledger for accounting and payout review.</p><button>Enable Integration</button></article>
          <article className="support-card"><strong>Secure Document Vault</strong><p>All financial documents are tied to backend booking records.</p></article>
        </div>
      </section>
    </OwnerShell>
  );
}
