import React from 'react';
import { SubscriptionProvider } from '@contexts/SubscriptionContext';
import { Dashboard } from '@pages/Dashboard';
import './styles/index.css';

function App() {
  return (
    <SubscriptionProvider>
      <Dashboard />
    </SubscriptionProvider>
  );
}

export default App;
