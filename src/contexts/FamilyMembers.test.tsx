import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { SubscriptionProvider, useSubscriptions } from './SubscriptionContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <SubscriptionProvider>{children}</SubscriptionProvider>
);

describe('Family Member Management', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Default "Me" member creation', () => {
    it('should create a default "Me" member on first load', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
        expect(result.current.familyMembers[0].name).toBe('Me');
        expect(result.current.familyMembers[0].isCurrentUser).toBe(true);
      });
    });

    it('should not create duplicate "Me" member if family members already exist', async () => {
      const existingMembers = [
        { id: 'test-1', name: 'Existing Member', isCurrentUser: false },
      ];
      localStorage.setItem('familyMembers', JSON.stringify(existingMembers));

      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
        expect(result.current.familyMembers[0].name).toBe('Existing Member');
      });
    });
  });

  describe('addFamilyMember', () => {
    it('should add a new family member', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
      });

      let newMember;
      act(() => {
        newMember = result.current.addFamilyMember('John Doe');
      });

      expect(newMember).toBeDefined();
      expect(newMember.name).toBe('John Doe');
      expect(newMember.id).toBeDefined();
      expect(result.current.familyMembers).toHaveLength(2);
    });

    it('should return the newly created member with an ID', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
      });

      let newMember;
      act(() => {
        newMember = result.current.addFamilyMember('Jane Doe');
      });

      expect(newMember.id).toBeTruthy();
      expect(typeof newMember.id).toBe('string');
    });

    it('should add family member to the list', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
      });

      act(() => {
        result.current.addFamilyMember('Test Member');
      });

      expect(result.current.familyMembers).toHaveLength(2);
      const testMember = result.current.familyMembers.find((m) => m.name === 'Test Member');
      expect(testMember).toBeDefined();
    });
  });

  describe('deleteFamilyMember', () => {
    it('should remove a family member by ID', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
      });

      let memberId;
      act(() => {
        const member = result.current.addFamilyMember('To Delete');
        memberId = member.id;
      });

      expect(result.current.familyMembers).toHaveLength(2);

      act(() => {
        result.current.deleteFamilyMember(memberId);
      });

      expect(result.current.familyMembers).toHaveLength(1);
      expect(result.current.familyMembers.find((m) => m.id === memberId)).toBeUndefined();
    });

  });

  describe('updateFamilyMember', () => {
    it('should update a family member name', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
      });

      let memberId;
      act(() => {
        const member = result.current.addFamilyMember('Old Name');
        memberId = member.id;
      });

      act(() => {
        result.current.updateFamilyMember(memberId, 'New Name');
      });

      const updatedMember = result.current.familyMembers.find((m) => m.id === memberId);
      expect(updatedMember?.name).toBe('New Name');
    });


    it('should not affect other family members', async () => {
      const { result } = renderHook(() => useSubscriptions(), { wrapper });

      await waitFor(() => {
        expect(result.current.familyMembers).toHaveLength(1);
      });

      let member1Id, member2Id;
      act(() => {
        member1Id = result.current.addFamilyMember('Member 1').id;
        member2Id = result.current.addFamilyMember('Member 2').id;
      });

      act(() => {
        result.current.updateFamilyMember(member1Id, 'Updated Member 1');
      });

      const member2 = result.current.familyMembers.find((m) => m.id === member2Id);
      expect(member2?.name).toBe('Member 2');
    });
  });
});
