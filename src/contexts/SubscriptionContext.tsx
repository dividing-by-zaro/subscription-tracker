import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Subscription, FilterOptions, DashboardMetrics, FamilyMember } from '@types/subscription';
import { calculateMetrics, filterSubscriptions } from '@utils';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  filteredSubscriptions: Subscription[];
  metrics: DashboardMetrics;
  filters: FilterOptions;
  familyMembers: FamilyMember[];
  setFilters: (filters: FilterOptions) => void;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  getSubscription: (id: string) => Subscription | undefined;
  addFamilyMember: (name: string) => FamilyMember;
  deleteFamilyMember: (id: string) => void;
  updateFamilyMember: (id: string, name: string) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
}

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    status: 'all',
    billingFrequency: 'all',
    familyMember: 'all',
    reimbursable: 'all',
    quickFilter: 'all',
    searchQuery: '',
  });

  // Load subscriptions and family members from localStorage on mount
  useEffect(() => {
    const storedSubscriptions = localStorage.getItem('subscriptions');
    if (storedSubscriptions) {
      try {
        const parsed = JSON.parse(storedSubscriptions);
        // Convert date strings back to Date objects
        const subscriptionsWithDates = parsed.map((sub: Subscription) => ({
          ...sub,
          nextBillingDate: new Date(sub.nextBillingDate),
          createdAt: new Date(sub.createdAt),
          updatedAt: new Date(sub.updatedAt),
        }));
        setSubscriptions(subscriptionsWithDates);
      } catch (error) {
        console.error('Failed to parse subscriptions from localStorage:', error);
      }
    }

    const storedFamilyMembers = localStorage.getItem('familyMembers');
    let loadedMembers: FamilyMember[] = [];
    if (storedFamilyMembers) {
      try {
        const parsed = JSON.parse(storedFamilyMembers);
        loadedMembers = parsed;
      } catch (error) {
        console.error('Failed to parse family members from localStorage:', error);
      }
    }

    // Create default "Me" member if no family members exist
    if (loadedMembers.length === 0) {
      const defaultMember: FamilyMember = {
        id: crypto.randomUUID(),
        name: 'Me',
        isCurrentUser: true,
      };
      loadedMembers = [defaultMember];
    }

    setFamilyMembers(loadedMembers);
    setIsLoaded(true);
  }, []);

  // Save subscriptions to localStorage whenever they change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    }
  }, [subscriptions, isLoaded]);

  // Save family members to localStorage whenever they change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
    }
  }, [familyMembers, isLoaded]);

  const addSubscription = (
    subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSubscriptions((prev) => [...prev, newSubscription]);
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              ...updates,
              updatedAt: new Date(),
            }
          : sub
      )
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  };

  const getSubscription = (id: string) => {
    return subscriptions.find((sub) => sub.id === id);
  };

  const addFamilyMember = (name: string): FamilyMember => {
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name,
    };
    setFamilyMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const updateFamilyMember = (id: string, name: string) => {
    setFamilyMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, name } : member))
    );
  };

  const filteredSubscriptions = filterSubscriptions(subscriptions, filters);
  const metrics = calculateMetrics(subscriptions);

  const value: SubscriptionContextType = {
    subscriptions,
    filteredSubscriptions,
    metrics,
    filters,
    familyMembers,
    setFilters,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getSubscription,
    addFamilyMember,
    deleteFamilyMember,
    updateFamilyMember,
  };

  return (
    <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
  );
}
