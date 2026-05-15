import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from './AuthShell';

const verificationImage =
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=85';

export default function Verification() {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verificationMethod, setVerificationMethod] = useState<'authenticator' | 'sms'>('authenticator');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string>('');
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join('');
    if (code.length !== verificationCode.length) {
      setErrors('Please enter the full verification code');
      return;
    }

    setIsSubmitting(true);
    console.log({ verificationCode: code, method: verificationMethod });
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1000);
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
        <p>Step 2 of 2: Secure your account to ensure the safety of your venue bookings and financial transactions.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="verification-section">
          <div className="step-title">
            <span>1</span>
            <h3>Select Verification Method</h3>
          </div>

          <button
            type="button"
            onClick={() => setVerificationMethod('authenticator')}
            className={`method-card ${verificationMethod === 'authenticator' ? 'active' : ''}`}
          >
            <span className="method-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                <path d="M10 8h4v4h-4z" />
              </svg>
            </span>
            <span>
              <small>Recommended</small>
              <strong>Authenticator App</strong>
              <em>Use Google Authenticator or Microsoft Authenticator for the highest level of security.</em>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setVerificationMethod('sms')}
            className={`method-card ${verificationMethod === 'sms' ? 'active' : ''}`}
          >
            <span className="method-icon muted" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 5h16v11H7l-3 3V5z" />
                <path d="M8 9h8M8 12h5" />
              </svg>
            </span>
            <span>
              <strong>SMS Verification</strong>
              <em>Receive a one-time code to your registered Rwandan mobile number (+250).</em>
            </span>
          </button>
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
              <button type="button">Resend via Authenticator</button>
            </p>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="primary-button">
          Continue to Dashboard
          <span aria-hidden="true">-&gt;</span>
        </button>
      </form>

      <p className="auth-switch small">I'll set this up later</p>
    </AuthShell>
  );
}
