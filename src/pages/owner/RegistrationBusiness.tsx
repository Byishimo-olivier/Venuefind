import { Link } from 'react-router-dom';
import { RegistrationShell } from './RegistrationShell';

const services = ['Catering', 'Tents', 'Decor', 'Photography', 'AV & Sound', 'Entertainment'];
const provinces = ['Kigali City', 'Eastern Province', 'Western Province', 'Northern Province', 'Southern Province'];

export default function RegistrationBusiness() {
  return (
    <RegistrationShell step={2}>
      <form className="reg-card wide">
        <h1>Business Details</h1>
        <p>Specify your professional expertise and regional coverage. This information helps us match you with the right clients in Rwanda.</p>
        <h2>Service Categories</h2>
        <div className="service-grid">
          {services.map((service, index) => (
            <label key={service} className={index === 0 ? 'selected' : ''}>
              <input type="checkbox" defaultChecked={index === 0} />
              <strong>{index === 0 ? '🍴' : index === 1 ? '△' : index === 2 ? '╱' : index === 3 ? '▣' : index === 4 ? '◉' : '✦'}</strong>
              <span>{service}</span>
              <small>{index === 0 ? 'Traditional Rwandan cuisine and international menus.' : 'Premium event support for distinguished gatherings.'}</small>
            </label>
          ))}
        </div>
        <div className="reg-columns">
          <section><h2>Operational Provinces</h2>{provinces.map((p) => <label className="check-line" key={p}><input type="checkbox" />{p}</label>)}</section>
          <section>
            <h2>Legal Identification</h2>
            <label>RRA TIN Number<input placeholder="Enter 9-digit TIN" /></label>
            <label>RDB Registration Number (Optional)<input placeholder="e.g., 100234..." /></label>
            <p className="secure-note">◎ Your data is encrypted and used solely for business verification.</p>
          </section>
        </div>
        <div className="reg-actions"><Link to="/owner/register">← Previous Step</Link><Link to="/owner/register/verification" className="reg-primary">Save & Continue →</Link></div>
      </form>
    </RegistrationShell>
  );
}
