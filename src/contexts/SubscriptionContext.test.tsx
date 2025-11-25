import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { SubscriptionProvider, useSubscriptions } from './SubscriptionContext';
import { createMockSubscription } from '../test/mockData';

describe('SubscriptionContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useSubscriptions());
    }).toThrow('useSubscriptions must be used within a SubscriptionProvider');

    consoleSpy.mockRestore();
  });

  it('should provide initial empty state', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: SubscriptionProvider,
    });

    expect(result.current.subscriptions).toEqual([]);
    expect(result.current.filteredSubscriptions).toEqual([]);
    expect(result.current.metrics.activeSubscriptions).toBe(0);
  });

  it('should add a subscription', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: SubscriptionProvider,
    });

    act(() => {
      result.current.addSubscription({
        serviceName: 'Netflix',
        amount: 15.99,
        billingFrequency: 'monthly',
        nextBillingDate: new Date('2024-12-01'),
        category: 'entertainment',
        status: 'active',
        autoRenew: true,
        reimbursable: false,
        syncEnabled: false,
      });
    });

    expect(result.current.subscriptions).toHaveLength(1);
    expect(result.current.subscriptions[0].serviceName).toBe('Netflix');
    expect(result.current.subscriptions[0].id).toBeDefined();
    expect(result.current.subscriptions[0].createdAt).toBeInstanceOf(Date);
  });

  it('should update a subscription', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: SubscriptionProvider,
    });

    let subscriptionId: string;

    act(() => {
      result.current.addSubscription({
        serviceName: 'Netflix',
        amount: 15.99,
        billingFrequency: 'monthly',
        nextBillingDate: new Date('2024-12-01'),
        category: 'entertainment',
        status: 'active',
        autoRenew: true,
        reimbursable: false,
        syncEnabled: false,
      });
      subscriptionId = result.current.subscriptions[0].id;
    });

    act(() => {
      result.current.updateSubscription(subscriptionId, {
        amount: 19.99,
        status: 'paused',
      });
    });

    expect(result.current.subscriptions[0].amount).toBe(19.99);
    expect(result.current.subscriptions[0].status).toBe('paused');
    expect(result.current.subscriptions[0].serviceName).toBe('Netflix'); // Other fields unchanged
  });

  it('should delete a subscription', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: SubscriptionProvider,
    });

    let subscriptionId: string;

    act(() => {
      result.current.addSubscription({
        serviceName: 'Netflix',
        amount: 15.99,
        billingFrequency: 'monthly',
        nextBillingDate: new Date('2024-12-01'),
        category: 'entertainment',
        status: 'active',
        autoRenew: true,
        reimbursable: false,
        syncEnabled: false,
      });
      subscriptionId = result.current.subscriptions[0].id;
    });

    expect(result.current.subscriptions).toHaveLength(1);

    act(() => {
      result.current.deleteSubscription(subscriptionId);
    });

    expect(result.current.subscriptions).toHaveLength(0);
  });

  it('should get subscription by id', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: SubscriptionProvider,
    });

    let subscriptionId: string;

    act(() => {
      result.current.addSubscription({
        serviceName: 'Netflix',
        amount: 15.99,
        billingFrequency: 'monthly',
        nextBillingDate: new Date('2024-12-01'),
        category: 'entertainment',
        status: 'active',
        autoRenew: true,
        reimbursable: false,
        syncEnabled: false,
      });
      subscriptionId = result.current.subscriptions[0].id;
    });

    const subscription = result.current.getSubscription(subscriptionId);
    expect(subscription).toBeDefined();
    expect(subscription?.serviceName).toBe('Netflix');

    const nonExistent = result.current.getSubscription('non-existent-id');
    expect(nonExistent).toBeUndefined();
  });

  it('should update metrics when subscriptions change', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: SubscriptionProvider,
    });

    expect(result.current.metrics.monthlySpend).toBe(0);

    act(() => {
      result.current.addSubscription({
        serviceName: 'Netflix',
        amount: 15.99,
        billingFrequency: 'monthly',
        nextBillingDate: new Date('2024-12-01'),
        category: 'entertainment',
        status: 'active',
        autoRenew: true,
        reimbursable: false,
        syncEnabled: false,
      });
    });

    expect(result.current.metrics.monthlySpend).toBe(15.99);
    expect(result.current.metrics.activeSubscriptions).toBe(1);
  });

  it('should apply filters', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: SubscriptionProvider,
    });

    act(() => {
      result.current.addSubscription({
        serviceName: 'Netflix',
        amount: 15.99,
        billingFrequency: 'monthly',
        nextBillingDate: new Date('2024-12-01'),
        category: 'entertainment',
        status: 'active',
        autoRenew: true,
        reimbursable: false,
        syncEnabled: false,
      });
      result.current.addSubscription({
        serviceName: 'Adobe',
        amount: 599.88,
        billingFrequency: 'annual',
        nextBillingDate: new Date('2025-03-01'),
        category: 'productivity',
        status: 'active',
        autoRenew: true,
        reimbursable: true,
        syncEnabled: false,
      });
    });

    expect(result.current.filteredSubscriptions).toHaveLength(2);

    act(() => {
      result.current.setFilters({ category: 'entertainment' });
    });

    expect(result.current.filteredSubscriptions).toHaveLength(1);
    expect(result.current.filteredSubscriptions[0].serviceName).toBe('Netflix');
  });

  it('should persist to localStorage', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: SubscriptionProvider,
    });

    act(() => {
      result.current.addSubscription({
        serviceName: 'Netflix',
        amount: 15.99,
        billingFrequency: 'monthly',
        nextBillingDate: new Date('2024-12-01'),
        category: 'entertainment',
        status: 'active',
        autoRenew: true,
        reimbursable: false,
        syncEnabled: false,
      });
    });

    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should load from localStorage on mount', () => {
    const mockData = [
      createMockSubscription({
        id: '1',
        serviceName: 'Existing Service',
        nextBillingDate: new Date('2024-12-01'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }),
    ];

    localStorage.getItem = vi.fn(() => JSON.stringify(mockData));

    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: SubscriptionProvider,
    });

    expect(result.current.subscriptions).toHaveLength(1);
    expect(result.current.subscriptions[0].serviceName).toBe('Existing Service');
  });

  it('should handle corrupted localStorage data gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.getItem = vi.fn(() => 'invalid json');

    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: SubscriptionProvider,
    });

    expect(result.current.subscriptions).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should update updatedAt timestamp when updating subscription', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: SubscriptionProvider,
    });

    let subscriptionId: string;
    let originalUpdatedAt: Date;

    act(() => {
      result.current.addSubscription({
        serviceName: 'Netflix',
        amount: 15.99,
        billingFrequency: 'monthly',
        nextBillingDate: new Date('2024-12-01'),
        category: 'entertainment',
        status: 'active',
        autoRenew: true,
        reimbursable: false,
        syncEnabled: false,
      });
      subscriptionId = result.current.subscriptions[0].id;
      originalUpdatedAt = result.current.subscriptions[0].updatedAt;
    });

    // Wait a bit to ensure timestamp difference
    act(() => {
      setTimeout(() => {
        result.current.updateSubscription(subscriptionId, { amount: 19.99 });
      }, 10);
    });

    waitFor(() => {
      expect(result.current.subscriptions[0].updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });
  });
});
