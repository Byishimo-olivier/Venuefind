import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ProviderShell } from './ProviderShell';
import { exportCsv, filterVenues, useOwnerData, useOwnerSearch, useOwnerSummary, venueExportRows } from './ownerData';

const feedback = [
  {
    author: 'Sarah Jenkins',
    body: 'The Grand Ballroom was absolutely stunning for our annual company gala. However, we did experience a slight delay during cocktail service.',
    rating: '4/5',
    title: 'Beautiful venue, slight delay in service',
    urgent: true,
  },
  {
    author: 'Michael T.',
    body: 'The attention to detail was incredible, and the food was spectacular.',
    rating: '5/5',
    title: 'Flawless execution from start to finish',
    urgent: false,
  },
];

export default function OwnerReputation() {
  const { venues, bookings } = useOwnerData();
  const { query } = useOwnerSearch();
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [publishedReply, setPublishedReply] = useState('');
  const filteredVenues = filterVenues(venues, query);
  const summary = useOwnerSummary(filteredVenues, bookings);
  const filteredFeedback = feedback.filter((item) => {
    if (showUrgentOnly && !item.urgent) return false;
    if (!query.trim()) return true;
    return [item.author, item.title, item.body].some((value) => value.toLowerCase().includes(query.toLowerCase()));
  });

  return (
    <ProviderShell compact>
      <section className="reputation-wrap">
        <h1>Reputation Management</h1>
        <p>Monitor your standing and engage with clients.</p>
        <div className="reputation-top">
          <article className="standing-card"><span>Venue Global Standing</span><strong>{summary.totalBookings ? '4.9' : 'New'} <em>/5.0</em></strong><p>{summary.totalBookings} backend bookings · {filteredVenues.length} listed venues · {summary.conversionRate}% confirmed</p><b>{summary.pendingBookings} replies or deposits to review</b></article>
          <aside className="accolades-card"><h2>Earned Accolades</h2><p>Verified Host<span>{summary.activeVenues} active listings</span></p><p>Booking Ready<span>{summary.upcomingBookings} active reservations</span></p><button type="button" onClick={() => exportCsv('owner-reputation-venues', venueExportRows(filteredVenues))}>Export Standing</button><Link to="/venues/search">View Public Listings</Link></aside>
        </div>
        <section className="needs-attention">
          <div className="section-title-row"><div><h2>Needs Attention</h2><p>Recent feedback pending your response.</p></div><button type="button" onClick={() => setShowUrgentOnly((value) => !value)}>{showUrgentOnly ? 'Show All' : 'Urgent Only'}</button></div>
          <div className="attention-grid">
            {filteredFeedback.map((item) => (
              <article className={`attention-card ${item.urgent ? 'urgent' : ''}`} key={item.title}>
                <header><b>{item.author}</b><span>{item.rating}</span></header>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                {item.urgent ? <textarea placeholder="Write your response here..." value={publishedReply} onChange={(event) => setPublishedReply(event.target.value)} /> : null}
                <footer><small>{item.urgent ? 'AI Assist Available' : 'Quick reply available'}</small><button type="button" onClick={() => setPublishedReply(item.urgent ? publishedReply || 'Thank you for the feedback. We will tighten service timing for the next event.' : 'Thank you for celebrating with us.')}>{item.urgent ? 'Publish Reply' : 'Draft Quick Reply'}</button></footer>
              </article>
            ))}
            {filteredFeedback.length === 0 && <article className="attention-card"><h3>No matching feedback</h3><p>Clear search or filters to review more feedback.</p></article>}
          </div>
        </section>
      </section>
    </ProviderShell>
  );
}
