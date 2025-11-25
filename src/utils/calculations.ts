import { Subscription, BillingFrequency, DashboardMetrics } from '@types/subscription';
import { isWithinInterval, addDays, startOfToday } from 'date-fns';

/**
 * Normalize subscription cost to monthly equivalent
 */
export function normalizeToMonthly(amount: number, frequency: BillingFrequency): number {
  switch (frequency) {
    case 'monthly':
      return amount;
    case 'annual':
      return amount / 12;
    case 'quarterly':
      return amount / 3;
    case 'weekly':
      return (amount * 52) / 12;
    case 'one-time':
      return 0; // One-time purchases don't contribute to recurring spend
    default:
      return 0;
  }
}

/**
 * Calculate annual projection from monthly amount
 */
export function calculateAnnualProjection(
  monthlyAmount: number,
  subscriptions: Subscription[]
): number {
  // Start with monthly * 12
  let annual = monthlyAmount * 12;

  // Add annual-only subscriptions that weren't included in monthly calculation
  subscriptions.forEach((sub) => {
    if (sub.status === 'active' && sub.billingFrequency === 'annual') {
      // Annual subscriptions are already divided by 12 in monthly calculation
      // So we don't need to add them separately
    }
  });

  return annual;
}

/**
 * Check if subscription is renewing within the next N days
 */
export function isUpcomingRenewal(subscription: Subscription, days: number = 7): boolean {
  const today = startOfToday();
  const futureDate = addDays(today, days);

  return isWithinInterval(new Date(subscription.nextBillingDate), {
    start: today,
    end: futureDate,
  });
}

/**
 * Calculate all dashboard metrics from subscriptions
 */
export function calculateMetrics(subscriptions: Subscription[]): DashboardMetrics {
  const activeSubscriptions = subscriptions.filter((sub) => sub.status === 'active');
  const oneTimePurchases = subscriptions.filter(
    (sub) => sub.billingFrequency === 'one-time'
  );

  // Calculate monthly spend
  let monthlySpend = 0;
  let monthlySpendReimbursable = 0;

  activeSubscriptions.forEach((sub) => {
    if (sub.billingFrequency !== 'one-time') {
      const monthlyAmount = normalizeToMonthly(sub.amount, sub.billingFrequency);
      monthlySpend += monthlyAmount;

      if (sub.reimbursable) {
        monthlySpendReimbursable += monthlyAmount;
      }
    }
  });

  const monthlySpendOutOfPocket = monthlySpend - monthlySpendReimbursable;

  // Calculate lifetime purchases
  const lifetimePurchases = oneTimePurchases.reduce((sum, sub) => sum + sub.amount, 0);
  const lifetimePurchasesCount = oneTimePurchases.length;

  // Calculate annual projection
  const annualProjection = calculateAnnualProjection(monthlySpend, activeSubscriptions);
  const annualProjectionReimbursable = monthlySpendReimbursable * 12;

  // Calculate upcoming renewals
  const upcomingRenewals = activeSubscriptions.filter((sub) =>
    isUpcomingRenewal(sub, 7)
  ).length;

  return {
    monthlySpend,
    monthlySpendReimbursable,
    monthlySpendOutOfPocket,
    lifetimePurchases,
    lifetimePurchasesCount,
    annualProjection,
    annualProjectionReimbursable,
    activeSubscriptions: activeSubscriptions.length,
    upcomingRenewals,
  };
}
