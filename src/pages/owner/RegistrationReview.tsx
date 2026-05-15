import { Link } from 'react-router-dom';
import { RegistrationShell } from './RegistrationShell';

export default function RegistrationReview() {
  return (
    <RegistrationShell step={4}>
      <section className="reg-review-wrap">
        <div>
          <p className="reg-mini">Step 4 of 4</p>
          <h1>Review & Finish</h1>
          <p>Please review your application carefully. Once submitted, your details will be verified by our excellence team.</p>
          <SummaryCard title="Basic Information" rows={['Jean Damascene Nkurunziza', 'j.damascene@kigaliholets.rw', '+250 788 000 000', 'Kinyarwanda, English']} />
          <article className="summary-card-reg">
            <header><h2>Business Details</h2><Link to="/owner/register/business">Edit ↗</Link></header>
            <div className="business-summary"><img src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=300" alt="" /><div><h3>The Virunga Heights Estate</h3><p>A premium boutique venue located in the heart of Musanze.</p></div></div>
            <footer><span>Location<br /><strong>Musanze, Northern Province</strong></span><span>Category<br /><strong>Heritage & Luxury Stay</strong></span></footer>
          </article>
          <SummaryCard title="Verification Documents" rows={['RDB_License_2026.pdf · Verified', 'Insurance_Certificate.pdf · Verified']} />
        </div>
        <aside className="submission-card">
          <h2>Submission Summary</h2>
          <p>Profile Status <strong>Complete</strong></p>
          <p>Venue Tier <strong>Excellence Hub</strong></p>
          <p>Verification Priority <strong>Standard</strong></p>
          <label><input type="checkbox" /> I confirm all provided information is accurate.</label>
          <Link to="/owner">Submit for Approval</Link>
          <div><strong>Verification Notice</strong><span>Your review is typically complete within 2-3 business days.</span></div>
        </aside>
      </section>
    </RegistrationShell>
  );
}

function SummaryCard({ title, rows }: { title: string; rows: string[] }) {
  return (
    <article className="summary-card-reg">
      <header><h2>{title}</h2><a>Edit ↗</a></header>
      <div className="summary-rows">{rows.map((row) => <span key={row}>{row}</span>)}</div>
    </article>
  );
}
