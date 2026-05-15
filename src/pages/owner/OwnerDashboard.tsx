import { Link } from 'react-router-dom';
import { OwnerShell, MetricCard } from './OwnerShell';

const topVenues = [
  ['The Crystal Plaza', '$420k', 'Top Performer'],
  ['Loft 42 Studios', '$385k', '88% Occupancy'],
  ['Emerald Gardens', '$312k', '+18K MoM'],
  ['Skyview Executive', '$290k', 'Stable'],
];

export default function OwnerDashboard() {
  return (
    <OwnerShell>
      <section className="owner-content">
        <div className="owner-heading">
          <div><p>Financial Intelligence</p><h1>Executive Dashboard</h1></div>
          <div><button>▣ Last 30 Days</button><button className="gold">↧ Export PDF</button></div>
        </div>

        <div className="owner-metrics-grid">
          <MetricCard label="Total Revenue" value="Rwf4,829,000" delta="+12.5%" />
          <MetricCard label="User Acquisition" value="12,482" accent="gold" delta="+8.2%" />
          <MetricCard label="Booking Conversion" value="64.2%" delta="-2.1%" />
          <MetricCard label="Average Ticket" value="Rwf18,420" accent="gold" delta="+15.4%" />
        </div>

        <div className="forecast-grid">
          <section className="forecast-card">
            <div className="card-title"><h2>Venue Demand Forecasting</h2><p>Predictive occupancy rates for the next quarter</p></div>
            <div className="chart-bars">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                <div key={month}>
                  <span style={{ height: `${70 + index * 16}px` }} />
                  <b style={{ height: `${95 + index * 20}px` }} />
                  <em>{month}</em>
                </div>
              ))}
            </div>
          </section>
          <aside className="top-venues-card">
            <h2>Top Venues</h2>
            {topVenues.map(([name, revenue, note]) => (
              <article key={name}>
                <img src="https://images.pexels.com/photos/265947/pexels-photo-265947.jpeg?auto=compress&cs=tinysrgb&w=120" alt="" />
                <div><strong>{name}</strong><span>Luxury Events</span></div>
                <b>{revenue}<small>{note}</small></b>
              </article>
            ))}
            <Link to="/owner/portfolio">View All Providers</Link>
          </aside>
        </div>

        <section className="insight-card">
          <div>
            <h2>Custom Intelligence Builder</h2>
            <p>Aggregate multi-dimensional data points for bespoke stakeholder reports.</p>
            <div className="insight-controls">
              <select><option>Revenue by Category</option></select>
              <select><option>Rolling 12 Months</option></select>
              <button>Build Insight</button>
              <button className="ghost">Clear Filters</button>
            </div>
          </div>
          <aside>
            <h3>AI Suggested Reports</h3>
            <p>Seasonal Peak Performance</p>
            <p>Commission Yield Analysis</p>
            <p>Luxury Market Growth 2Y</p>
          </aside>
        </section>
      </section>
    </OwnerShell>
  );
}
