import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubscriptionForm } from './SubscriptionForm';
import { createMockSubscription } from '../../test/mockData';

describe('SubscriptionForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  };

  it('should render form title for new subscription', () => {
    render(<SubscriptionForm {...defaultProps} />);
    expect(screen.getByText('Add Subscription')).toBeInTheDocument();
  });

  it('should render form title for editing subscription', () => {
    const subscription = createMockSubscription();
    render(<SubscriptionForm {...defaultProps} subscription={subscription} />);
    expect(screen.getByText('Edit Subscription')).toBeInTheDocument();
  });

  it('should render all required fields', () => {
    render(<SubscriptionForm {...defaultProps} />);

    expect(screen.getByLabelText(/Service Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Billing Frequency/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Next Billing Date/)).toBeInTheDocument();
  });

  it('should render optional fields', () => {
    render(<SubscriptionForm {...defaultProps} />);

    expect(screen.getByLabelText(/Category/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Payment Method/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/)).toBeInTheDocument();
  });

  it('should render checkboxes', () => {
    render(<SubscriptionForm {...defaultProps} />);

    expect(screen.getByText('Auto-renew')).toBeInTheDocument();
    expect(screen.getByText('Reimbursable')).toBeInTheDocument();
  });

  it('should pre-fill form when editing', () => {
    const subscription = createMockSubscription({
      serviceName: 'Netflix',
      amount: 15.99,
      notes: 'Test notes',
    });

    render(<SubscriptionForm {...defaultProps} subscription={subscription} />);

    expect(screen.getByDisplayValue('Netflix')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test notes')).toBeInTheDocument();
  });

  it('should call onSubmit with form data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<SubscriptionForm {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Service Name/), 'Netflix');
    await user.type(screen.getByLabelText(/Amount/), '15.99');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');

    await user.click(screen.getByText('Add Subscription'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        serviceName: 'Netflix',
        amount: 15.99,
      })
    );
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<SubscriptionForm {...defaultProps} onCancel={onCancel} />);

    await user.click(screen.getByText('Cancel'));

    expect(onCancel).toHaveBeenCalled();
  });

  it('should update reimbursable checkbox', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<SubscriptionForm {...defaultProps} onSubmit={onSubmit} />);

    const reimbursableCheckbox = screen.getByRole('checkbox', { name: /reimbursable/i });
    await user.click(reimbursableCheckbox);

    await user.type(screen.getByLabelText(/Service Name/), 'Netflix');
    await user.type(screen.getByLabelText(/Amount/), '15.99');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');

    await user.click(screen.getByText('Add Subscription'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        reimbursable: true,
      })
    );
  });

  it('should update auto-renew checkbox', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<SubscriptionForm {...defaultProps} onSubmit={onSubmit} />);

    const autoRenewCheckbox = screen.getByRole('checkbox', { name: /auto-renew/i });
    await user.click(autoRenewCheckbox); // Toggle off (default is true)

    await user.type(screen.getByLabelText(/Service Name/), 'Netflix');
    await user.type(screen.getByLabelText(/Amount/), '15.99');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');

    await user.click(screen.getByText('Add Subscription'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        autoRenew: false,
      })
    );
  });

  it('should allow selecting billing frequency', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<SubscriptionForm {...defaultProps} onSubmit={onSubmit} />);

    await user.selectOptions(screen.getByLabelText(/Billing Frequency/), 'annual');

    await user.type(screen.getByLabelText(/Service Name/), 'Netflix');
    await user.type(screen.getByLabelText(/Amount/), '15.99');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');

    await user.click(screen.getByText('Add Subscription'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        billingFrequency: 'annual',
      })
    );
  });

  it('should allow selecting category', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<SubscriptionForm {...defaultProps} onSubmit={onSubmit} />);

    await user.selectOptions(screen.getByLabelText(/Category/), 'entertainment');

    await user.type(screen.getByLabelText(/Service Name/), 'Netflix');
    await user.type(screen.getByLabelText(/Amount/), '15.99');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');

    await user.click(screen.getByText('Add Subscription'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'entertainment',
      })
    );
  });

  it('should show Update button when editing', () => {
    const subscription = createMockSubscription();
    render(<SubscriptionForm {...defaultProps} subscription={subscription} />);

    expect(screen.getByText('Update Subscription')).toBeInTheDocument();
  });

  it('should require service name', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<SubscriptionForm {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Amount/), '15.99');
    await user.type(screen.getByLabelText(/Next Billing Date/), '2024-12-01');
    await user.click(screen.getByText('Add Subscription'));

    // Form should not submit without service name
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
