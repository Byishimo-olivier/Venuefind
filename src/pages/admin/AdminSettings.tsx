import { useState } from 'react';
import { AdminShell } from './AdminShell';
import { extendOwnerTrial } from '../../services/admin';

export default function AdminSettings() {
  const [ownerId, setOwnerId] = useState('');
  const [extraDays, setExtraDays] = useState('30');
  const [expiresAt, setExpiresAt] = useState('');
  const [trialMessage, setTrialMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExtendTrial = async () => {
    setTrialMessage('');
    setIsSubmitting(true);
    try {
      await extendOwnerTrial(ownerId, {
        extraDays: extraDays ? Number(extraDays) : undefined,
        expiresAt: expiresAt || undefined,
      });
      setTrialMessage('Trial extension applied successfully.');
    } catch (error) {
      setTrialMessage(error instanceof Error ? error.message : 'Unable to apply trial extension.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminShell mode="concierge">
      <section className="admin-content settings-content">
        <h1>Platform Settings</h1>
        <p>Refine the operational architecture of your luxury venue ecosystem.</p>
        <section className="settings-section"><h2>General Configuration</h2><div className="settings-grid"><article><label>Platform Identity<input defaultValue="Concierge Luxury Venues" /></label><div className="two-fields"><label>Base Currency<select defaultValue="RWF"><option>RWF (Frw)</option></select></label><label>Timezone<select defaultValue="GMT+2"><option>GMT+2 (Kigali)</option></select></label></div></article><article className="settings-preview">#2 Elite Solutions<br /><span>Global operations managed from the heart of Rwanda.</span></article></div></section>
        <section className="settings-section"><h2>Financial Settings</h2><div className="financial-settings"><article>Commission Rate<strong>12%</strong></article><article>VAT Percentage<strong>18%</strong></article><article>Payout Threshold<strong>500,000 RWF</strong></article></div></section>
        <section className="settings-section"><h2>Trial Extensions</h2><div className="settings-grid"><article><label>Owner ID<input value={ownerId} onChange={(event) => setOwnerId(event.target.value)} placeholder="Owner user ID" /></label><label>Extra Days<input value={extraDays} onChange={(event) => setExtraDays(event.target.value)} placeholder="30" /></label><label>Expires At<input type="date" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} /></label><button type="button" onClick={handleExtendTrial} disabled={isSubmitting || !ownerId}>{isSubmitting ? 'Applying...' : 'Extend Trial'}</button>{trialMessage && <p className="field-note">{trialMessage}</p>}</article><article className="settings-preview"><strong>Admin trial overrides</strong><p>Use this panel to apply a free-trial extension for a venue owner based on off-system agreements.</p></article></div></section>
        <section className="settings-section"><h2>Provider Rules</h2><div className="rules-grid"><div>{['Mandatory KYC Check', 'Minimum Image Quality', 'Insurance Documentation'].map((r, i) => <label key={r}>{r}<input type="checkbox" defaultChecked={i < 2} /></label>)}</div><article className="phone-preview">Provider Payout Dashboard<br /><MiniPhoneChart /></article></div></section>
        <section className="settings-section"><h2>User Policies</h2><div className="policy-grid"><article className="dark-policy"><h3>Cancellation & Refund Logic</h3><p>Define the window in which a user can withdraw from a booking.</p><strong>72 Hours · 15 Daily Press</strong><button>Edit Protocol</button></article><article><h3>Dispute Windows</h3><p>Maximum days a client has to file a dispute after contract close.</p><strong>7 Days</strong></article></div></section>
        <section className="settings-section"><h2>System Status</h2><div className="status-grid">{['API Gateway 99.98%', 'Main DB Healthy', 'Image CDN Warm', 'Email SMTP Active'].map((s) => <article key={s}>{s}</article>)}</div></section>
      </section>
    </AdminShell>
  );
}

function MiniPhoneChart() {
  return <div className="mini-phone-chart">{[20, 40, 55, 35, 80, 45].map((h, i) => <span key={i} style={{ height: h }} />)}</div>;
}
