import { Link } from 'react-router-dom';
import './venues.css';

export default function BookingConfirmation() {
  return (
    <main className="confirmation-page">
      <section className="confirmation-wrap">
        <div className="confirmed-icon">✓</div>
        <h1>Booking Confirmed</h1>
        <p>Your reservation at The Grand Arch is secured. We look forward to hosting your event.</p>
        <div className="confirmation-number">Confirmation Number <strong>#GA-7829-RW</strong></div>

        <div className="confirmation-grid">
          <section className="confirmed-venue">
            <div className="confirmed-image">
              <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85" alt="" />
              <div>
                <h2>The Grand Arch</h2>
                <p>⌖ Kigali Heights Atrium</p>
              </div>
            </div>
            <div className="confirmed-meta">
              <div><span>▣ Date</span><strong>October 24, 2026</strong></div>
              <div><span>◷ Time</span><strong>18:00 - 23:00</strong></div>
            </div>
            <Link to="/venues/akagera/review/new">Please Review: Help us to Improve</Link>
          </section>

          <aside className="confirmed-services">
            <div className="booked-services">
              <h2>Booked Services</h2>
              <p>✓ Full Atrium Access <span>Includes mezzanine and private terrace</span></p>
              <p>✓ Premium Audiovisual Suite <span>4K projectors, surround sound, mic setup</span></p>
              <p>✓ In-House Concierge <span>Dedicated staff for event duration</span></p>
            </div>
            <div className="sync-card">
              <h2>Sync Event</h2>
              <p>Add this reservation to your calendar to stay updated.</p>
              <button>▣ Add to Google Calendar</button>
              <button>▣ Add to Outlook</button>
            </div>
          </aside>
        </div>

        <div className="reservation-actions">
          <span>Need to make changes to your reservation?</span>
          <Link to="/venues/akagera/book">Reschedule Event</Link>
          <a>Cancel Booking</a>
        </div>
      </section>
    </main>
  );
}
