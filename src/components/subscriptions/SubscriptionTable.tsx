import React from 'react';
import { Subscription } from '@types/subscription';
import { SubscriptionRow } from './SubscriptionRow';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionTable({ subscriptions, onEdit, onDelete }: SubscriptionTableProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="empty-state">
        <p>No subscriptions found. Add your first subscription to get started!</p>
      </div>
    );
  }

  return (
    <div className="subscription-table">
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Family Member</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Next Billing</th>
            <th>Status</th>
            <th>Reimbursable</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <SubscriptionRow
              key={subscription.id}
              subscription={subscription}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
