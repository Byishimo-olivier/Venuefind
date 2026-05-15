import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type AuthShellProps = {
  children: ReactNode;
  kicker?: string;
  title: ReactNode;
  body: string;
  image: string;
  imagePosition?: string;
  brandMode?: 'venue' | 'partner';
  footer?: ReactNode;
  topRight?: ReactNode;
  tone?: 'warm' | 'cool';
};

export function AuthShell({
  children,
  kicker,
  title,
  body,
  image,
  imagePosition = 'center',
  brandMode = 'venue',
  footer,
  topRight,
  tone = 'warm',
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <aside className={`auth-visual auth-visual-${tone}`}>
        <img src={image} alt="" className="auth-visual-image" style={{ objectPosition: imagePosition }} />
        <div className="auth-visual-shade" />
        <div className="auth-visual-brand">
          {brandMode === 'partner' ? (
            <Link to="/signup" className="auth-back-link auth-back-light">
              &lt;- Partner Registration
            </Link>
          ) : (
            <span>Smart Event Venue</span>
          )}
        </div>
        <div className="auth-visual-copy">
          {kicker && <span className="auth-kicker">{kicker}</span>}
          <h1>{title}</h1>
          <p>{body}</p>
        </div>
        {footer && <div className="auth-visual-footer">{footer}</div>}
      </aside>

      <section className="auth-panel">
        {topRight && <div className="auth-top-right">{topRight}</div>}
        <div className="auth-card">{children}</div>
      </section>
    </main>
  );
}

export function BrandMark() {
  return (
    <div className="brand-row">
      <span className="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 3l2.2 4.6L19 9.8l-4.8 2.1L12 17l-2.2-5.1L5 9.8l4.8-2.2L12 3z" />
          <path d="M18 15l.9 1.9 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9L18 15z" />
        </svg>
      </span>
      <span>Smart Event Venue</span>
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.2 3-7.2z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-0.9 6.6-2.5l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" />
      <path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3.1a10 10 0 0 0 0 8.8l3.3-2.6z" />
      <path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.9 5.6l3.3 2.6c.8-2.3 3-4.1 5.6-4.1z" />
    </svg>
  );
}

export function EyeButton({ visible, onClick, label }: { visible: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" className="input-icon-button" onClick={onClick} aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {visible ? (
          <>
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
            <circle cx="12" cy="12" r="3" />
          </>
        ) : (
          <>
            <path d="M3 3l18 18" />
            <path d="M10.7 5.2A9.9 9.9 0 0 1 12 5c6 0 9.5 7 9.5 7a16 16 0 0 1-3 4" />
            <path d="M6.2 6.8C3.9 8.5 2.5 12 2.5 12s3.5 7 9.5 7c1.2 0 2.3-.3 3.3-.7" />
          </>
        )}
      </svg>
    </button>
  );
}
