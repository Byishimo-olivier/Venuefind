import { ProviderShell } from './ProviderShell';

export default function OwnerAnalytics() {
  return (
    <ProviderShell>
      <section className="analytics-wrap">
        <div className="analytics-heading"><div><h1>Market Performance</h1><p>Comprehensive insights into venue demand across Rwanda.</p></div><div><button>↧ Export Report</button><button>▣ Last 30 Days</button></div></div>
        <div className="analytics-grid">
          <article className="analytics-card"><span>Total Revenue (RWF)</span><strong>12.4M</strong><p>↗ +14.2% vs last month</p></article>
          <article className="analytics-card"><span>Average Occupancy</span><strong>78%</strong><i><b /></i><p>Peak: Saturdays (94%)</p></article>
          <article className="regional-card"><h2>Regional Distribution</h2><p>Kigali City <b>62%</b></p><i><b style={{ width: '62%' }} /></i><p>Provinces <b>38%</b></p><i><b style={{ width: '38%' }} /></i></article>
          <article className="volume-card"><h2>Booking Volume Trends</h2><div>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=><span key={d} className={i===4?'hot':''} style={{ height: `${80 + i * 15}px` }}><em>{d}</em></span>)}</div></article>
          <aside className="forecast-side"><h2>Demand Forecast</h2><p>High demand expected for wedding season in Rubavu district.</p><strong>Projected Growth +22%</strong></aside>
        </div>
      </section>
    </ProviderShell>
  );
}
