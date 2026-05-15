import { NavLink, Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import '../venues/venues.css';

const providerNav = [
  ['Dashboard', '/owner', 'grid'],
  ['Marketplace', '/owner/portfolio', 'store'],
  ['Bookings', '/owner/bookings', 'calendar'],
  ['Analytics', '/owner/analytics', 'chart'],
  ['Reputation', '/owner/reputation', 'star'],
  ['Payouts', '/owner/payouts', 'wallet'],
];

export function ProviderShell({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <main className={`provider-page owner-console ${compact ? 'compact-provider' : ''}`}>
      <aside className="provider-side">
        <Link to="/owner" className="provider-logo">
          <span>SE</span>
          <strong>Smart Event Venue</strong>
          <small>Premium Provider</small>
        </Link>

        <nav>
          {providerNav.map(([label, to, icon]) => (
            <NavLink to={to} end={to === '/owner'} key={to}>
              <i data-icon={icon} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="provider-console-status">
          <small>Profile Score</small>
          <strong>94%</strong>
          <i><b /></i>
        </div>

        <Link to="/owner/register" className="provider-add">Add New Venue</Link>
      </aside>
      <section className="provider-main">
        <header className="provider-topbar">
          <label>
            <span>Provider Portal</span>
            <input placeholder="Search venues, bookings, reviews..." />
          </label>
          <div>
            <Link to="/owner/register">New Listing</Link>
            <span>DM</span>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
