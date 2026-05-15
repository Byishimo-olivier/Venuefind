import { NavLink, Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import '../venues/venues.css';

const ownerNav = [
  ['Dashboard', '/owner', 'grid'],
  ['Transactions', '/owner/transactions', 'ledger'],
  ['Invoicing', '/owner/invoices', 'file'],
  ['Bookings', '/owner/bookings', 'calendar'],
  ['Analytics', '/owner/analytics', 'chart'],
  ['Reputation', '/owner/reputation', 'star'],
];

export function OwnerShell({ children, section = 'Overview' }: { children: ReactNode; section?: string }) {
  return (
    <main className="owner-page owner-console">
      <aside className="owner-sidebar">
        <Link to="/owner" className="owner-brand">
          <span>GV</span>
          <strong>The Grand Venue</strong>
          <small>Owner Console</small>
        </Link>

        <div className="owner-property">
          <strong>Financial Terminal</strong>
          <span>Live settlement access</span>
        </div>

        <nav>
          {ownerNav.map(([label, to, icon]) => (
            <NavLink to={to} end={to === '/owner'} key={to}>
              <i data-icon={icon} />
              {label}
            </NavLink>
          ))}
        </nav>

        <Link to="/owner/register" className="owner-sidebar-cta">
          Add Venue
        </Link>
      </aside>

      <section className="owner-main">
        <header className="owner-topbar">
          <Link to="/owner" className="booking-logo">The Venue Ledger</Link>
          <nav>
            <NavLink to="/owner" end>Overview</NavLink>
            <NavLink to="/owner/portfolio">Listings</NavLink>
            <NavLink to="/owner/payouts">Payouts</NavLink>
            <NavLink to="/owner/register">Add Venue</NavLink>
            {section !== 'Overview' && <span>{section}</span>}
          </nav>
          <div className="owner-topbar-actions">
            <input placeholder="Search bookings, invoices, guests..." />
            <button type="button">Export</button>
            <span>JD</span>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

export function MetricCard({ label, value, accent = 'dark', delta }: { label: string; value: string; accent?: string; delta?: string }) {
  return (
    <article className={`owner-metric ${accent}`}>
      {delta && <em>{delta}</em>}
      <span>{label}</span>
      <strong>{value}</strong>
      <i />
    </article>
  );
}
