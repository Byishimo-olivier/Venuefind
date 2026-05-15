import { Link } from 'react-router-dom';
import { ProviderShell } from './ProviderShell';

const bookings = [
  ['Mutsinzi Wedding', 'Dec 24, 2026', '250', '4,500,000 RWF', 'Confirmed'],
  ['Tech Summit Gala', 'Jan 12, 2026', '120', '2,200,000 RWF', 'Pending Deposit'],
  ['Anniversary Dinner', 'Nov 15, 2026', '45', '850,000 RWF', 'Completed'],
];

export default function OwnerBookings() {
  return (
    <ProviderShell>
      <section className="bookings-wrap">
        <div className="bookings-top"><h1>Bookings</h1><p>Curate and manage your event calendar with precision.</p><div><Link to="/owner/transactions">↧ Export Ledger</Link><Link to="/owner/register" className="gold">⊕ Manual Entry</Link></div></div>
        <div className="booking-filter-tabs"><button className="active">All Bookings</button><button>Confirmed</button><button>Pending Deposit</button><button>Completed</button><span>⌄ More Filters</span></div>
        <section className="transaction-table-card booking-directory">
          <table><thead><tr><th>Client & Event</th><th>Date & Time</th><th>Guests</th><th>Total Value</th><th>Status</th><th>Actions</th></tr></thead><tbody>{bookings.map(([event, date, guests, value, status]) => <tr key={event}><td><strong>{event}</strong><span>Jean-Luc Mutsinzi</span></td><td>{date}<span>19:00 - 02:00</span></td><td>{guests}</td><td>{value}</td><td><em className={status.includes('Pending') ? 'pending' : status.toLowerCase()}>{status}</em></td><td>⋯</td></tr>)}</tbody></table>
        </section>
        <div className="booking-stats"><article className="dark"><span>Upcoming Revenue</span><strong>12,450,000 RWF</strong><small>↗ +12% from last month</small></article><article><span>Confirmed Guests</span><strong>1,840</strong><i><b /></i></article><article className="gold"><span>Active Capacity</span><strong>88%</strong><small>Optimize Calendar</small></article></div>
      </section>
    </ProviderShell>
  );
}
