import React, { useState, useMemo } from 'react';
import { Subscription } from '@types/subscription';
import { SubscriptionRow } from './SubscriptionRow';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

type SortField = 'serviceName' | 'category' | 'amount' | 'nextBillingDate' | 'status';
type SortDirection = 'asc' | 'desc' | null;

export function SubscriptionTable({ subscriptions, onEdit, onDelete }: SubscriptionTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSubscriptions = useMemo(() => {
    if (!sortField || !sortDirection) {
      return subscriptions;
    }

    return [...subscriptions].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle date fields
      if (sortField === 'nextBillingDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string fields
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [subscriptions, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown size={14} style={{ opacity: 0.3 }} />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp size={14} />
    ) : (
      <ChevronDown size={14} />
    );
  };

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
            <th
              onClick={() => handleSort('serviceName')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Service
                <SortIcon field="serviceName" />
              </div>
            </th>
            <th>Family Member</th>
            <th
              onClick={() => handleSort('category')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Category
                <SortIcon field="category" />
              </div>
            </th>
            <th
              onClick={() => handleSort('amount')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Amount
                <SortIcon field="amount" />
              </div>
            </th>
            <th
              onClick={() => handleSort('nextBillingDate')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Next Billing
                <SortIcon field="nextBillingDate" />
              </div>
            </th>
            <th
              onClick={() => handleSort('status')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Status
                <SortIcon field="status" />
              </div>
            </th>
            <th>Reimbursable</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedSubscriptions.map((subscription) => (
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
