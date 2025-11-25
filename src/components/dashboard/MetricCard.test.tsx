import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';
import { DollarSign } from 'lucide-react';

describe('MetricCard', () => {
  it('should render title and value', () => {
    render(<MetricCard title="Monthly Spend" value="$100.00" />);

    expect(screen.getByText('Monthly Spend')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    render(
      <MetricCard
        title="Monthly Spend"
        value="$100.00"
        subtitle="5 active subscriptions"
      />
    );

    expect(screen.getByText('5 active subscriptions')).toBeInTheDocument();
  });

  it('should render icon when provided', () => {
    const { container } = render(
      <MetricCard title="Monthly Spend" value="$100.00" icon={<DollarSign data-testid="icon" />} />
    );

    expect(container.querySelector('[data-testid="icon"]')).toBeInTheDocument();
  });

  it('should not render subtitle when not provided', () => {
    render(<MetricCard title="Monthly Spend" value="$100.00" />);

    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MetricCard title="Monthly Spend" value="$100.00" className="custom-class" />
    );

    expect(container.querySelector('.metric-card.custom-class')).toBeInTheDocument();
  });
});
