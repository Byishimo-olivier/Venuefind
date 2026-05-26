import type { Venue } from '../../data/venues';

export type RecommendationIntent = {
  budget?: number;
  guests?: number;
  province?: string;
  category?: string;
};

export function parseMoney(value?: string) {
  const amount = Number(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

export function parseCapacity(value?: string) {
  const amount = Number(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

export function extractIntent(message: string): RecommendationIntent {
  const text = message.toLowerCase();
  const numbers = [...text.matchAll(/\b\d[\d,.\s]*\b/g)].map((match) => Number(match[0].replace(/[^0-9.]/g, ''))).filter(Number.isFinite);
  const budgetHint = text.includes('budget') || text.includes('rwf') || text.includes('frw') || text.includes('price') || text.includes('cost');
  const guestHint = text.includes('guest') || text.includes('people') || text.includes('capacity') || text.includes('attend');
  const budget = budgetHint ? numbers.find((number) => number > 10000) : undefined;
  const guests = guestHint ? numbers.find((number) => number > 0 && number < 10000) : undefined;
  const province = ['Kigali City', 'Eastern Province', 'Northern Province', 'Western Province', 'Southern Province']
    .find((name) => text.includes(name.toLowerCase().replace(' province', '')) || text.includes(name.toLowerCase()));
  const category = ['Garden Venue', 'Conference Hall', 'Corporate Hub', 'Indoor/Outdoor', 'Heritage & Luxury Stay']
    .find((name) => text.includes(name.toLowerCase()) || text.includes(name.toLowerCase().replace(' venue', '')));

  return { budget, guests, province, category };
}

export function scoreVenue(venue: Venue, intent: RecommendationIntent) {
  let score = 0;
  const price = parseMoney(venue.price);
  const capacity = parseCapacity(venue.capacity);

  if (intent.province && venue.province === intent.province) score += 35;
  if (intent.category && [venue.category, venue.label].includes(intent.category)) score += 30;
  if (intent.budget && price > 0 && price <= intent.budget) score += 25;
  if (intent.guests && capacity > 0 && capacity >= intent.guests) score += 25;
  if (String(venue.status || '').toLowerCase().includes('approved')) score += 10;
  if (venue.rating && venue.rating !== 'New') score += 8;
  if (venue.description) score += 4;

  return score;
}

function venueMatchesCategory(venue: Venue, category: string) {
  const searchableText = [
    venue.category,
    venue.label,
    venue.setting,
    venue.description,
    ...(venue.tags || []),
  ].join(' ').toLowerCase();

  return searchableText.includes(category.toLowerCase());
}

function venueMatchesIntent(venue: Venue, intent: RecommendationIntent) {
  const price = parseMoney(venue.price);
  const capacity = parseCapacity(venue.capacity);

  if (intent.province && venue.province !== intent.province) return false;
  if (intent.category && !venueMatchesCategory(venue, intent.category)) return false;
  if (intent.budget && price > 0 && price > intent.budget) return false;
  if (intent.guests && capacity > 0 && capacity < intent.guests) return false;

  return true;
}

export function recommendVenues(venues: Venue[], intent: RecommendationIntent, limit = 3) {
  const hasIntent = Boolean(intent.budget || intent.guests || intent.province || intent.category);
  const matchedVenues = hasIntent ? venues.filter((venue) => venueMatchesIntent(venue, intent)) : venues;

  return [...matchedVenues]
    .map((venue) => ({ venue, score: scoreVenue(venue, intent) }))
    .sort((a, b) => b.score - a.score || parseMoney(a.venue.price) - parseMoney(b.venue.price))
    .slice(0, limit)
    .map((item) => item.venue);
}

export function buildAssistantReply(message: string, venues: Venue[]) {
  const intent = extractIntent(message);
  const recommendations = recommendVenues(venues, intent, 3);
  const hasIntent = Boolean(intent.budget || intent.guests || intent.province || intent.category);

  if (!venues.length) {
    return {
      recommendations,
      text: 'I cannot see any live venues yet. Once owners publish venues, I can match them by location, budget, capacity, and event style.',
    };
  }

  if (!message.trim()) {
    return {
      recommendations,
      text: 'Tell me your guest count, budget, location, or event style and I will shortlist the best venues.',
    };
  }

  if (!hasIntent) {
    return {
      recommendations,
      text: `I found ${venues.length} live venues. For a better shortlist, add details like "200 guests in Kigali under 1000000 RWF" or "garden wedding venue".`,
    };
  }

  const parts = [
    intent.guests ? `${intent.guests} guests` : '',
    intent.budget ? `under ${new Intl.NumberFormat('en-RW').format(intent.budget)} RWF` : '',
    intent.province || '',
    intent.category || '',
  ].filter(Boolean);

  return {
    recommendations,
    text: recommendations.length
      ? `Best matches for ${parts.join(', ')}.`
      : `I could not find a close match for ${parts.join(', ')}. Try widening the budget, capacity, or province.`,
  };
}
