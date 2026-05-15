import { AdminShell } from './AdminShell';

export default function AdminReports() {
  return (
    <AdminShell mode="concierge">
      <section className="admin-content report-content">
        <div className="admin-heading wide"><div><h1>Custom Report Builder</h1><p>Synthesize complex platform data into actionable editorial insights.</p></div><aside>System Status: <strong>Engine Online</strong></aside></div>
        <div className="report-grid">
          <section className="report-config"><h2>Report Configuration</h2><div className="report-types"><button className="active">Revenue Analysis</button><button>Growth Projections</button><button>Provider Performance</button></div><div className="report-filters"><input defaultValue="10/24/2026" /><input defaultValue="10/31/2026" /><select><option>Category: All Venues</option></select><select><option>Province: North</option></select><select><option>Status: Active</option></select></div></section>
          <aside className="recent-exports"><h2>Recent Exports</h2>{['Revenue_Q3_Final.pdf', 'Growth_Forecast_2026.csv', 'Venue_Yield_Sept.xlsx'].map((file) => <p key={file}>✓ {file}<button>Download Report</button></p>)}</aside>
          <section className="export-format"><h2>Export Format</h2><button>PDF</button><button>CSV</button><button>Excel</button></section>
          <section className="finalize-report"><h2>Finalize Custom Report</h2><p>Review parameters before generating your executive summary.</p><button>Generate Report</button></section>
        </div>
        <section className="impact-preview"><h2>Global Impact Preview</h2><div><article><strong>$2.4M</strong><p>Platform throughput</p></article><article><strong>1,248</strong><p>Active venues</p></article><article><strong>14.2K</strong><p>Users this month</p></article></div></section>
      </section>
    </AdminShell>
  );
}
