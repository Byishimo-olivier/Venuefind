import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createPaymentIntent, confirmPayment, getBooking } from '../../services/bookings';
import type { Booking } from '../../services/bookings';
import './venues.css';

function formatRwf(value = 0) {
  return `${Math.round(value).toLocaleString('en-US')} RWF`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function formatBalanceDue(value: string) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() - 14);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export default function VenueCheckout() {
  const { venueId = 'akagera' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId') || '';
  const [booking, setBooking] = useState<Booking | null>(null);
  const [schedule, setSchedule] = useState<'deposit' | 'full'>('deposit');
  const [method, setMethod] = useState('card');
  const [error, setError] = useState('');
  const [isPaying, setIsPaying] = useState(false);

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

  const handlePayment = async () => {
    if (!booking) return;

    setError('');
    setIsPaying(true);
    try {
      const payment = await createPaymentIntent({
        bookingId: booking.id,
        amount: amountDue,
        method,
      });
      await confirmPayment(payment.id);
      navigate(`/venues/${venueId}/confirmed?bookingId=${encodeURIComponent(booking.id)}`);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : 'Payment could not be completed.');
    } finally {
      setIsPaying(false);
    }
  };

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
                <strong>Pay 30% Deposit</strong>
                <em>Secure your date now, pay the remaining balance 14 days before the event.</em>
                <b>{formatRwf(booking?.totals.depositDue)}</b>
              </button>
              <button type="button" className={schedule === 'full' ? 'active' : ''} onClick={() => setSchedule('full')}>
                <span>Full</span>
                <strong>Full Payment</strong>
                <em>Pay the entire amount upfront for a simplified accounting experience.</em>
                <b>{formatRwf(booking?.totals.total)}</b>
              </button>
            </div>
          </section>

          <section className="checkout-step payment-method">
            <h2><span>2</span>Payment Method</h2>
            <div className="method-tabs">
              <button type="button" className={method === 'card' ? 'active' : ''} onClick={() => setMethod('card')}>Credit Card</button>
              <button type="button" className={method === 'mobile_money' ? 'active' : ''} onClick={() => setMethod('mobile_money')}>Mobile Money</button>
              <button type="button" className={method === 'bank_transfer' ? 'active' : ''} onClick={() => setMethod('bank_transfer')}>Bank Transfer</button>
            </div>
            <label>Cardholder Name<input defaultValue="JEAN PIERRE NIYOMUGABO" /></label>
            <label>Card Number<input defaultValue="•••• •••• •••• 4582" /></label>
            <div className="two-fields">
              <label>Expiry Date<input placeholder="MM / YY" /></label>
              <label>CVV<input placeholder="•••" /></label>
            </div>
          </section>

          <button type="button" className="secure-pay" onClick={handlePayment} disabled={!booking || isPaying}>
            {isPaying ? 'Processing...' : `Pay ${formatRwf(amountDue)} Securely`}
          </button>
          {error && <p className="pci-note">{error}</p>}
          <p className="pci-note">PCI-DSS Level 1 compliant mock transaction</p>
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
            <small>{booking ? `Balance due ${formatBalanceDue(booking.date)}` : 'Balance due before the event'}</small>
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
