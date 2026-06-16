import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { clearAuthSession, getAuthUser } from '../../services/api';
import { useOwnerSearch } from './ownerData';
import '../venues/venues.css';

const providerNav = [
  ['Dashboard', '/owner', 'grid'],
  ['Marketplace', '/owner/portfolio', 'store'],
  ['Bookings', '/owner/bookings', 'calendar'],
  ['Analytics', '/owner/analytics', 'chart'],
  ['Reputation', '/owner/reputation', 'star'],
  ['Subscription & Payouts', '/owner/payouts', 'wallet'],
];

function getInitials(name?: string) {
  const parts = String(name || 'Owner').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'O';
}

export function ProviderShell({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
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
    <main className={`provider-page owner-console ${compact ? 'compact-provider' : ''}`}>
      <aside className="provider-side">
        <Link to="/owner" className="provider-logo">
          <span>{getInitials(ownerName)}</span>
          <strong>{ownerName}</strong>
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
            <input
              placeholder="Search venues, bookings, reviews..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div>
            {query && <button type="button" onClick={() => setQuery('')}>Clear</button>}
            <Link to="/owner/register">New Listing</Link>
            <div className="owner-profile-menu">
              <button
                type="button"
                className="owner-profile-trigger"
                aria-expanded={profileOpen}
                aria-label="Open provider profile menu"
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
