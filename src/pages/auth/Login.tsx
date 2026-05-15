import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/validation';
import { AuthShell, BrandMark, EyeButton, GoogleIcon } from './AuthShell';

const loginImage =
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (password.length < 6) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      console.log({ email, password });
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  return (
    <AuthShell
      image={loginImage}
      imagePosition="center"
      kicker="Curated Excellence"
      title={
        <>
          Turning fleeting moments into <span>timeless legacies.</span>
        </>
      }
      body="Experience the art of Rwandan hospitality through our bespoke digital concierge service. Every detail, meticulously managed."
      footer={<span>Kigali, Rwanda</span>}
    >
      <BrandMark />

      <div className="auth-heading">
        <h2>Welcome Back</h2>
        <p>Please enter your credentials to access your event dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.rw"
            className={errors.email ? 'is-invalid' : ''}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="field">
          <div className="field-row">
            <label htmlFor="password">Password</label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <div className="input-with-icon">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="........"
              className={errors.password ? 'is-invalid' : ''}
            />
            <EyeButton
              visible={showPassword}
              onClick={() => setShowPassword(!showPassword)}
              label={showPassword ? 'Hide password' : 'Show password'}
            />
          </div>
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="primary-button">
          Log In
        </button>
      </form>

      <div className="divider">
        <span>Or continue with</span>
      </div>

      <button className="secondary-button">
        <GoogleIcon />
        <span>Sign up with Google</span>
      </button>

      <p className="auth-switch">
        Don't have an account? <Link to="/signup">Create Account</Link>
      </p>

      <nav className="auth-footer-links">
        <Link to="/">Privacy Policy</Link>
        <Link to="/">Terms of Service</Link>
        <Link to="/">Contact Support</Link>
      </nav>
    </AuthShell>
  );
}
