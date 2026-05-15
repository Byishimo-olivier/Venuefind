import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/validation';
import { AuthShell } from './AuthShell';

const forgotImage =
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    if (!validateEmail(email)) {
      setErrors('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors('');
    if (validate()) {
      setIsSubmitting(true);
      console.log({ email });
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
      }, 1000);
    }
  };

  return (
    <AuthShell
      image={forgotImage}
      imagePosition="center"
      title={
        <>
          Creating unforgettable moments in the heart <span>of Africa.</span>
        </>
      }
      body="Your account keeps every venue conversation, booking, and concierge detail close at hand."
    >
      <Link to="/login" className="auth-back-link">
        &lt;- Back to Login
      </Link>

      <div className="auth-heading tall">
        <h2>Forgot Password?</h2>
        <p>Enter the email address associated with your account and we will send you a link to reset your password.</p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className={errors ? 'is-invalid' : ''}
              />
              <span className="static-input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </span>
            </div>
            {errors && <p className="field-error">{errors}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="primary-button">
            Send Reset Link
            <span aria-hidden="true">-&gt;</span>
          </button>
        </form>
      ) : (
        <div className="success-panel">
          <span className="success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <h3>Check your email</h3>
          <p>
            We sent a password reset link to <strong>{email}</strong>.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setEmail('');
            }}
          >
            Try another email
          </button>
        </div>
      )}

      <div className="support-links">
        <span>Need immediate assistance?</span>
        <Link to="/">Contact Support</Link>
        <Link to="/">Concierge</Link>
      </div>
    </AuthShell>
  );
}
