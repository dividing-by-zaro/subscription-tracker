import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Subscription, FilterOptions, DashboardMetrics } from '@types/subscription';
import { calculateMetrics, filterSubscriptions } from '@utils';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  filteredSubscriptions: Subscription[];
  metrics: DashboardMetrics;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  getSubscription: (id: string) => Subscription | undefined;
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
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    status: 'all',
    billingFrequency: 'all',
    familyMember: 'all',
    reimbursable: 'all',
    quickFilter: 'all',
    searchQuery: '',
  });

  // Load subscriptions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('subscriptions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
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
  }, []);

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

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

  const filteredSubscriptions = filterSubscriptions(subscriptions, filters);
  const metrics = calculateMetrics(subscriptions);

  const value: SubscriptionContextType = {
    subscriptions,
    filteredSubscriptions,
    metrics,
    filters,
    setFilters,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
  );
}
