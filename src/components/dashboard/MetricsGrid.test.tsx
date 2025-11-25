import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricsGrid } from './MetricsGrid';
import { DashboardMetrics } from '@types/subscription';

describe('MetricsGrid', () => {
  const mockMetrics: DashboardMetrics = {
    monthlySpend: 100.5,
    monthlySpendReimbursable: 30.0,
    monthlySpendOutOfPocket: 70.5,
    lifetimePurchases: 500.0,
    lifetimePurchasesCount: 3,
    annualProjection: 1206.0,
    annualProjectionReimbursable: 360.0,
    activeSubscriptions: 5,
    upcomingRenewals: 2,
  };

  it('should render all metric cards', () => {
    render(<MetricsGrid metrics={mockMetrics} />);

    expect(screen.getByText('Monthly Spend')).toBeInTheDocument();
    expect(screen.getByText('Lifetime Purchases')).toBeInTheDocument();
    expect(screen.getByText('Annual Projection')).toBeInTheDocument();
    expect(screen.getByText('Active Subscriptions')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Renewals')).toBeInTheDocument();
  });

  it('should display formatted monthly spend', () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    expect(screen.getByText('$100.50')).toBeInTheDocument();
  });

  it('should display active subscriptions count', () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    expect(screen.getByText('5 active subscriptions')).toBeInTheDocument();
  });

  it('should display lifetime purchases', () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    expect(screen.getByText('$500.00')).toBeInTheDocument();
    expect(screen.getByText('3 purchases')).toBeInTheDocument();
  });

  it('should display annual projection', () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    expect(screen.getByText('$1,206.00')).toBeInTheDocument();
    expect(screen.getByText('Based on current active subscriptions')).toBeInTheDocument();
  });

  it('should display upcoming renewals count', () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Next 7 days')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    const zeroMetrics: DashboardMetrics = {
      monthlySpend: 0,
      monthlySpendReimbursable: 0,
      monthlySpendOutOfPocket: 0,
      lifetimePurchases: 0,
      lifetimePurchasesCount: 0,
      annualProjection: 0,
      annualProjectionReimbursable: 0,
      activeSubscriptions: 0,
      upcomingRenewals: 0,
    };

    render(<MetricsGrid metrics={zeroMetrics} />);
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});
