import { OwnerShell } from './OwnerShell';
import { formatRwf, labelStatus, statusClass, useOwnerData, useOwnerSummary } from './ownerData';

export default function OwnerPayouts() {
  const { venues, bookings, isLoading, error } = useOwnerData();
  const summary = useOwnerSummary(venues, bookings);
  const heldDeposits = bookings.reduce((total, booking) => total + Number(booking.totals?.depositDue || 0), 0);
  const finalPayments = Math.max(summary.totalRevenue - heldDeposits, 0);
  const depositShare = summary.totalRevenue ? Math.round((heldDeposits / summary.totalRevenue) * 100) : 0;
  const finalShare = summary.totalRevenue ? Math.round((finalPayments / summary.totalRevenue) * 100) : 0;

  return (
    <OwnerShell section="Payouts">
      <section className="owner-content">
        {isLoading && <p>Loading payouts...</p>}
        {error && <p className="field-error centered">{error}</p>}
        <div className="payout-top">
          <article className="balance-card">
            <span>Available Balance</span>
            <h1>{formatRwf(summary.paidRevenue)}</h1>
            <p>{formatRwf(summary.pendingRevenue)} pending from active bookings</p>
            <div><span>Next Payout<br /><strong>After event completion</strong></span><span>Status<br /><strong>Processing</strong></span></div>
            <button>Request Instant Payout</button>
          </article>
          <article className="split-card">
            <h2>Split Tracking</h2>
            <label>Deposits Held <b>{formatRwf(heldDeposits)}</b><i><span style={{ width: `${depositShare}%` }} /></i></label>
            <label>Final Payments <b>{formatRwf(finalPayments)}</b><i><span style={{ width: `${finalShare}%` }} /></i></label>
            <p>Deposits are released 48h after booking. Final balances released post-event.</p>
          </article>
        </div>

        <section className="transaction-table-card payout-ledger">
          <div className="table-toolbar"><h2>Transaction Ledger</h2><div><button>Filter By Date</button><button>Export CSV</button></div></div>
          <table>
            <thead><tr><th>Client / Event</th><th>Transaction ID</th><th>Type</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td><strong>{booking.venueName}</strong><span>Client: {booking.customerName || booking.customerEmail || 'Customer'}</span></td>
                  <td>{booking.confirmationNumber || booking.id}</td>
                  <td>{booking.paymentStatus === 'paid' ? 'Final Balance' : 'Deposit'}</td>
                  <td>{formatRwf(booking.amountPaid || booking.totals?.depositDue || 0)}</td>
                  <td><em className={statusClass(booking.paymentStatus)}>{labelStatus(booking.paymentStatus)}</em></td>
                  <td>View</td>
                </tr>
              ))}
              {!isLoading && bookings.length === 0 && (
                <tr><td colSpan={6}>No payouts are available yet.</td></tr>
              )}
            </tbody>
          </table>
          <button className="load-history">Load Full Transaction History</button>
        </section>

        <section className="dispute-card">
          <div><strong>Financial Dispute Center</strong><p>Manage chargebacks, partial refunds, or security deposit claims directly with our reconciliation team.</p></div>
          <div><button>Issue Refund</button><button>Open Support Case</button></div>
        </section>
      </section>
    </OwnerShell>
  );
}
