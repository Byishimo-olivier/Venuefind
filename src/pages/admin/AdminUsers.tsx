import { useEffect, useMemo, useState } from 'react';
import { getAdminOverview } from '../../services/admin';
import type { AdminOverview } from '../../services/admin';
import { AdminMetric, AdminShell } from './AdminShell';

export default function AdminUsers() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
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
        setError(loadError instanceof Error ? loadError.message : 'Could not load users.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const users = useMemo(() => {
    const search = query.trim().toLowerCase();
    return (overview?.users || []).filter((user) => {
      const matchesRole = role === 'all' || user.role === role;
      const matchesSearch = !search || [user.fullName, user.email, user.phone, user.role].join(' ').toLowerCase().includes(search);
      return matchesRole && matchesSearch;
    });
  }, [overview?.users, query, role]);

  const summary = overview?.summary;

  return (
    <AdminShell>
      <section className="admin-content">
        <div className="security-grid">
          <article className="user-landscape"><h1>User Landscape</h1><p>{error || 'Real-time overview of platform adoption and active engagement across all roles.'}</p><div><strong>{summary?.totalUsers ?? '...'}<span>Total Registered</span></strong><strong>{summary?.verifiedUsers ?? '...'}<span>Verified</span></strong></div></article>
          <AdminMetric title="Customers" value={String(summary?.customers ?? '...')} note="Customer accounts" />
          <AdminMetric title="Owners" value={String(summary?.owners ?? '...')} tone="gold" note="Provider accounts" />
        </div>
        <div className="user-management-grid">
          <section>
            <div className="card-title-row">
              <div><h2>System Directory</h2><p>Manage permissions and investigate user reports.</p></div>
              <div>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users" />
                <select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Filter role">
                  <option value="all">All roles</option>
                  <option value="customer">Customers</option>
                  <option value="owner">Owners</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
            <div className="user-list">
              {users.map((user) => (
                <article key={user.id}>
                  <span className="thumb" />
                  <div><strong>{user.fullName}</strong><small>{user.email} - {user.role}</small></div>
                  <em className={user.verified ? '' : 'danger'}>{user.verified ? 'Verified' : 'Unverified'}</em>
                  <button>{user.role}</button>
                </article>
              ))}
              {!users.length && <p className="empty-venues">No users match your filters.</p>}
            </div>
          </section>
          <aside className="security-side"><article><h2>Security Alerts</h2><p>{summary?.admins || 0} admin accounts</p><p>{summary?.verifiedUsers || 0} verified identities</p><p>{(summary?.totalUsers || 0) - (summary?.verifiedUsers || 0)} accounts need verification</p></article><article className="integrity-card"><h2>Account Integrity</h2><strong>{summary?.totalUsers ? Math.round((summary.verifiedUsers / summary.totalUsers) * 100) : 0}%</strong><p>Verified identity threshold.</p></article><div><button>Audit Policy</button><button>Export CSV</button></div></aside>
        </div>
      </section>
    </AdminShell>
  );
}
