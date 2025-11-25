import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format date as relative time (e.g., "in 3 days")
 */
export function formatRelativeDate(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format date as absolute date string
 */
export function formatAbsoluteDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

/**
 * Get billing frequency label
 */
export function getBillingFrequencyLabel(frequency: string): string {
  const labels: Record<string, string> = {
    monthly: 'Monthly',
    annual: 'Annual',
    quarterly: 'Quarterly',
    weekly: 'Weekly',
    'one-time': 'One-time',
  };
  return labels[frequency] || frequency;
}

/**
 * Get category label
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    entertainment: 'Entertainment',
    utilities: 'Utilities',
    productivity: 'Productivity',
    'health-fitness': 'Health & Fitness',
    education: 'Education',
    shopping: 'Shopping',
    finance: 'Finance',
    other: 'Other',
  };
  return labels[category] || category;
}

/**
 * Get status badge color class
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'green',
    paused: 'yellow',
    cancelled: 'red',
    trial: 'blue',
  };
  return colors[status] || 'gray';
}
