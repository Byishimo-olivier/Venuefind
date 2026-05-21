import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Venue } from '../../data/venues';
import { getAllVenues } from '../../data/venues';
import { listVenues } from '../../services/venues';
import { VenueHeader } from './VenueHome';
import './venues.css';

export default function VenueSearchMap() {
  const [venues, setVenues] = useState<Venue[]>(() => getAllVenues());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    listVenues()
      .then((items) => {
        if (isMounted) setVenues(items.length ? items : getAllVenues());
      })
      .catch(() => {
        if (isMounted) setVenues(getAllVenues());
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="map-page">
      <VenueHeader />
      <div className="map-layout">
        <aside className="filters-panel">
          <h1>Filters</h1>
          <FilterGroup title="Venue Type" items={['Indoor/Outdoor', 'Garden Venue', 'Conference Hall', 'Corporate Hub']} checked={[0, 1]} />
          <FilterGroup title="Province" items={['Kigali City', 'Eastern Province', 'Northern Province', 'Western Province']} checked={[0, 1]} />
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
              <p>Rwanda</p>
              <h2>{isLoading ? 'Loading Smart Venues...' : `${venues.length} Smart Venues Found`}</h2>
            </div>
            <button>Recommended</button>
          </div>

          <div className="venue-results">
            {venues.map((venue) => (
              <Link className="result-card" to={`/venues/${venue.id}`} key={venue.id}>
                <div className="result-image">
                  {venue.heroMediaType === 'video' ? (
                    <video src={venue.heroImage} muted autoPlay loop playsInline />
                  ) : (
                    <img src={venue.heroImage} alt="" />
                  )}
                  <span>{venue.label}</span>
                  <button aria-label={`Save ${venue.name}`}>Save</button>
                </div>
                <div className="result-info">
                  <div>
                    <h3>{venue.name}</h3>
                    <p>{venue.location}</p>
                    <div className="tag-row">
                      {venue.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="price-block">
                    <strong>{venue.price}</strong>
                    <span>/ day</span>
                    <small>{venue.rating === 'New' ? 'New listing' : `${venue.rating} (${venue.reviews} reviews)`}</small>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <aside className="map-panel">
          <div className="map-search">
            <span>Search</span>
            <input defaultValue="Smart Event Venue" aria-label="Search map" />
          </div>
          <div className="active-search">Active Search Area<br />Kigali City Center & Surrounding Hills</div>
          <div className="abstract-map">
            {venues.slice(0, 3).map((venue, index) => (
              <span className={`pin pin-${['one', 'two', 'three'][index]}`} key={venue.id}>{venue.price.replace('RWF ', '')}</span>
            ))}
            <strong>KIGALI</strong>
            <em>Rwanda Urban Grid</em>
          </div>
          <div className="map-controls">
            <button>+</button>
            <button>-</button>
            <button>Center</button>
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
