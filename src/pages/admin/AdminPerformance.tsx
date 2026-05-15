import { AdminShell } from './AdminShell';

export default function AdminPerformance() {
  return (
    <AdminShell mode="concierge">
      <section className="admin-content">
        <div className="admin-heading"><h1>Provider Performance <span>Benchmarking</span></h1><p>Analyze and compare service excellence across the Rwandan luxury landscape.</p></div>
        <div className="benchmark-top"><article><h2>Regional Insights</h2><div><strong>4.8</strong><strong>12m</strong><strong>+24%</strong><strong>98%</strong></div><button>View Province Map →</button></article><aside><h2>Efficiency Leader</h2><p>Mantis Kivu Queen</p><strong>99.2%</strong><i><b /></i><button>Benchmarking Deep-Dive</button></aside></div>
        <section className="benchmark-list"><div className="section-title-row"><h2>Top Performing Providers</h2><div><button>All Sectors</button><button className="active">Hospitality</button><button>Transport</button></div></div>{['Singita Kwitonda Lodge', 'Kigali Aero Services'].map((name) => <article key={name}><span className="thumb" /><div><strong>{name}</strong><small>Musanze, Northern Province · Luxury Hospitality</small></div><p>Response Time<br /><b>04:20h</b></p><p>Bookings 2026<br /><b>1,248</b></p><p>Growth YoY<br /><b>+18.5%</b></p><button>Benchmark</button></article>)}</section>
        <div className="benchmark-bottom"><article><h2>Reliability Trends</h2><p>System-wide reliability has increased by 8.4% since certification rollout.</p><i><b style={{ width: '78%' }} /></i><i><b style={{ width: '86%' }} /></i></article><article><h2>Quality Thresholds</h2><p>Elite providers must maintain a 5 min response time.</p><p>Booking fulfillment rate must exceed 98% monthly.</p></article></div>
      </section>
    </AdminShell>
  );
}
