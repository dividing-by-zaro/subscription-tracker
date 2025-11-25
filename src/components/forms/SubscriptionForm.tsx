import React, { useState, FormEvent } from 'react';
import { Subscription, BillingFrequency, Category, SubscriptionStatus, SplitAllocation } from '@types/subscription';
import { useSubscriptions } from '@contexts/SubscriptionContext';
import { X, Plus } from 'lucide-react';

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function SubscriptionForm({ subscription, onSubmit, onCancel }: SubscriptionFormProps) {
  const { familyMembers, addFamilyMember } = useSubscriptions();
  const [formData, setFormData] = useState({
    serviceName: subscription?.serviceName || '',
    amount: subscription?.amount || 0,
    billingFrequency: subscription?.billingFrequency || ('monthly' as BillingFrequency),
    nextBillingDate: subscription?.nextBillingDate
      ? new Date(subscription.nextBillingDate).toISOString().split('T')[0]
      : '',
    category: subscription?.category || ('other' as Category),
    status: subscription?.status || ('active' as SubscriptionStatus),
    autoRenew: subscription?.autoRenew ?? true,
    reimbursable: subscription?.reimbursable ?? false,
    paymentMethod: subscription?.paymentMethod || '',
    notes: subscription?.notes || '',
    icon: subscription?.icon || '',
    syncEnabled: subscription?.syncEnabled ?? false,
  });

  const [splitAllocations, setSplitAllocations] = useState<SplitAllocation[]>(
    subscription?.splitAllocations || []
  );
  const [newMemberName, setNewMemberName] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addFamilyMember(newMemberName.trim());
      setNewMemberName('');
      setShowAddMember(false);
    }
  };

  const handleAddSplitAllocation = (familyMemberId: string) => {
    const existingAllocation = splitAllocations.find(
      (a) => a.familyMemberId === familyMemberId
    );

    if (existingAllocation) {
      return;
    }

    setSplitAllocations([...splitAllocations, { familyMemberId, percentage: 0 }]);
  };

  const handleRemoveSplitAllocation = (familyMemberId: string) => {
    setSplitAllocations(splitAllocations.filter((a) => a.familyMemberId !== familyMemberId));
  };

  const handleUpdatePercentage = (familyMemberId: string, percentage: number) => {
    setSplitAllocations(
      splitAllocations.map((a) =>
        a.familyMemberId === familyMemberId ? { ...a, percentage } : a
      )
    );
  };

  const totalPercentage = splitAllocations.reduce((sum, a) => sum + a.percentage, 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (splitAllocations.length > 0 && Math.abs(totalPercentage - 100) > 0.01) {
      alert('Split allocations must total 100%');
      return;
    }

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      nextBillingDate: new Date(formData.nextBillingDate),
      splitAllocations: splitAllocations.length > 0 ? splitAllocations : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="subscription-form">
      <h2>{subscription ? 'Edit Subscription' : 'Add Subscription'}</h2>

      <div className="form-group">
        <label htmlFor="serviceName">Service Name *</label>
        <input
          type="text"
          id="serviceName"
          value={formData.serviceName}
          onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="billingFrequency">Billing Frequency *</label>
          <select
            id="billingFrequency"
            value={formData.billingFrequency}
            onChange={(e) =>
              setFormData({ ...formData, billingFrequency: e.target.value as BillingFrequency })
            }
            required
          >
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
            <option value="quarterly">Quarterly</option>
            <option value="weekly">Weekly</option>
            <option value="one-time">One-time</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nextBillingDate">Next Billing Date *</label>
        <input
          type="date"
          id="nextBillingDate"
          value={formData.nextBillingDate}
          onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
          >
            <option value="entertainment">Entertainment</option>
            <option value="utilities">Utilities</option>
            <option value="productivity">Productivity</option>
            <option value="health-fitness">Health & Fitness</option>
            <option value="education">Education</option>
            <option value="shopping">Shopping</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as SubscriptionStatus })}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
            <option value="trial">Trial</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="paymentMethod">Payment Method</label>
        <input
          type="text"
          id="paymentMethod"
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          placeholder="e.g., Visa ****1234"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-checkboxes">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.autoRenew}
            onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
          />
          <span>Auto-renew</span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.reimbursable}
            onChange={(e) => setFormData({ ...formData, reimbursable: e.target.checked })}
          />
          <span>Reimbursable</span>
        </label>
      </div>

      <div className="form-group">
        <label>Shared Expense Split</label>
        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
          Split this expense between family members. Leave empty if not shared.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          {familyMembers.map((member) => {
            const allocation = splitAllocations.find((a) => a.familyMemberId === member.id);
            return (
              <button
                key={member.id}
                type="button"
                onClick={() =>
                  allocation
                    ? handleRemoveSplitAllocation(member.id)
                    : handleAddSplitAllocation(member.id)
                }
                style={{
                  padding: '0.5rem 1rem',
                  border: allocation ? '2px solid #4f46e5' : '1px solid #ddd',
                  borderRadius: '0.5rem',
                  background: allocation ? '#eef2ff' : 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                {member.name}
              </button>
            );
          })}

          {!showAddMember && (
            <button
              type="button"
              onClick={() => setShowAddMember(true)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px dashed #4f46e5',
                borderRadius: '0.5rem',
                background: 'transparent',
                color: '#4f46e5',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.875rem',
              }}
            >
              <Plus size={16} />
              Add Member
            </button>
          )}
        </div>

        {showAddMember && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Member name"
              style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
            />
            <button
              type="button"
              onClick={handleAddMember}
              style={{
                padding: '0.5rem 1rem',
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddMember(false);
                setNewMemberName('');
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {splitAllocations.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
              Allocation percentages:
            </div>
            {splitAllocations.map((allocation) => {
              const member = familyMembers.find((m) => m.id === allocation.familyMemberId);
              return (
                <div
                  key={allocation.familyMemberId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span style={{ flex: 1 }}>{member?.name}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={allocation.percentage}
                    onChange={(e) =>
                      handleUpdatePercentage(allocation.familyMemberId, parseFloat(e.target.value) || 0)
                    }
                    style={{
                      width: '80px',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '0.25rem',
                    }}
                  />
                  <span>%</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSplitAllocation(allocation.familyMemberId)}
                    style={{
                      padding: '0.25rem',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ef4444',
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
              );
            })}
            <div
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                background: totalPercentage === 100 ? '#d1fae5' : '#fee2e2',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                color: totalPercentage === 100 ? '#065f46' : '#991b1b',
              }}
            >
              Total: {totalPercentage.toFixed(2)}%
              {totalPercentage !== 100 && ' (must equal 100%)'}
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {subscription ? 'Update' : 'Add'} Subscription
        </button>
      </div>
    </form>
  );
}
