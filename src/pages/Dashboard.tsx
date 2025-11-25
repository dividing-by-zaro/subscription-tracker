import React, { useState } from 'react';
import { useSubscriptions } from '@contexts/SubscriptionContext';
import { Header } from '@components/layout/Header';
import { MetricsGrid } from '@components/dashboard/MetricsGrid';
import { SearchBar } from '@components/ui/SearchBar';
import { FilterBar } from '@components/ui/FilterBar';
import { SubscriptionTable } from '@components/subscriptions/SubscriptionTable';
import { SubscriptionForm } from '@components/forms/SubscriptionForm';
import { Subscription } from '@types/subscription';

export function Dashboard() {
  const {
    filteredSubscriptions,
    metrics,
    filters,
    setFilters,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions();

  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>(
    undefined
  );

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

  return (
    <div className="dashboard">
      <Header onAddSubscription={handleAddSubscription} />

      <main className="main-content">
        <MetricsGrid metrics={metrics} />

        <div className="subscriptions-section">
          <div className="filters-container">
            <SearchBar
              value={filters.searchQuery || ''}
              onChange={(value) => setFilters({ ...filters, searchQuery: value })}
            />
            <FilterBar filters={filters} onFilterChange={setFilters} />
          </div>

          <SubscriptionTable
            subscriptions={filteredSubscriptions}
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
    </div>
  );
}
