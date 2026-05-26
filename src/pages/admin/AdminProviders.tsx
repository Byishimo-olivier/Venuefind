import { useEffect, useState } from 'react';
import { getAdminOverview } from '../../services/admin';
import type { AdminOverview } from '../../services/admin';
import { AdminMetric, AdminShell } from './AdminShell';

export default function AdminProviders() {
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
        setError(loadError instanceof Error ? loadError.message : 'Could not load provider data.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const pendingVenues = overview?.pendingVenues || [];
  const owners = overview?.users.filter((user) => user.role === 'owner') || [];

  return (
    <AdminShell>
      <section className="admin-content">
        <div className="admin-heading"><h1>Provider Vetting</h1><p>{error || 'Review and verify new partner applications from across Rwanda.'}</p></div>
        <div className="vetting-metrics">
          <AdminMetric title="Pending Review" value={String(pendingVenues.length)} />
          <AdminMetric title="Registered Owners" value={String(owners.length)} />
          <AdminMetric title="Active Venues" value={String(overview?.summary.activeVenues ?? '...')} />
          <AdminMetric title="Total Venues" value={String(overview?.summary.totalVenues ?? '...')} />
        </div>
        <section className="vetting-list">
          {pendingVenues.map((venue) => (
            <article key={venue.id}>
              <span className="thumb" />
              <div><strong>{venue.name}</strong><small>{venue.category} - {venue.location}</small></div>
              <em className="pending">{venue.status || 'Pending Review'}</em>
              <button>Review Application</button>
            </article>
          ))}
          {!pendingVenues.length && <p className="empty-venues">No provider applications are pending review.</p>}
        </section>
        <div className="vetting-bottom">
          <article className="protocol-card"><h2>Verification Protocol</h2><p>Every partner on our platform must pass business checks and compliance verification.</p><ul><li>RDB Business License Validation</li><li>VAT Certificate Verification</li><li>Background Compliance Check</li></ul></article>
          <aside className="expert-card"><h2>Need Expert Support?</h2><p>The legal vetting team is available for complex document escalations.</p><button>Contact Compliance Dept</button></aside>
        </div>
      </section>
    </AdminShell>
  );
}
