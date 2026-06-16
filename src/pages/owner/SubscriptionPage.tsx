import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, getAuthUser } from '../../services/api';
import './subscription.css';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  highlighted?: boolean;
  description: string;
}

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'phone'>('card');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [modalPlanId, setModalPlanId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [cardPaymentUnavailable, setCardPaymentUnavailable] = useState(false);

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiRequest('/api/subscriptions/plans', { method: 'GET' });
        setPlans(response.plans || []);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
        setError('Could not load subscription plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const trialEndsAt = user?.subscriptionTrialEndsAt ? new Date(user.subscriptionTrialEndsAt) : null;
  const trialing = Boolean(
    user?.subscriptionStatus === 'free_trial' ||
    (trialEndsAt && trialEndsAt.getTime() > Date.now())
  );
  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  useEffect(() => {
    if (user?.role !== 'owner') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const activeSubscription = user?.subscriptionStatus === 'active' && !trialing;
  const handleSelectPlan = async (planId: string, methodArg?: 'card' | 'phone', phoneArg?: string) => {
    setSelectedPlan(planId);
    setLoading(true);
    setError(null);

    let method: 'card' | 'phone' = methodArg || paymentMethod;

    try {
      const phone = methodArg === 'phone' ? (phoneArg || phoneNumber) : undefined;
      if (method === 'phone' && (!phone || !phone.trim())) {
        throw new Error('Phone number is required for mobile payments.');
      }

      const data = await apiRequest<{ payment?: { redirectUrl?: string }; planId: string }>('/api/subscriptions/initiate', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ planId, paymentMethod: method, phoneNumber: phone }),
      });

      if (data.payment?.redirectUrl) {
        window.location.href = data.payment.redirectUrl;
        return;
      }

      if (data.payment) {
        // Mobile payment - show confirmation message instead of redirecting
        if (method === 'phone') {
          alert(`✓ Payment initiated!\n\nCheck your phone (${phone}) for a payment confirmation prompt.\n\nPlease confirm the payment on your phone to complete your subscription.`);
          navigate('/subscriptions/current');
          return;
        }
        throw new Error('Subscription checkout started but did not return a payment URL. Please try again or contact support.');
      }

      throw new Error('Unable to start subscription checkout. Please try again.');
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : String(err || 'Failed to subscribe');
      let userMessage = rawMessage;

      if (method === 'card' && isCardPaymentUnavailableError(rawMessage)) {
        setCardPaymentUnavailable(true);
        setPaymentMethod('phone');
        userMessage = 'Card payment via PesaPal is currently unavailable. Please select mobile payment and enter your phone number to continue.';
      }

      setError(userMessage);
      setSelectedPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const openMethodModal = (planId: string) => {
    setModalPlanId(planId);
    setModalError(null);
    setShowMethodModal(true);
  };

  const isCardPaymentUnavailableError = (message: string) => {
    const normalized = message.toLowerCase();
    return /checkout link|payment url|no payment url|pesapal.*not return|unable to start subscription checkout|invalid_consumer_key_or_secret|authentication failed|card payment provider/i.test(normalized);
  };

  const normalizePhone = (raw: string) => {
    if (!raw) return '';
    // strip spaces, dashes, parentheses
    return raw.replace(/[\s\-()\.]/g, '');
  };

  const isValidPhone = (raw: string) => {
    const p = normalizePhone(raw);
    // allow leading + and digits, require 9-15 digits
    const digits = p.replace(/^\+/, '');
    return /^[0-9]{9,15}$/.test(digits);
  };

  const confirmMethodModal = async () => {
    if (!modalPlanId) return;
    setModalError(null);

    if (paymentMethod === 'phone') {
      const normalized = normalizePhone(phoneNumber);
      if (!normalized) {
        setModalError('Enter a phone number for mobile checkout.');
        return;
      }
      if (!isValidPhone(normalized)) {
        setModalError('Please enter a valid phone number (9-15 digits).');
        return;
      }
      setPhoneNumber(normalized);
    }

    try {
      await handleSelectPlan(modalPlanId, paymentMethod, phoneNumber);
      // on success close modal
      setShowMethodModal(false);
      setModalPlanId(null);
    } catch (e: any) {
      setModalError(e?.message || 'Failed to start checkout');
    }
  };

  const pageTitle = activeSubscription
    ? 'Manage Your Plan'
    : trialing
      ? 'Your free trial is active'
      : 'Choose Your Plan';

  const pageMessage = activeSubscription
    ? `You are currently on the ${user?.subscriptionPlan?.toUpperCase() || 'Starter'} plan. Upgrade or switch plans anytime from this page.`
    : trialing
      ? `You have ${trialDaysLeft ?? 'a few'} day${trialDaysLeft === 1 ? '' : 's'} remaining in your free trial. Upgrade now to continue uninterrupted after your trial ends.`
      : 'Your free trial has ended. Select a plan to continue listing your venues and accepting bookings.';

  return (
    <div className="subscription-page">
      <div className="subscription-header">
        <h1>{pageTitle}</h1>
        <p>{pageMessage}</p>
      </div>

      {showMethodModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Select Payment Method</h3>
            <div style={{ marginTop: 8 }}>
              <label style={{ marginRight: 12 }}>
                <input
                  type="radio"
                  name="modalMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  disabled={cardPaymentUnavailable}
                />
                Card
              </label>
              <label>
                <input
                  type="radio"
                  name="modalMethod"
                  value="phone"
                  checked={paymentMethod === 'phone'}
                  onChange={() => setPaymentMethod('phone')}
                />
                Mobile (phone)
              </label>
            </div>
            {cardPaymentUnavailable && (
              <div className="subscription-warning" style={{ marginTop: 12, padding: '12px', background: '#FFF4E5', border: '1px solid #FFCC80', borderRadius: 6 }}>
                <strong>Card checkout unavailable:</strong> PesaPal card payments are currently not available. Please use mobile payment instead.
              </div>
            )}
            {paymentMethod === 'phone' && (
              <div style={{ marginTop: 8 }}>
                <input type="tel" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ padding: '8px', width: 220 }} />
              </div>
            )}
            {modalError && <p className="field-error">{modalError}</p>}
            <div style={{ marginTop: 12 }}>
              <button onClick={confirmMethodModal} disabled={loading} className="btn btn-primary">Continue</button>
              <button onClick={() => setShowMethodModal(false)} style={{ marginLeft: 8 }} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="subscription-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading subscription plans...</p>
        </div>
      ) : (
        <div className="subscription-plans">
          {plans.map((plan) => (
          <div
            key={plan.id}
            className={`subscription-card ${plan.highlighted ? 'highlighted' : ''} plan-${plan.id}`}
          >
            {plan.highlighted && <div className="plan-badge">Most Popular</div>}

            <div className="plan-header">
              <span className="plan-tag">{plan.name}</span>
              <p className="plan-description">{plan.description}</p>
            </div>

            <div className="plan-pricing">
              <span className="currency">{plan.currency}</span>
              <span className="price">{plan.price.toLocaleString()}</span>
              <span className="period">/{plan.billingPeriod === 'monthly' ? 'month' : 'year'}</span>
            </div>

            <div className="plan-features">
              <ul>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="feature-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`plan-button ${plan.highlighted ? 'highlighted' : ''}`}
              onClick={() => openMethodModal(plan.id)}
              disabled={loading && selectedPlan === plan.id}
            >
              {loading && selectedPlan === plan.id ? 'Processing...' : 'Get Started'}
            </button>
          </div>
        ))}
        </div>
      )}

      <div className="subscription-info">
        <h3>What Happens Next?</h3>
        <ol>
          <li>
            <strong>Select a plan</strong> that matches your venue's needs
          </li>
          <li>
            <strong>Complete payment</strong> using your preferred payment method (M-Pesa, PayPal, PayPack)
          </li>
          <li>
            <strong>Access activated</strong> immediately after successful payment
          </li>
          <li>
            <strong>Start accepting bookings</strong> with full platform access
          </li>
        </ol>
      </div>

      <div className="subscription-faq">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-item">
          <strong>Can I change my plan later?</strong>
          <p>Yes, you can upgrade or downgrade your plan anytime from your owner dashboard.</p>
        </div>
        <div className="faq-item">
          <strong>What payment methods do you accept?</strong>
          <p>We accept M-Pesa, PayPal, and PayPack for your convenience.</p>
        </div>
        <div className="faq-item">
          <strong>Is there a contract or commitment?</strong>
          <p>No! You can cancel your subscription anytime. There are no long-term contracts.</p>
        </div>
        <div className="faq-item">
          <strong>What's the commission rate?</strong>
          <p>Commission rates vary by plan, ranging from 5% (Premium) to 12% (Starter).</p>
        </div>
      </div>

      <div className="subscription-support">
        <p>Need help? Contact us at support@tombola.com or call +254 (0) 123 456 789</p>
      </div>
    </div>
  );
}
