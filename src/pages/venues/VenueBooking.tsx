import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import type { Venue } from '../../data/venues';
import { getAuthToken } from '../../services/api';
import { createBooking, getBookingAvailability, listBookingAddons } from '../../services/bookings';
import type { BookingAddon } from '../../services/bookings';
import { getVenue as getVenueFromApi } from '../../services/venues';
import './venues.css';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
function formatRwf(value: number) {
  return `RWF ${Math.round(value).toLocaleString('en-US')}`;
}

function parseMoney(value: string) {
  const amount = Number(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

function parseDuration(value: string) {
  return Number(value.replace(/[^0-9.]/g, '')) || 6;
}

function toDateKey(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function toMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthCells(date: Date) {
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const leadingBlankCount = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return [
    ...Array.from({ length: leadingBlankCount }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

function formatSelectedDate(dateKey: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${dateKey}T00:00:00`));
}

export default function VenueBooking() {
  const { venueId = '' } = useParams();
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [addons, setAddons] = useState<BookingAddon[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(today.getFullYear(), today.getMonth(), today.getDate()));
  const [startTime, setStartTime] = useState('2:00 PM');
  const [duration, setDuration] = useState('6 Hours');
  const [guestCount, setGuestCount] = useState('150');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const visibleMonthKey = toMonthKey(visibleMonth);

  useEffect(() => {
    let isMounted = true;

    getVenueFromApi(venueId)
      .then((apiVenue) => {
        if (isMounted) {
          setVenue(apiVenue);
          const venueAddons = apiVenue.addons || [];
          setAddons(venueAddons);
          setSelectedAddonIds(venueAddons.slice(0, 2).map((addon) => addon.id));
        }
      })
      .catch(() => {
        if (isMounted) setVenue(null);
      });

    listBookingAddons(venueId)
      .then((apiAddons) => {
        if (isMounted) {
          setAddons(apiAddons);
          setSelectedAddonIds(apiAddons.slice(0, 2).map((addon) => addon.id));
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [venueId]);

  useEffect(() => {
    let isMounted = true;

    getBookingAvailability(venueId, visibleMonthKey)
      .then((availability) => {
        if (isMounted) setBookedDates([...new Set(availability.blocked.map((item) => item.date))]);
      })
      .catch(() => {
        if (isMounted) setBookedDates([]);
      });

    return () => {
      isMounted = false;
    };
  }, [venueId, visibleMonthKey]);

  const selectedAddons = useMemo(
    () => addons.filter((addon) => selectedAddonIds.includes(addon.id)),
    [addons, selectedAddonIds],
  );
  const calendarCells = useMemo(() => getMonthCells(visibleMonth), [visibleMonth]);
  const baseVenueFee = parseMoney(venue?.price || '');
  const cleaningFee = parseMoney(venue?.cleaningFee || '');
  const decorFee = parseMoney(venue?.decorFee || '');
  const addonsTotal = selectedAddons.reduce((total, addon) => total + addon.amount, 0);
  const subtotal = baseVenueFee + cleaningFee + decorFee + addonsTotal;
  const vat = Math.round(subtotal * 0.18);
  const total = subtotal + vat;
  const deposit = Math.round(total * 0.3);

  const handleAddonToggle = (id: string) => {
    setSelectedAddonIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const setCalendarMonth = (year: number, monthIndex: number) => {
    const safeYear = Number.isFinite(year) ? Math.max(2026, Math.min(2100, year)) : visibleMonth.getFullYear();
    setVisibleMonth(new Date(safeYear, monthIndex, 1));
  };

  const moveMonth = (direction: -1 | 1) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  const handleSubmit = async () => {
    setError('');

    if (!getAuthToken()) {
      navigate(`/login?redirect=/venues/${venueId}/book`);
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await createBooking({
        venueId,
        date: selectedDate,
        startTime,
        durationHours: parseDuration(duration),
        guestCount: Number(guestCount.replace(/[^0-9]/g, '')) || 1,
        addons: selectedAddonIds,
      });

      navigate(`/venues/${venueId}/checkout?bookingId=${encodeURIComponent(booking.id)}`);
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : 'Could not create booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="booking-page">
      <BookingHeader venueId={venueId} />
      {!venue ? (
        <section className="booking-wrap">
          <p className="empty-venues">Venue not found in the backend database.</p>
          <Link to="/venues/search">Browse available venues</Link>
        </section>
      ) : (
      <section className="booking-wrap">
        <div className="booking-title">
          <h1>Reserve Your Experience</h1>
          <p>Configure your event at {venue.name}. Select your preferred date, time, and bespoke additions to elevate your gathering.</p>
        </div>

        <div className="booking-grid">
          <aside className="availability-card">
            <h2>Availability</h2>
            <div className="calendar-head">
              <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month">&lt;</button>
              <div className="calendar-current">
                <select
                  aria-label="Select month"
                  value={visibleMonth.getMonth()}
                  onChange={(event) => setCalendarMonth(visibleMonth.getFullYear(), Number(event.target.value))}
                >
                  {monthNames.map((name, index) => <option value={index} key={name}>{name}</option>)}
                </select>
                <input
                  aria-label="Select year"
                  min="2026"
                  max="2100"
                  type="number"
                  value={visibleMonth.getFullYear()}
                  onChange={(event) => setCalendarMonth(Number(event.target.value), visibleMonth.getMonth())}
                />
              </div>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Next month">&gt;</button>
            </div>
            <div className="weekdays">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}</div>
            <div className="calendar-grid">
              {calendarCells.map((day, index) => {
                if (!day) return <span className="calendar-empty" key={`empty-${index}`} />;

                const date = toDateKey(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
                const isBooked = bookedDates.includes(date);
                return (
                  <button
                    type="button"
                    key={date}
                    disabled={isBooked}
                    className={date === selectedDate ? 'selected' : isBooked ? 'booked' : [8, 12, 18, 24, 26].includes(day) ? 'prime' : ''}
                    onClick={() => setSelectedDate(date)}
                  >
                    {day}
                  </button>
                );
              })}
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
                <label>Start Time
                  <select value={startTime} onChange={(event) => setStartTime(event.target.value)}>
                    <option>2:00 PM</option>
                    <option>4:00 PM</option>
                    <option>6:00 PM</option>
                  </select>
                </label>
                <label>Duration
                  <select value={duration} onChange={(event) => setDuration(event.target.value)}>
                    <option>6 Hours</option>
                    <option>8 Hours</option>
                    <option>10 Hours</option>
                  </select>
                </label>
              </div>
              <label>Guest Count (Est.)<input value={guestCount} onChange={(event) => setGuestCount(event.target.value)} /></label>
            </div>
            <div className="addons-card">
              <h2>Bespoke Add-ons</h2>
              <p>Enhance your event with our curated services.</p>
              {addons.map((addon) => (
                <label className="addon-row" key={addon.id}>
                  <input type="checkbox" checked={selectedAddonIds.includes(addon.id)} onChange={() => handleAddonToggle(addon.id)} />
                  <span><strong>{addon.name}</strong><em>{addon.description}</em></span>
                  <b>{formatRwf(addon.amount)}</b>
                </label>
              ))}
            </div>
          </section>

          <aside className="summary-card">
            <h2>Booking Summary</h2>
            <p>Event Date <strong>{formatSelectedDate(selectedDate)}</strong></p>
            <p>Base Venue Fee <strong>{formatRwf(baseVenueFee)}</strong></p>
            <p>Cleaning Fee <strong>{formatRwf(cleaningFee)}</strong></p>
            <p>Decor Package <strong>{formatRwf(decorFee)}</strong></p>
            {selectedAddons.map((addon) => (
              <p key={addon.id}>{addon.name} <strong>{formatRwf(addon.amount)}</strong></p>
            ))}
            <hr />
            <p>Subtotal <strong>{formatRwf(subtotal)}</strong></p>
            <p>VAT (18%) <strong>{formatRwf(vat)}</strong></p>
            <div className="total-line">
              <span>Total Cost</span>
              <strong>{formatRwf(total)}</strong>
            </div>
            <small>Required Deposit: 30%, {formatRwf(deposit)}</small>
            <button type="button" className="summary-action" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Creating Booking...' : 'Continue to Payment'} <span>-&gt;</span>
            </button>
            {error && <em>{error}</em>}
            <em>You won't be charged until the final step.</em>
          </aside>
        </div>
      </section>
      )}
    </main>
  );
}

export function BookingHeader({ venueId = '' }: { venueId?: string }) {
  return (
    <header className="booking-header">
      <Link to="/venues" className="booking-logo">The Venue Collective</Link>
      <nav>
        <Link to="/venues">Venues</Link>
        <Link to={`/venues/${venueId}`}>Experiences</Link>
        <Link to={`/venues/${venueId}/reviews`}>Concierge</Link>
        <Link to={`/venues/${venueId}/book`} className="active">My Bookings</Link>
      </nav>
      <div>
        <span>Search</span>
        <Link to="/login">Sign In</Link>
      </div>
    </header>
  );
}
