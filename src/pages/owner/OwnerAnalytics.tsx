import { ProviderShell } from './ProviderShell';
import { bookingExportRows, exportCsv, filterBookings, filterVenues, formatRwf, useOwnerData, useOwnerSearch, useOwnerSummary, venueExportRows } from './ownerData';

export default function OwnerAnalytics() {
  const { venues, bookings, isLoading, error } = useOwnerData();
  const { query } = useOwnerSearch();
  const filteredVenues = filterVenues(venues, query);
  const filteredBookings = filterBookings(bookings, query);
  const summary = useOwnerSummary(filteredVenues, filteredBookings);
  const kigaliBookings = filteredBookings.filter((booking) => /kigali/i.test(booking.venueLocation || '')).length;
  const kigaliShare = filteredBookings.length ? Math.round((kigaliBookings / filteredBookings.length) * 100) : 0;
  const provinceShare = filteredBookings.length ? 100 - kigaliShare : 0;

  return (
    <ProviderShell>
      <section className="analytics-wrap">
        <div className="analytics-heading">
          <div><h1>Market Performance</h1><p>Comprehensive insights into venue demand across Rwanda.</p></div>
          <div>
            <button type="button" onClick={() => exportCsv('owner-analytics-bookings', bookingExportRows(filteredBookings))}>Export Bookings</button>
            <button type="button" onClick={() => exportCsv('owner-analytics-venues', venueExportRows(filteredVenues))}>Export Venues</button>
          </div>
        </div>
        {isLoading && <p>Loading analytics...</p>}
        {error && <p className="field-error centered">{error}</p>}
        <div className="analytics-grid">
          <article className="analytics-card"><span>Total Revenue</span><strong>{formatRwf(summary.totalRevenue)}</strong><p>{summary.totalBookings} total bookings</p></article>
          <article className="analytics-card"><span>Average Occupancy</span><strong>{summary.occupancy}%</strong><i><b style={{ width: `${summary.occupancy}%` }} /></i><p>{summary.guestCount} guests across {summary.capacity || 0} capacity</p></article>
          <article className="regional-card"><h2>Regional Distribution</h2><p>Kigali City <b>{kigaliShare}%</b></p><i><b style={{ width: `${kigaliShare}%` }} /></i><p>Provinces <b>{provinceShare}%</b></p><i><b style={{ width: `${provinceShare}%` }} /></i></article>
          <article className="volume-card"><h2>Booking Volume Trends</h2><div>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, index) => {
            const dayBookings = filteredBookings.filter((booking) => new Date(`${booking.date}T00:00:00`).getDay() === (index + 1) % 7).length;
            return <span key={day} className={index === 4 ? 'hot' : ''} style={{ height: `${Math.max(45, 70 + dayBookings * 22)}px` }}><em>{day}</em></span>;
          })}</div></article>
          <aside className="forecast-side"><h2>Demand Forecast</h2><p>{summary.pendingBookings} bookings still need deposit completion.</p><strong>Projected Revenue {formatRwf(summary.pendingRevenue)}</strong></aside>
        </div>
      </section>
    </ProviderShell>
  );
}
