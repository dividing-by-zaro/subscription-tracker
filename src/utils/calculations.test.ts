import { describe, it, expect } from 'vitest';
import {
  normalizeToMonthly,
  calculateAnnualProjection,
  isUpcomingRenewal,
  calculateMetrics,
} from './calculations';
import { createMockSubscription } from '../test/mockData';

describe('normalizeToMonthly', () => {
  it('should return the same amount for monthly subscriptions', () => {
    expect(normalizeToMonthly(10, 'monthly')).toBe(10);
  });

  it('should divide annual amount by 12', () => {
    expect(normalizeToMonthly(120, 'annual')).toBe(10);
  });

  it('should divide quarterly amount by 3', () => {
    expect(normalizeToMonthly(30, 'quarterly')).toBe(10);
  });

  it('should calculate weekly correctly', () => {
    expect(normalizeToMonthly(52, 'weekly')).toBeCloseTo(224.67, 2);
  });

  it('should return 0 for one-time purchases', () => {
    expect(normalizeToMonthly(100, 'one-time')).toBe(0);
  });
});

describe('calculateAnnualProjection', () => {
  it('should multiply monthly amount by 12', () => {
    const subscriptions = [
      createMockSubscription({ amount: 10, billingFrequency: 'monthly', status: 'active' }),
    ];
    expect(calculateAnnualProjection(10, subscriptions)).toBe(120);
  });

  it('should calculate correctly with multiple subscriptions', () => {
    const subscriptions = [
      createMockSubscription({ amount: 10, billingFrequency: 'monthly', status: 'active' }),
      createMockSubscription({ amount: 120, billingFrequency: 'annual', status: 'active' }),
    ];
    // Monthly: 10 + annual normalized: 10 = 20/month * 12 = 240
    expect(calculateAnnualProjection(20, subscriptions)).toBe(240);
  });
});

describe('isUpcomingRenewal', () => {
  it('should return true for subscriptions within 7 days', () => {
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    const subscription = createMockSubscription({ nextBillingDate: threeDaysFromNow });
    expect(isUpcomingRenewal(subscription, 7)).toBe(true);
  });

  it('should return false for subscriptions beyond 7 days', () => {
    const today = new Date();
    const tenDaysFromNow = new Date(today);
    tenDaysFromNow.setDate(today.getDate() + 10);

    const subscription = createMockSubscription({ nextBillingDate: tenDaysFromNow });
    expect(isUpcomingRenewal(subscription, 7)).toBe(false);
  });

  it('should return true for subscriptions today', () => {
    const today = new Date();
    const subscription = createMockSubscription({ nextBillingDate: today });
    expect(isUpcomingRenewal(subscription, 7)).toBe(true);
  });

  it('should respect custom day parameter', () => {
    const today = new Date();
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(today.getDate() + 2);

    const subscription = createMockSubscription({ nextBillingDate: twoDaysFromNow });
    expect(isUpcomingRenewal(subscription, 3)).toBe(true);
    expect(isUpcomingRenewal(subscription, 1)).toBe(false);
  });
});

describe('calculateMetrics', () => {
  it('should calculate monthly spend correctly', () => {
    const subscriptions = [
      createMockSubscription({ amount: 10, billingFrequency: 'monthly', status: 'active' }),
      createMockSubscription({ amount: 20, billingFrequency: 'monthly', status: 'active' }),
    ];

    const metrics = calculateMetrics(subscriptions);
    expect(metrics.monthlySpend).toBe(30);
  });

  it('should calculate reimbursable amounts correctly', () => {
    const subscriptions = [
      createMockSubscription({
        amount: 10,
        billingFrequency: 'monthly',
        status: 'active',
        reimbursable: true,
      }),
      createMockSubscription({
        amount: 20,
        billingFrequency: 'monthly',
        status: 'active',
        reimbursable: false,
      }),
    ];

    const metrics = calculateMetrics(subscriptions);
    expect(metrics.monthlySpendReimbursable).toBe(10);
    expect(metrics.monthlySpendOutOfPocket).toBe(20);
  });

  it('should calculate lifetime purchases correctly', () => {
    const subscriptions = [
      createMockSubscription({ amount: 100, billingFrequency: 'one-time' }),
      createMockSubscription({ amount: 200, billingFrequency: 'one-time' }),
    ];

    const metrics = calculateMetrics(subscriptions);
    expect(metrics.lifetimePurchases).toBe(300);
    expect(metrics.lifetimePurchasesCount).toBe(2);
  });

  it('should not include one-time purchases in monthly spend', () => {
    const subscriptions = [
      createMockSubscription({
        amount: 10,
        billingFrequency: 'monthly',
        status: 'active',
      }),
      createMockSubscription({
        amount: 100,
        billingFrequency: 'one-time',
        status: 'active',
      }),
    ];

    const metrics = calculateMetrics(subscriptions);
    expect(metrics.monthlySpend).toBe(10);
  });

  it('should count active subscriptions correctly', () => {
    const subscriptions = [
      createMockSubscription({ status: 'active' }),
      createMockSubscription({ status: 'active' }),
      createMockSubscription({ status: 'paused' }),
      createMockSubscription({ status: 'cancelled' }),
    ];

    const metrics = calculateMetrics(subscriptions);
    expect(metrics.activeSubscriptions).toBe(2);
  });

  it('should calculate annual projection correctly', () => {
    const subscriptions = [
      createMockSubscription({
        amount: 10,
        billingFrequency: 'monthly',
        status: 'active',
      }),
    ];

    const metrics = calculateMetrics(subscriptions);
    expect(metrics.annualProjection).toBe(120);
    expect(metrics.annualProjectionReimbursable).toBe(0);
  });

  it('should count upcoming renewals', () => {
    const today = new Date();
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(today.getDate() + 2);
    const tenDaysFromNow = new Date(today);
    tenDaysFromNow.setDate(today.getDate() + 10);

    const subscriptions = [
      createMockSubscription({ nextBillingDate: twoDaysFromNow, status: 'active' }),
      createMockSubscription({ nextBillingDate: tenDaysFromNow, status: 'active' }),
    ];

    const metrics = calculateMetrics(subscriptions);
    expect(metrics.upcomingRenewals).toBe(1);
  });

  it('should normalize different billing frequencies for monthly spend', () => {
    const subscriptions = [
      createMockSubscription({
        amount: 12,
        billingFrequency: 'monthly',
        status: 'active',
      }),
      createMockSubscription({
        amount: 120,
        billingFrequency: 'annual',
        status: 'active',
      }),
      createMockSubscription({
        amount: 30,
        billingFrequency: 'quarterly',
        status: 'active',
      }),
    ];

    const metrics = calculateMetrics(subscriptions);
    // 12 + 10 + 10 = 32
    expect(metrics.monthlySpend).toBe(32);
  });
});
