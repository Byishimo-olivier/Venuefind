import React, { useState } from 'react';
import {
  confirmPayment,
  getPaymentStatus,
  initiatePesapalCardPayment,
  initiatePayPalMobilePayment,
} from '../services/payments';

interface PaymentProps {
  bookingId: string;
  amount: number;
  currency?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export const PaymentComponent: React.FC<PaymentProps> = ({
  bookingId,
  amount,
  currency = 'RWF',
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'phone'>('card');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  /**
   * Handle card payment via PesaPal
   */
  const handleCardPayment = async () => {
    try {
      setLoading(true);
      setStatus('processing');

      const payment = await initiatePesapalCardPayment({
        method: 'card',
        bookingId,
        amount,
        currency,
      });

      setPaymentId(payment.id);
      // User will be redirected to PesaPal website
      // After successful payment, webhook will handle confirmation
    } catch (error: any) {
      setStatus('error');
      const errorMsg = error.message || 'Card payment failed';
      onError?.(errorMsg);
      console.error('Card payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle mobile payment via Paypack
   */
  const handleMobilePayment = async () => {
    if (!phoneNumber.trim()) {
      onError?.('Please enter a phone number');
      return;
    }

    try {
      setLoading(true);
      setStatus('processing');

      const payment = await initiatePayPalMobilePayment({
        method: 'phone',
        bookingId,
        amount,
        currency,
        phoneNumber,
      });

      setPaymentId(payment.id);
      // User approves the mobile money prompt, then we confirm the payment status.
    } catch (error: any) {
      setStatus('error');
      const errorMsg = error.message || 'Mobile payment failed';
      onError?.(errorMsg);
      console.error('Mobile payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check payment status (for polling)
   */
  const checkPaymentStatus = async () => {
    if (!paymentId) return;

    try {
      setLoading(true);
      const payment = await getPaymentStatus(paymentId);

      if (payment.payment.status === 'paid') {
        setStatus('success');
        onSuccess?.(paymentId);
      } else {
        console.log('Payment status:', payment.payment.status);
      }
    } catch (error: any) {
      console.error('Status check error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Confirm mobile payment after user approves the Paypack prompt
   */
  const handleConfirmPayment = async () => {
    if (!paymentId) return;

    try {
      setLoading(true);
      setStatus('processing');

      const payment = await confirmPayment(paymentId);

      if (payment.payment.status === 'paid') {
        setStatus('success');
        onSuccess?.(paymentId);
      } else {
        setStatus('processing');
        onError?.('Payment is still pending. Please approve the mobile money prompt, then check again.');
      }
    } catch (error: any) {
      setStatus('error');
      const errorMsg = error.message || 'Confirmation failed';
      onError?.(errorMsg);
      console.error('Confirmation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-widget">
      <div className="payment-widget__header">
        <span className="payment-widget__eyebrow">Secure payment</span>
        <h2>Complete your booking</h2>
        <p className="payment-widget__intro">Choose the payment method that works best for you and confirm your venue reservation.</p>
      </div>

      <div className="payment-summary">
        <div className="payment-summary__row">
          <span>Amount</span>
          <strong>{amount} {currency}</strong>
        </div>
        <div className="payment-summary__row">
          <span>Booking ID</span>
          <strong className="payment-summary__id">{bookingId}</strong>
        </div>
      </div>

      {status === 'idle' && !paymentId && (
        <>
          <div className="payment-method-selector">
            <label className={`payment-method-card ${paymentMethod === 'card' ? 'payment-method-card--active' : ''}`}>
              <input
                type="radio"
                name="method"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="payment-method-card__input"
              />
              <div className="payment-method-card__details">
                <span className="payment-method-card__label">Card payment</span>
                <strong className="payment-method-card__title">PesaPal</strong>
                <p className="payment-method-card__description">Pay securely with card and complete the booking in one step.</p>
              </div>
            </label>

            <label className={`payment-method-card ${paymentMethod === 'phone' ? 'payment-method-card--active' : ''}`}>
              <input
                type="radio"
                name="method"
                value="phone"
                checked={paymentMethod === 'phone'}
                onChange={() => setPaymentMethod('phone')}
                className="payment-method-card__input"
              />
              <div className="payment-method-card__details">
                <span className="payment-method-card__label">Mobile payment</span>
                <strong className="payment-method-card__title">Paypack mobile money</strong>
                <p className="payment-method-card__description">Receive a payment request on your phone and approve it instantly.</p>
              </div>
            </label>
          </div>

          {paymentMethod === 'phone' && (
            <div className="payment-input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="078 XXX XXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="payment-input"
              />
              <p className="payment-input-hint">We will send the payment request to this number.</p>
            </div>
          )}

          <button
            onClick={paymentMethod === 'card' ? handleCardPayment : handleMobilePayment}
            disabled={loading || (paymentMethod === 'phone' && !phoneNumber.trim())}
            className="payment-button"
          >
            {loading ? 'Processing...' : `Pay ${amount} ${currency}`}
          </button>
        </>
      )}

      {status === 'processing' && paymentId && (
        <div className="payment-status payment-status--processing">
          <div className="payment-status__icon payment-status__icon--loader" />
          <p>Processing your payment...</p>
          {paymentMethod === 'phone' && (
            <p className="payment-status__meta">Check your phone for a mobile money approval prompt.</p>
          )}
          <p className="payment-status__meta">Payment ID: {paymentId}</p>

          <div className="payment-status__actions">
            <button
              onClick={checkPaymentStatus}
              disabled={loading}
              className="payment-status__button"
            >
              Check status
            </button>

            {paymentMethod === 'phone' && (
              <button
                onClick={handleConfirmPayment}
                disabled={loading}
                className="payment-status__button payment-status__button--primary"
              >
                Confirm payment
              </button>
            )}
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="payment-status payment-status--success">
          <div className="payment-status__icon">✓</div>
          <p className="payment-status__message">Payment successful!</p>
          <p className="payment-status__meta">Your payment has been confirmed.</p>
          <p className="payment-status__meta">Payment ID: {paymentId}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="payment-status payment-status--error">
          <div className="payment-status__icon">✗</div>
          <p className="payment-status__message">Payment failed</p>
          <button
            onClick={() => {
              setStatus('idle');
              setPaymentId(null);
            }}
            className="payment-button payment-button--secondary"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
};
