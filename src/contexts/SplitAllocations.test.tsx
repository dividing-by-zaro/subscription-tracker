import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { SubscriptionProvider, useSubscriptions } from './SubscriptionContext';
import { ReactNode } from 'react';
import { SplitAllocation } from '@types/subscription';

const wrapper = ({ children }: { children: ReactNode }) => (
  <SubscriptionProvider>{children}</SubscriptionProvider>
);

describe('Split Allocations', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Creating subscriptions with split allocations', () => {
    it('should create subscription with split allocations', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
      });

      let member1Id, member2Id;
      act(() => {
        member1Id = result.current.addFamilyMember('Partner').id;
        member2Id = result.current.familyMembers[0].id; // "Me" member
      });

      const splitAllocations: SplitAllocation[] = [
        { familyMemberId: member2Id, percentage: 60 },
        { familyMemberId: member1Id, percentage: 40 },
      ];

      act(() => {
        result.current.addSubscription({
          serviceName: 'Shared Netflix',
          amount: 15.99,
          billingFrequency: 'monthly',
          nextBillingDate: new Date('2024-12-01'),
          category: 'entertainment',
          status: 'active',
          autoRenew: true,
          reimbursable: false,
          syncEnabled: false,
          splitAllocations,
        });
      });

      expect(result.current.subscriptions).toHaveLength(1);
      expect(result.current.subscriptions[0].splitAllocations).toEqual(splitAllocations);
    });


    it('should handle subscriptions without split allocations', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
      });

      act(() => {
        result.current.addSubscription({
          serviceName: 'Regular Subscription',
          amount: 10.0,
          billingFrequency: 'monthly',
          nextBillingDate: new Date('2024-12-01'),
          category: 'other',
          status: 'active',
          autoRenew: true,
          reimbursable: false,
          syncEnabled: false,
        });
      });

      expect(result.current.subscriptions).toHaveLength(1);
      expect(result.current.subscriptions[0].splitAllocations).toBeUndefined();
    });
  });

  describe('Updating subscriptions with split allocations', () => {
    it('should update split allocations on existing subscription', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
      });

      const currentUserId = result.current.familyMembers[0].id;
      let subscriptionId: string;

      act(() => {
        result.current.addSubscription({
          serviceName: 'Test Service',
          amount: 10.0,
          billingFrequency: 'monthly',
          nextBillingDate: new Date('2024-12-01'),
          category: 'other',
          status: 'active',
          autoRenew: true,
          reimbursable: false,
          syncEnabled: false,
          splitAllocations: [{ familyMemberId: currentUserId, percentage: 100 }],
        });
      });

      subscriptionId = result.current.subscriptions[0].id;

      let partnerId: string;
      act(() => {
        partnerId = result.current.addFamilyMember('Partner').id;
      });

      const newSplitAllocations: SplitAllocation[] = [
        { familyMemberId: currentUserId, percentage: 50 },
        { familyMemberId: partnerId, percentage: 50 },
      ];

      act(() => {
        result.current.updateSubscription(subscriptionId, {
          splitAllocations: newSplitAllocations,
        });
      });

      const updated = result.current.subscriptions.find((s) => s.id === subscriptionId);
      expect(updated?.splitAllocations).toHaveLength(2);
      expect(updated?.splitAllocations?.[0].percentage).toBe(50);
      expect(updated?.splitAllocations?.[1].percentage).toBe(50);
    });

    it('should remove split allocations from subscription', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
      });

      const currentUserId = result.current.familyMembers[0].id;
      let subscriptionId: string;

      act(() => {
        result.current.addSubscription({
          serviceName: 'Test Service',
          amount: 10.0,
          billingFrequency: 'monthly',
          nextBillingDate: new Date('2024-12-01'),
          category: 'other',
          status: 'active',
          autoRenew: true,
          reimbursable: false,
          syncEnabled: false,
          splitAllocations: [{ familyMemberId: currentUserId, percentage: 100 }],
        });
      });

      subscriptionId = result.current.subscriptions[0].id;

      act(() => {
        result.current.updateSubscription(subscriptionId, {
          splitAllocations: undefined,
        });
      });

      const updated = result.current.subscriptions.find((s) => s.id === subscriptionId);
      expect(updated?.splitAllocations).toBeUndefined();
    });
  });

  describe('Split allocation validation', () => {
    it('should handle percentages that add up to 100', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
      });

      let member1Id, member2Id;
      act(() => {
        member1Id = result.current.familyMembers[0].id;
        member2Id = result.current.addFamilyMember('Partner').id;
      });

      const splitAllocations: SplitAllocation[] = [
        { familyMemberId: member1Id, percentage: 60 },
        { familyMemberId: member2Id, percentage: 40 },
      ];

      const total = splitAllocations.reduce((sum, a) => sum + a.percentage, 0);
      expect(total).toBe(100);
    });

    it('should handle decimal percentages', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
      });

      let member1Id, member2Id, member3Id;
      act(() => {
        member1Id = result.current.familyMembers[0].id;
        member2Id = result.current.addFamilyMember('Partner 1').id;
        member3Id = result.current.addFamilyMember('Partner 2').id;
      });

      const splitAllocations: SplitAllocation[] = [
        { familyMemberId: member1Id, percentage: 33.33 },
        { familyMemberId: member2Id, percentage: 33.33 },
        { familyMemberId: member3Id, percentage: 33.34 },
      ];

      act(() => {
        result.current.addSubscription({
          serviceName: 'Three-way Split',
          amount: 30.0,
          billingFrequency: 'monthly',
          nextBillingDate: new Date('2024-12-01'),
          category: 'other',
          status: 'active',
          autoRenew: true,
          reimbursable: false,
          syncEnabled: false,
          splitAllocations,
        });
      });

      expect(result.current.subscriptions[0].splitAllocations).toEqual(splitAllocations);
    });
  });
});
