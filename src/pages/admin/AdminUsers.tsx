import { AdminMetric, AdminShell } from './AdminShell';

const users = [
  ['Alexandra Valerius', 'Enterprise Planner', 'Verified'],
  ['Julian Thome', 'Catering Pro', 'Risk Review'],
  ['Marcus Sterling', 'Enterprise', 'Online'],
];

export default function AdminUsers() {
  return (
    <AdminShell>
      <section className="admin-content">
        <div className="security-grid">
          <article className="user-landscape"><h1>User Landscape</h1><p>Real-time overview of platform adoption and active engagement across all tiers.</p><div><strong>12,842<span>Total Registered</span></strong><strong>9,410<span>Active Now</span></strong></div></article>
          <AdminMetric title="Security Tier" value="AES-256" note="Compliant" />
          <AdminMetric title="Auth Health" value="84% MFA" tone="gold" note="+12% this month" />
        </div>
        <div className="user-management-grid">
          <section>
            <div className="card-title-row"><div><h2>System Directory</h2><p>Manage permissions and investigate user reports.</p></div><div><button>Filter</button><button className="dark">Add User</button></div></div>
            <div className="user-list">{users.map(([name, role, status]) => <article key={name}><span className="thumb" /><div><strong>{name}</strong><small>{role}</small></div><em className={status.includes('Risk') ? 'danger' : ''}>{status}</em><button>⋮</button></article>)}</div>
          </section>
          <aside className="security-side"><article><h2>Security Alerts</h2><p>Multiple Login Failures</p><p>New MFA Enrollment</p><p>Privilege Escalation</p></article><article className="integrity-card"><h2>Account Integrity</h2><strong>92%</strong><p>Verified identity threshold optimal.</p></article><div><button>Audit Policy</button><button>Export CSV</button></div></aside>
        </div>
      </section>
    </AdminShell>
  );
}
