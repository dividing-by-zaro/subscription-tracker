import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatRelativeDate,
  formatAbsoluteDate,
  getBillingFrequencyLabel,
  getCategoryLabel,
  getStatusColor,
} from './formatters';

describe('formatCurrency', () => {
  it('should format positive amounts', () => {
    expect(formatCurrency(10.99)).toBe('$10.99');
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('should format zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format large amounts', () => {
    expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
  });

  it('should handle decimal places', () => {
    expect(formatCurrency(10.5)).toBe('$10.50');
    expect(formatCurrency(10.123)).toBe('$10.12');
  });
});

describe('formatRelativeDate', () => {
  it('should format past dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const result = formatRelativeDate(yesterday);
    expect(result).toContain('ago');
  });

  it('should format future dates', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const result = formatRelativeDate(tomorrow);
    expect(result).toContain('in');
  });

  it('should handle dates multiple days away', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    const result = formatRelativeDate(future);
    expect(result).toMatch(/in \d+ days?/);
  });
});

describe('formatAbsoluteDate', () => {
  it('should format date in MMM d, yyyy format', () => {
    const date = new Date('2024-12-25');
    const result = formatAbsoluteDate(date);
    expect(result).toMatch(/Dec 2[45], 2024/); // Accounting for timezone
  });

  it('should handle different months', () => {
    const date = new Date('2024-01-15');
    const result = formatAbsoluteDate(date);
    expect(result).toMatch(/Jan 1[45], 2024/);
  });
});

describe('getBillingFrequencyLabel', () => {
  it('should return correct labels for all frequencies', () => {
    expect(getBillingFrequencyLabel('monthly')).toBe('Monthly');
    expect(getBillingFrequencyLabel('annual')).toBe('Annual');
    expect(getBillingFrequencyLabel('quarterly')).toBe('Quarterly');
    expect(getBillingFrequencyLabel('weekly')).toBe('Weekly');
    expect(getBillingFrequencyLabel('one-time')).toBe('One-time');
  });

  it('should return the input for unknown frequencies', () => {
    expect(getBillingFrequencyLabel('unknown' as any)).toBe('unknown');
  });
});

describe('getCategoryLabel', () => {
  it('should return correct labels for all categories', () => {
    expect(getCategoryLabel('entertainment')).toBe('Entertainment');
    expect(getCategoryLabel('utilities')).toBe('Utilities');
    expect(getCategoryLabel('productivity')).toBe('Productivity');
    expect(getCategoryLabel('health-fitness')).toBe('Health & Fitness');
    expect(getCategoryLabel('education')).toBe('Education');
    expect(getCategoryLabel('shopping')).toBe('Shopping');
    expect(getCategoryLabel('finance')).toBe('Finance');
    expect(getCategoryLabel('other')).toBe('Other');
  });

  it('should return the input for unknown categories', () => {
    expect(getCategoryLabel('unknown' as any)).toBe('unknown');
  });
});

describe('getStatusColor', () => {
  it('should return correct colors for all statuses', () => {
    expect(getStatusColor('active')).toBe('green');
    expect(getStatusColor('paused')).toBe('yellow');
    expect(getStatusColor('cancelled')).toBe('red');
    expect(getStatusColor('trial')).toBe('blue');
  });

  it('should return gray for unknown statuses', () => {
    expect(getStatusColor('unknown')).toBe('gray');
  });
});
