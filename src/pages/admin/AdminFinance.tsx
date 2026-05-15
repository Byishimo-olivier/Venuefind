import { AdminMetric, AdminShell } from './AdminShell';

const tx = [
  ['#TXN-8842-RW', 'Kigali Heights Ballroom', '2,500,000 RWF', '250,000 RWF', 'Settled'],
  ['#TXN-8643-RW', 'Elite Sound Systems', '850,000 RWF', '85,000 RWF', 'Processed'],
  ['#TXN-8644-RW', 'Mille Collines Catering', '4,200,000 RWF', '420,000 RWF', 'Scheduled'],
  ['#TXN-8831-RW', 'Rwanda Events Logistics', '1,200,000 RWF', '120,000 RWF', 'Settled'],
];

export default function AdminFinance() {
  return (
    <AdminShell>
      <section className="admin-content">
        <div className="admin-heading wide"><div><h1>Financial Oversight</h1><p>Comprehensive ledger of all platform transactions across Rwanda. Manage provider payouts and institutional growth with precision.</p></div><aside><span>Regional Currency</span><strong>RWF 42,980,000</strong></aside></div>
        <div className="finance-metrics">
          <AdminMetric title="Total Transaction Volume" value="128,400,000 RWF" note="+12.8%" />
          <AdminMetric title="Platform Commission" value="12,845,000" tone="dark" />
          <AdminMetric title="Pending Payouts" value="3,420,000" tone="gold" />
        </div>
        <section className="admin-table-card">
          <div className="table-toolbar"><span>Filter Ledger</span><button>Date: Last 30 Days</button><button>Provider Type: All</button><button>Status: All Transactions</button><button className="dark">Export CSV</button></div>
          <table><thead><tr><th>Transaction ID</th><th>Provider</th><th>Gross Amount</th><th>Commission</th><th>Payout Status</th><th>Date</th></tr></thead><tbody>{tx.map(([id, provider, gross, commission, status]) => <tr key={id}><td>{id}</td><td><strong>{provider}</strong><span>Venue Provider</span></td><td>{gross}</td><td>{commission}</td><td><em className={status.toLowerCase()}>{status}</em></td><td>Oct 24, 2026</td></tr>)}</tbody></table>
        </section>
        <div className="finance-ops-grid">
          <article className="regional-map"><h2>Regional Distribution</h2><p>Active transaction hubs across Rwanda's major provinces.</p><div><span>Kigali 82% Volume</span><span>Western 12% Volume</span></div></article>
          <aside className="payout-card"><h2>Upcoming Payouts</h2><p>Legacy Event Center <strong>1,400,000</strong></p><p>Pure Decor & Flowers <strong>650,000</strong></p><p>VIP Protection Serv. <strong>900,000</strong></p><button>Process All Now</button></aside>
          <aside className="security-protocol"><h2>Security Protocol</h2><p>Two-factor authorization is required for all payouts exceeding 5,000,000 RWF.</p></aside>
        </div>
      </section>
    </AdminShell>
  );
}
