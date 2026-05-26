import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Venue } from '../../data/venues';
import { getAuthUser } from '../../services/api';
import { addFavoriteVenue, listFavoriteVenueIds, removeFavoriteVenue } from '../../services/favorites';
import { listVenues } from '../../services/venues';
import { FavoriteButton } from './FavoriteButton';
import { VenueAssistant } from './VenueAssistant';
import { VenueHeader } from './VenueHome';
import './venues.css';

const venueTypeOptions = ['Indoor/Outdoor', 'Garden Venue', 'Conference Hall', 'Corporate Hub'];
const provinceOptions = ['Kigali City', 'Eastern Province', 'Northern Province', 'Western Province'];
const capacityOptions = ['Any Capacity', '50 - 200 Guests', '200 - 500 Guests', '500+ Guests'];

function parseCapacity(value: string) {
  const numbers = value.match(/\d+/g);
  if (!numbers?.length) return 0;
  return Number(numbers[numbers.length - 1]);
}

function venueMatchesQuery(venue: Venue, query: string) {
  const terms = query
    .toLowerCase()
    .split(/[\s,]+/)
    .map((term) => term.trim())
    .filter(Boolean)
    .filter((term) => term !== 'rwanda');

  if (terms.length === 0) return true;

  const searchableText = [
    venue.name,
    venue.location,
    venue.province,
    venue.category,
    venue.label,
    venue.setting,
    venue.description,
    ...(venue.tags || []),
  ].join(' ').toLowerCase();

  return terms.every((term) => searchableText.includes(term));
}

function venueMatchesType(venue: Venue, selectedTypes: string[]) {
  if (selectedTypes.length === 0) return true;
  const text = [venue.category, venue.label, venue.setting, ...(venue.tags || [])].join(' ').toLowerCase();
  return selectedTypes.some((type) => text.includes(type.toLowerCase()));
}

function venueMatchesCapacity(venue: Venue, selectedCapacity: string) {
  if (selectedCapacity === 'Any Capacity') return true;
  const capacity = parseCapacity(venue.capacity);
  if (selectedCapacity === '50 - 200 Guests') return capacity >= 50 && capacity <= 200;
  if (selectedCapacity === '200 - 500 Guests') return capacity >= 200 && capacity <= 500;
  if (selectedCapacity === '500+ Guests') return capacity >= 500;
  return true;
}

export default function VenueSearchMap() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [favoriteVenueIds, setFavoriteVenueIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('location') || '');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState('Any Capacity');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    listVenues()
      .then((items) => {
        if (!isMounted) return;
        setVenues(items);
        setError('');
      })
      .catch((loadError) => {
        if (!isMounted) return;
        setVenues([]);
        setError(loadError instanceof Error ? loadError.message : 'Could not load backend venues.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!getAuthUser()) return;
    let isMounted = true;
    listFavoriteVenueIds()
      .then((ids) => {
        if (isMounted) setFavoriteVenueIds(ids);
      })
      .catch(() => {
        if (isMounted) setFavoriteVenueIds([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSearchTerm(searchParams.get('location') || '');
  }, [searchParams]);

  const filteredVenues = venues.filter((venue) => {
    const matchesProvince = selectedProvinces.length === 0 || selectedProvinces.includes(venue.province);
    return (
      venueMatchesQuery(venue, searchTerm) &&
      venueMatchesType(venue, selectedTypes) &&
      matchesProvince &&
      venueMatchesCapacity(venue, selectedCapacity)
    );
  });

  const toggleType = (type: string) => {
    setSelectedTypes((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type]);
  };

  const toggleProvince = (province: string) => {
    setSelectedProvinces((current) => current.includes(province) ? current.filter((item) => item !== province) : [...current, province]);
  };

  const applyFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) nextParams.set('location', searchTerm.trim());
    else nextParams.delete('location');
    setSearchParams(nextParams);
  };

  const toggleFavorite = async (venueId: string) => {
    if (!getAuthUser()) {
      navigate(`/login?redirect=${encodeURIComponent('/venues/search')}`);
      return;
    }

    const isSaved = favoriteVenueIds.includes(venueId);
    setFavoriteVenueIds((current) => isSaved ? current.filter((id) => id !== venueId) : [...current, venueId]);
    try {
      const ids = isSaved ? await removeFavoriteVenue(venueId) : await addFavoriteVenue(venueId);
      setFavoriteVenueIds(ids);
    } catch (_error) {
      setFavoriteVenueIds((current) => isSaved ? [...current, venueId] : current.filter((id) => id !== venueId));
    }
  };

  return (
    <main className="map-page">
      <VenueHeader />
      <div className="map-layout">
        <aside className="filters-panel">
          <h1>Filters</h1>
          <FilterGroup title="Venue Type" items={venueTypeOptions} selected={selectedTypes} onToggle={toggleType} />
          <FilterGroup title="Province" items={provinceOptions} selected={selectedProvinces} onToggle={toggleProvince} />
          <label className="select-filter">
            <span>Capacity</span>
            <select value={selectedCapacity} onChange={(event) => setSelectedCapacity(event.target.value)}>
              {capacityOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <button className="apply-filters" onClick={applyFilters}>Apply Filters</button>
        </aside>

        <section className="results-panel">
          <div className="results-heading">
            <div>
              <p>{searchTerm.trim() || 'Rwanda'}</p>
              <h2>{isLoading ? 'Loading Smart Venues...' : `${filteredVenues.length} Smart Venues Found`}</h2>
            </div>
            <button>Recommended</button>
          </div>

          <div className="venue-results">
            {filteredVenues.map((venue) => (
              <Link className="result-card" to={`/venues/${venue.id}`} key={venue.id}>
                <div className="result-image">
                  {venue.heroMediaType === 'video' ? (
                    <video src={venue.heroImage} muted autoPlay loop playsInline />
                  ) : (
                    <img src={venue.heroImage} alt="" />
                  )}
                  <span>{venue.label}</span>
                  <FavoriteButton isSaved={favoriteVenueIds.includes(venue.id)} label={venue.name} onToggle={() => toggleFavorite(venue.id)} />
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
            {!isLoading && filteredVenues.length === 0 && (
              <p className="empty-venues">{error || 'No venues match those filters yet.'}</p>
            )}
          </div>
        </section>

        <aside className="map-panel">
          <div className="map-search">
            <span>Search</span>
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} aria-label="Search map" placeholder="Search venues" />
          </div>
          <div className="active-search">Active Search Area<br />{searchTerm.trim() || 'Rwanda'}</div>
          <div className="abstract-map">
            {filteredVenues.slice(0, 3).map((venue, index) => (
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
      <VenueAssistant venues={filteredVenues.length > 0 ? filteredVenues : venues} />
    </main>
  );
}

function FilterGroup({ title, items, selected, onToggle }: { title: string; items: string[]; selected: string[]; onToggle: (item: string) => void }) {
  return (
    <fieldset className="filter-group">
      <legend>{title}</legend>
      {items.map((item) => (
        <label key={item}>
          <input type="checkbox" checked={selected.includes(item)} onChange={() => onToggle(item)} />
          {item}
        </label>
      ))}
    </fieldset>
  );
}
