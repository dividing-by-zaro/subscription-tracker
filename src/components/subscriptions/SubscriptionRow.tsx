import React, { useState } from 'react';
import { Subscription } from '@types/subscription';
import {
  formatCurrency,
  formatRelativeDate,
  formatAbsoluteDate,
  getBillingFrequencyLabel,
  getCategoryLabel,
  getStatusColor,
} from '@utils/formatters';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useSubscriptions } from '@contexts/SubscriptionContext';

interface SubscriptionRowProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionRow({ subscription, onEdit, onDelete }: SubscriptionRowProps) {
  const { familyMembers } = useSubscriptions();
  const [expanded, setExpanded] = useState(false);

  const statusColor = getStatusColor(subscription.status);

  return (
    <>
      <tr className="subscription-row" onClick={() => setExpanded(!expanded)}>
        <td>
          <div className="service-cell">
            {subscription.icon && <img src={subscription.icon} alt="" className="service-icon" />}
            <span className="service-name">{subscription.serviceName}</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </td>
        <td>
          {subscription.splitAllocations && subscription.splitAllocations.length > 0 ? (
            <div className="family-member">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {subscription.splitAllocations.map((allocation) => {
                  const member = familyMembers.find((m) => m.id === allocation.familyMemberId);
                  return (
                    <span key={allocation.familyMemberId} style={{ fontSize: '0.875rem' }}>
                      {member?.name} ({allocation.percentage}%)
                    </span>
                  );
                })}
              </div>
            </div>
          ) : subscription.familyMember ? (
            <div className="family-member">
              {subscription.familyMember.avatar && (
                <img
                  src={subscription.familyMember.avatar}
                  alt=""
                  className="family-member-avatar"
                />
              )}
              <span>{subscription.familyMember.name}</span>
            </div>
          ) : (
            <span className="text-muted">-</span>
          )}
        </td>
        <td>
          <span className="category-badge">{getCategoryLabel(subscription.category)}</span>
        </td>
        <td>
          <div className="amount-cell">
            <span className="amount">{formatCurrency(subscription.amount)}</span>
            <span className="frequency">{getBillingFrequencyLabel(subscription.billingFrequency)}</span>
          </div>
        </td>
        <td>
          <div className="next-billing">
            <span className="relative-date">{formatRelativeDate(subscription.nextBillingDate)}</span>
            <span className="absolute-date">{formatAbsoluteDate(subscription.nextBillingDate)}</span>
          </div>
        </td>
        <td>
          <span className={`status-badge status-${statusColor}`}>
            {subscription.status}
          </span>
        </td>
        <td>
          <span className={subscription.reimbursable ? 'reimbursable-yes' : 'reimbursable-no'}>
            {subscription.reimbursable ? 'Yes' : 'No'}
          </span>
        </td>
        <td>
          <div className="actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(subscription);
              }}
              className="action-button"
              aria-label="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this subscription?')) {
                  onDelete(subscription.id);
                }
              }}
              className="action-button"
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="subscription-details">
          <td colSpan={8}>
            <div className="details-content">
              {subscription.splitAllocations && subscription.splitAllocations.length > 0 && (
                <div className="detail-section">
                  <strong>Expense Split:</strong>
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {subscription.splitAllocations.map((allocation) => {
                      const member = familyMembers.find((m) => m.id === allocation.familyMemberId);
                      const memberAmount = (subscription.amount * allocation.percentage) / 100;
                      return (
                        <div key={allocation.familyMemberId} style={{ display: 'flex', gap: '1rem' }}>
                          <span>{member?.name}:</span>
                          <span>{allocation.percentage}% ({formatCurrency(memberAmount)})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {subscription.notes && (
                <div className="detail-section">
                  <strong>Notes:</strong> {subscription.notes}
                </div>
              )}
              {subscription.paymentMethod && (
                <div className="detail-section">
                  <strong>Payment Method:</strong> {subscription.paymentMethod}
                </div>
              )}
              <div className="detail-section">
                <strong>Auto-renew:</strong> {subscription.autoRenew ? 'Yes' : 'No'}
              </div>
              <div className="detail-section">
                <strong>Created:</strong> {formatAbsoluteDate(subscription.createdAt)}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
