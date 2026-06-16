import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import './trialBanner.css';

export interface TrialInfo {
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  isExpired: boolean;
  expiresAt: string | null;
}

export function useTrialStatus(expiresAt: string | null | undefined): TrialInfo {
  const [trialInfo, setTrialInfo] = useState<TrialInfo>({
    daysRemaining: 0,
    hoursRemaining: 0,
    minutesRemaining: 0,
    isExpired: false,
    expiresAt: expiresAt || null,
  });

  useEffect(() => {
    if (!expiresAt) {
      setTrialInfo((prev) => ({ ...prev, isExpired: true }));
      return;
    }

    function calculateTimeRemaining() {
      const now = new Date().getTime();
      const expiryTime = new Date(expiresAt).getTime();
      const timeRemaining = expiryTime - now;

      if (timeRemaining <= 0) {
        setTrialInfo({
          daysRemaining: 0,
          hoursRemaining: 0,
          minutesRemaining: 0,
          isExpired: true,
          expiresAt,
        });
        return;
      }

      const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

      setTrialInfo({
        daysRemaining,
        hoursRemaining,
        minutesRemaining,
        isExpired: false,
        expiresAt,
      });
    }

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [expiresAt]);

  return trialInfo;
}

export interface TrialBannerProps {
  expiresAt: string | null | undefined;
  onUpgrade?: () => void;
  children?: ReactNode;
}

export function TrialBanner({ expiresAt, onUpgrade }: TrialBannerProps) {
  const trial = useTrialStatus(expiresAt);

  if (trial.isExpired) {
    return null;
  }

  const isUrgent = trial.daysRemaining <= 2;
  const urgencyClass = isUrgent ? 'trial-banner-urgent' : '';

  return (
    <div className={`trial-banner ${urgencyClass}`}>
      <div className="trial-banner-content">
        <div className="trial-banner-icon">
          {isUrgent ? '⏰' : '🎁'}
        </div>
        <div className="trial-banner-text">
          <strong>
            {trial.daysRemaining === 0
              ? `Your free trial ends in ${trial.hoursRemaining}h ${trial.minutesRemaining}m`
              : `${trial.daysRemaining} day${trial.daysRemaining === 1 ? '' : 's'} left in your free trial`}
          </strong>
          <p>
            {isUrgent
              ? 'Upgrade now to continue listing your venues and accepting bookings after your trial ends.'
              : 'Get unlimited venue listings and bookings. Choose a plan that works for you.'}
          </p>
        </div>
        {onUpgrade && (
          <button
            type="button"
            className={`trial-banner-button ${isUrgent ? 'urgent' : 'primary'}`}
            onClick={onUpgrade}
          >
            {isUrgent ? 'Upgrade Now' : 'View Plans'}
          </button>
        )}
      </div>
    </div>
  );
}
