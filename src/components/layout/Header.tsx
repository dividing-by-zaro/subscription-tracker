import React from 'react';
import { TabBar } from '@components/ui/TabBar';
import { CustomView } from '@types/customView';

interface HeaderProps {
  onAddSubscription: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  customViews: CustomView[];
  onDeleteView: (viewId: string) => void;
}

export function Header({ onAddSubscription, activeTab, onTabChange, customViews, onDeleteView }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">Subscription Tracker</h1>
        <button onClick={onAddSubscription} className="btn-primary">
          + Add Subscription
        </button>
      </div>
      <TabBar
        activeTab={activeTab}
        onTabChange={onTabChange}
        customViews={customViews}
        onDeleteView={onDeleteView}
      />
    </header>
  );
}
