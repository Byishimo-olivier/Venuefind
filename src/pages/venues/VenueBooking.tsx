import { Link } from 'react-router-dom';
import './venues.css';

const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

export default function VenueBooking() {
  return (
    <main className="booking-page">
      <BookingHeader />
      <section className="booking-wrap">
        <div className="booking-title">
          <h1>Reserve Your Experience</h1>
          <p>Configure your event at The Kigali Grand Atrium. Select your preferred date, time, and bespoke additions to elevate your gathering.</p>
        </div>

        <div className="booking-grid">
          <aside className="availability-card">
            <h2>Availability</h2>
            <div className="calendar-head"><button>‹</button><strong>October 2026</strong><button>›</button></div>
            <div className="weekdays">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <span key={d}>{d}</span>)}</div>
            <div className="calendar-grid">
              {days.map((day) => (
                <button key={day} className={day === 13 ? 'selected' : [8, 12, 18, 24, 26].includes(day) ? 'prime' : [15, 17].includes(day) ? 'booked' : ''}>
                  {day}
                </button>
              ))}
            </div>
            <div className="calendar-legend">
              <span><i className="selected" />Selected Date</span>
              <span><i className="prime" />Prime Availability</span>
              <span><i className="booked" />Fully Booked</span>
            </div>
          </aside>

          <section className="logistics-stack">
            <div className="logistics-card">
              <h2>Event Logistics</h2>
              <div className="two-fields">
                <label>Start Time<select defaultValue="2:00 PM"><option>2:00 PM</option><option>4:00 PM</option></select></label>
                <label>Duration<select defaultValue="6 Hours"><option>6 Hours</option><option>8 Hours</option></select></label>
              </div>
              <label>Guest Count (Est.)<input defaultValue="150" /></label>
            </div>
            <div className="addons-card">
              <h2>Bespoke Add-ons</h2>
              <p>Enhance your event with our curated services.</p>
              {[
                ['Executive Catering', 'Premium 5-course plated service with dedicated waitstaff.', 'RWF 450,000', true],
                ['Floral & Decor Package', 'Custom centerpiece arrangements and ambient lighting design.', 'RWF 250,000', true],
                ['Event Photography', '4 hours of professional coverage and edited digital gallery.', 'RWF 150,000', false],
              ].map(([title, body, price, checked]) => (
                <label className="addon-row" key={title as string}>
                  <input type="checkbox" defaultChecked={checked as boolean} />
                  <span><strong>{title}</strong><em>{body}</em></span>
                  <b>{price}</b>
                </label>
              ))}
            </div>
          </section>

          <aside className="summary-card">
            <h2>Booking Summary</h2>
            <p>Base Venue Fee <strong>RWF 800,000</strong></p>
            <p>Executive Catering <strong>RWF 450,000</strong></p>
            <p>Floral & Decor <strong>RWF 250,000</strong></p>
            <hr />
            <p>Subtotal <strong>RWF 1,500,000</strong></p>
            <p>VAT (18%) <strong>RWF 270,000</strong></p>
            <div className="total-line">
              <span>Total Cost</span>
              <strong>RWF 1,770,000</strong>
            </div>
            <small>Required Deposit: 30%, RWF 531,000</small>
            <Link to="/venues/akagera/checkout">Continue to Payment <span>→</span></Link>
            <em>You won't be charged until the final step.</em>
          </aside>
        </div>
      </section>
    </main>
  );
}

export function BookingHeader() {
  return (
    <header className="booking-header">
      <Link to="/venues" className="booking-logo">The Venue Collective</Link>
      <nav>
        <Link to="/venues">Venues</Link>
        <Link to="/venues/akagera">Experiences</Link>
        <Link to="/venues/akagera/reviews">Concierge</Link>
        <Link to="/venues/akagera/book" className="active">My Bookings</Link>
      </nav>
      <div>
        <span>⌕</span>
        <Link to="/login">Sign In</Link>
      </div>
    </header>
  );
}
