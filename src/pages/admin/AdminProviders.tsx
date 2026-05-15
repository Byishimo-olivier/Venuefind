import { AdminMetric, AdminShell } from './AdminShell';

const providers = [
  ['Virunga Heights Resort', 'Premium Venue · Musanze District', 'Pending Review'],
  ['Kigali Gourmet Catering', 'Service Provider · Nyarugenge', 'License Review'],
  ['Lens & Light Studios', 'Service Provider · Gasabo District', 'Docs Pending'],
  ['Elegant Bloom Decor', 'Service Provider · Kicukiro', 'Pending Review'],
];

export default function AdminProviders() {
  return (
    <AdminShell>
      <section className="admin-content">
        <div className="admin-heading"><h1>Provider Vetting</h1><p>Review and verify new partner applications from across Rwanda. Maintain high standards through diligent document inspection.</p></div>
        <div className="vetting-metrics"><AdminMetric title="Pending Review" value="24" /><AdminMetric title="Under Investigation" value="08" /><AdminMetric title="Verified Today" value="12" /><AdminMetric title="Rejection Rate" value="4.2%" /></div>
        <section className="vetting-list">
          {providers.map(([name, desc, status]) => (
            <article key={name}><span className="thumb" /><div><strong>{name}</strong><small>{desc}</small></div><em className={status.includes('Pending') ? 'pending' : status.includes('License') ? 'dark' : ''}>{status}</em><button>Review Application</button></article>
          ))}
        </section>
        <div className="vetting-bottom">
          <article className="protocol-card"><h2>Verification Protocol</h2><p>Every partner on our platform must pass RDB business checks and VAT compliance verification.</p><ul><li>RDB Business License Validation</li><li>VAT Certificate Verification</li><li>Background Compliance Check</li></ul></article>
          <aside className="expert-card"><h2>Need Expert Support?</h2><p>The legal vetting team is available for complex document escalations.</p><button>Contact Compliance Dept</button></aside>
        </div>
      </section>
    </AdminShell>
  );
}
