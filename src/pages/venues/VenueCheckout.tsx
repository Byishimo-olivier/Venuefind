import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBooking } from '../../services/bookings';
import type { Booking } from '../../services/bookings';
import { PaymentComponent } from '../../components/PaymentComponent';
import './venues.css';

function formatRwf(value = 0) {
  return `${Math.round(value).toLocaleString('en-US')} RWF`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function formatBalanceDue(value: string | null | undefined) {
  if (!value) return 'TBD';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'TBD';
  date.setDate(date.getDate() - 14);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export default function VenueCheckout() {
  const { venueId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId') || '';
  const [booking, setBooking] = useState<Booking | null>(null);
  const [schedule, setSchedule] = useState<'deposit' | 'full'>('deposit');
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setError('Create a booking before checkout.');
      return;
    }

    let isMounted = true;
    getBooking(bookingId)
      .then((result) => {
        if (isMounted) setBooking(result);
      })
      .catch((bookingError) => {
        if (isMounted) setError(bookingError instanceof Error ? bookingError.message : 'Could not load booking.');
      });

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  const amountDue = schedule === 'deposit' ? booking?.totals.depositDue || 0 : booking?.totals.total || 0;
  const balanceRemaining = booking ? Math.max((booking.totals.total || 0) - (schedule === 'deposit' ? booking.totals.depositDue || 0 : booking.totals.total || 0), 0) : 0;
  const balanceDueText = schedule === 'deposit' ? `Balance due ${formatBalanceDue(booking?.date || '')}` : 'Paid in full today';

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <Link to="/venues" className="booking-logo">The Venue Ledger</Link>
        <nav>
          <a>Transactions</a>
          <a className="active">Secure Checkout</a>
        </nav>
        <div>Secure Mock Payment</div>
      </header>

      <section className="checkout-wrap">
        <div className="checkout-main">
          <div className="checkout-title">
            <h1>Finalize Your Booking</h1>
            <p>{booking ? `Secure your date at ${booking.venueName}.` : 'Loading your booking details.'}</p>
          </div>

          <section className="checkout-step">
            <h2><span>1</span>Payment Schedule</h2>
            <div className="payment-options">
              <button type="button" className={schedule === 'deposit' ? 'active' : ''} onClick={() => setSchedule('deposit')}>
                <span>Deposit</span>
                <strong>Pay 30% today</strong>
                <em>Reserve your date now and pay the remaining balance later.</em>
                <b>{formatRwf(booking?.totals.depositDue)}</b>
              </button>
              <button type="button" className={schedule === 'full' ? 'active' : ''} onClick={() => setSchedule('full')}>
                <span>Full</span>
                <strong>Pay in full</strong>
                <em>Settle the entire booking amount upfront.</em>
                <b>{formatRwf(booking?.totals.total)}</b>
              </button>
            </div>
          </section>

          <section className="checkout-step checkout-payment-section">
            <h2><span>2</span>Payment Method</h2>

            <div className="checkout-payment-summary">
              <p>
                {schedule === 'deposit'
                  ? `You're paying ${formatRwf(amountDue)} today. ${balanceRemaining ? `Remaining ${formatRwf(balanceRemaining)} due by ${formatBalanceDue(booking?.date || '')}.` : ''}`
                  : `You're paying ${formatRwf(amountDue)} now. Your booking will be fully settled.`}
              </p>
            </div>
            
            {!paymentSuccess ? (
              <PaymentComponent
                bookingId={booking?.id || ''}
                amount={amountDue}
                currency="RWF"
                onSuccess={() => {
                  setPaymentSuccess(true);
                  setError('');
                  setTimeout(() => {
                    navigate(`/venues/${venueId}/confirmed?bookingId=${encodeURIComponent(booking?.id || '')}`);
                  }, 2000);
                }}
                onError={(error) => {
                  setError(`Payment error: ${error}`);
                }}
              />
            ) : (
              <div className="checkout-payment-status success">
                <div className="checkout-payment-status__icon">✓</div>
                <strong>Payment Successful!</strong>
                <p>Redirecting to your booking confirmation...</p>
              </div>
            )}
            
            {error && <p className="checkout-payment-error">{error}</p>}
          </section>
        </div>

        <aside className="receipt-card">
          <div className="receipt-image">
            <img src={booking?.venueImage || 'https://images.unsplash.com/photo-1507901747481-84a4f64fda6d?auto=format&fit=crop&w=700&q=85'} alt="" />
            <h2>{booking?.venueName || 'Venue booking'}</h2>
            <p>{booking?.venueLocation || 'Rwanda'}</p>
          </div>
          <dl>
            <div><dt>Date</dt><dd>{booking ? formatDate(booking.date) : '-'}</dd></div>
            <div><dt>Guests</dt><dd>{booking ? `${booking.guestCount} guests` : '-'}</dd></div>
            <div><dt>Payment plan</dt><dd>{schedule === 'deposit' ? 'Deposit payment' : 'Full payment'}</dd></div>
            <div><dt>Next due</dt><dd>{schedule === 'deposit' ? formatBalanceDue(booking?.date || '') : 'None'}</dd></div>
            <div><dt>Base Venue Hire</dt><dd>{formatRwf(booking?.totals.baseVenueFee)}</dd></div>
            <div><dt>Selected Add-ons</dt><dd>{formatRwf(booking?.totals.addonsTotal)}</dd></div>
            <div><dt>VAT</dt><dd>{formatRwf(booking?.totals.vat)}</dd></div>
          </dl>
          <div className="receipt-total">
            <span>Total Cost</span>
            <strong>{formatRwf(booking?.totals.total)}</strong>
          </div>
          <div className="deposit-due">
            <span>Today's Payment</span>
            <strong>{formatRwf(amountDue)}</strong>
            <small>{booking ? balanceDueText : 'Balance due before the event'}</small>
          </div>
        </aside>
      </section>

      <footer className="ledger-footer">
        <div><strong>The Venue Ledger Guarantee</strong><p>Secure transaction protected by our venue booking assurance.</p></div>
        <div>24/7 Concierge Support<br />+250 788 000 000</div>
      </footer>
    </main>
  );
}
