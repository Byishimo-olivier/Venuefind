import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cancelBooking, getBooking } from '../../services/bookings';
import type { Booking } from '../../services/bookings';
import { downloadPdfReceipt } from '../../utils/pdfReceipt';
import { PaymentComponent } from '../../components/PaymentComponent';
import './venues.css';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function formatTimeRange(startTime: string, durationHours: number) {
  return `${startTime} - ${durationHours} hours`;
}

function formatRwf(value = 0) {
  return `RWF ${Math.round(value).toLocaleString('en-US')}`;
}

function parseEventDateTime(date: string, time: string, durationHours: number) {
  const match = String(time || '').match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
  let hours = 9;
  let minutes = 0;

  if (match) {
    hours = Number(match[1]);
    minutes = Number(match[2]);
    const period = match[3].toUpperCase();
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
  }

  const start = new Date(`${date}T00:00:00`);
  start.setHours(hours, minutes, 0, 0);
  const end = new Date(start);
  end.setHours(end.getHours() + Number(durationHours || 1));
  return { start, end };
}

function toCalendarDate(value: Date) {
  return value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function getCalendarDetails(booking: Booking) {
  const { start, end } = parseEventDateTime(booking.date, booking.startTime, booking.durationHours);
  const title = `Reservation at ${booking.venueName}`;
  const details = [
    `Confirmation: ${booking.confirmationNumber}`,
    `Guests: ${booking.guestCount}`,
    `Status: ${booking.status.replace(/_/g, ' ')}`,
  ].join('\n');

  return {
    details,
    end,
    location: booking.venueLocation,
    start,
    title,
  };
}

function getGoogleCalendarUrl(booking: Booking) {
  const event = getCalendarDetails(booking);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    dates: `${toCalendarDate(event.start)}/${toCalendarDate(event.end)}`,
    details: event.details,
    location: event.location,
    text: event.title,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getOutlookCalendarUrl(booking: Booking) {
  const event = getCalendarDetails(booking);
  const params = new URLSearchParams({
    body: event.details,
    enddt: event.end.toISOString(),
    location: event.location,
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: event.start.toISOString(),
    subject: event.title,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function downloadIcs(booking: Booking) {
  const event = getCalendarDetails(booking);
  const escapeIcs = (value: string) => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Smart Event Venues//Booking Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@Smart Event Venuevenues`,
    `DTSTAMP:${toCalendarDate(new Date())}`,
    `DTSTART:${toCalendarDate(event.start)}`,
    `DTEND:${toCalendarDate(event.end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `LOCATION:${escapeIcs(event.location)}`,
    `DESCRIPTION:${escapeIcs(event.details)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${booking.confirmationNumber || 'booking'}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getNavigationUrl(booking: Booking) {
  if (booking.venueLatitude && booking.venueLongitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${booking.venueLatitude},${booking.venueLongitude}`)}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.venueLocation || booking.venueName)}`;
}

function downloadBookingPdf(booking: Booking) {
  downloadPdfReceipt({
    title: 'Booking Receipt',
    subtitle: `Confirmation #${booking.confirmationNumber}`,
    filename: `${booking.confirmationNumber || 'booking-receipt'}.pdf`,
    lines: [
      { label: 'Customer', value: booking.customerName || '-' },
      { label: 'Venue', value: booking.venueName },
      { label: 'Location', value: booking.venueLocation },
      { label: 'Coordinates', value: booking.venueLatitude && booking.venueLongitude ? `${booking.venueLatitude}, ${booking.venueLongitude}` : 'Not provided' },
      { label: 'Date', value: formatDate(booking.date) },
      { label: 'Time', value: formatTimeRange(booking.startTime, booking.durationHours) },
      { label: 'Guests', value: `${booking.guestCount}` },
      { label: 'Status', value: booking.status.replace(/_/g, ' ') },
      { label: 'Payment', value: booking.paymentStatus.replace(/_/g, ' ') },
      { label: 'Total', value: formatRwf(booking.totals.total) },
      { label: 'Paid', value: formatRwf(booking.amountPaid || 0) },
      { label: 'Balance', value: formatRwf(booking.balanceRemaining || 0) },
    ],
  });
}

export default function BookingConfirmation() {
  const { venueId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || '';
  const [booking, setBooking] = useState<Booking | null>(null);
  const [message, setMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
              <button type="button" onClick={() => booking && downloadBookingPdf(booking)} disabled={!booking}>Download PDF Receipt</button>
              <a
                className={!booking ? 'disabled' : undefined}
                href={booking ? getNavigationUrl(booking) : undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!booking}
              >
                Navigate on Map
              </a>
              <a
                className={!booking ? 'disabled' : undefined}
                href={booking ? getGoogleCalendarUrl(booking) : undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!booking}
              >
                Add to Google Calendar
              </a>
              <a
                className={!booking ? 'disabled' : undefined}
                href={booking ? getOutlookCalendarUrl(booking) : undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!booking}
              >
                Add to Outlook
              </a>
              <button type="button" onClick={() => booking && downloadIcs(booking)} disabled={!booking}>Download .ics</button>
            </div>
          </aside>
        </div>

        <div className="reservation-actions">
          <span>{message || 'Need to make changes to your reservation?'}</span>
          <Link to={`/venues/${venueId}/book`}>Reschedule Event</Link>
          <button type="button" onClick={handleCancel} disabled={!booking || booking.status === 'cancelled'}>Cancel Booking</button>
        </div>

        {/* Payment Section */}
        {booking && !paymentSuccess && (
          <section className="payment-section" style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Complete Your Booking Payment</h2>
            <p style={{ marginBottom: '1rem', color: '#666' }}>
              Balance Due: <strong>{booking.balanceRemaining ? `RWF ${Math.round(booking.balanceRemaining).toLocaleString('en-US')}` : 'Paid'}</strong>
            </p>

            {booking.balanceRemaining && booking.balanceRemaining > 0 ? (
              <PaymentComponent
                bookingId={booking.id}
                amount={booking.balanceRemaining}
                currency="RWF"
                onSuccess={() => {
                  setPaymentSuccess(true);
                  setMessage('✓ Payment completed successfully!');
                  // Refresh booking data
                  getBooking(bookingId)
                    .then((result) => setBooking(result))
                    .catch(() => {});
                }}
                onError={(error) => {
                  setMessage(`Payment error: ${error}`);
                }}
              />
            ) : (
              <div style={{ padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '4px', color: '#2e7d32' }}>
                <strong>✓ Payment Already Completed</strong>
                <p>This booking has been fully paid.</p>
              </div>
            )}
          </section>
        )}

        {paymentSuccess && (
          <section className="payment-success" style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
            <h2 style={{ color: '#2e7d32', marginBottom: '0.5rem' }}>Payment Complete!</h2>
            <p style={{ color: '#555', marginBottom: '1.5rem' }}>Your booking is fully paid and confirmed.</p>
            <Link to={`/venues/${venueId}/checkout?bookingId=${bookingId}`} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2e7d32', color: 'white', textDecoration: 'none', borderRadius: '4px', display: 'inline-block' }}>
              View Booking Details
            </Link>
          </section>
        )}
      </section>
    </main>
  );
}
