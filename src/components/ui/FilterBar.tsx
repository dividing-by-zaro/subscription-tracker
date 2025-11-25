import React from 'react';
import { FilterOptions, QuickFilter } from '@types/subscription';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const quickFilters: { value: QuickFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
  ];

  return (
    <div className="filter-bar">
      <div className="quick-filters">
        {quickFilters.map((filter) => (
          <button
            key={filter.value}
            className={`filter-chip ${filters.quickFilter === filter.value ? 'active' : ''}`}
            onClick={() => onFilterChange({ ...filters, quickFilter: filter.value })}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="advanced-filters">
        <select
          value={filters.category || 'all'}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value as any })}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="entertainment">Entertainment</option>
          <option value="utilities">Utilities</option>
          <option value="productivity">Productivity</option>
          <option value="health-fitness">Health & Fitness</option>
          <option value="education">Education</option>
          <option value="shopping">Shopping</option>
          <option value="finance">Finance</option>
          <option value="other">Other</option>
        </select>

        <select
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
          <option value="trial">Trial</option>
        </select>

        <select
          value={filters.billingFrequency || 'all'}
          onChange={(e) => onFilterChange({ ...filters, billingFrequency: e.target.value as any })}
          className="filter-select"
        >
          <option value="all">All Billing</option>
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
          <option value="quarterly">Quarterly</option>
          <option value="weekly">Weekly</option>
          <option value="one-time">One-time</option>
        </select>

        <select
          value={
            filters.reimbursable === 'all' ? 'all' : filters.reimbursable === true ? 'yes' : 'no'
          }
          onChange={(e) => {
            const value = e.target.value;
            onFilterChange({
              ...filters,
              reimbursable: value === 'all' ? 'all' : value === 'yes',
            });
          }}
          className="filter-select"
        >
          <option value="all">All Expenses</option>
          <option value="yes">Reimbursable</option>
          <option value="no">Non-reimbursable</option>
        </select>
      </div>
    </div>
  );
}
