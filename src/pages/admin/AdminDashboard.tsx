import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatRwf, getAdminOverview } from '../../services/admin';
import type { AdminOverview } from '../../services/admin';
import { AdminMetric, AdminShell, MiniBars } from './AdminShell';

export default function AdminDashboard() {
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
        setError(loadError instanceof Error ? loadError.message : 'Could not load admin data.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = overview?.summary;
  const topVenues = overview?.topVenues || [];

  return (
    <AdminShell>
      <section className="admin-content compact">
        <div className="admin-heading">
          <h1>Command Center</h1>
          <p>{error || 'Global operations and revenue metrics for Smart Event Platform.'}</p>
        </div>
        <div className="command-grid">
          <AdminMetric title="Total Platform Revenue" value={summary ? formatRwf(summary.totalRevenue) : 'Loading'} tone="dark" note={`${summary?.conversionRate || 0}% booking conversion`} />
          <AdminMetric title="Active Providers" value={String(summary?.owners ?? '...')} note={`${summary?.activeVenues || 0} active venues`} />
          <AdminMetric title="Commission Earned" value={summary ? formatRwf(summary.commission) : 'Loading'} note="10% platform commission" />
          <article className="admin-growth"><span>User Growth</span><strong>{summary?.totalUsers ?? '...'}</strong><p>Verified accounts: {summary?.verifiedUsers || 0}</p><MiniBars /></article>
          <article className="elite-card"><h2>Provider Review Queue</h2><p>{summary?.pendingVenues || 0} venues are waiting for admin verification.</p><Link to="/admin/providers">Review Queue</Link></article>
        </div>
        <div className="admin-dashboard-lower">
          <section className="admin-chart-card">
            <div className="card-title-row"><div><h2>Demand Forecasting</h2><p>Platform-wide projected booking volume for Q4</p></div><div><button>Weekly</button><button className="active">Monthly</button></div></div>
            <MiniBars dark />
            <p className="insight-note">Insight: {summary?.totalBookings || 0} bookings are currently in the system, with {summary?.pendingBookings || 0} waiting on deposit or confirmation.</p>
          </section>
          <aside className="admin-topvenues">
            <h2>Top Venues <Link to="/venues/all">View All</Link></h2>
            {topVenues.slice(0, 4).map((venue) => (
              <article key={venue.id}><span /><div><strong>{venue.name}</strong><small>{venue.location}</small><em>{formatRwf(venue.revenue)} Revenue</em></div></article>
            ))}
            {!topVenues.length && <p>No venue revenue yet.</p>}
          </aside>
        </div>
        <footer className="admin-actionbar"><span>Data synced from backend database</span><div><Link to="/admin/reports">Export Global Report</Link><Link to="/admin/finance" className="gold">Audit Financials</Link></div></footer>
      </section>
    </AdminShell>
  );
}
