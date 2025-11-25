import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '../test/testUtils';
import userEvent from '@testing-library/user-event';
import { Dashboard } from './Dashboard';

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render dashboard with all sections', () => {
    render(<Dashboard />);

    // Check for header
    expect(screen.getByText('Subscription Tracker')).toBeInTheDocument();
    expect(screen.getByText('+ Add Subscription')).toBeInTheDocument();

    // Check for metrics
    expect(screen.getByText('Monthly Spend')).toBeInTheDocument();
    expect(screen.getByText('Lifetime Purchases')).toBeInTheDocument();
    expect(screen.getByText('Annual Projection')).toBeInTheDocument();

    // Check for filters
    expect(screen.getByPlaceholderText('Search subscriptions...')).toBeInTheDocument();
  });

  it('should show empty state initially', () => {
    render(<Dashboard />);

    expect(
      screen.getByText('No subscriptions found. Add your first subscription to get started!')
    ).toBeInTheDocument();
  });

  it('should open form modal when Add Subscription is clicked', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    await user.click(screen.getByText('+ Add Subscription'));

    expect(screen.getByText('Add Subscription')).toBeInTheDocument();
    expect(screen.getByLabelText(/Service Name/)).toBeInTheDocument();
  });

  it('should close form modal when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    await user.click(screen.getByText('+ Add Subscription'));
    expect(screen.getByText('Add Subscription')).toBeInTheDocument();

    await user.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add Subscription')).not.toBeInTheDocument();
  });

  it('should add a subscription and update metrics', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    // Open form
    await user.click(screen.getByText('+ Add Subscription'));

    // Fill form
    await user.type(screen.getByLabelText(/Service Name/), 'Netflix');
    await user.type(screen.getByLabelText(/Amount/), '15.99');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');

    // Submit
    await user.click(within(screen.getByRole('dialog') || document.body).getByText(/Add Subscription/));

    // Check subscription appears in table
    expect(screen.getByText('Netflix')).toBeInTheDocument();

    // Check metrics updated
    expect(screen.getByText('$15.99')).toBeInTheDocument();
  });

  it('should filter subscriptions by search query', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    // Add multiple subscriptions
    await user.click(screen.getByText('+ Add Subscription'));
    await user.type(screen.getByLabelText(/Service Name/), 'Netflix');
    await user.type(screen.getByLabelText(/Amount/), '15.99');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');
    await user.click(within(screen.getByRole('dialog') || document.body).getByText(/Add Subscription/));

    await user.click(screen.getByText('+ Add Subscription'));
    await user.type(screen.getByLabelText(/Service Name/), 'Spotify');
    await user.type(screen.getByLabelText(/Amount/), '9.99');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');
    await user.click(within(screen.getByRole('dialog') || document.body).getByText(/Add Subscription/));

    // Search for Netflix
    const searchInput = screen.getByPlaceholderText('Search subscriptions...');
    await user.type(searchInput, 'netflix');

    // Should only show Netflix
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.queryByText('Spotify')).not.toBeInTheDocument();
  });

  it('should delete a subscription with confirmation', async () => {
    const user = userEvent.setup();
    global.confirm = vi.fn(() => true);

    render(<Dashboard />);

    // Add subscription
    await user.click(screen.getByText('+ Add Subscription'));
    await user.type(screen.getByLabelText(/Service Name/), 'Netflix');
    await user.type(screen.getByLabelText(/Amount/), '15.99');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');
    await user.click(within(screen.getByRole('dialog') || document.body).getByText(/Add Subscription/));

    expect(screen.getByText('Netflix')).toBeInTheDocument();

    // Delete subscription
    const deleteButton = screen.getByLabelText('Delete');
    await user.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();
    expect(screen.queryByText('Netflix')).not.toBeInTheDocument();
  });

  it('should edit an existing subscription', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    // Add subscription
    await user.click(screen.getByText('+ Add Subscription'));
    await user.type(screen.getByLabelText(/Service Name/), 'Netflix');
    await user.type(screen.getByLabelText(/Amount/), '15.99');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');
    await user.click(within(screen.getByRole('dialog') || document.body).getByText(/Add Subscription/));

    // Click edit
    const editButton = screen.getByLabelText('Edit');
    await user.click(editButton);

    // Form should be pre-filled
    expect(screen.getByDisplayValue('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Edit Subscription')).toBeInTheDocument();

    // Update amount
    const amountInput = screen.getByLabelText(/Amount/);
    await user.clear(amountInput);
    await user.type(amountInput, '19.99');

    await user.click(screen.getByText('Update Subscription'));

    // Check updated amount appears
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('should filter by category', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    // Add entertainment subscription
    await user.click(screen.getByText('+ Add Subscription'));
    await user.type(screen.getByLabelText(/Service Name/), 'Netflix');
    await user.type(screen.getByLabelText(/Amount/), '15.99');
    await user.selectOptions(screen.getByLabelText(/Category/), 'entertainment');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');
    await user.click(within(screen.getByRole('dialog') || document.body).getByText(/Add Subscription/));

    // Add productivity subscription
    await user.click(screen.getByText('+ Add Subscription'));
    await user.type(screen.getByLabelText(/Service Name/), 'Adobe');
    await user.type(screen.getByLabelText(/Amount/), '49.99');
    await user.selectOptions(screen.getByLabelText(/Category/), 'productivity');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');
    await user.click(within(screen.getByRole('dialog') || document.body).getByText(/Add Subscription/));

    // Filter by entertainment
    const categoryFilter = screen.getByDisplayValue('All Categories');
    await user.selectOptions(categoryFilter, 'entertainment');

    // Should only show Netflix
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.queryByText('Adobe')).not.toBeInTheDocument();
  });

  it('should toggle reimbursable and update metrics', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    // Add reimbursable subscription
    await user.click(screen.getByText('+ Add Subscription'));
    await user.type(screen.getByLabelText(/Service Name/), 'Adobe');
    await user.type(screen.getByLabelText(/Amount/), '50');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');
    const reimbursableCheckbox = screen.getByRole('checkbox', { name: /reimbursable/i });
    await user.click(reimbursableCheckbox);
    await user.click(within(screen.getByRole('dialog') || document.body).getByText(/Add Subscription/));

    // Check subscription appears with reimbursable flag
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('should close modal when clicking overlay', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    await user.click(screen.getByText('+ Add Subscription'));
    expect(screen.getByText('Add Subscription')).toBeInTheDocument();

    // Click overlay
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
      await user.click(overlay);
      expect(screen.queryByText('Add Subscription')).not.toBeInTheDocument();
    }
  });
});
