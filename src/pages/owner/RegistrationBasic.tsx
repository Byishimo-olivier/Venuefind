import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import { RegistrationShell } from './RegistrationShell';
import { getVenueDraft, saveVenueDraft } from '../../data/venues';

export default function RegistrationBasic() {
  const navigate = useNavigate();
  const draft = getVenueDraft();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    saveVenueDraft({
      name: String(form.get('name') || ''),
      businessType: String(form.get('businessType') || 'Venue') as 'Venue' | 'Service',
      contactPerson: String(form.get('contactPerson') || ''),
      phone: String(form.get('phone') || ''),
      email: String(form.get('email') || ''),
      languages: String(form.get('languages') || ''),
    });

    navigate('/owner/register/business');
  };

  return (
    <RegistrationShell step={1}>
      <div className="reg-basic-grid">
        <form className="reg-card narrow" onSubmit={handleSubmit}>
          <div className="reg-step-line"><span>Step 01 of 04</span><b>25% Complete</b></div>
          <h1>Welcome to the Marketplace</h1>
          <p>Let's begin by gathering the details guests will see on your venue profile.</p>

          <label>Business Name<input name="name" defaultValue={draft.name} placeholder="e.g. Kigali Heights Convention Center" required /></label>

          <span className="reg-label">Business Type</span>
          <div className="business-type">
            <label className="active"><input type="radio" name="businessType" value="Venue" defaultChecked={draft.businessType !== 'Service'} /><span>Venue</span></label>
            <label><input type="radio" name="businessType" value="Service" defaultChecked={draft.businessType === 'Service'} /><span>Service</span></label>
          </div>

          <label>Contact Person<input name="contactPerson" defaultValue={draft.contactPerson} placeholder="Full Name" required /></label>
          <div className="two-fields">
            <label>Phone Number<input name="phone" defaultValue={draft.phone} placeholder="+250 788 000 000" required /></label>
            <label>Email Address<input name="email" type="email" defaultValue={draft.email} placeholder="contact@example.com" required /></label>
          </div>
          <label>Languages Spoken<input name="languages" defaultValue={draft.languages} placeholder="Kinyarwanda, English, French" /></label>

          <button type="submit" className="reg-primary">Continue to Business Details</button>
        </form>

        <aside className="reg-visual">
          <img src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" />
          <blockquote>"The land of a thousand hills offers a thousand opportunities for celebration and connection."<span>Rwandan Proverb</span></blockquote>
        </aside>
      </div>
    </RegistrationShell>
  );
}
