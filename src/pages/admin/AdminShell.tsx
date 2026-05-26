import { Link, NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { getAuthUser } from '../../services/api';
import './admin.css';

const nav = [
  ['Dashboard', '/admin', 'grid'],
  ['Provider Vetting', '/admin/providers', 'shield'],
  ['User Management', '/admin/users', 'users'],
  ['Financial Oversight', '/admin/finance', 'ledger'],
  ['Platform Settings', '/admin/settings', 'sliders'],
  ['Performance', '/admin/analytics', 'chart'],
  ['Demand', '/admin/demand', 'pulse'],
  ['Reports', '/admin/reports', 'file'],
];

export function AdminShell({ children, mode = 'admin' }: { children: ReactNode; mode?: 'admin' | 'concierge' }) {
  const user = getAuthUser();
  const initials = (user?.fullName || 'System Admin')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <main className={`admin-page admin-${mode}`}>
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-logo">
          <span>SE</span>
          <strong>{mode === 'concierge' ? 'Concierge Admin' : 'Smart Event Admin'}</strong>
          <small>Command Console</small>
        </Link>

        <div className="admin-profile">
          <span>{initials}</span>
          <div>
            <strong>{user?.fullName || 'System Admin'}</strong>
            <small>{user?.role === 'admin' ? 'Admin Access' : 'Command Access'}</small>
          </div>
        </div>

        <nav>
          {nav.map(([label, to, icon]) => (
            <NavLink to={to} end={to === '/admin'} key={to}>
              <i data-icon={icon} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-health">
          <div>
            <small>System Health</small>
            <strong>Stable</strong>
          </div>
          <span />
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <label>
            <span>Search</span>
            <input placeholder="Venues, providers, users, transactions..." />
          </label>
          <div className="admin-topbar-actions">
            <button type="button">Alerts</button>
            <button type="button">Audit Log</button>
            <span>{initials}</span>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

export function AdminMetric({ title, value, tone = 'light', note }: { title: string; value: string; tone?: 'dark' | 'gold' | 'light'; note?: string }) {
  return (
    <article className={`admin-metric ${tone}`}>
      <span>{title}</span>
      <strong>{value}</strong>
      {note && <em>{note}</em>}
    </article>
  );
}

export function MiniBars({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`admin-mini-bars ${dark ? 'dark' : ''}`}>
      {[44, 61, 72, 92, 38, 50, 66, 56].map((height, index) => (
        <span key={index} style={{ height }} />
      ))}
    </div>
  );
}
