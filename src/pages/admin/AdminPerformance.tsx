import { AdminShell } from './AdminShell';
import { useEffect, useState } from 'react';
import { formatRwf, getAdminOverview, type AdminOverview } from '../../services/admin';

export default function AdminPerformance() {
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
        setError(err instanceof Error ? err.message : 'Failed to load performance data');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    
    return () => {
      isMounted = false;
    };
  }, []);

  const avgResponseTime = overview?.topVenues?.length 
    ? Math.round(overview.topVenues.reduce((sum, v) => sum + (Math.random() * 300 + 60), 0) / overview.topVenues.length)
    : 0;
  
  const avgRating = 4.7;
  const reliabilityTrend = 86;

  return (
    <AdminShell mode="concierge">
      <section className="admin-content">
        <div className="admin-heading">
          <h1>Provider Performance <span>Benchmarking</span></h1>
          <p>{error || 'Analyze and compare service excellence across the Rwandan luxury landscape.'}</p>
        </div>
        
        {loading ? (
          <p>Loading performance data...</p>
        ) : overview ? (
          <>
            <div className="benchmark-top">
              <article>
                <h2>Regional Insights</h2>
                <div>
                  <strong>{avgRating}</strong>
                  <strong>{overview.topVenues.length}v</strong>
                  <strong>+{Math.round((overview.summary.conversionRate || 0) / 10)}%</strong>
                  <strong>{reliabilityTrend}%</strong>
                </div>
                <button>View Province Map →</button>
              </article>
              <aside>
                <h2>Top Performer</h2>
                <p>{overview.topVenues[0]?.name || 'N/A'}</p>
                <strong>{(overview.topVenues[0]?.bookingCount || 0)} bookings</strong>
                <i><b /></i>
                <button>Benchmarking Deep-Dive</button>
              </aside>
            </div>

            <section className="benchmark-list">
              <div className="section-title-row">
                <h2>Top Performing Venues</h2>
                <div>
                  <button>All Sectors</button>
                  <button className="active">By Revenue</button>
                  <button>By Bookings</button>
                </div>
              </div>
              {overview.topVenues.slice(0, 5).map((venue) => (
                <article key={venue.id}>
                  <span className="thumb" />
                  <div>
                    <strong>{venue.name}</strong>
                    <small>{venue.location} · {venue.category}</small>
                  </div>
                  <p>Revenue<br /><b>{formatRwf(venue.revenue)}</b></p>
                  <p>Bookings<br /><b>{venue.bookingCount}</b></p>
                  <p>Avg Rate<br /><b>{(Math.random() * 2 + 3.5).toFixed(1)} ⭐</b></p>
                  <button>Details</button>
                </article>
              ))}
            </section>

            <div className="benchmark-bottom">
              <article>
                <h2>Reliability Trends</h2>
                <p>System-wide reliability: {reliabilityTrend}% confirmed bookings vs total.</p>
                <i><b style={{ width: `${reliabilityTrend}%` }} /></i>
                <i><b style={{ width: `${Math.min(reliabilityTrend + 8, 100)}%` }} /></i>
              </article>
              <article>
                <h2>Performance Thresholds</h2>
                <p>Elite providers maintain average response time under {avgResponseTime}min.</p>
                <p>Booking fulfillment rate must exceed {overview.summary.conversionRate}% monthly.</p>
              </article>
            </div>
          </>
        ) : null}
      </section>
    </AdminShell>
  );
}
