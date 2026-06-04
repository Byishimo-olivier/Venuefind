import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { RegistrationShell } from './RegistrationShell';
import { amenityCatalog, defaultVenueAddons, getVenueDraft, saveVenueDraft } from '../../data/venues';
import type { VenueMedia } from '../../data/venues';

const provinces = ['Kigali City', 'Eastern Province', 'Western Province', 'Northern Province', 'Southern Province'];
const categories = ['Garden Venue', 'Conference Hall', 'Heritage & Luxury Stay', 'Corporate Hub', 'Indoor/Outdoor'];
const settings = ['Urban Venue', 'Lakefront', 'National Park', 'Mountain View', 'Private Estate', 'Historic Site'];

function parseAmount(value: FormDataEntryValue | null) {
  const amount = Number(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

export default function RegistrationBusiness() {
  const navigate = useNavigate();
  const draft = getVenueDraft();
  const initialMedia = draft.galleryMedia?.length
    ? draft.galleryMedia
    : draft.heroImage
      ? [{ url: draft.heroImage, type: draft.heroMediaType || 'image' as const }]
      : [];
  const [selectedMedia, setSelectedMedia] = useState<VenueMedia[]>(initialMedia);

  const handleMediaChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const media = await Promise.all(files.map(async (file) => ({
      url: await readFileAsDataUrl(file),
      type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
      name: file.name,
    })));

    setSelectedMedia(media);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selectedAmenities = amenityCatalog.filter((amenity) => form.getAll('amenities').includes(amenity.title));
    const media = selectedMedia.length ? selectedMedia : initialMedia;
    const heroMedia = media[0];
    const addons = defaultVenueAddons.map((addon) => ({
      ...addon,
      amount: parseAmount(form.get(`addon-${addon.id}-amount`)),
    })).filter((addon) => addon.amount > 0);

    saveVenueDraft({
      category: String(form.get('category') || ''),
      label: String(form.get('category') || ''),
      location: String(form.get('location') || ''),
      latitude: String(form.get('latitude') || ''),
      longitude: String(form.get('longitude') || ''),
      province: String(form.get('province') || ''),
      setting: String(form.get('setting') || ''),
      description: String(form.get('description') || ''),
      capacity: String(form.get('capacity') || ''),
      price: String(form.get('price') || ''),
      cleaningFee: String(form.get('cleaningFee') || ''),
      decorFee: String(form.get('decorFee') || ''),
      addons,
      heroImage: heroMedia?.url || '',
      heroMediaType: heroMedia?.type || 'image',
      galleryImages: media.filter((item) => item.type === 'image').map((item) => item.url),
      galleryMedia: media,
      amenities: selectedAmenities,
      tin: String(form.get('tin') || ''),
      rdbNumber: String(form.get('rdbNumber') || ''),
    });

    navigate('/owner/register/verification');
  };

  return (
    <RegistrationShell step={2}>
      <form className="reg-card wide" onSubmit={handleSubmit}>
        <h1>Venue Details</h1>
        <p>Add the same information visitors will see on the public venue profile after you publish.</p>

        <div className="reg-columns">
          <section>
            <h2>Public Listing</h2>
            <label>Venue Category
              <select name="category" defaultValue={draft.category || 'Garden Venue'} required>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>Exact Location<input name="location" defaultValue={draft.location} placeholder="Kiyovu, Kigali" required /></label>
            <div className="two-fields">
              <label>Latitude<input name="latitude" defaultValue={draft.latitude} placeholder="-1.9441" inputMode="decimal" /></label>
              <label>Longitude<input name="longitude" defaultValue={draft.longitude} placeholder="30.0619" inputMode="decimal" /></label>
            </div>
            <label>Province
              <select name="province" defaultValue={draft.province || 'Kigali City'} required>
                {provinces.map((province) => <option key={province}>{province}</option>)}
              </select>
            </label>
            <label>Setting
              <select name="setting" defaultValue={draft.setting || 'Urban Venue'} required>
                {settings.map((setting) => <option key={setting}>{setting}</option>)}
              </select>
            </label>
          </section>

          <section>
            <h2>Capacity & Pricing</h2>
            <label>Guest Capacity<input name="capacity" defaultValue={draft.capacity} placeholder="250" required /></label>
            <label>Base Price Per Day<input name="price" defaultValue={draft.price} placeholder="RWF 1,250,000" required /></label>
            <label>Cleaning Fee<input name="cleaningFee" defaultValue={draft.cleaningFee} placeholder="RWF 50,000" /></label>
            <label>Decor Package Fee<input name="decorFee" defaultValue={draft.decorFee} placeholder="RWF 200,000" /></label>
          </section>
        </div>

        <h2>Bespoke Add-ons</h2>
        <p>Set the optional service prices guests can choose during booking.</p>
        <div className="addon-pricing-grid">
          {defaultVenueAddons.map((addon) => {
            const savedAddon = draft.addons?.find((item) => item.id === addon.id);
            return (
              <label key={addon.id}>
                <span>
                  <strong>{addon.name}</strong>
                  <small>{addon.description}</small>
                </span>
                <input
                  name={`addon-${addon.id}-amount`}
                  defaultValue={savedAddon ? `RWF ${savedAddon.amount.toLocaleString('en-US')}` : `RWF ${addon.amount.toLocaleString('en-US')}`}
                  placeholder="RWF 0"
                />
              </label>
            );
          })}
        </div>

        <label>Venue Description
          <textarea name="description" defaultValue={draft.description} placeholder="Describe the venue experience, architecture, surroundings, and best event use cases." required />
        </label>
        <section className="venue-photo-upload">
          <div>
            <h2>Venue Media</h2>
            <p>Upload photos and short videos guests will see on search and detail pages. The first file becomes the cover.</p>
          </div>
          <label className={selectedMedia.length ? 'photo-dropzone has-preview' : 'photo-dropzone'}>
            {selectedMedia[0]?.type === 'video' ? (
              <video src={selectedMedia[0].url} muted controls playsInline />
            ) : selectedMedia[0] ? (
              <img src={selectedMedia[0].url} alt="Venue preview" />
            ) : (
              <span>
                <strong>Upload venue media</strong>
                <small>PNG, JPG, WEBP, MP4, WEBM, or OGG</small>
              </span>
            )}
            <input name="mediaFiles" type="file" accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/ogg" multiple onChange={handleMediaChange} />
            <em>{selectedMedia.length ? 'Replace media set' : 'Choose media'}</em>
          </label>
          <small>{selectedMedia.length ? `${selectedMedia.length} media file${selectedMedia.length === 1 ? '' : 's'} selected` : 'No media selected yet'}</small>
          {selectedMedia.length > 1 && (
            <div className="media-preview-strip">
              {selectedMedia.map((item, index) => (
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
        </section>

        <h2>Public Amenities</h2>
        <div className="service-grid">
          {amenityCatalog.map((amenity, index) => (
            <label key={amenity.title} className={index < 4 ? 'selected' : ''}>
              <input type="checkbox" name="amenities" value={amenity.title} defaultChecked={draft.amenities?.some((item) => item.title === amenity.title) ?? index < 4} />
              <strong>{amenity.icon}</strong>
              <span>{amenity.title}</span>
              <small>{amenity.body}</small>
            </label>
          ))}
        </div>

        <div className="reg-columns">
          <section>
            <h2>Legal Identification</h2>
            <label>RRA TIN Number<input name="tin" defaultValue={draft.tin} placeholder="Enter 9-digit TIN" /></label>
            <label>RDB Registration Number<input name="rdbNumber" defaultValue={draft.rdbNumber} placeholder="e.g. 100234..." /></label>
          </section>
          <section>
            <h2>Coverage</h2>
            {provinces.map((province) => <label className="check-line" key={province}><input type="checkbox" defaultChecked={province === draft.province} />{province}</label>)}
          </section>
        </div>

        <div className="reg-actions"><Link to="/owner/register">Previous Step</Link><button type="submit" className="reg-primary">Save & Continue</button></div>
      </form>
    </RegistrationShell>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
