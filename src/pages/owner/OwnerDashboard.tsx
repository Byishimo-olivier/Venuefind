import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../components/ui/chart';
import { OwnerShell, MetricCard } from './OwnerShell';
import { bookingExportRows, exportCsv, filterBookings, filterVenues, formatRwf, useOwnerData, useOwnerSearch, useOwnerSummary, venueExportRows } from './ownerData';

type MonthlyBookingData = {
  month: string;
  bookings: number;
  revenue: number;
};

const demandChartConfig = {
  bookings: {
    label: 'Bookings',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export default function OwnerDashboard() {
  const { venues, bookings, isLoading, error } = useOwnerData();
  const { query, setQuery } = useOwnerSearch();
  const filteredVenues = filterVenues(venues, query);
  const filteredBookings = filterBookings(bookings, query);
  const summary = useOwnerSummary(filteredVenues, filteredBookings);
  const monthlyBookingData = buildMonthlyBookingData(filteredBookings);

  return (
    <OwnerShell>
      <section className="owner-content">
        <div className="owner-heading">
          <div><p>Financial Intelligence</p><h1>Executive Dashboard</h1></div>
          <div>
            <button type="button" onClick={() => setQuery('')}>Clear Search</button>
            <button className="gold" type="button" onClick={() => exportCsv('owner-dashboard-summary', [
              { metric: 'Total Revenue', value: summary.totalRevenue },
              { metric: 'Total Bookings', value: summary.totalBookings },
              { metric: 'Confirmed Guests', value: summary.guestCount },
              { metric: 'Average Ticket', value: summary.averageTicket },
            ])}>Export Summary</button>
          </div>
        </div>

        {isLoading && <p>Loading owner dashboard...</p>}
        {error && <p className="field-error centered">{error}</p>}

        <div className="owner-metrics-grid">
          <MetricCard label="Total Revenue" value={formatRwf(summary.totalRevenue)} delta={`${summary.totalBookings} bookings`} />
          <MetricCard label="Confirmed Guests" value={String(summary.guestCount)} accent="gold" delta={`${summary.upcomingBookings} upcoming`} />
          <MetricCard label="Booking Conversion" value={`${summary.conversionRate}%`} delta={`${summary.confirmedBookings} confirmed`} />
          <MetricCard label="Average Ticket" value={formatRwf(summary.averageTicket)} accent="gold" delta={`${filteredVenues.length} venues`} />
        </div>

        <div className="forecast-grid">
          <section className="forecast-card owner-chart-card">
            <div className="card-title"><h2>Venue Demand Forecasting</h2><p>Booking volume and revenue by month from live reservations.</p></div>
            <div className="owner-chart-wrap">
              <DemandChart data={monthlyBookingData} />
            </div>
          </section>
          <aside className="top-venues-card">
            <h2>Top Venues</h2>
            {summary.topVenues.slice(0, 4).map(({ venue, revenue, bookings: bookingCount }) => (
              <article key={venue.id}>
                <img src={venue.heroImage || 'https://images.pexels.com/photos/265947/pexels-photo-265947.jpeg?auto=compress&cs=tinysrgb&w=120'} alt="" />
                <div><strong>{venue.name}</strong><span>{venue.category || 'Venue'}</span></div>
                <b>{formatRwf(revenue)}<small>{bookingCount} bookings</small></b>
              </article>
            ))}
            {!isLoading && summary.topVenues.length === 0 && <p>No venue performance yet.</p>}
            <Link to="/owner/portfolio">View All Listings</Link>
          </aside>
        </div>

        <section className="insight-card">
          <div>
            <h2>Custom Intelligence Builder</h2>
            <p>Aggregate booking, venue, and revenue data for stakeholder reports.</p>
            <div className="insight-controls">
              <select><option>Revenue by Category</option></select>
              <select><option>Rolling 12 Months</option></select>
              <button type="button" onClick={() => exportCsv('owner-bookings', bookingExportRows(filteredBookings))}>Export Bookings</button>
              <button className="ghost" type="button" onClick={() => exportCsv('owner-venues', venueExportRows(filteredVenues))}>Export Venues</button>
            </div>
          </div>
          <aside>
            <h3>Suggested Reports</h3>
            <p>{summary.pendingBookings} bookings awaiting deposit</p>
            <p>{summary.pendingVenues} listings in review</p>
            <p>{formatRwf(summary.pendingRevenue)} outstanding balance</p>
          </aside>
        </section>
      </section>
    </OwnerShell>
  );
}

function buildMonthlyBookingData(bookings: ReturnType<typeof filterBookings>): MonthlyBookingData[] {
  const validDates = bookings
    .map((booking) => new Date(`${booking.date}T00:00:00`))
    .filter((date) => !Number.isNaN(date.getTime()));
  const endDate = validDates.length
    ? new Date(Math.max(...validDates.map((date) => date.getTime())))
    : new Date();
  const monthStarts = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(endDate.getFullYear(), endDate.getMonth() - (5 - index), 1);
    return date;
  });

  return monthStarts.map((date) => {
    const monthBookings = bookings.filter((booking) => {
      const bookingDate = new Date(`${booking.date}T00:00:00`);
      return bookingDate.getFullYear() === date.getFullYear() && bookingDate.getMonth() === date.getMonth();
    });

    return {
      month: date.toLocaleString('en-US', { month: 'short' }),
      bookings: monthBookings.length,
      revenue: monthBookings.reduce((total, booking) => total + Number(booking.totals?.total || 0), 0),
    };
  });
}

function DemandChart({ data }: { data: MonthlyBookingData[] }) {
  return (
    <ChartContainer config={demandChartConfig} className="owner-recharts">
      <BarChart accessibilityLayer data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#eef1f5" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12, fill: '#5b6b80' }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#5b6b80' }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="bookings" fill="var(--color-bookings)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
