import { Link } from 'react-router-dom';
import { VenueHeader } from './VenueHome';
import './venues.css';

const venues = [
  {
    name: 'The Umushumba Pavilion',
    location: 'Kimironko, Kigali',
    price: '$1,200',
    label: 'Indoor Performance Space',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1300&q=85',
    tags: ['High-speed WiFi', 'Photography', 'Catering gifts'],
    rating: '4.9',
  },
  {
    name: 'Mille Collines Gardens',
    location: 'Kiyovu, Kigali',
    price: '$2,500',
    label: 'Garden Venue',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1300&q=85',
    tags: ['Historic site', 'Poolside space', '500 guests'],
    rating: '5.0',
  },
  {
    name: 'Norrsken Kigali House',
    location: 'Nyarugenge, Kigali',
    price: '$850',
    label: 'Corporate Hub',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1300&q=85',
    tags: ['Smart audio', 'Conference access'],
    rating: '4.8',
  },
];

export default function VenueSearchMap() {
  return (
    <main className="map-page">
      <VenueHeader />
      <div className="map-layout">
        <aside className="filters-panel">
          <h1>Filters</h1>
          <FilterGroup title="Venue Type" items={['Indoor Performance Space', 'Garden Venues', 'Corporate Boardrooms', 'Art Galleries']} checked={[1]} />
          <FilterGroup title="Neighborhood" items={['Kimironko', 'Kiyovu', 'Nyarugenge', 'Gacuriro']} checked={[0, 1]} />
          <label className="select-filter">
            <span>Capacity</span>
            <select defaultValue="50 - 200 Guests">
              <option>50 - 200 Guests</option>
              <option>200 - 500 Guests</option>
              <option>500+ Guests</option>
            </select>
          </label>
          <button className="apply-filters">Apply Filters</button>
        </aside>

        <section className="results-panel">
          <div className="results-heading">
            <div>
              <p>Kigali, Rwanda</p>
              <h2>12 Smart Venues Found</h2>
            </div>
            <button>Recommended</button>
          </div>

          <div className="venue-results">
            {venues.map((venue) => (
              <Link className="result-card" to="/venues/akagera" key={venue.name}>
                <div className="result-image">
                  <img src={venue.image} alt="" />
                  <span>{venue.label}</span>
                  <button aria-label={`Save ${venue.name}`}>♡</button>
                </div>
                <div className="result-info">
                  <div>
                    <h3>{venue.name}</h3>
                    <p>⌖ {venue.location}</p>
                    <div className="tag-row">
                      {venue.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="price-block">
                    <strong>{venue.price}</strong>
                    <span>/ day</span>
                    <small>★ {venue.rating} (28 reviews)</small>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <aside className="map-panel">
          <div className="map-search">
            <span>⌕</span>
            <input defaultValue="Smart Event Venue" aria-label="Search map" />
          </div>
          <div className="active-search">Active Search Area<br />Kigali City Center & Surrounding Hills</div>
          <div className="abstract-map">
            <span className="pin pin-one">$1,200</span>
            <span className="pin pin-two">$2,500</span>
            <span className="pin pin-three">$850</span>
            <strong>KIGALI</strong>
            <em>Rwanda Urban Grid</em>
          </div>
          <div className="map-controls">
            <button>+</button>
            <button>-</button>
            <button>◎</button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function FilterGroup({ title, items, checked }: { title: string; items: string[]; checked: number[] }) {
  return (
    <fieldset className="filter-group">
      <legend>{title}</legend>
      {items.map((item, index) => (
        <label key={item}>
          <input type="checkbox" defaultChecked={checked.includes(index)} />
          {item}
        </label>
      ))}
    </fieldset>
  );
}
