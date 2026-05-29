import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { clearAuthSession, getAuthUser } from '../../services/api';
import { useOwnerSearch } from './ownerData';
import '../venues/venues.css';

const ownerNav = [
  ['Dashboard', '/owner', 'grid'],
  ['Transactions', '/owner/transactions', 'ledger'],
  ['Invoicing', '/owner/invoices', 'file'],
  ['Bookings', '/owner/bookings', 'calendar'],
  ['Analytics', '/owner/analytics', 'chart'],
  ['Reputation', '/owner/reputation', 'star'],
];

function getInitials(name?: string) {
  const parts = String(name || 'Owner').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'O';
}

export function OwnerShell({ children, section = 'Overview' }: { children: ReactNode; section?: string }) {
  const user = getAuthUser();
  const ownerName = user?.fullName || 'Venue Owner';
  const { query, setQuery } = useOwnerSearch();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    clearAuthSession();
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <main className="owner-page owner-console">
      <aside className="owner-sidebar">
        <Link to="/owner" className="owner-brand">
          <span>{getInitials(ownerName)}</span>
          <strong>{ownerName}</strong>
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
            <input
              placeholder="Search bookings, invoices, guests..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && <button type="button" onClick={() => setQuery('')}>Clear</button>}
            <div className="owner-profile-menu">
              <button
                type="button"
                className="owner-profile-trigger"
                aria-expanded={profileOpen}
                aria-label="Open owner profile menu"
                onClick={() => setProfileOpen((current) => !current)}
              >
                {getInitials(ownerName)}
              </button>
              {profileOpen && (
                <div className="owner-profile-dropdown">
                  <div>
                    <span>Signed in as</span>
                    <strong>{ownerName}</strong>
                    <small>{user?.email || 'No email available'}</small>
                  </div>
                  <Link to="/owner/portfolio" onClick={() => setProfileOpen(false)}>My Listings</Link>
                  <Link to="/owner/register" onClick={() => setProfileOpen(false)}>Add Venue</Link>
                  <Link to="/venues" onClick={() => setProfileOpen(false)}>Customer Site</Link>
                  <button type="button" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
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
