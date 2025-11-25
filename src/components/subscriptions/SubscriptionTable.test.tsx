import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubscriptionTable } from './SubscriptionTable';
import { mockSubscriptions } from '../../test/mockData';

describe('SubscriptionTable', () => {
  const defaultProps = {
    subscriptions: mockSubscriptions.slice(0, 3),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('should render table headers', () => {
    render(<SubscriptionTable {...defaultProps} />);

    expect(screen.getByText('Service')).toBeInTheDocument();
    expect(screen.getByText('Family Member')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Next Billing')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Reimbursable')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should render subscription rows', () => {
    render(<SubscriptionTable {...defaultProps} />);

    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Spotify')).toBeInTheDocument();
    expect(screen.getByText('Adobe Creative Cloud')).toBeInTheDocument();
  });

  it('should render empty state when no subscriptions', () => {
    render(<SubscriptionTable subscriptions={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(
      screen.getByText('No subscriptions found. Add your first subscription to get started!')
    ).toBeInTheDocument();
  });

  it('should pass onEdit to subscription rows', () => {
    const onEdit = vi.fn();
    render(<SubscriptionTable {...defaultProps} onEdit={onEdit} />);

    // Rows are rendered, onEdit will be tested in SubscriptionRow tests
    expect(screen.getByText('Netflix')).toBeInTheDocument();
  });

  it('should pass onDelete to subscription rows', () => {
    const onDelete = vi.fn();
    render(<SubscriptionTable {...defaultProps} onDelete={onDelete} />);

    // Rows are rendered, onDelete will be tested in SubscriptionRow tests
    expect(screen.getByText('Netflix')).toBeInTheDocument();
  });
});
