import { Subscription, FilterOptions, QuickFilter } from '@types/subscription';
import {
  isToday,
  isThisWeek,
  isThisMonth,
  isWithinInterval,
  addDays,
  startOfToday,
} from 'date-fns';

/**
 * Apply quick filter to subscriptions
 */
function applyQuickFilter(subscriptions: Subscription[], filter: QuickFilter): Subscription[] {
  const today = startOfToday();

  switch (filter) {
    case 'today':
      return subscriptions.filter((sub) => isToday(new Date(sub.nextBillingDate)));

    case 'upcoming':
      return subscriptions.filter((sub) =>
        isWithinInterval(new Date(sub.nextBillingDate), {
          start: today,
          end: addDays(today, 7),
        })
      );

    case 'this-week':
      return subscriptions.filter((sub) => isThisWeek(new Date(sub.nextBillingDate)));

    case 'this-month':
      return subscriptions.filter((sub) => isThisMonth(new Date(sub.nextBillingDate)));

    case 'all':
    default:
      return subscriptions;
  }
}

/**
 * Apply all filters to subscription list
 */
export function filterSubscriptions(
  subscriptions: Subscription[],
  filters: FilterOptions
): Subscription[] {
  let filtered = [...subscriptions];

  // Apply search query
  if (filters.searchQuery && filters.searchQuery.trim() !== '') {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (sub) =>
        sub.serviceName.toLowerCase().includes(query) ||
        sub.category.toLowerCase().includes(query) ||
        sub.notes?.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((sub) => sub.category === filters.category);
  }

  // Apply status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((sub) => sub.status === filters.status);
  }

  // Apply billing frequency filter
  if (filters.billingFrequency && filters.billingFrequency !== 'all') {
    filtered = filtered.filter((sub) => sub.billingFrequency === filters.billingFrequency);
  }

  // Apply family member filter
  if (filters.familyMember && filters.familyMember !== 'all') {
    filtered = filtered.filter((sub) => sub.familyMember?.id === filters.familyMember);
  }

  // Apply reimbursable filter
  if (filters.reimbursable !== undefined && filters.reimbursable !== 'all') {
    filtered = filtered.filter((sub) => sub.reimbursable === filters.reimbursable);
  }

  // Apply quick filter
  if (filters.quickFilter && filters.quickFilter !== 'all') {
    filtered = applyQuickFilter(filtered, filters.quickFilter);
  }

  return filtered;
}

/**
 * Sort subscriptions by next billing date
 */
export function sortByNextBilling(subscriptions: Subscription[]): Subscription[] {
  return [...subscriptions].sort(
    (a, b) =>
      new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime()
  );
}
