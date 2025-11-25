import React from 'react';

interface HeaderProps {
  onAddSubscription: () => void;
}

export function Header({ onAddSubscription }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">Subscription Tracker</h1>
        <button onClick={onAddSubscription} className="btn-primary">
          + Add Subscription
        </button>
      </div>
    </header>
  );
}
