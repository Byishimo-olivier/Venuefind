import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { RegistrationShell } from './RegistrationShell';
import { buildVenueFromDraft, clearVenueDraft, getVenueDraft } from '../../data/venues';
import { createVenue } from '../../services/venues';

export default function RegistrationReview() {
  const navigate = useNavigate();
  const draft = getVenueDraft();
  const venue = buildVenueFromDraft(draft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const publishedVenue = await createVenue(venue);
      clearVenueDraft();
      navigate(`/venues/${publishedVenue.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit your venue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegistrationShell step={4}>
      <form className="reg-review-wrap" onSubmit={handleSubmit}>
        <div>
          <p className="reg-mini">Step 4 of 4</p>
          <h1>Review & Finish</h1>
          <p>Please review your application carefully. Once submitted, the public venue detail page will use these same fields.</p>
          <SummaryCard title="Basic Information" rows={[venue.contactPerson, venue.email, venue.phone, draft.languages || 'Languages not specified']} />
          <article className="summary-card-reg">
            <header><h2>Venue Details</h2><Link to="/owner/register/business">Edit</Link></header>
            <div className="business-summary">
              {venue.heroMediaType === 'video' ? (
                <video src={venue.heroImage} muted playsInline />
              ) : (
                <img src={venue.heroImage} alt="" />
              )}
              <div><h3>{venue.name}</h3><p>{venue.description}</p></div>
            </div>
            <footer>
              <span>Location<br /><strong>{venue.location}</strong></span>
              <span>Category<br /><strong>{venue.category}</strong></span>
            </footer>
            {venue.galleryMedia.length > 1 && (
              <div className="media-preview-strip">
                {venue.galleryMedia.slice(0, 6).map((item, index) => (
                  <span key={`${item.url.slice(0, 32)}-${index}`}>
                    {item.type === 'video' ? (
                      <video src={item.url} muted playsInline />
                    ) : (
                      <img src={item.url} alt="" />
                    )}
                    <small>{index === 0 ? 'Cover' : item.type}</small>
                  </span>
                ))}
              </div>
            )}
            <div className="summary-rows venue-review-facts">
              <span>Capacity<br /><strong>{venue.capacity}</strong></span>
              <span>Setting<br /><strong>{venue.setting}</strong></span>
              <span>Base Price<br /><strong>{venue.price} / day</strong></span>
              <span>Cleaning Fee<br /><strong>{venue.cleaningFee}</strong></span>
              <span>Decor Fee<br /><strong>{venue.decorFee}</strong></span>
              <span>Amenities<br /><strong>{venue.amenities.map((item) => item.title).join(', ')}</strong></span>
            </div>
            <div className="summary-rows venue-review-facts">
              {venue.addons.map((addon) => (
                <span key={addon.id}>{addon.name}<br /><strong>{formatRwf(addon.amount)}</strong></span>
              ))}
            </div>
          </article>
          <SummaryCard title="Verification Documents" rows={['RDB license ready for review', 'Insurance certificate ready for review']} />
        </div>
        <aside className="submission-card">
          <h2>Submission Summary</h2>
          <p>Profile Status <strong>{venue.status}</strong></p>
          <p>Venue Tier <strong>{venue.tier}</strong></p>
          <p>Verification Priority <strong>Standard</strong></p>
          <label><input type="checkbox" required /> I confirm all provided information is accurate.</label>
          {error && <p className="field-error centered">{error}</p>}
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit and View Venue'}</button>
          <div><strong>Verification Notice</strong><span>Your review is typically complete within 2-3 business days.</span></div>
        </aside>
      </form>
    </RegistrationShell>
  );
}

function SummaryCard({ title, rows }: { title: string; rows: string[] }) {
  return (
    <article className="summary-card-reg">
      <header><h2>{title}</h2><Link to="/owner/register">Edit</Link></header>
      <div className="summary-rows">{rows.map((row) => <span key={row}>{row}</span>)}</div>
    </article>
  );
}

function formatRwf(value: number) {
  return `RWF ${Math.round(value).toLocaleString('en-US')}`;
}
