import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { clearAuthSession, getAuthUser } from '../../services/api';
import { useOwnerSearch } from './ownerData';
import LanguageSelector from '../../components/LanguageSelector';
import '../venues/venues.css';

const ownerNav = [
  ['Dashboard', '/owner', 'grid'],
  ['Transactions', '/owner/transactions', 'ledger'],
  ['Invoicing', '/owner/invoices', 'file'],
  ['Bookings', '/owner/bookings', 'calendar'],
  ['Analytics', '/owner/analytics', 'chart'],
  ['Reputation', '/owner/reputation', 'star'],
  ['Subscription', '/owner/subscription', 'wallet'],
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
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    const defaultTrialDays = 7;
    const now = () => new Date().getTime();
    const trialStartTime = user?.subscriptionStartedAt ? new Date(user.subscriptionStartedAt).getTime() : null;
    const trialEndTime = user?.subscriptionTrialEndsAt ? new Date(user.subscriptionTrialEndsAt).getTime() : null;

    const calculateTrialDays = () => {
      const currentTime = now();
      let daysRemaining: number | null = null;

      if (trialEndTime) {
        const timeRemaining = trialEndTime - currentTime;
        daysRemaining = timeRemaining <= 0 ? 0 : Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
      } else if (trialStartTime) {
        const elapsed = currentTime - trialStartTime;
        daysRemaining = Math.max(0, defaultTrialDays - Math.floor(elapsed / (1000 * 60 * 60 * 24)));
      } else if (user?.subscriptionPlan?.toLowerCase() === 'starter') {
        daysRemaining = defaultTrialDays;
      }

      setTrialDaysRemaining(daysRemaining);
    };

    calculateTrialDays();
    const interval = setInterval(calculateTrialDays, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user?.subscriptionStartedAt, user?.subscriptionTrialEndsAt, user?.subscriptionPlan]);

  const handleLogout = () => {
    clearAuthSession();
    setProfileOpen(false);
    navigate('/login');
  };

  const hasActiveTrial = trialDaysRemaining !== null && trialDaysRemaining > 0;
  const hasExpiredTrial = trialDaysRemaining === 0 && Boolean(user?.subscriptionTrialEndsAt || user?.subscriptionStartedAt || user?.subscriptionPlan?.toLowerCase() === 'starter');
  const isStarterPlan = user?.subscriptionPlan?.toLowerCase() === 'starter';
  const trialCardClickable = hasActiveTrial || hasExpiredTrial || isStarterPlan;
  const trialCardRoute = '/owner/subscription';
  const trialDaysLabel = trialDaysRemaining === 1 ? '1 day' : `${trialDaysRemaining ?? 7} days`;
  const trialEndsDate = user?.subscriptionTrialEndsAt
    ? new Date(user.subscriptionTrialEndsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <main className="owner-page owner-console">
      <aside className="owner-sidebar">
        <Link to="/owner" className="owner-brand">
          <span>{getInitials(ownerName)}</span>
          <strong>{ownerName}</strong>
          <small>Owner Console</small>
        </Link>

        <button
          type="button"
          className={`owner-property owner-trial-card${trialCardClickable ? ' owner-trial-clickable' : ''}`}
          onClick={trialCardClickable ? () => navigate(trialCardRoute) : undefined}
          aria-label={trialCardClickable ? 'Go to subscription or payouts page' : undefined}
        >
          {trialDaysRemaining !== null && trialDaysRemaining > 0 ? (
            <div className="owner-trial-body">
              <span className="trial-label">Free Trial</span>
              <strong className="trial-days">{trialDaysLabel}</strong>
              <span className="trial-copy">Remaining in your free trial</span>
              <div className="trial-footer">
                <small>{trialEndsDate ? `Ends on ${trialEndsDate}` : 'Up to 7 days free trial'}</small>
                <span className="trial-icon">⏱</span>
              </div>
            </div>
          ) : hasExpiredTrial ? (
            <div className="owner-trial-body">
              <span className="trial-label">Trial Expired</span>
              <strong className="trial-days">0 days</strong>
              <span className="trial-copy">Your free trial has ended</span>
              <div className="trial-footer">
                <small>Please choose a paid plan</small>
                <span className="trial-icon">⚠️</span>
              </div>
            </div>
          ) : isStarterPlan ? (
            <div className="owner-trial-body">
              <span className="trial-label">Starter Plan</span>
              <strong className="trial-days">7 days</strong>
              <span className="trial-copy">Free trial days remaining</span>
              <div className="trial-footer">
                <small>Up to 7 days free trial</small>
                <span className="trial-icon">⭐</span>
              </div>
            </div>
          ) : (
            <div>
              <strong>💳 Active Subscription</strong>
              <span>{user?.subscriptionPlan || 'Premium'} Plan</span>
            </div>
          )}
        </button>

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
            <NavLink to="/owner/subscription">Subscription</NavLink>
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
            <LanguageSelector />
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
