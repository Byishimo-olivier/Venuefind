import { useMemo, useState } from 'react';
import { OwnerShell } from './OwnerShell';
import { bookingExportRows, exportCsv, filterBookings, formatRwf, labelStatus, statusClass, useOwnerData, useOwnerSearch, useOwnerSummary } from './ownerData';
import { apiRequest } from '../../services/api';

export default function OwnerPayouts() {
  const {
    venues,
    bookings,
    subscriptionPlan,
    subscriptionStatus,
    subscriptionTrialEndsAt,
    subscriptionNextBillingAt,
    isLoading,
    error,
  } = useOwnerData();
  const { query } = useOwnerSearch();
  const [planMessage, setPlanMessage] = useState('');
  const [planError, setPlanError] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const filteredBookings = filterBookings(bookings, query);

  const trialDaysLeft = useMemo(() => {
    if (!subscriptionTrialEndsAt) return null;
    const remaining = Math.ceil((new Date(subscriptionTrialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
  }, [subscriptionTrialEndsAt]);
  const summary = useOwnerSummary(venues, filteredBookings);

  const manageSubscription = async () => {
    const plan = window.prompt('Choose subscription plan: premium or elite', subscriptionPlan === 'starter' ? 'premium' : subscriptionPlan);
    if (!plan) return;

    try {
      setPlanError('');
      setCheckoutUrl('');
      const result = await apiRequest<{ payment?: { redirectUrl?: string }; user?: { subscriptionPlan?: string } }>('/api/owner/subscription', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ subscriptionPlan: plan, startTrial: true }),
      });

      if (result.user?.subscriptionPlan) {
        setPlanMessage(`Free trial started for ${result.user.subscriptionPlan.toUpperCase()}. Enjoy 5 days free!`);
        return;
      }

      setPlanMessage('Subscription update requested.');
    } catch (error) {
      setPlanError(error instanceof Error ? error.message : 'Unable to update subscription.');
    }
  };

  const checkoutSubscription = async (plan: string) => {
    try {
      setPlanError('');
      setPlanMessage('');
      const payment = await apiRequest<{ payment: { redirectUrl?: string } }>('/api/owner/subscription', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ subscriptionPlan: plan, paymentMethod: 'card', currency: 'RWF' }),
      });
      if (payment.payment?.redirectUrl) {
        setCheckoutUrl(payment.payment.redirectUrl);
        setPlanMessage(`Subscription checkout created for ${plan.toUpperCase()}. Redirect to complete payment.`);
      } else {
        setPlanMessage(`Subscription checkout created for ${plan.toUpperCase()}.`);
      }
    } catch (error) {
      setPlanError(error instanceof Error ? error.message : 'Unable to start checkout.');
    }
  };

  const cancelSubscription = async () => {
    const confirmed = window.confirm('Cancel your owner subscription? Your account will move back to a cancelled subscription status.');
    if (!confirmed) return;

    try {
      setPlanError('');
      setPlanMessage('');
      await apiRequest<{ user: { subscriptionPlan?: string; subscriptionStatus?: string } }>('/api/owner/subscription', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ action: 'cancel', subscriptionPlan }),
      });
      setPlanMessage('Subscription cancelled. You can restart a paid plan any time from this page.');
    } catch (error) {
      setPlanError(error instanceof Error ? error.message : 'Unable to cancel subscription.');
    }
  };
  const heldDeposits = filteredBookings.reduce((total, booking) => total + Number(booking.totals?.depositDue || 0), 0);
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
          <article className="subscription-card">
            <span>Owner Subscription</span>
            <h2>{subscriptionPlan ? subscriptionPlan.toUpperCase() : 'STARTER'}</h2>
            <p>{subscriptionStatus === 'free_trial' ? 'Free Trial' : subscriptionStatus === 'active' ? 'Active' : subscriptionStatus === 'expired' ? 'Expired' : subscriptionStatus === 'cancelled' ? 'Cancelled' : 'Active'}</p>
            {subscriptionStatus === 'free_trial' && trialDaysLeft !== null && (
              <p className="subscription-trial">
                {trialDaysLeft > 0
                  ? `${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'} of free trial left`
                  : 'Trial expires today. Complete checkout to stay active.'}
              </p>
            )}
            {subscriptionNextBillingAt && subscriptionStatus !== 'free_trial' && (
              <p className="subscription-next-billing">Next billing date: {new Date(subscriptionNextBillingAt).toLocaleDateString()}</p>
            )}
            <div><strong>Platform Fees</strong><small>Review your marketplace plan and payout priority.</small></div>
            <div className="subscription-actions">
              <button type="button" onClick={manageSubscription}>Start 5-Day Free Trial</button>
              <button type="button" onClick={() => checkoutSubscription('premium')}>Upgrade to Premium</button>
              <button type="button" onClick={() => checkoutSubscription('elite')}>Upgrade to Elite</button>
              <button type="button" onClick={cancelSubscription}>Cancel Subscription</button>
            </div>
            {checkoutUrl && (
              <p className="owner-action-message">
                Open this link to complete payment: <a href={checkoutUrl} target="_blank" rel="noreferrer">Continue checkout</a>
              </p>
            )}
            {planMessage && <p className="owner-action-message">{planMessage}</p>}
            {planError && <p className="field-error">{planError}</p>}
          </article>
          <article className="split-card">
            <h2>Split Tracking</h2>
            <label>Deposits Held <b>{formatRwf(heldDeposits)}</b><i><span style={{ width: `${depositShare}%` }} /></i></label>
            <label>Final Payments <b>{formatRwf(finalPayments)}</b><i><span style={{ width: `${finalShare}%` }} /></i></label>
            <p>Deposits are released 48h after booking. Final balances released post-event.</p>
          </article>
        </div>

        <section className="transaction-table-card payout-ledger">
          <div className="table-toolbar"><h2>Transaction Ledger</h2><div><button type="button" onClick={() => exportCsv('owner-payouts', bookingExportRows(filteredBookings))}>Export CSV</button></div></div>
          <table>
            <thead><tr><th>Client / Event</th><th>Transaction ID</th><th>Type</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td><strong>{booking.venueName}</strong><span>Client: {booking.customerName || booking.customerEmail || 'Customer'}</span></td>
                  <td>{booking.confirmationNumber || booking.id}</td>
                  <td>{booking.paymentStatus === 'paid' ? 'Final Balance' : 'Deposit'}</td>
                  <td>{formatRwf(booking.amountPaid || booking.totals?.depositDue || 0)}</td>
                  <td><em className={statusClass(booking.paymentStatus)}>{labelStatus(booking.paymentStatus)}</em></td>
                  <td>View</td>
                </tr>
              ))}
              {!isLoading && filteredBookings.length === 0 && (
                <tr><td colSpan={6}>{bookings.length ? 'No payouts match your current search.' : 'No payouts are available yet.'}</td></tr>
              )}
            </tbody>
          </table>
          <button className="load-history" type="button" onClick={() => exportCsv('owner-payout-history', bookingExportRows(bookings))}>Load Full Transaction History</button>
        </section>

        <section className="dispute-card">
          <div><strong>Financial Dispute Center</strong><p>Manage chargebacks, partial refunds, or security deposit claims directly with our reconciliation team.</p></div>
          <div><button>Issue Refund</button><button>Open Support Case</button></div>
        </section>
      </section>
    </OwnerShell>
  );
}
