import { OwnerShell } from './OwnerShell';

const ledger = [
  ['Aurora Gala Night', 'Deposit (50%)', 'Rwf12,500.00', 'Settled'],
  ['Tech Summit 2023', 'Final Balance', 'Rwf45,000.00', 'Pending'],
  ['Boutique Wedding', 'Refunded', '-Rwf2,400.00', 'Adjusted'],
];

export default function OwnerPayouts() {
  return (
    <OwnerShell section="Payouts">
      <section className="owner-content">
        <div className="payout-top">
          <article className="balance-card">
            <span>Available Balance</span>
            <h1>Rwf142,850.24</h1>
            <p>↗ +12.5% from last period</p>
            <div><span>Next Payout<br /><strong>October 24, 2026</strong></span><span>Status<br /><strong>● Processing</strong></span></div>
            <button>Request Instant Payout</button>
          </article>
          <article className="split-card">
            <h2>Split Tracking</h2>
            <label>Deposits Held <b>42,500</b><i><span style={{ width: '76%' }} /></i></label>
            <label>Final Payments <b>100,550</b><i><span style={{ width: '94%' }} /></i></label>
            <p>Deposits are released 48h after booking. Final balances released post-event.</p>
          </article>
        </div>

        <section className="transaction-table-card payout-ledger">
          <div className="table-toolbar"><h2>Transaction Ledger</h2><div><button>Filter By Date</button><button>Export CSV</button></div></div>
          <table>
            <thead><tr><th>Client / Event</th><th>Transaction ID</th><th>Type</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {ledger.map(([event, type, amount, status], index) => (
                <tr key={event}>
                  <td><strong>{event}</strong><span>Client: Sterling Media</span></td>
                  <td>#TXN-882{index}-AV</td>
                  <td>{type}</td>
                  <td>{amount}</td>
                  <td><em className={status.toLowerCase()}>{status}</em></td>
                  <td>⋮</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="load-history">Load Full Transaction History →</button>
        </section>

        <section className="dispute-card">
          <div><strong>Financial Dispute Center</strong><p>Manage chargebacks, partial refunds, or security deposit claims directly with our reconciliation team.</p></div>
          <div><button>Issue Refund</button><button>Open Support Case</button></div>
        </section>
      </section>
    </OwnerShell>
  );
}
