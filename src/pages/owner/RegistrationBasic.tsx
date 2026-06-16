import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { RegistrationShell } from './RegistrationShell';
import { getVenueDraft, languageOptions, saveVenueDraft } from '../../data/venues';

export default function RegistrationBasic() {
  const navigate = useNavigate();
  const draft = getVenueDraft();
  const [businessType, setBusinessType] = useState<'Venue' | 'Service'>(draft.businessType || 'Venue');
  const [selectedLanguages, setSelectedLanguages] = useState(
    String(draft.languages || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  );

  const addLanguage = (value: string) => {
    if (!value) return;
    setSelectedLanguages((current) => current.includes(value) ? current : [...current, value]);
  };

  const removeLanguage = (value: string) => {
    setSelectedLanguages((current) => current.filter((item) => item !== value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    saveVenueDraft({
      name: String(form.get('name') || ''),
      businessType,
      contactPerson: String(form.get('contactPerson') || ''),
      phone: String(form.get('phone') || ''),
      email: String(form.get('email') || ''),
      languages: selectedLanguages.join(', '),
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
            <label className={businessType === 'Venue' ? 'active' : ''}>
              <input type="radio" name="businessType" value="Venue" checked={businessType === 'Venue'} onChange={() => setBusinessType('Venue')} />
              <span>Venue</span>
            </label>
            <label className={businessType === 'Service' ? 'active service-active' : ''}>
              <input type="radio" name="businessType" value="Service" checked={businessType === 'Service'} onChange={() => setBusinessType('Service')} />
              <span>Service</span>
            </label>
          </div>

          <label>Contact Person<input name="contactPerson" defaultValue={draft.contactPerson} placeholder="Full Name" required /></label>
          <div className="two-fields">
            <label>Phone Number<input name="phone" defaultValue={draft.phone} placeholder="+250 788 000 000" required /></label>
            <label>Email Address<input name="email" type="email" defaultValue={draft.email} placeholder="contact@example.com" required /></label>
          </div>
          <label>Languages Spoken
            <select value="" onChange={(event) => addLanguage(event.target.value)}>
              <option value="">Choose a language</option>
              {languageOptions.map((language) => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </label>
          <input type="hidden" name="languages" value={selectedLanguages.join(', ')} />
          <div className="language-pill-list">
            {selectedLanguages.length ? selectedLanguages.map((language) => (
              <button key={language} type="button" onClick={() => removeLanguage(language)}>
                {language} x
              </button>
            )) : <span>No languages selected yet</span>}
          </div>

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
