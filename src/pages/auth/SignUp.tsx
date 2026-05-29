import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword, validateFullName, validatePhoneNumber } from '../../utils/validation';
import { continueWithGoogle, register } from '../../services/auth';
import { AuthShell, GoogleIcon } from './AuthShell';

const signupImage =
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=85';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateFullName(fullName)) {
      newErrors.fullName = 'Please enter a valid full name';
    }
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePhoneNumber(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerMessage('');
    if (validate()) {
      setIsSubmitting(true);
      try {
        const result = await register({ fullName, email, phone: `+250${phone.replace(/\D/g, '')}`, password, role });
        window.sessionStorage.setItem('verification-email-status', JSON.stringify({
          emailError: result.emailError,
          emailSent: result.emailSent,
          message: result.message,
          verificationCode: result.verificationCode,
        }));
        navigate('/verification');
      } catch (error) {
        setServerMessage(error instanceof Error ? error.message : 'Unable to create your account.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogle = async () => {
    setServerMessage('');
    setIsSubmitting(true);
    try {
      await continueWithGoogle('signup');
      navigate('/verification');
    } catch (error) {
      setServerMessage(error instanceof Error ? error.message : 'Google sign-up failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      image={signupImage}
      imagePosition="center"
      kicker="Premier Selection 2026"
      title={
        <>
          Experience Rwanda's Most <span>Exquisite Settings.</span>
        </>
      }
      body="From mist-covered hills to private garden venues, book spaces that turn every gathering into a memory."
      footer={<span>Join 200+ event planners</span>}
      topRight={<span className="support-chip">Support</span>}
    >
      <div className="auth-heading compact">
        <span className="form-kicker">Premier Selection 2026</span>
        <h2>Create Account</h2>
        <p>Register to start booking your luxury event.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Uwase Aline"
            className={errors.fullName ? 'is-invalid' : ''}
          />
          {errors.fullName && <p className="field-error">{errors.fullName}</p>}
        </div>

        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aline.uwase@example.rw"
            className={errors.email ? 'is-invalid' : ''}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="phone">Phone Number</label>
          <div className="phone-row">
            <select aria-label="Country code">
              <option>+250</option>
            </select>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="780 000 000"
              className={errors.phone ? 'is-invalid' : ''}
            />
          </div>
          {errors.phone && <p className="field-error">{errors.phone}</p>}
        </div>

        <div className="two-fields">
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="........"
              className={errors.password ? 'is-invalid' : ''}
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="........"
              className={errors.confirmPassword ? 'is-invalid' : ''}
            />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="role">I am a...</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="role-select"
          >
            <option value="customer">Customer (Looking to book venues)</option>
            <option value="owner">Owner/Venue Provider (Looking to list venues)</option>
          </select>
        </div>

        <button type="submit" disabled={isSubmitting} className="primary-button">
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
        {serverMessage && <p className="field-error centered">{serverMessage}</p>}
      </form>

      <div className="divider">
        <span>Or join with</span>
      </div>

      <button className="secondary-button" onClick={handleGoogle} disabled={isSubmitting}>
        <GoogleIcon />
        <span>Sign up with Google</span>
      </button>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </AuthShell>
  );
}
