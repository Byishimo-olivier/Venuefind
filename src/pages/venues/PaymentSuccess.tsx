import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getPaymentStatus } from '../../services/payments';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = searchParams.get('id');
  const orderId = searchParams.get('orderId');

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [payment, setPayment] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        if (!paymentId && !orderId) {
          setStatus('failed');
          setError('No payment ID provided');
          return;
        }

        const id = paymentId || orderId;
        if (!id) return;

        const result = await getPaymentStatus(id);
        setPayment(result.payment);

        if (result.payment.status === 'paid') {
          setStatus('success');
        } else {
          setStatus('failed');
          setError('Payment not yet confirmed. Please try again.');
        }
      } catch (err: any) {
        setStatus('failed');
        setError(err.message || 'Failed to verify payment');
      }
    };

    checkPaymentStatus();
  }, [paymentId, orderId]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: '500px', width: '100%', margin: '0 1rem' }}>
        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>⏳</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Verifying Payment</h1>
            <p style={{ color: '#666' }}>Please wait while we confirm your payment...</p>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#4caf50' }}>✓</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#4caf50' }}>Payment Successful!</h1>
            <p style={{ color: '#666', marginBottom: '1rem' }}>Your payment has been confirmed and your booking is now active.</p>

            {payment && (
              <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', textAlign: 'left' }}>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Payment ID:</strong> {payment.id}
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Amount:</strong> RWF {Math.round(payment.amount).toLocaleString('en-US')}
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Method:</strong> {payment.method === 'card' ? 'Card (PesaPal)' : 'Mobile (PayPal)'}
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Date:</strong> {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : 'Just now'}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Continue to Dashboard
              </button>
              <Link
                to="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#f44336' }}>✗</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#f44336' }}>Payment Failed</h1>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{error || 'We could not verify your payment. Please try again.'}</p>

            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Try Again
              </button>
              <Link
                to="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
