import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { resendVerificationCode, verifyAccount } from '../../services/auth';
import { getAuthUser } from '../../services/api';
import { AuthShell } from './AuthShell';

const verificationImage =
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=85';
const inboxNotice = 'If you do not see it in your inbox, check your Spam or Junk folder.';

export default function Verification() {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const user = getAuthUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<string>('');
  const [notice, setNotice] = useState(
    user?.email
      ? `Check ${user.email} for the verification code. ${inboxNotice}`
      : `Check your email for the verification code. ${inboxNotice}`
  );
  const navigate = useNavigate();

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      setErrors('');

      if (value && index < verificationCode.length - 1) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join('');
    if (code.length !== verificationCode.length) {
      setErrors('Please enter the full verification code');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyAccount(code, 'authenticator');
      setIsSubmitting(false);
      navigate('/venues');
    } catch (error) {
      setErrors(error instanceof Error ? error.message : 'Unable to verify your account.');
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setErrors('');
    setIsResending(true);
    try {
      const result = await resendVerificationCode();
      setNotice(result.emailSent && user?.email ? `A new code was sent to ${user.email}. ${inboxNotice}` : result.message || `A new code was generated. ${inboxNotice}`);
    } catch (error) {
      setErrors(error instanceof Error ? error.message : 'Unable to resend verification code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell
      image={verificationImage}
      imagePosition="center"
      brandMode="partner"
      tone="cool"
      kicker="Platform Integrity"
      title={
        <>
          Securing the world's most <span>exclusive stages.</span>
        </>
      }
      body="To maintain the premium standard of our digital concierge service, we protect every partner account before bookings and payments begin."
      footer={
        <div className="security-footer">
          <span>End-to-end encrypted</span>
          <span>RURA compliant</span>
        </div>
      }
      topRight={
        <nav className="setup-nav">
          <span>Setup</span>
          <span>Guidelines</span>
          <span>Support</span>
        </nav>
      }
    >
      <div className="auth-heading">
        <h2>Umutekano</h2>
        <p>{notice}</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="verification-section">
          <div className="step-title">
            <span>1</span>
            <h3>Email Verification</h3>
          </div>

          <div className="method-card active">
            <span className="method-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 6h16v12H4z" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </span>
            <span>
              <small>Verification email</small>
              <strong>{user?.email || 'Your signup email'}</strong>
              <em>Enter the 6-digit code sent to the email address used during signup. Check Spam or Junk if it is missing.</em>
            </span>
          </div>
        </div>

        <div className="verification-section">
          <div className="step-title muted">
            <span>2</span>
            <h3>Enter Verification Code</h3>
          </div>

          <div className="code-box">
            <div className="code-inputs">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  maxLength={1}
                  aria-label={`Verification digit ${index + 1}`}
                />
              ))}
            </div>
            {errors && <p className="field-error centered">{errors}</p>}
            <p>
              Haven't received the code?
              <button type="button" onClick={handleResend} disabled={isResending}>
                {isResending ? 'Sending...' : 'Resend email'}
              </button>
            </p>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="primary-button">
          {isSubmitting ? 'Verifying...' : 'Continue to Dashboard'}
          <span aria-hidden="true">-&gt;</span>
        </button>
      </form>

      <p className="auth-switch small">I'll set this up later</p>
    </AuthShell>
  );
}
