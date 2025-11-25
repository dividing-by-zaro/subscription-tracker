import { describe, it, expect } from 'vitest';
import { filterSubscriptions, sortByNextBilling } from './filters';
import { createMockSubscription } from '../test/mockData';
import { FilterOptions } from '@types/subscription';

describe('filterSubscriptions', () => {
  it('should return all subscriptions with empty filters', () => {
    const subscriptions = [
      createMockSubscription({ id: '1' }),
      createMockSubscription({ id: '2' }),
    ];
    const filters: FilterOptions = {};

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(2);
  });

  it('should filter by search query - service name', () => {
    const subscriptions = [
      createMockSubscription({ serviceName: 'Netflix' }),
      createMockSubscription({ serviceName: 'Spotify' }),
    ];
    const filters: FilterOptions = { searchQuery: 'netflix' };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].serviceName).toBe('Netflix');
  });

  it('should filter by search query - category', () => {
    const subscriptions = [
      createMockSubscription({ serviceName: 'Netflix', category: 'entertainment' }),
      createMockSubscription({ serviceName: 'Adobe', category: 'productivity' }),
    ];
    const filters: FilterOptions = { searchQuery: 'entertainment' };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].serviceName).toBe('Netflix');
  });

  it('should filter by search query - notes', () => {
    const subscriptions = [
      createMockSubscription({ serviceName: 'Service1', notes: 'work expense' }),
      createMockSubscription({ serviceName: 'Service2', notes: 'personal' }),
    ];
    const filters: FilterOptions = { searchQuery: 'work' };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].serviceName).toBe('Service1');
  });

  it('should filter by category', () => {
    const subscriptions = [
      createMockSubscription({ category: 'entertainment' }),
      createMockSubscription({ category: 'productivity' }),
      createMockSubscription({ category: 'entertainment' }),
    ];
    const filters: FilterOptions = { category: 'entertainment' };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(2);
  });

  it('should filter by status', () => {
    const subscriptions = [
      createMockSubscription({ status: 'active' }),
      createMockSubscription({ status: 'paused' }),
      createMockSubscription({ status: 'active' }),
    ];
    const filters: FilterOptions = { status: 'active' };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(2);
  });

  it('should filter by billing frequency', () => {
    const subscriptions = [
      createMockSubscription({ billingFrequency: 'monthly' }),
      createMockSubscription({ billingFrequency: 'annual' }),
      createMockSubscription({ billingFrequency: 'monthly' }),
    ];
    const filters: FilterOptions = { billingFrequency: 'monthly' };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(2);
  });

  it('should filter by family member', () => {
    const member1 = { id: '1', name: 'John' };
    const member2 = { id: '2', name: 'Jane' };
    const subscriptions = [
      createMockSubscription({ familyMember: member1 }),
      createMockSubscription({ familyMember: member2 }),
      createMockSubscription({ familyMember: member1 }),
    ];
    const filters: FilterOptions = { familyMember: '1' };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(2);
  });

  it('should filter by reimbursable - true', () => {
    const subscriptions = [
      createMockSubscription({ reimbursable: true }),
      createMockSubscription({ reimbursable: false }),
      createMockSubscription({ reimbursable: true }),
    ];
    const filters: FilterOptions = { reimbursable: true };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(2);
  });

  it('should filter by reimbursable - false', () => {
    const subscriptions = [
      createMockSubscription({ reimbursable: true }),
      createMockSubscription({ reimbursable: false }),
      createMockSubscription({ reimbursable: false }),
    ];
    const filters: FilterOptions = { reimbursable: false };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(2);
  });

  it('should filter by quick filter - today', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const subscriptions = [
      createMockSubscription({ nextBillingDate: today }),
      createMockSubscription({ nextBillingDate: tomorrow }),
    ];
    const filters: FilterOptions = { quickFilter: 'today' };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(1);
  });

  it('should filter by quick filter - upcoming', () => {
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    const tenDaysFromNow = new Date(today);
    tenDaysFromNow.setDate(today.getDate() + 10);

    const subscriptions = [
      createMockSubscription({ nextBillingDate: threeDaysFromNow }),
      createMockSubscription({ nextBillingDate: tenDaysFromNow }),
    ];
    const filters: FilterOptions = { quickFilter: 'upcoming' };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(1);
  });

  it('should apply multiple filters simultaneously', () => {
    const subscriptions = [
      createMockSubscription({
        serviceName: 'Netflix',
        category: 'entertainment',
        status: 'active',
        billingFrequency: 'monthly',
      }),
      createMockSubscription({
        serviceName: 'Adobe',
        category: 'productivity',
        status: 'active',
        billingFrequency: 'annual',
      }),
      createMockSubscription({
        serviceName: 'Spotify',
        category: 'entertainment',
        status: 'paused',
        billingFrequency: 'monthly',
      }),
    ];
    const filters: FilterOptions = {
      category: 'entertainment',
      status: 'active',
      billingFrequency: 'monthly',
    };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].serviceName).toBe('Netflix');
  });

  it('should handle "all" filter values', () => {
    const subscriptions = [
      createMockSubscription({ category: 'entertainment' }),
      createMockSubscription({ category: 'productivity' }),
    ];
    const filters: FilterOptions = {
      category: 'all',
      status: 'all',
      billingFrequency: 'all',
      reimbursable: 'all',
      quickFilter: 'all',
    };

    const result = filterSubscriptions(subscriptions, filters);
    expect(result).toHaveLength(2);
  });
});

describe('sortByNextBilling', () => {
  it('should sort subscriptions by next billing date ascending', () => {
    const date1 = new Date('2024-12-01');
    const date2 = new Date('2024-11-25');
    const date3 = new Date('2024-12-15');

    const subscriptions = [
      createMockSubscription({ id: '1', nextBillingDate: date1 }),
      createMockSubscription({ id: '2', nextBillingDate: date2 }),
      createMockSubscription({ id: '3', nextBillingDate: date3 }),
    ];

    const sorted = sortByNextBilling(subscriptions);
    expect(sorted[0].id).toBe('2');
    expect(sorted[1].id).toBe('1');
    expect(sorted[2].id).toBe('3');
  });

  it('should not mutate the original array', () => {
    const subscriptions = [
      createMockSubscription({ id: '1', nextBillingDate: new Date('2024-12-01') }),
      createMockSubscription({ id: '2', nextBillingDate: new Date('2024-11-25') }),
    ];

    const sorted = sortByNextBilling(subscriptions);
    expect(sorted[0].id).toBe('2');
    expect(subscriptions[0].id).toBe('1'); // Original unchanged
  });
});
