import React, { useState, FormEvent } from 'react';
import { Subscription, BillingFrequency, Category, SubscriptionStatus } from '@types/subscription';

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function SubscriptionForm({ subscription, onSubmit, onCancel }: SubscriptionFormProps) {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      nextBillingDate: new Date(formData.nextBillingDate),
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
