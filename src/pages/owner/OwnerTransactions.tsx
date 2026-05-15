import { OwnerShell, MetricCard } from './OwnerShell';

const rows = [
  ['#INV-88210', 'Katherine & Michael', 'Oct 28, 2026', '$14,500.00', 'Completed'],
  ['#INV-88209', 'TechGlobal Inc.', 'Oct 26, 2026', '$3,200.00', 'Pending'],
  ['#INV-88194', 'David Jenkins', 'Oct 24, 2026', '($450.00)', 'Refunded'],
  ['#INV-88188', 'Starlight Foundation', 'Oct 22, 2026', '$28,900.00', 'Completed'],
];

export default function OwnerTransactions() {
  return (
    <OwnerShell section="Transaction Log">
      <section className="owner-content">
        <div className="owner-heading"><div><h1>Financial History</h1><p>Review your venue's fiscal health and manage transactional documents.</p></div></div>
        <div className="owner-metrics-grid finance">
          <MetricCard label="Total Fiscal Volume" value="Rwf412,850" accent="gold" delta="+12%" />
          <MetricCard label="Pending Invoices" value="Rwf18,420" delta="6 Active" />
          <article className="settlement-card"><span>Last Settlement</span><strong>Rwf12,900</strong><button>Settled Today 14:00</button></article>
          <article className="create-invoice">⊕<strong>Create New Invoice</strong><span>Manual transaction entry</span></article>
        </div>
        <section className="transaction-table-card">
          <div className="table-toolbar"><div><button className="active">All</button><button>Completed</button><button>Pending</button><button>Refunded</button></div><button>↧ Export CSV</button></div>
          <table>
            <thead><tr><th>Invoice ID</th><th>Client Name</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map(([id, client, date, amount, status]) => (
                <tr key={id}>
                  <td><strong>{id}</strong><span>Event Package</span></td>
                  <td>{client}</td>
                  <td>{date}</td>
                  <td>{amount}</td>
                  <td><em className={status.toLowerCase()}>{status}</em></td>
                  <td>⋯</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className="finance-bottom">
          <article className="tax-card"><h2>Automate your quarterly tax reconciliation</h2><p>Connect your account directly to QuickBooks or Xero to sync every invoice and expense automatically.</p><button>Enable Integration</button></article>
          <article className="support-card"><strong>Secure Document Vault</strong><p>All financial documents are encrypted and backed up daily.</p></article>
        </div>
      </section>
    </OwnerShell>
  );
}
