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
  category: string;
  label: string;
  location: string;
  province: string;
  setting: string;
  description: string;
  capacity: string;
  price: string;
  cleaningFee: string;
  decorFee: string;
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
};

const venueStorageKey = 'umurage-owner-venues';
const draftStorageKey = 'umurage-owner-venue-draft';

export const defaultVenueAddons: VenueAddon[] = [
  { id: 'executive-catering', name: 'Executive Catering', description: 'Premium 5-course plated service with dedicated waitstaff.', amount: 450000 },
  { id: 'floral-decor', name: 'Floral & Decor Package', description: 'Custom centerpiece arrangements and ambient lighting design.', amount: 250000 },
  { id: 'event-photography', name: 'Event Photography', description: '4 hours of professional coverage and edited digital gallery.', amount: 150000 },
  { id: 'premium-av', name: 'Premium Audiovisual Suite', description: 'Projectors, surround sound, lighting, and mic setup.', amount: 200000 },
];

export const defaultVenue: Venue = {
  id: 'akagera',
  name: 'Akagera Safari Lodge Event Space',
  contactPerson: 'Jean Damascene Nkurunziza',
  phone: '+250 788 000 000',
  email: 'contact@akageralodge.rw',
  category: 'Grasslands Earth Collection',
  label: 'Indoor/Outdoor',
  location: 'Akagera National Park, Rwanda',
  province: 'Eastern Province',
  setting: 'National Park',
  description:
    'Perched on a ridge overlooking Lake Ihema, the Akagera Safari Lodge Event Space offers an unparalleled fusion of wild adventure and high-end sophistication.',
  capacity: 'Up to 250',
  price: 'RWF 1,250,000',
  cleaningFee: 'RWF 50,000',
  decorFee: 'RWF 200,000',
  heroImage: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1400',
  heroMediaType: 'image',
  galleryImages: [
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  galleryMedia: [
    { url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' },
    { url: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' },
  ],
  addons: defaultVenueAddons,
  amenities: [
    { icon: 'P', title: 'Valet Service', body: 'Professional parking for up to 100 private vehicles.' },
    { icon: 'WiFi', title: 'Fiber Internet', body: 'High-speed connectivity for event teams and guests.' },
    { icon: 'AV', title: 'Audio Visual', body: 'Presentation sound, lighting, and screen support.' },
    { icon: 'Food', title: 'Safari Catering', body: 'World-class cuisine with a modern Rwandan twist.' },
    { icon: 'Power', title: 'Gen-set Backup', body: 'Uninterrupted power for your critical event moments.' },
    { icon: 'Decor', title: 'Traditional Decor', body: 'Curated imigongo and local craft styling options.' },
  ],
  tags: ['Fiber Internet', 'Catering', '250 guests'],
  rating: '4.9',
  reviews: 32,
  status: 'Approved',
  tier: 'Excellence Hub',
  tin: '102345678',
  rdbNumber: '100234567',
};

export type VenueDraft = Partial<Venue> & {
  businessType?: 'Venue' | 'Service';
  languages?: string;
};

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
  const ownerVenues = getOwnerVenues();
  const ownerHasDefault = ownerVenues.some((venue) => venue.id === defaultVenue.id);
  return ownerHasDefault ? ownerVenues : [defaultVenue, ...ownerVenues];
}

export function getVenueById(id = defaultVenue.id): Venue {
  return getAllVenues().find((venue) => venue.id === id) || defaultVenue;
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
    category: draft.category || 'Verified Venue',
    label: draft.label || draft.category || 'Event Venue',
    location: draft.location || 'Kigali, Rwanda',
    province: draft.province || 'Kigali City',
    setting: draft.setting || 'Urban Venue',
    description: draft.description || 'A verified venue ready to host memorable events across Rwanda.',
    capacity,
    price: draft.price || 'RWF 800,000',
    cleaningFee: draft.cleaningFee || 'RWF 50,000',
    decorFee: draft.decorFee || 'RWF 200,000',
    heroImage: draft.heroImage || fallbackImage,
    heroMediaType: draft.heroMediaType || 'image',
    galleryImages: draft.galleryImages?.length ? draft.galleryImages : allMedia.filter((item) => item.type === 'image').map((item) => item.url),
    galleryMedia: allMedia.length ? allMedia : [{ url: fallbackImage, type: 'image' }],
    addons: draft.addons?.length ? draft.addons : defaultVenueAddons,
    amenities: selectedAmenities,
    tags: [draft.setting || 'Flexible Setting', capacity, draft.province || 'Rwanda'],
    rating: draft.rating || 'New',
    reviews: draft.reviews || 0,
    status: draft.status || 'Pending Approval',
    tier: draft.tier || 'New Partner',
    tin: draft.tin || '',
    rdbNumber: draft.rdbNumber || '',
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
