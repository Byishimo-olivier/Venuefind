import { Link, NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import '../venues/venues.css';

const steps = [
  ['Basic Information', '/owner/register'],
  ['Business Details', '/owner/register/business'],
  ['Verification', '/owner/register/verification'],
  ['Final Review', '/owner/register/review'],
];

export function RegistrationShell({ children, step }: { children: ReactNode; step: number }) {
  return (
    <main className="registration-page">
      <header className="registration-top">
        <Link to="/venues" className="reg-logo">Umurage Marketplace</Link>
        <nav><Link to="/venues">Venues</Link><Link to="/venues/search">Services</Link><Link to="/venues/search">Heritage</Link><Link to="/login">Support</Link></nav>
        <Link to="/login">Partner Login</Link>
      </header>
      <aside className="registration-side">
        <h2>Registration</h2>
        <p>Venue & Service Onboarding</p>
        <nav>
          {steps.map(([label, url], index) => (
            <NavLink key={label} to={url} end={index === 0} className={step === index + 1 ? 'active' : ''}>
              {index === 0 ? '♙' : index === 1 ? '▦' : index === 2 ? '▣' : '◎'} {label}
            </NavLink>
          ))}
        </nav>
        <div className="reg-progress"><span>Step {step} of 4 · {step * 25}% Complete</span><i><b style={{ width: `${step * 25}%` }} /></i></div>
      </aside>
      <section className="registration-main">{children}</section>
      <footer className="registration-footer">© 2026 Umurage Marketplace. Celebrating Rwandan excellence.<span>Terms&nbsp;&nbsp;&nbsp;Privacy&nbsp;&nbsp;&nbsp;Contact</span></footer>
    </main>
  );
}
