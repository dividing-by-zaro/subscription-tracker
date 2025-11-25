import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubscriptionRow } from './SubscriptionRow';
import { createMockSubscription, mockFamilyMembers } from '../../test/mockData';

describe('SubscriptionRow', () => {
  const mockSubscription = createMockSubscription({
    serviceName: 'Netflix',
    amount: 15.99,
    billingFrequency: 'monthly',
    nextBillingDate: new Date('2024-12-01'),
    category: 'entertainment',
    status: 'active',
    familyMember: mockFamilyMembers[0],
    reimbursable: false,
    notes: 'Test notes',
  });

  const defaultProps = {
    subscription: mockSubscription,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('should render subscription details', () => {
    render(<SubscriptionRow {...defaultProps} />);

    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
  });

  it('should render family member name', () => {
    render(<SubscriptionRow {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should show dash when no family member', () => {
    const sub = createMockSubscription({ familyMember: undefined });
    render(<SubscriptionRow subscription={sub} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should render reimbursable status', () => {
    const reimbursableSub = createMockSubscription({ reimbursable: true });
    render(<SubscriptionRow subscription={reimbursableSub} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('should render non-reimbursable status', () => {
    render(<SubscriptionRow {...defaultProps} />);
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should expand row when clicked', async () => {
    const user = userEvent.setup();
    render(<SubscriptionRow {...defaultProps} />);

    const row = screen.getByText('Netflix').closest('tr');
    await user.click(row!);

    expect(screen.getByText('Test notes')).toBeInTheDocument();
  });

  it('should show notes in expanded view', async () => {
    const user = userEvent.setup();
    render(<SubscriptionRow {...defaultProps} />);

    const row = screen.getByText('Netflix').closest('tr');
    await user.click(row!);

    expect(screen.getByText(/Notes:/)).toBeInTheDocument();
    expect(screen.getByText('Test notes')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(<SubscriptionRow {...defaultProps} onEdit={onEdit} />);

    const editButton = screen.getByLabelText('Edit');
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockSubscription);
  });

  it('should call onDelete when delete button is clicked and confirmed', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    global.confirm = vi.fn(() => true);

    render(<SubscriptionRow {...defaultProps} onDelete={onDelete} />);

    const deleteButton = screen.getByLabelText('Delete');
    await user.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledWith(mockSubscription.id);
  });

  it('should not call onDelete when delete is cancelled', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    global.confirm = vi.fn(() => false);

    render(<SubscriptionRow {...defaultProps} onDelete={onDelete} />);

    const deleteButton = screen.getByLabelText('Delete');
    await user.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('should toggle expansion state', async () => {
    const user = userEvent.setup();
    render(<SubscriptionRow {...defaultProps} />);

    const row = screen.getByText('Netflix').closest('tr');

    // Expand
    await user.click(row!);
    expect(screen.getByText('Test notes')).toBeInTheDocument();

    // Collapse
    await user.click(row!);
    expect(screen.queryByText('Test notes')).not.toBeInTheDocument();
  });

  it('should apply correct status color class', () => {
    const { container } = render(<SubscriptionRow {...defaultProps} />);
    const statusBadge = container.querySelector('.status-badge');

    expect(statusBadge).toHaveClass('status-green');
  });

  it('should show payment method in expanded view', async () => {
    const user = userEvent.setup();
    const sub = createMockSubscription({ paymentMethod: 'Visa ****1234' });
    render(<SubscriptionRow subscription={sub} onEdit={vi.fn()} onDelete={vi.fn()} />);

    const row = screen.getByText(/Mock Service/).closest('tr');
    await user.click(row!);

    expect(screen.getByText(/Payment Method:/)).toBeInTheDocument();
    expect(screen.getByText('Visa ****1234')).toBeInTheDocument();
  });

  it('should show auto-renew status in expanded view', async () => {
    const user = userEvent.setup();
    render(<SubscriptionRow {...defaultProps} />);

    const row = screen.getByText('Netflix').closest('tr');
    await user.click(row!);

    expect(screen.getByText(/Auto-renew:/)).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });
});
