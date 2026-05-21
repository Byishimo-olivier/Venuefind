import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cancelBooking, getBooking } from '../../services/bookings';
import type { Booking } from '../../services/bookings';
import './venues.css';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function formatTimeRange(startTime: string, durationHours: number) {
  return `${startTime} - ${durationHours} hours`;
}

export default function BookingConfirmation() {
  const { venueId = 'akagera' } = useParams();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || '';
  const [booking, setBooking] = useState<Booking | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!bookingId) {
      setMessage('No booking selected.');
      return;
    }

    let isMounted = true;
    getBooking(bookingId)
      .then((result) => {
        if (isMounted) setBooking(result);
      })
      .catch((error) => {
        if (isMounted) setMessage(error instanceof Error ? error.message : 'Could not load booking.');
      });

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  const handleCancel = async () => {
    if (!booking) return;

    try {
      const cancelled = await cancelBooking(booking.id);
      setBooking(cancelled);
      setMessage('Booking cancelled.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not cancel booking.');
    }
  };

  return (
    <main className="confirmation-page">
      <section className="confirmation-wrap">
        <div className="confirmed-icon">✓</div>
        <h1>{booking?.status === 'cancelled' ? 'Booking Cancelled' : 'Booking Confirmed'}</h1>
        <p>{booking ? `Your reservation at ${booking.venueName} is ${booking.status.replace('_', ' ')}.` : 'Loading your reservation.'}</p>
        <div className="confirmation-number">Confirmation Number <strong>#{booking?.confirmationNumber || '-'}</strong></div>

        <div className="confirmation-grid">
          <section className="confirmed-venue">
            <div className="confirmed-image">
              <img src={booking?.venueImage || 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85'} alt="" />
              <div>
                <h2>{booking?.venueName || 'Venue booking'}</h2>
                <p>{booking?.venueLocation || 'Rwanda'}</p>
              </div>
            </div>
            <div className="confirmed-meta">
              <div><span>Date</span><strong>{booking ? formatDate(booking.date) : '-'}</strong></div>
              <div><span>Time</span><strong>{booking ? formatTimeRange(booking.startTime, booking.durationHours) : '-'}</strong></div>
            </div>
            <Link to={`/venues/${venueId}/review/new`}>Please Review: Help us to Improve</Link>
          </section>

          <aside className="confirmed-services">
            <div className="booked-services">
              <h2>Booked Services</h2>
              <p>✓ Full Venue Access <span>{booking ? `${booking.guestCount} guests` : 'Guest count pending'}</span></p>
              {booking?.addons.length ? booking.addons.map((addon) => (
                <p key={addon.id}>✓ {addon.name} <span>{addon.description}</span></p>
              )) : <p>✓ Venue Coordination <span>Core booking service included</span></p>}
            </div>
            <div className="sync-card">
              <h2>Sync Event</h2>
              <p>Add this reservation to your calendar to stay updated.</p>
              <button type="button">Add to Google Calendar</button>
              <button type="button">Add to Outlook</button>
            </div>
          </aside>
        </div>

        <div className="reservation-actions">
          <span>{message || 'Need to make changes to your reservation?'}</span>
          <Link to={`/venues/${venueId}/book`}>Reschedule Event</Link>
          <button type="button" onClick={handleCancel} disabled={!booking || booking.status === 'cancelled'}>Cancel Booking</button>
        </div>
      </section>
    </main>
  );
}
