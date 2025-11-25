import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from './FilterBar';
import { FilterOptions } from '@types/subscription';

describe('FilterBar', () => {
  const defaultFilters: FilterOptions = {
    category: 'all',
    status: 'all',
    billingFrequency: 'all',
    familyMember: 'all',
    reimbursable: 'all',
    quickFilter: 'all',
    searchQuery: '',
  };

  it('should render all quick filter buttons', () => {
    render(<FilterBar filters={defaultFilters} onFilterChange={vi.fn()} />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText('This Week')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
  });

  it('should render all advanced filter dropdowns', () => {
    render(<FilterBar filters={defaultFilters} onFilterChange={vi.fn()} />);

    expect(screen.getByDisplayValue('All Categories')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Status')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Billing')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Expenses')).toBeInTheDocument();
  });

  it('should highlight active quick filter', () => {
    const filters = { ...defaultFilters, quickFilter: 'today' as const };
    const { container } = render(<FilterBar filters={filters} onFilterChange={vi.fn()} />);

    const todayButton = screen.getByText('Today').closest('.filter-chip');
    expect(todayButton).toHaveClass('active');
  });

  it('should call onFilterChange when quick filter is clicked', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    render(<FilterBar filters={defaultFilters} onFilterChange={onFilterChange} />);

    await user.click(screen.getByText('Today'));

    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ quickFilter: 'today' })
    );
  });

  it('should call onFilterChange when category is changed', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    render(<FilterBar filters={defaultFilters} onFilterChange={onFilterChange} />);

    const categorySelect = screen.getByDisplayValue('All Categories');
    await user.selectOptions(categorySelect, 'entertainment');

    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'entertainment' })
    );
  });

  it('should call onFilterChange when status is changed', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    render(<FilterBar filters={defaultFilters} onFilterChange={onFilterChange} />);

    const statusSelect = screen.getByDisplayValue('All Status');
    await user.selectOptions(statusSelect, 'active');

    expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ status: 'active' }));
  });

  it('should call onFilterChange when billing frequency is changed', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    render(<FilterBar filters={defaultFilters} onFilterChange={onFilterChange} />);

    const billingSelect = screen.getByDisplayValue('All Billing');
    await user.selectOptions(billingSelect, 'monthly');

    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ billingFrequency: 'monthly' })
    );
  });

  it('should call onFilterChange when reimbursable is changed', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    render(<FilterBar filters={defaultFilters} onFilterChange={onFilterChange} />);

    const reimbursableSelect = screen.getByDisplayValue('All Expenses');
    await user.selectOptions(reimbursableSelect, 'yes');

    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ reimbursable: true })
    );
  });

  it('should display current filter values', () => {
    const filters: FilterOptions = {
      category: 'entertainment',
      status: 'active',
      billingFrequency: 'monthly',
      reimbursable: true,
      quickFilter: 'upcoming',
    };

    render(<FilterBar filters={filters} onFilterChange={vi.fn()} />);

    expect(screen.getByDisplayValue('Entertainment')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Active')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Monthly')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Reimbursable')).toBeInTheDocument();
  });
});
