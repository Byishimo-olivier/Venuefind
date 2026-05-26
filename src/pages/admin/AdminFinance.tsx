import { useEffect, useState } from 'react';
import { formatRwf, getAdminOverview } from '../../services/admin';
import type { AdminOverview } from '../../services/admin';
import { AdminMetric, AdminShell } from './AdminShell';

function formatDate(value?: string) {
  if (!value) return 'Not paid';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export default function AdminFinance() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    getAdminOverview()
      .then((data) => {
        if (!isMounted) return;
        setOverview(data);
        setError('');
      })
      .catch((loadError) => {
        if (!isMounted) return;
        setError(loadError instanceof Error ? loadError.message : 'Could not load financial data.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = overview?.summary;
  const payments = overview?.payments || [];

  return (
    <AdminShell>
      <section className="admin-content">
        <div className="admin-heading wide"><div><h1>Financial Oversight</h1><p>{error || 'Comprehensive ledger of all platform transactions across Rwanda.'}</p></div><aside><span>Regional Currency</span><strong>{summary ? formatRwf(summary.totalRevenue) : 'Loading'}</strong></aside></div>
        <div className="finance-metrics">
          <AdminMetric title="Total Transaction Volume" value={summary ? formatRwf(summary.totalRevenue) : 'Loading'} note={`${summary?.totalBookings || 0} bookings`} />
          <AdminMetric title="Platform Commission" value={summary ? formatRwf(summary.commission) : 'Loading'} tone="dark" />
          <AdminMetric title="Pending Payouts" value={summary ? formatRwf(summary.pendingPayouts) : 'Loading'} tone="gold" />
        </div>
        <section className="admin-table-card">
          <div className="table-toolbar"><span>Live Ledger</span><button>Date: All</button><button>Provider Type: All</button><button>Status: All Transactions</button><button className="dark">Export CSV</button></div>
          <table>
            <thead><tr><th>Transaction ID</th><th>Booking</th><th>Gross Amount</th><th>Commission</th><th>Payout Status</th><th>Date</th></tr></thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td><strong>{payment.bookingId || payment.venueId}</strong><span>{payment.method}</span></td>
                  <td>{formatRwf(payment.amount)}</td>
                  <td>{formatRwf(Math.round(payment.amount * 0.1))}</td>
                  <td><em className={payment.status}>{payment.status}</em></td>
                  <td>{formatDate((payment as { paidAt?: string; createdAt?: string }).paidAt || (payment as { createdAt?: string }).createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!payments.length && <p className="empty-venues">No payments have been recorded yet.</p>}
        </section>
        <div className="finance-ops-grid">
          <article className="regional-map"><h2>Regional Distribution</h2><p>Active transaction hubs across Rwanda's major provinces.</p><div>{(overview?.provinceSummary || []).slice(0, 2).map((row) => <span key={row.province}>{row.province} {formatRwf(row.revenue)}</span>)}</div></article>
          <aside className="payout-card"><h2>Upcoming Payouts</h2>{(overview?.topVenues || []).slice(0, 3).map((venue) => <p key={venue.id}>{venue.name} <strong>{formatRwf(venue.revenue)}</strong></p>)}<button>Process All Now</button></aside>
          <aside className="security-protocol"><h2>Security Protocol</h2><p>Two-factor authorization is required for all payouts exceeding 5,000,000 RWF.</p></aside>
        </div>
      </section>
    </AdminShell>
  );
}
