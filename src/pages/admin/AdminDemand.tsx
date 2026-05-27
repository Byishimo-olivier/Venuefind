import { AdminShell } from './AdminShell';
import { useEffect, useState } from 'react';
import { formatRwf, getAdminOverview, type AdminOverview } from '../../services/admin';

export default function AdminDemand() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAdminOverview()
      .then((data) => {
        if (!isMounted) return;
        setOverview(data);
        setError('');
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load demand data');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    
    return () => {
      isMounted = false;
    };
  }, []);

  const sortedProvinces = overview?.provinceSummary?.sort((a, b) => b.revenue - a.revenue) || [];
  const totalDemand = overview?.summary?.totalBookings || 0;
  const confirmedDemand = overview?.summary?.confirmedBookings || 0;
  const inquiryRate = Math.round((totalDemand / Math.max(overview?.summary?.totalUsers || 1, 1)) * 100);

  return (
    <AdminShell mode="concierge">
      <section className="admin-content demand-content">
        <div className="admin-heading wide">
          <div>
            <h1>Market Intelligence & Demand Dynamics</h1>
            <p>{error || 'Analyzing multidimensional regional signals to provide precision forecasting and strategic insights.'}</p>
          </div>
          <aside>
            Global Sentiment
            <strong>{overview?.summary?.conversionRate || 0}% Conversion</strong>
          </aside>
        </div>

        {loading ? (
          <p>Loading demand data...</p>
        ) : overview ? (
          <>
            <section className="seasonal-focus">
              <div>
                <img src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=900" alt="" />
                <h2>Market Snapshot</h2>
                <p>Total Bookings: <strong>{totalDemand}</strong> | Confirmed: <strong>{confirmedDemand}</strong></p>
              </div>
              <aside>
                <article className="gold">Active Venues: {overview.summary.activeVenues}</article>
                <article className="dark">Pending Review: {overview.summary.pendingVenues}</article>
              </aside>
            </section>

            <div className="demand-grid">
              <section className="demand-matrix">
                <h2>Regional Demand</h2>
                <div>
                  {sortedProvinces.slice(0, 4).map((prov) => (
                    <span key={prov.province}>
                      {prov.province}: {prov.bookings}
                    </span>
                  ))}
                </div>
                <p>Revenue Distribution <b>Across Provinces</b></p>
                <p>Active Bookings <b>{overview.summary.confirmedBookings}/${overview.summary.totalBookings}</b></p>
              </section>

              <aside className="funnel-card">
                <h2>Conversion Funnel</h2>
                {[
                  { label: 'Total Users', value: overview.summary.totalUsers },
                  { label: 'Active Venues', value: overview.summary.activeVenues },
                  { label: 'Total Bookings', value: overview.summary.totalBookings },
                  { label: 'Confirmed', value: overview.summary.confirmedBookings },
                ].map((item) => (
                  <p key={item.label}>
                    {item.value}
                    <span>{item.label}</span>
                  </p>
                ))}
              </aside>
            </div>

            <section className="growth-forecast">
              <h2>Performance Metrics</h2>
              <div>
                <article>
                  Active Venues
                  <strong>+{Math.round((overview.summary.activeVenues / Math.max(overview.summary.totalVenues, 1)) * 100)}%</strong>
                  <svg viewBox="0 0 300 120">
                    <path d="M10 90 C60 80 65 20 130 55 S220 95 290 20" />
                  </svg>
                </article>
                <article>
                  Conversion Rate
                  <strong>{overview.summary.conversionRate}%</strong>
                  <svg viewBox="0 0 300 120">
                    <path d="M10 95 C70 80 100 65 145 70 S210 45 290 12" />
                  </svg>
                </article>
              </div>
            </section>
          </>
        ) : null}
      </section>
    </AdminShell>
  );
}
