import React from 'react';
import { DashboardMetrics } from '@types/subscription';
import { formatCurrency } from '@utils/formatters';
import { MetricCard } from './MetricCard';
import {
  DollarSign,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="metrics-grid">
      <MetricCard
        title="Monthly Spend"
        value={formatCurrency(metrics.monthlySpend)}
        subtitle={`${metrics.activeSubscriptions} active subscriptions`}
        icon={<DollarSign />}
      />
      <MetricCard
        title="Annual Projection"
        value={formatCurrency(metrics.annualProjection)}
        subtitle="Based on current active subscriptions"
        icon={<TrendingUp />}
      />
      <MetricCard
        title="Active Subscriptions"
        value={metrics.activeSubscriptions.toString()}
        icon={<CheckCircle />}
      />
    </div>
  );
}
