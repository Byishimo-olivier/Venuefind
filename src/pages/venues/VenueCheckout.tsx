import { Link } from 'react-router-dom';
import './venues.css';

export default function VenueCheckout() {
  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <Link to="/venues" className="booking-logo">The Venue Ledger</Link>
        <nav>
          <a>Transactions</a>
          <a className="active">Secure Checkout</a>
        </nav>
        <div>♧ ◎ ◉</div>
      </header>

      <section className="checkout-wrap">
        <div className="checkout-main">
          <div className="checkout-title">
            <h1>Finalize Your Booking</h1>
            <p>Secure your dates at The Grand Ballroom. All transactions are encrypted and processed through our verified gateway.</p>
          </div>

          <section className="checkout-step">
            <h2><span>1</span>Payment Schedule</h2>
            <div className="payment-options">
              <button className="active">
                <span>▣</span>
                <strong>Pay 30% Deposit</strong>
                <em>Secure your dates now, pay the remaining balance 14 days before the event.</em>
                <b>450,000 RWF</b>
              </button>
              <button>
                <span>▤</span>
                <strong>Full Payment</strong>
                <em>Pay the entire amount upfront for a simplified accounting experience.</em>
                <b>1,500,000 RWF</b>
              </button>
            </div>
          </section>

          <section className="checkout-step payment-method">
            <h2><span>2</span>Payment Method</h2>
            <div className="method-tabs">
              <button className="active">▣ Credit Card</button>
              <button>▯ Mobile Money</button>
              <button>▱ Bank Transfer</button>
            </div>
            <label>Cardholder Name<input defaultValue="JEAN PIERRE NIYOMUGABO" /></label>
            <label>Card Number<input defaultValue="•••• •••• •••• 4582" /></label>
            <div className="two-fields">
              <label>Expiry Date<input placeholder="MM / YY" /></label>
              <label>CVV<input placeholder="•••" /></label>
            </div>
          </section>

          <Link to="/venues/akagera/confirmed" className="secure-pay">▣ Pay 450,000 RWF Securely</Link>
          <p className="pci-note">◎ PCI-DSS Level 1 Compliant Transaction</p>
        </div>

        <aside className="receipt-card">
          <div className="receipt-image">
            <img src="https://images.unsplash.com/photo-1507901747481-84a4f64fda6d?auto=format&fit=crop&w=700&q=85" alt="" />
            <h2>The Grand Ballroom</h2>
            <p>Kigali Business District</p>
          </div>
          <dl>
            <div><dt>Date</dt><dd>14 October 2026</dd></div>
            <div><dt>Guests</dt><dd>Up to 250 Pax</dd></div>
            <div><dt>Base Venue Hire</dt><dd>1,200,000 RWF</dd></div>
            <div><dt>Catering & Setup</dt><dd>300,000 RWF</dd></div>
            <div><dt>Admin Fee (WAIVED)</dt><dd>0 RWF</dd></div>
          </dl>
          <div className="receipt-total">
            <span>Total Cost</span>
            <strong>1,500,000 RWF</strong>
          </div>
          <div className="deposit-due">
            <span>Today's Deposit (30%)</span>
            <strong>450,000 RWF</strong>
            <small>Balance due Oct 1, 2026</small>
          </div>
        </aside>
      </section>

      <footer className="ledger-footer">
        <div><strong>✹ The Venue Ledger Guarantee</strong><p>Secure transaction protected by our venue booking assurance.</p></div>
        <div>24/7 Concierge Support<br />+250 788 000 000</div>
      </footer>
    </main>
  );
}
