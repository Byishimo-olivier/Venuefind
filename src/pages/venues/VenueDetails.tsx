import { Link } from 'react-router-dom';
import type { SyntheticEvent } from 'react';
import { VenueHeader } from './VenueHome';
import './venues.css';

const heroImage =
  'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1400';
const suiteImage =
  'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800';
const tourImage =
  'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800';

const fallbackVenueImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900"%3E%3Cdefs%3E%3ClinearGradient id="sky" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop stop-color="%23d9c07a"/%3E%3Cstop offset=".48" stop-color="%236d8c75"/%3E%3Cstop offset="1" stop-color="%23173c2e"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1400" height="900" fill="url(%23sky)"/%3E%3Cpath d="M0 610c170-105 280-115 430-45 155 72 270 58 410-20 165-92 335-85 560 25v330H0z" fill="%23254f3b" opacity=".82"/%3E%3Cpath d="M190 520h820l120 210H70z" fill="%2310211a" opacity=".8"/%3E%3Cpath d="M250 350h610l185 170H170z" fill="%23f3e1ad" opacity=".86"/%3E%3Cpath d="M300 520h95v150h-95zM460 520h95v150h-95zM620 520h95v150h-95zM780 520h95v150h-95z" fill="%23f7c66f" opacity=".82"/%3E%3Ccircle cx="1090" cy="210" r="72" fill="%23f5d482" opacity=".9"/%3E%3C/svg%3E';

const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.src = fallbackVenueImage;
};

const amenities = [
  ['⚡', 'Gen-set Backup', 'Uninterrupted power for your critical event moments.'],
  ['◎', 'Traditional Decor', 'Curated imigongo and local craft styling options available.'],
  ['≋', 'Fiber Internet', 'High-speed connectivity even in the heart of the park.'],
  ['🍴', 'Safari Catering', 'World-class cuisine with a modern Rwandan twist.'],
  ['◈', 'VIP Security', 'Discreet, high-level protection for distinguished guests.'],
  ['P', 'Valet Service', 'Professional parking for up to 100 private vehicles.'],
];

const reviews = [
  {
    name: 'Divine Umutoni',
    role: 'Senior Planner, Kigali Heights Events',
    time: '2 months ago',
    text: 'The light quality at sunset is incomparable for photography. We hosted a high-level ministerial dinner here and the Gen-set backup gave us total peace of mind.',
  },
  {
    name: 'Jean-Paul Nsabimana',
    role: 'CEO, Heritage Events Rwanda',
    time: '1 month ago',
    text: 'Unmatched logistics support. Moving 200 guests from the city to Akagera can be a challenge, but the venue staff coordinated everything perfectly.',
  },
];

const more = [
  {
    name: 'Mille Collines Garden',
    place: 'Urban Elegance & Heritage',
    tag: 'Kigali City',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=85',
  },
  {
    name: 'Rubavu Waterfront',
    place: 'Serene Volcanic Panoramas',
    tag: 'Lake Kivu',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=85',
  },
  {
    name: 'Gorilla View Pavilion',
    place: 'Mist-covered Rainforest Luxury',
    tag: 'Musanze',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=85',
  },
];

export default function VenueDetails() {
  return (
    <main className="venue-detail-page">
      <VenueHeader />
      <div className="detail-wrap">
        <p className="breadcrumb">Venues / Eastern Province / Akagera Safari Lodge</p>

        <section className="detail-hero-grid">
          <div className="detail-hero">
            <img src={heroImage} alt="Akagera Safari Lodge event hall" onError={handleImageError} />
            <div>
              <span>Grasslands Earth Collection</span>
              <h1>Akagera Safari Lodge Event space</h1>
              <p>⌖ Akagera National Park, Rwanda</p>
            </div>
          </div>
          <div className="detail-side-media">
            <article>
              <img src={suiteImage} alt="Warm lodge interior" onError={handleImageError} />
              <button>View All (24)</button>
            </article>
            <article className="virtual-tour">
              <img src={tourImage} alt="Savannah virtual tour" onError={handleImageError} />
              <div>
                <strong>↻</strong>
                <h2>Virtual Tour</h2>
                <p>Explore the savannah views</p>
              </div>
            </article>
          </div>
        </section>

        <div className="detail-content-grid">
          <section className="detail-main">
            <section className="essence-section">
              <h2>The Essence of the Savannah</h2>
              <p>
                Perched on a ridge overlooking Lake Ihema, the Akagera Safari Lodge Event Space offers an
                unparalleled fusion of wild adventure and high-end sophistication. Designed to mirror the
                undulating hills of the Eastern Province, the architecture utilizes local volcanic rock and
                sustainable timber, creating a seamless transition from the interior luxury to the surrounding
                national park.
              </p>
              <div className="venue-facts">
                <div><span>Capacity</span><strong>Up to 250</strong></div>
                <div><span>Venue Type</span><strong>Indoor/Outdoor</strong></div>
                <div><span>Setting</span><strong>National Park</strong></div>
              </div>
            </section>

            <section>
              <h2 className="detail-section-title">Premium Amenities</h2>
              <div className="amenity-grid">
                {amenities.map(([icon, title, body]) => (
                  <article key={title}>
                    <span>{icon}</span>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="reviews-section">
              <div className="reviews-heading">
                <div>
                  <h2>Professional Reviews</h2>
                  <p>Endorsed by Kigali's top event planners</p>
                </div>
                <strong>★ 4.9 <span>(32 Reviews)</span></strong>
              </div>
              {reviews.map((review) => (
                <article className="review-card" key={review.name}>
                  <div className="review-avatar">{review.name.slice(0, 1)}</div>
                  <div>
                    <div className="review-meta">
                      <strong>{review.name}</strong>
                      <span>{review.time}</span>
                    </div>
                    <p>"{review.text}"</p>
                    <small>{review.role}</small>
                  </div>
                </article>
              ))}
            </section>
          </section>

          <aside className="booking-aside">
            <div className="pricing-card">
              <span>Base Pricing</span>
              <h2>RWF 1,250,000 <small>/ day</small></h2>
              <p>Pricing varies by season and guest count.</p>
              <dl>
                <div><dt>Venue Hire</dt><dd>Included</dd></div>
                <div><dt>Cleaning Fee</dt><dd>RWF 50,000</dd></div>
                <div><dt>Decor Package (Opt.)</dt><dd>RWF 200,000</dd></div>
              </dl>
              <Link to="/venues/akagera/book" className="request-button">Request Booking Details</Link>
              <button>Download Brochure (PDF)</button>
            </div>
            <div className="mini-map-card">
              <div>
                <span>●</span>
                <Link to="/venues/search">View on Map</Link>
              </div>
            </div>
            <div className="concierge-card">
              <strong>☏</strong>
              <p>Dedicated Concierge<br /><span>+250 788 000 000</span></p>
            </div>
          </aside>
        </div>

        <section className="more-escapes">
          <div className="section-title-row">
            <h2>Explore More Escapes</h2>
            <Link to="/venues/search">Browse All Venues →</Link>
          </div>
          <div className="more-grid">
            {more.map((item) => (
              <Link to="/venues/akagera" key={item.name}>
                <img src={item.image} alt="" />
                <span>{item.tag}</span>
                <h3>{item.name}</h3>
                <p>{item.place}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <footer className="detail-footer">
        <div>
          <h2>Virunga Venues</h2>
          <p>Curating Rwanda's most prestigious spaces for corporate milestones, cultural celebrations, and life's grandest moments.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/venues/search">Our Portfolio</Link>
          <Link to="/venues/akagera/book">Planning Services</Link>
          <Link to="/venues/akagera">Cultural Guidance</Link>
          <Link to="/venues/akagera/reviews">Sustainability</Link>
        </div>
        <div>
          <h3>Company</h3>
          <Link to="/venues">About Us</Link>
          <Link to="/owner/register">Partner With Us</Link>
          <Link to="/owner/analytics">Press & Media</Link>
          <Link to="/login">Contact Support</Link>
        </div>
      </footer>
    </main>
  );
}
