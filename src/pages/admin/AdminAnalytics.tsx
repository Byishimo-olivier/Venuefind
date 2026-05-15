import { AdminMetric, AdminShell, MiniBars } from './AdminShell';

export default function AdminAnalytics() {
  return (
    <AdminShell mode="concierge">
      <section className="admin-content analytics-command">
        <div className="admin-heading wide"><div><h1>Performance Analytics</h1><p>Detailed ecosystem health and venue trends for Rwanda.</p></div><button>October 2026</button></div>
        <div className="analytics-command-grid">
          <AdminMetric title="Total Revenue (RWF)" value="48,250,000" tone="gold" note="+72.4k" />
          <AdminMetric title="Collaboration Earned" value="7,237,500" tone="dark" />
          <AdminMetric title="Active Users" value="12,840" note="+5%" />
          <section className="market-bars"><h2>Market Trends & Seasonality</h2><MiniBars dark /></section>
          <aside className="revenue-efficiency"><h2>Revenue Efficiency</h2><p>Kigali Central <b>82%</b></p><i><b style={{ width: '82%' }} /></i><p>Musanze Tourism <b>64%</b></p><i><b style={{ width: '64%' }} /></i><p>Other Districts <b>31%</b></p><i><b style={{ width: '31%' }} /></i></aside>
          <article className="category-card"><h2>Wedding Venues</h2><p>Dominating 62% of all platform bookings.</p></article>
          <article className="category-card image"><img src="https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg?auto=compress&cs=tinysrgb&w=700" alt="" /></article>
          <article className="category-card"><h2>Corporate Spaces</h2><p>Increasing demand for hybrid tech events.</p></article>
        </div>
      </section>
    </AdminShell>
  );
}
