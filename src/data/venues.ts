export type VenueAmenity = {
  icon: string;
  title: string;
  body: string;
};

export type VenueMedia = {
  url: string;
  type: 'image' | 'video';
  name?: string;
};

export type VenueDocument = {
  id: string;
  category: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  uploadedAt: string;
};

export type VenueAddon = {
  id: string;
  name: string;
  description: string;
  amount: number;
};

export type Venue = {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  latitude?: string;
  longitude?: string;
  category: string;
  label: string;
  location: string;
  province: string;
  setting: string;
  description: string;
  languages?: string;
  policy?: string;
  capacity: string;
  price: string;
  cleaningFee: string;
  decorFee: string;
  depositRate?: number;
  heroImage: string;
  heroMediaType: 'image' | 'video';
  galleryImages: string[];
  galleryMedia: VenueMedia[];
  addons: VenueAddon[];
  amenities: VenueAmenity[];
  tags: string[];
  rating: string;
  reviews: number;
  status: string;
  tier: string;
  tin: string;
  rdbNumber: string;
  verificationDocuments?: VenueDocument[];
};

const venueStorageKey = 'umurage-owner-venues';
const draftStorageKey = 'umurage-owner-venue-draft';

export const defaultVenueAddons: VenueAddon[] = [
  { id: 'executive-catering', name: 'Executive Catering', description: 'Premium 5-course plated service with dedicated waitstaff.', amount: 450000 },
  { id: 'floral-decor', name: 'Floral & Decor Package', description: 'Custom centerpiece arrangements and ambient lighting design.', amount: 250000 },
  { id: 'event-photography', name: 'Event Photography', description: '4 hours of professional coverage and edited digital gallery.', amount: 150000 },
  { id: 'premium-av', name: 'Premium Audiovisual Suite', description: 'Projectors, surround sound, lighting, and mic setup.', amount: 200000 },
];

export type VenueDraft = Partial<Venue> & {
  businessType?: 'Venue' | 'Service';
  languages?: string;
  verificationDocuments?: VenueDocument[];
};

export const languageOptions = [
  'Kinyarwanda',
  'English',
  'French',
  'Swahili',
  'Afrikaans',
  'Albanian',
  'Amharic',
  'Arabic',
  'Armenian',
  'Azerbaijani',
  'Basque',
  'Bengali',
  'Bosnian',
  'Bulgarian',
  'Burmese',
  'Catalan',
  'Chinese',
  'Croatian',
  'Czech',
  'Danish',
  'Dutch',
  'Estonian',
  'Filipino',
  'Finnish',
  'Georgian',
  'German',
  'Greek',
  'Gujarati',
  'Hausa',
  'Hebrew',
  'Hindi',
  'Hungarian',
  'Icelandic',
  'Indonesian',
  'Irish',
  'Italian',
  'Japanese',
  'Kannada',
  'Kazakh',
  'Khmer',
  'Korean',
  'Kurdish',
  'Lao',
  'Latvian',
  'Lithuanian',
  'Malay',
  'Malayalam',
  'Marathi',
  'Mongolian',
  'Nepali',
  'Norwegian',
  'Pashto',
  'Persian',
  'Polish',
  'Portuguese',
  'Punjabi',
  'Romanian',
  'Russian',
  'Serbian',
  'Shona',
  'Sinhala',
  'Slovak',
  'Slovenian',
  'Somali',
  'Spanish',
  'Tamil',
  'Telugu',
  'Thai',
  'Turkish',
  'Ukrainian',
  'Urdu',
  'Vietnamese',
  'Xhosa',
  'Yoruba',
  'Zulu',
];

const fallbackImage =
  'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200';

const amenityCatalog: VenueAmenity[] = [
  { icon: 'WiFi', title: 'Fiber Internet', body: 'High-speed connectivity for event teams and guests.' },
  { icon: 'Food', title: 'Catering Kitchen', body: 'On-site food preparation or catering partner access.' },
  { icon: 'AV', title: 'Audio Visual', body: 'Sound, lighting, projector, and stage support.' },
  { icon: 'P', title: 'Parking', body: 'Organized guest parking and arrival support.' },
  { icon: 'Power', title: 'Backup Power', body: 'Generator or backup electricity for reliable events.' },
  { icon: 'Decor', title: 'Decor Support', body: 'Flexible styling support for weddings and corporate events.' },
];

export function getVenueDraft(): VenueDraft {
  if (typeof window === 'undefined') return {};

  try {
    return JSON.parse(window.localStorage.getItem(draftStorageKey) || '{}') as VenueDraft;
  } catch {
    return {};
  }
}

export function saveVenueDraft(draft: VenueDraft) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(draftStorageKey, JSON.stringify({ ...getVenueDraft(), ...draft }));
}

export function clearVenueDraft() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(draftStorageKey);
}

export function getOwnerVenues(): Venue[] {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(window.localStorage.getItem(venueStorageKey) || '[]') as Venue[];
  } catch {
    return [];
  }
}

export function getAllVenues(): Venue[] {
  return getOwnerVenues();
}

export function getVenueById(id?: string): Venue | undefined {
  const venues = getAllVenues();
  return id ? venues.find((venue) => venue.id === id) : venues[0];
}

export function createSlug(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `venue-${Date.now()}`;
}

export function buildVenueFromDraft(draft: VenueDraft): Venue {
  const name = draft.name?.trim() || 'New Rwandan Venue';
  const capacityNumber = String(draft.capacity || '').replace(/[^0-9]/g, '');
  const capacity = capacityNumber ? `Up to ${capacityNumber}` : draft.capacity || 'Capacity on request';
  const selectedAmenities = draft.amenities?.length ? draft.amenities : amenityCatalog.slice(0, 4);
  const galleryMedia = draft.galleryMedia?.length
    ? draft.galleryMedia
    : (draft.galleryImages || [])
        .filter(Boolean)
        .map((url) => ({ url, type: 'image' as const }));
  const heroMedia = draft.heroImage
    ? [{ url: draft.heroImage, type: draft.heroMediaType || 'image' as const }]
    : [];
  const allMedia = galleryMedia.length ? galleryMedia : heroMedia;

  return {
    id: draft.id || createSlug(name),
    name,
    contactPerson: draft.contactPerson || 'Venue Manager',
    phone: draft.phone || '+250 788 000 000',
    email: draft.email || 'contact@example.com',
    latitude: draft.latitude || '',
    longitude: draft.longitude || '',
    category: draft.category || 'Verified Venue',
    label: draft.label || draft.category || 'Event Venue',
    location: draft.location || 'Kigali, Rwanda',
    province: draft.province || 'Kigali City',
    setting: draft.setting || 'Urban Venue',
    description: draft.description || 'A verified venue ready to host memorable events across Rwanda.',
    languages: draft.languages || 'Kinyarwanda, English',
    policy: draft.policy || 'Standard booking and cancellation policies apply. Please confirm details before you arrive.',
    capacity,
    price: draft.price || 'RWF 800,000',
    cleaningFee: draft.cleaningFee || 'RWF 50,000',
    decorFee: draft.decorFee || 'RWF 200,000',
    heroImage: draft.heroImage || fallbackImage,
    heroMediaType: draft.heroMediaType || 'image',
    galleryImages: draft.galleryImages?.length && !draft.galleryMedia?.length
      ? Array.from(new Set(draft.galleryImages))
      : [],
    galleryMedia: allMedia.length ? allMedia : [{ url: fallbackImage, type: 'image' }],
    addons: draft.addons?.length ? draft.addons : defaultVenueAddons,
    amenities: selectedAmenities,
    tags: [draft.setting || 'Flexible Setting', capacity, draft.province || 'Rwanda'],
    depositRate: typeof draft.depositRate === 'number' ? Math.min(Math.max(draft.depositRate, 0.05), 0.9) : 0.3,
    rating: draft.rating || 'New',
    reviews: draft.reviews || 0,
    status: draft.status || 'Pending Approval',
    tier: draft.tier || 'New Partner',
    tin: draft.tin || '',
    rdbNumber: draft.rdbNumber || '',
    verificationDocuments: draft.verificationDocuments || [],
  };
}

export function publishVenueFromDraft() {
  const venue = buildVenueFromDraft(getVenueDraft());
  const existing = getOwnerVenues().filter((item) => item.id !== venue.id);
  window.localStorage.setItem(venueStorageKey, JSON.stringify([venue, ...existing]));
  clearVenueDraft();
  return venue;
}

export { amenityCatalog };
