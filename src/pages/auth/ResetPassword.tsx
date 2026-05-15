import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validatePassword } from '../../utils/validation';
import { AuthShell, EyeButton } from './AuthShell';

const resetImage =
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      console.log({ password });
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/login');
      }, 1000);
    }
  };

  return (
    <AuthShell
      image={resetImage}
      imagePosition="center"
      title={
        <>
          Curated Spaces for Life's Most <span>Memorable Moments</span>
        </>
      }
      body="Discover breathtaking Rwandan venues where traditional elegance meets modern luxury in every hand-selected detail."
      topRight={<span className="support-chip">Support</span>}
    >
      <div className="auth-heading tall">
        <h2>Set New Password</h2>
        <p>Your new password must be different from previously used passwords.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="newPassword">New Password</label>
          <div className="input-with-icon">
            <input
              id="newPassword"
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

        <div className="field">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <div className="input-with-icon">
            <input
              id="confirmNewPassword"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="........"
              className={errors.confirmPassword ? 'is-invalid' : ''}
            />
            <EyeButton
              visible={showConfirm}
              onClick={() => setShowConfirm(!showConfirm)}
              label={showConfirm ? 'Hide password' : 'Show password'}
            />
          </div>
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
        </div>

        <div className="requirements">
          <p className={password.length >= 8 ? 'met' : ''}>Minimum 8 characters</p>
          <p className={/[A-Z]/.test(password) && /[0-9]/.test(password) ? 'met' : ''}>
            Include at least one uppercase letter and one number
          </p>
        </div>

        <button type="submit" disabled={isSubmitting} className="primary-button">
          Reset Password
          <span aria-hidden="true">-&gt;</span>
        </button>
      </form>

      <p className="auth-switch small">
        <Link to="/login">&lt;- Back to Login</Link>
      </p>
    </AuthShell>
  );
}
