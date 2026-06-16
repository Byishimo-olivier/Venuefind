import { useState, useEffect } from 'react';
import { AdminShell } from './AdminShell';
import { apiRequest } from '../../services/api';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
}

export default function AdminSubscriptions() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Plan>>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/subscriptions/admin/plans', { method: 'GET', auth: true });
      setPlans(response.plans || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (plan: Plan) => {
    setEditingPlan(plan.id);
    setEditForm({ ...plan });
    setSuccessMessage('');
  };

  const cancelEdit = () => {
    setEditingPlan(null);
    setEditForm({});
  };

  const savePlan = async () => {
    if (!editingPlan) return;

    try {
      setSaving(true);
      setError('');
      await apiRequest(`/api/subscriptions/admin/plans/${editingPlan}`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify({
          price: Number(editForm.price),
          name: editForm.name,
          description: editForm.description,
          features: editForm.features,
        }),
      });
      setSuccessMessage(`Plan "${editForm.name}" updated successfully!`);
      setEditingPlan(null);
      setEditForm({});
      await fetchPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell mode="concierge">
      <section className="admin-content settings-content">
        <h1>Subscription Plans</h1>
        <p>Manage subscription plan prices and features available to venue owners.</p>

        {error && (
          <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#fee', borderRadius: '4px', color: '#c33' }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#efe', borderRadius: '4px', color: '#3c3' }}>
            {successMessage}
          </div>
        )}

        {loading ? (
          <p>Loading plans...</p>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: editingPlan === plan.id ? '#f9f9f9' : '#fff',
                }}
              >
                {editingPlan === plan.id ? (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div>
                      <label>Plan Name</label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>

                    <div>
                      <label>Price (RWF)</label>
                      <input
                        type="number"
                        value={editForm.price || 0}
                        onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>

                    <div>
                      <label>Description</label>
                      <input
                        type="text"
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button
                        onClick={savePlan}
                        disabled={saving}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: saving ? 'not-allowed' : 'pointer',
                          opacity: saving ? 0.6 : 1,
                        }}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={saving}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#999',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0' }}>{plan.name}</h3>
                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>{plan.description}</p>
                        <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
                          {plan.currency} {plan.price.toLocaleString()}
                          <span style={{ fontSize: '14px', color: '#999' }}>/month</span>
                        </p>
                      </div>
                      <button
                        onClick={() => startEdit(plan)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                    </div>

                    <div>
                      <strong>Features:</strong>
                      <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                        {plan.features.map((feature, idx) => (
                          <li key={idx} style={{ fontSize: '14px', marginBottom: '4px' }}>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
