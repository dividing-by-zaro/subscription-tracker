import React, { useState, useMemo, useEffect } from 'react';
import { useSubscriptions } from '@contexts/SubscriptionContext';
import { Header } from '@components/layout/Header';
import { MetricsGrid } from '@components/dashboard/MetricsGrid';
import { SpendingBreakdown } from '@components/dashboard/SpendingBreakdown';
import { SearchBar } from '@components/ui/SearchBar';
import { FilterBar } from '@components/ui/FilterBar';
import { SubscriptionTable } from '@components/subscriptions/SubscriptionTable';
import { SubscriptionForm } from '@components/forms/SubscriptionForm';
import { CustomViewModal } from '@components/forms/CustomViewModal';
import { Subscription } from '@types/subscription';
import { CustomView, CustomViewFilters } from '@types/customView';
import { calculateMetrics } from '@utils/calculations';

export function Dashboard() {
  const {
    subscriptions,
    filteredSubscriptions,
    metrics,
    filters,
    setFilters,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [customViews, setCustomViews] = useState<CustomView[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showCustomViewModal, setShowCustomViewModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>(
    undefined
  );

  // Load custom views from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customViews');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCustomViews(
        parsed.map((view: any) => ({
          ...view,
          createdAt: new Date(view.createdAt),
        }))
      );
    }
  }, []);

  // Save custom views to localStorage
  useEffect(() => {
    localStorage.setItem('customViews', JSON.stringify(customViews));
  }, [customViews]);

  const handleAddSubscription = () => {
    setEditingSubscription(undefined);
    setShowForm(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setShowForm(true);
  };

  const handleSubmit = (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingSubscription) {
      updateSubscription(editingSubscription.id, subscription);
    } else {
      addSubscription(subscription);
    }
    setShowForm(false);
    setEditingSubscription(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubscription(undefined);
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'create-custom-view') {
      setShowCustomViewModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleCreateCustomView = (name: string, filters: CustomViewFilters) => {
    const newView: CustomView = {
      id: `view-${Date.now()}`,
      name,
      filters,
      createdAt: new Date(),
    };
    setCustomViews((prev) => [...prev, newView]);
    setShowCustomViewModal(false);
    setActiveTab(newView.id);
  };

  const handleDeleteView = (viewId: string) => {
    setCustomViews((prev) => prev.filter((view) => view.id !== viewId));
    if (activeTab === viewId) {
      setActiveTab('overview');
    }
  };

  // Apply custom view filters
  const applyCustomViewFilters = (subs: Subscription[], viewFilters: CustomViewFilters): Subscription[] => {
    console.log('🔍 Applying custom view filters:', {
      totalSubscriptions: subs.length,
      filters: viewFilters,
    });

    const results = subs.filter((sub) => {
      // Filter by categories
      if (viewFilters.categories && viewFilters.categories.length > 0) {
        if (!viewFilters.categories.includes(sub.category)) {
          console.log(`❌ ${sub.serviceName}: Category ${sub.category} not in filter`, viewFilters.categories);
          return false;
        }
      }

      // Filter by family members
      if (viewFilters.familyMemberFilters && viewFilters.familyMemberFilters.length > 0) {
        let matchesFamilyFilter = false;

        for (const filter of viewFilters.familyMemberFilters) {
          const isSplit = sub.splitAllocations && sub.splitAllocations.length > 0;

          if (filter.type === 'individual') {
            // "Individual" means 100% ownership
            // This can be either:
            // 1. No splits with familyMember set
            // 2. Single 100% split allocation
            const hasNoSplit = !isSplit;
            const hasFamilyMember = sub.familyMember && sub.familyMember.id === filter.memberId;

            // Check if this is a 100% ownership via split allocations
            const is100PercentSplit = isSplit &&
              sub.splitAllocations.length === 1 &&
              sub.splitAllocations[0].familyMemberId === filter.memberId &&
              sub.splitAllocations[0].percentage === 100;

            console.log(`🔍 ${sub.serviceName} - Individual check:`, {
              isSplit,
              hasNoSplit,
              familyMember: sub.familyMember,
              filterMemberId: filter.memberId,
              hasFamilyMember,
              is100PercentSplit,
              splitAllocations: sub.splitAllocations,
            });

            if ((hasNoSplit && hasFamilyMember) || is100PercentSplit) {
              matchesFamilyFilter = true;
              break;
            }
          } else if (filter.type === 'shared') {
            // "Shared" means has a split allocation (but NOT 100% ownership)
            const is100PercentSplit = isSplit &&
              sub.splitAllocations.length === 1 &&
              sub.splitAllocations[0].percentage === 100;

            // It's shared if there are splits, the member is in the splits, and it's not 100% ownership
            if (isSplit && !is100PercentSplit && sub.splitAllocations.some(alloc => alloc.familyMemberId === filter.memberId)) {
              matchesFamilyFilter = true;
              break;
            }
          }
        }

        if (!matchesFamilyFilter) {
          console.log(`❌ ${sub.serviceName}: Does not match family member filter`);
          return false;
        }
      }

      // Filter by reimbursable
      if (viewFilters.reimbursable !== undefined) {
        if (sub.reimbursable !== viewFilters.reimbursable) {
          console.log(`❌ ${sub.serviceName}: Reimbursable mismatch`);
          return false;
        }
      }

      console.log(`✅ ${sub.serviceName}: PASSED all filters`);
      return true;
    });

    console.log(`✅ Final results: ${results.length} subscriptions matched`);
    return results;
  };

  // Get filtered subscriptions for current view
  const viewSubscriptions = useMemo(() => {
    if (activeTab === 'overview') {
      return filteredSubscriptions;
    }

    const currentView = customViews.find((view) => view.id === activeTab);
    if (!currentView) {
      return filteredSubscriptions;
    }

    // For custom views, apply view filters to ALL subscriptions, not just filteredSubscriptions
    // This ensures custom view filters work independently from Overview filters
    return applyCustomViewFilters(subscriptions, currentView.filters);
  }, [activeTab, customViews, subscriptions, filteredSubscriptions]);

  // Calculate metrics for current view
  const viewMetrics = useMemo(() => {
    if (activeTab === 'overview') {
      return metrics;
    }

    const currentView = customViews.find((view) => view.id === activeTab);
    if (!currentView) {
      return metrics;
    }

    const filtered = applyCustomViewFilters(subscriptions, currentView.filters);
    return calculateMetrics(filtered);
  }, [activeTab, customViews, subscriptions, metrics]);

  return (
    <div className="dashboard">
      <Header
        onAddSubscription={handleAddSubscription}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        customViews={customViews}
        onDeleteView={handleDeleteView}
      />

      <main className="main-content">
        <MetricsGrid metrics={viewMetrics} />

        <SpendingBreakdown subscriptions={viewSubscriptions} />

        <div className="subscriptions-section">
          <div className="filters-container">
            <SearchBar
              value={filters.searchQuery || ''}
              onChange={(value) => setFilters({ ...filters, searchQuery: value })}
            />
            <FilterBar filters={filters} onFilterChange={setFilters} />
          </div>

          <SubscriptionTable
            subscriptions={viewSubscriptions}
            onEdit={handleEditSubscription}
            onDelete={deleteSubscription}
          />
        </div>
      </main>

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <SubscriptionForm
              subscription={editingSubscription}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {showCustomViewModal && (
        <div className="modal-overlay" onClick={() => setShowCustomViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CustomViewModal
              onSubmit={handleCreateCustomView}
              onCancel={() => setShowCustomViewModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
