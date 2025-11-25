import React from 'react';
import { CustomView } from '@types/customView';
import { X } from 'lucide-react';

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  customViews: CustomView[];
  onDeleteView?: (viewId: string) => void;
}

export function TabBar({ activeTab, onTabChange, customViews, onDeleteView }: TabBarProps) {
  const handleDeleteView = (e: React.MouseEvent, viewId: string) => {
    e.stopPropagation();
    if (onDeleteView && confirm('Are you sure you want to delete this view?')) {
      onDeleteView(viewId);
    }
  };

  return (
    <div className="tab-bar">
      <button
        className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
        onClick={() => onTabChange('overview')}
      >
        Overview
      </button>

      {customViews.map((view) => (
        <button
          key={view.id}
          className={`tab tab-custom ${activeTab === view.id ? 'tab-active' : ''}`}
          onClick={() => onTabChange(view.id)}
        >
          <span>{view.name}</span>
          {onDeleteView && (
            <button
              className="tab-delete"
              onClick={(e) => handleDeleteView(e, view.id)}
              aria-label="Delete view"
            >
              <X size={14} />
            </button>
          )}
        </button>
      ))}

      <button
        className="tab tab-add"
        onClick={() => onTabChange('create-custom-view')}
      >
        + Custom view
      </button>
    </div>
  );
}
