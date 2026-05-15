import { Link } from 'react-router-dom';
import { RegistrationShell } from './RegistrationShell';

export default function RegistrationBasic() {
  return (
    <RegistrationShell step={1}>
      <div className="reg-basic-grid">
        <form className="reg-card narrow">
          <div className="reg-step-line"><span>Step 01 of 04</span><b>25% Complete</b></div>
          <h1>Welcome to the Marketplace</h1>
          <p>Let's begin by gathering some fundamental details about your business entity.</p>
          <label>Business Name<input placeholder="e.g. Kigali Heights Convention Center" /></label>
          <span className="reg-label">Business Type</span>
          <div className="business-type">
            <button type="button" className="active">▦<span>Venue</span></button>
            <button type="button">⚒<span>Service</span></button>
          </div>
          <label>Contact Person<input placeholder="Full Name" /></label>
          <div className="two-fields">
            <label>Phone Number<input placeholder="+250    788 000 000" /></label>
            <label>Email Address<input placeholder="contact@example.com" /></label>
          </div>
          <Link to="/owner/register/business" className="reg-primary">Continue to Business Details →</Link>
        </form>
        <aside className="reg-visual">
          <img src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" />
          <blockquote>“The land of a thousand hills offers a thousand opportunities for celebration and connection.”<span>Rwandan Proverb</span></blockquote>
        </aside>
      </div>
    </RegistrationShell>
  );
}
