import { AdminShell } from './AdminShell';
import { useEffect, useState } from 'react';
import { formatRwf, getAdminOverview, type AdminOverview } from '../../services/admin';

export default function AdminReports() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('revenue');
  const [exportFormat, setExportFormat] = useState('json');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getAdminOverview()
      .then((data) => {
        if (!isMounted) return;
        setOverview(data);
        setError('');
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load report data');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    
    return () => {
      isMounted = false;
    };
  }, []);

  const generateReportContent = () => {
    if (!overview) return null;
    
    let content = '';
    const today = new Date().toLocaleDateString();
    
    if (reportType === 'revenue') {
      content = `
REVENUE ANALYSIS REPORT
Generated: ${today}

SUMMARY
Total Platform Revenue: ${formatRwf(overview.summary.totalRevenue)}
Paid Revenue: ${formatRwf(overview.summary.paidRevenue)}
Platform Commission: ${formatRwf(overview.summary.commission)}
Pending Payouts: ${formatRwf(overview.summary.pendingPayouts)}

METRICS
Total Bookings: ${overview.summary.totalBookings}
Confirmed Bookings: ${overview.summary.confirmedBookings}
Conversion Rate: ${overview.summary.conversionRate}%

TOP VENUES BY REVENUE
${overview.topVenues.slice(0, 10).map((v, i) => 
  `${i + 1}. ${v.name} - ${formatRwf(v.revenue)} (${v.bookingCount} bookings)`
).join('\n')}

PROVINCIAL BREAKDOWN
${overview.provinceSummary.map(p => 
  `${p.province}: ${p.venues} venues, ${p.bookings} bookings, ${formatRwf(p.revenue)}`
).join('\n')}
      `;
    } else if (reportType === 'performance') {
      const avgBookings = overview.topVenues.length > 0 
        ? Math.round(overview.topVenues.reduce((sum, v) => sum + v.bookingCount, 0) / overview.topVenues.length)
        : 0;
      content = `
PROVIDER PERFORMANCE REPORT
Generated: ${today}

OVERVIEW
Total Venues: ${overview.summary.totalVenues}
Active Venues: ${overview.summary.activeVenues}
Pending Review: ${overview.summary.pendingVenues}

PERFORMANCE METRICS
Average Bookings per Venue: ${avgBookings}
Total Bookings: ${overview.summary.totalBookings}
Confirmation Rate: ${overview.summary.conversionRate}%

TOP PERFORMING VENUES
${overview.topVenues.slice(0, 10).map((v, i) => 
  `${i + 1}. ${v.name} (${v.location})
   Bookings: ${v.bookingCount}
   Revenue: ${formatRwf(v.revenue)}`
).join('\n\n')}
      `;
    } else {
      content = `
MARKET DEMAND REPORT
Generated: ${today}

DEMAND OVERVIEW
Total Users: ${overview.summary.totalUsers}
Total Bookings: ${overview.summary.totalBookings}
Confirmed Bookings: ${overview.summary.confirmedBookings}
Conversion Rate: ${overview.summary.conversionRate}%

ACTIVE VENUES
Total: ${overview.summary.activeVenues}
Pending: ${overview.summary.pendingVenues}

REGIONAL DEMAND
${overview.provinceSummary.sort((a, b) => b.bookings - a.bookings).map(p =>
  `${p.province}: ${p.bookings} bookings from ${p.venues} venues`
).join('\n')}

GROWTH METRICS
Active Venues Percentage: ${Math.round((overview.summary.activeVenues / Math.max(overview.summary.totalVenues, 1)) * 100)}%
Confirmed Bookings Rate: ${overview.summary.conversionRate}%
      `;
    }
    
    return content;
  };

  const generatePDF = () => {
    const content = generateReportContent();
    if (!content) return;

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;
    const lineHeight = 5;
    let yPos = margin;

    const lines = content.trim().split('\n');
    const pdfLines: Array<{ text: string; y: number }> = [];

    lines.forEach((line) => {
      pdfLines.push({ text: line, y: yPos });
      yPos += lineHeight;
      if (yPos > pageHeight - margin) {
        yPos = margin;
      }
    });

    // Create a simple canvas-based PDF (using basic text rendering)
    const canvas = document.createElement('canvas');
    canvas.width = pageWidth * 4;
    canvas.height = pageHeight * 4;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      
      let currentY = 30;
      lines.forEach((line) => {
        if (currentY > canvas.height - 30) {
          currentY = 30;
        }
        ctx.fillText(line, 30, currentY);
        currentY += 16;
      });
    }

    // Download as image/text instead of PDF (simpler fallback)
    const textBlob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(textBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report_${reportType}_${new Date().toISOString().split('T')[0]}.pdf.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = async () => {
    if (!overview) return;
    setIsGenerating(true);

    try {
      const data = {
        type: reportType,
        generatedAt: new Date().toISOString(),
        summary: overview.summary,
        topVenues: overview.topVenues,
        provinceSummary: overview.provinceSummary,
      };

      if (exportFormat === 'json') {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Report_${reportType}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'csv') {
        const csv = [
          'Report Type,Value',
          `Type,${reportType}`,
          `Generated,${new Date().toISOString()}`,
          '',
          'SUMMARY',
          `Total Revenue,${data.summary.totalRevenue}`,
          `Active Venues,${data.summary.activeVenues}`,
          `Total Bookings,${data.summary.totalBookings}`,
          `Conversion Rate,${data.summary.conversionRate}%`,
          '',
          'TOP VENUES',
          ...data.topVenues.slice(0, 10).map(v => `${v.name},"${v.location}",${v.bookingCount},${v.revenue}`),
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'pdf') {
        generatePDF();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportTitle = () => {
    if (reportType === 'revenue') return 'Revenue Analysis';
    if (reportType === 'performance') return 'Provider Performance';
    return 'Market Demand';
  };

  return (
    <AdminShell mode="concierge">
      <section className="admin-content report-content">
        <div className="admin-heading wide">
          <div>
            <h1>Custom Report Builder</h1>
            <p>{error || 'Synthesize complex platform data into actionable editorial insights.'}</p>
          </div>
          <aside>System Status: <strong>{loading ? 'Loading...' : 'Engine Online'}</strong></aside>
        </div>

        {loading ? (
          <p>Loading report data...</p>
        ) : overview ? (
          <div className="report-grid">
            <section className="report-config">
              <h2>Report Configuration</h2>
              <div className="report-types">
                <button 
                  className={reportType === 'revenue' ? 'active' : ''} 
                  onClick={() => setReportType('revenue')}
                >
                  Revenue Analysis
                </button>
                <button 
                  className={reportType === 'performance' ? 'active' : ''} 
                  onClick={() => setReportType('performance')}
                >
                  Provider Performance
                </button>
                <button 
                  className={reportType === 'demand' ? 'active' : ''} 
                  onClick={() => setReportType('demand')}
                >
                  Market Demand
                </button>
              </div>
              <div className="report-filters">
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                <select>
                  <option>Category: All Venues ({overview.summary.totalVenues})</option>
                </select>
                <select>
                  <option>Province: All ({overview.provinceSummary.length})</option>
                  {overview.provinceSummary.map((prov) => (
                    <option key={prov.province}>{prov.province} ({prov.venues})</option>
                  ))}
                </select>
                <select>
                  <option>Status: Active ({overview.summary.activeVenues})</option>
                </select>
              </div>
            </section>

            <aside className="recent-exports">
              <h2>Report Summary</h2>
              <p>✓ {getReportTitle()}</p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(45,45,45,0.65)', marginTop: '8px' }}>
                Format: <strong>{exportFormat.toUpperCase()}</strong>
              </p>
              <button onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Download Report'}
              </button>
              <p style={{ fontSize: '0.85rem', color: 'rgba(45,45,45,0.65)', marginTop: '12px' }}>
                Generated: {new Date().toLocaleDateString()}
              </p>
            </aside>

            <section className="export-format">
              <h2>Export Format</h2>
              <button 
                className={exportFormat === 'json' ? 'active' : ''} 
                onClick={() => setExportFormat('json')}
              >
                JSON
              </button>
              <button 
                className={exportFormat === 'csv' ? 'active' : ''} 
                onClick={() => setExportFormat('csv')}
              >
                CSV
              </button>
              <button 
                className={exportFormat === 'pdf' ? 'active' : ''} 
                onClick={() => setExportFormat('pdf')}
              >
                PDF
              </button>
            </section>

            <section className="finalize-report">
              <h2>Finalize Custom Report</h2>
              <p>
                {reportType === 'revenue' && `Total Revenue: ${formatRwf(overview.summary.totalRevenue)} | Paid: ${formatRwf(overview.summary.paidRevenue)}`}
                {reportType === 'performance' && `Top Venues: ${overview.topVenues.length} | Avg Bookings: ${Math.round(overview.topVenues.reduce((sum, v) => sum + v.bookingCount, 0) / Math.max(overview.topVenues.length, 1))}`}
                {reportType === 'demand' && `Conversion Rate: ${overview.summary.conversionRate}% | Confirmed: ${overview.summary.confirmedBookings}/${overview.summary.totalBookings}`}
              </p>
              <button onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </button>
            </section>
          </div>
        ) : null}

        {overview && (
          <section className="impact-preview">
            <h2>Global Impact Preview</h2>
            <div>
              <article>
                <strong>{formatRwf(overview.summary.totalRevenue)}</strong>
                <p>Platform Throughput</p>
              </article>
              <article>
                <strong>{overview.summary.totalVenues}</strong>
                <p>Active Venues</p>
              </article>
              <article>
                <strong>{overview.summary.totalUsers}</strong>
                <p>Users This Month</p>
              </article>
            </div>
          </section>
        )}
      </section>
    </AdminShell>
  );
}
