import { AdminShell } from './AdminShell';

export default function AdminDemand() {
  return (
    <AdminShell mode="concierge">
      <section className="admin-content demand-content">
        <div className="admin-heading wide"><div><h1>Market Intelligence & Demand Dynamics</h1><p>Analyzing multidimensional regional signals to provide precision forecasting and strategic pricing interventions.</p></div><aside>Global Sentiment<strong>Bullish +12.4%</strong></aside></div>
        <section className="seasonal-focus"><div><img src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=900" alt="" /><h2>Rainy Season Setups</h2><p>Maximizing revenue through architectural weather-proofing.</p></div><aside><article className="gold">Winter Micro-Events</article><article className="dark">Q1 Gala Prep</article></aside></section>
        <div className="demand-grid"><section className="demand-matrix"><h2>Demand Matrix</h2><div>{['High 8.2x', 'Moderate 4.1x', 'Critical 12.0x', 'Growth 6.8x'].map((x) => <span key={x}>{x}</span>)}</div><p>Corporate Evening Hire <b>Apply Global</b></p><p>Social Gala (Weekend) <b>Apply Global</b></p></section><aside className="funnel-card"><h2>Acquisition Funnel</h2>{['1.2M Views', '245k Interest', '32.8k Inquiries', '8.4k Booked'].map((x) => <p key={x}>{x}<span /></p>)}</aside></div>
        <section className="growth-forecast"><h2>Quarterly Growth Forecasting</h2><div><article>Corporate Engagements <strong>+18.5%</strong><svg viewBox="0 0 300 120"><path d="M10 90 C60 80 65 20 130 55 S220 95 290 20" /></svg></article><article>Social & Private Events <strong>+22.1%</strong><svg viewBox="0 0 300 120"><path d="M10 95 C70 80 100 65 145 70 S210 45 290 12" /></svg></article></div></section>
      </section>
    </AdminShell>
  );
}
