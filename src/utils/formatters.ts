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

/**
 * Get category badge colors
 */
export function getCategoryColor(category: string): { bg: string; text: string; border: string; bar: string } {
  const colors: Record<string, { bg: string; text: string; border: string; bar: string }> = {
    entertainment: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', bar: '#dc2626' },     // Red
    utilities: { bg: '#ffedd5', text: '#9a3412', border: '#fdba74', bar: '#ea580c' },          // Orange
    productivity: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd', bar: '#2563eb' },       // Blue
    'health-fitness': { bg: '#e9d5ff', text: '#6b21a8', border: '#c084fc', bar: '#9333ea' },   // Purple
    education: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7', bar: '#059669' },          // Green
    shopping: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d', bar: '#eab308' },           // Yellow
    finance: { bg: '#cffafe', text: '#155e75', border: '#67e8f9', bar: '#0891b2' },            // Cyan
    other: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db', bar: '#6b7280' },              // Gray
  };
  return colors[category] || colors.other;
}
