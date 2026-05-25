import { Link } from 'react-router-dom';
import { OwnerShell, MetricCard } from './OwnerShell';
import { formatDate, formatRwf, labelStatus, statusClass, useOwnerData, useOwnerSummary } from './ownerData';

export default function OwnerTransactions() {
  const { venues, bookings, isLoading, error } = useOwnerData();
  const summary = useOwnerSummary(venues, bookings);

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
          <div className="table-toolbar"><div><button className="active">All</button><button>Completed</button><button>Pending</button><button>Refunded</button></div><button>Export CSV</button></div>
          <table>
            <thead><tr><th>Invoice ID</th><th>Client Name</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td><strong>{booking.confirmationNumber || booking.id}</strong><span>{booking.venueName}</span></td>
                  <td>{booking.customerName || booking.customerEmail || 'Customer'}</td>
                  <td>{formatDate(booking.date)}</td>
                  <td>{formatRwf(booking.totals?.total)}</td>
                  <td><em className={statusClass(booking.paymentStatus || booking.status)}>{labelStatus(booking.paymentStatus || booking.status)}</em></td>
                  <td><Link to={`/venues/${booking.venueId}/confirmed?bookingId=${encodeURIComponent(booking.id)}`}>View</Link></td>
                </tr>
              ))}
              {!isLoading && bookings.length === 0 && (
                <tr><td colSpan={6}>No transaction history yet.</td></tr>
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
