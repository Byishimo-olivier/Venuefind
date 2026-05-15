import { Link } from 'react-router-dom';
import { AdminMetric, AdminShell, MiniBars } from './AdminShell';

export default function AdminDashboard() {
  return (
    <AdminShell>
      <section className="admin-content compact">
        <div className="admin-heading">
          <h1>Command Center</h1>
          <p>Global operations and revenue metrics for Smart Event Platform.</p>
        </div>
        <div className="command-grid">
          <AdminMetric title="Total Platform Revenue" value="$3,482,900" tone="dark" note="+12.4% vs last month" />
          <AdminMetric title="Active Providers" value="1,248" note="+82" />
          <AdminMetric title="Commission Earned" value="$522k" note="+8%" />
          <article className="admin-growth"><span>User Growth</span><strong>14.2k</strong><p>New signups this week: 842</p><MiniBars /></article>
          <article className="elite-card"><h2>Elite Provider Program</h2><p>9 new venues eligible for verification in Rwanda.</p><Link to="/admin/providers">Review Queue</Link></article>
        </div>
        <div className="admin-dashboard-lower">
          <section className="admin-chart-card">
            <div className="card-title-row"><div><h2>Demand Forecasting</h2><p>Platform-wide projected booking volume for Q4</p></div><div><button>Weekly</button><button className="active">Monthly</button></div></div>
            <MiniBars dark />
            <p className="insight-note">Insight: Booking demand in Rwanda is projected to peak in late December due to holiday galas and corporate end-of-year events.</p>
          </section>
          <aside className="admin-topvenues">
            <h2>Top Venues <Link to="/venues/search">View All</Link></h2>
            {['The Kigali Heights Pavilion', 'Serenity Hills Estate', 'The Industrial Hub', 'Grand Heritage Ballroom'].map((venue) => (
              <article key={venue}><span /><div><strong>{venue}</strong><small>Kigali, Rwanda</small><em>+$18,000 Revenue</em></div></article>
            ))}
          </aside>
        </div>
        <footer className="admin-actionbar"><span>Data last synced: Today at 2:45PM GMT+2</span><div><Link to="/admin/reports">Export Global Report</Link><Link to="/admin/finance" className="gold">Audit Financials</Link></div></footer>
      </section>
    </AdminShell>
  );
}
