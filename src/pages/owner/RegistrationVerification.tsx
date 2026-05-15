import { Link } from 'react-router-dom';
import { RegistrationShell } from './RegistrationShell';

export default function RegistrationVerification() {
  return (
    <RegistrationShell step={3}>
      <section className="reg-card wide docs">
        <h1>Documentation & Verification</h1>
        <p>To celebrate Rwandan excellence on our marketplace, we require official verification of your business and identity.</p>
        <div className="doc-status-row">
          <article><strong>♜</strong><h3>Identity</h3><span className="ok">● Passport Loaded</span></article>
          <article><strong>▤</strong><h3>RDB License</h3><span>○ Pending Upload</span></article>
          <article><strong>▧</strong><h3>VAT Certificate</h3><span>○ Pending Upload</span></article>
        </div>
        {['RDB Business License', 'VAT Certificate'].map((title, index) => (
          <article className="upload-row" key={title}>
            <div><h2>{title}</h2><p>{index === 0 ? 'Upload your valid Rwanda Development Board business registration certificate.' : 'A valid VAT certificate from Rwanda Revenue Authority is required for service providers.'}</p>{index === 1 && <b>Failure to provide a clear VAT certificate may delay approval.</b>}</div>
            <div className="upload-box">☁<span>{index === 0 ? 'Drag and drop your RDB License here' : 'Upload VAT Certificate'}</span><small>PDF preferred for verification precision</small></div>
          </article>
        ))}
        <article className="upload-row identity">
          <div><h2>Identity (ID or Passport)</h2><p>National ID or International Passport for the primary business owner.</p><span className="file-pill">muhizi_claudine_passport.pdf ▣</span></div>
          <div className="verified-paper">Verified<br /><small>Pub testamentum far me notis</small></div>
        </article>
        <div className="reg-actions"><Link to="/owner/register/business">← Back to Business Details</Link><Link to="/owner/register/review" className="reg-primary">Save and Continue →</Link></div>
      </section>
    </RegistrationShell>
  );
}
