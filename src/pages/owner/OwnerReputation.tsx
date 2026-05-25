import { Link } from 'react-router-dom';
import { ProviderShell } from './ProviderShell';

export default function OwnerReputation() {
  return (
    <ProviderShell compact>
      <section className="reputation-wrap">
        <h1>Reputation Management</h1>
        <p>Monitor your standing and engage with clients.</p>
        <div className="reputation-top">
          <article className="standing-card"><span>Venue Global Standing</span><strong>4.9 <em>/5.0</em></strong><p>Lifetime Reviews 1,248 · Response Rate 98% · Avg Response Time 4 hrs</p><b>Top 7% Regionally</b></article>
          <aside className="accolades-card"><h2>Earned Accolades</h2><p>Platinum Host 2026<span>Verified reviews</span></p><p>Couples Choice<span>3 consecutive years</span></p><Link to="/venues/search">View All Accolades</Link></aside>
        </div>
        <section className="needs-attention">
          <div className="section-title-row"><div><h2>Needs Attention</h2><p>Recent feedback pending your response.</p></div><button>Filter</button></div>
          <div className="attention-grid">
            <article className="attention-card urgent"><header><b>Sarah Jenkins</b><span>★★★★☆</span></header><h3>Beautiful venue, slight delay in service</h3><p>The Grand Ballroom was absolutely stunning for our annual company gala. However, we did experience a slight delay during cocktail service.</p><textarea placeholder="Write your response here..." /><footer><small>AI Assist Available</small><button>Publish Reply</button></footer></article>
            <article className="attention-card"><header><b>Michael T.</b><span>★★★★★</span></header><h3>Flawless execution from start to finish</h3><p>I cannot speak highly enough of the staff at The Grand Ballroom. The attention to detail was incredible, and the food was spectacular.</p><button>Draft Quick Reply</button></article>
          </div>
        </section>
      </section>
    </ProviderShell>
  );
}
