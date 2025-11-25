# Subscription Tracker - Project Structure

## Overview
React + TypeScript + Vite application for tracking subscriptions and recurring payments.

## Directory Structure

```
subscription-tracker/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 dashboard/
│   │   │   ├── MetricCard.tsx          # Individual metric display card
│   │   │   └── MetricsGrid.tsx         # Grid of 5 summary metric cards
│   │   ├── 📁 subscriptions/
│   │   │   ├── SubscriptionTable.tsx   # Main table component
│   │   │   └── SubscriptionRow.tsx     # Individual subscription row with expandable details
│   │   ├── 📁 layout/
│   │   │   └── Header.tsx              # App header with title and "Add Subscription" button
│   │   ├── 📁 ui/
│   │   │   ├── SearchBar.tsx           # Search input with icon
│   │   │   └── FilterBar.tsx           # Quick filters and advanced filter dropdowns
│   │   └── 📁 forms/
│   │       └── SubscriptionForm.tsx    # Add/Edit subscription modal form
│   ├── 📁 contexts/
│   │   └── SubscriptionContext.tsx     # Global state management for subscriptions
│   ├── 📁 hooks/                       # (Empty - ready for custom hooks)
│   ├── 📁 pages/
│   │   └── Dashboard.tsx               # Main dashboard page component
│   ├── 📁 services/                    # (Empty - ready for API services)
│   ├── 📁 types/
│   │   ├── subscription.ts             # TypeScript interfaces and types
│   │   └── index.ts                    # Type exports
│   ├── 📁 utils/
│   │   ├── calculations.ts             # Metric calculations (monthly spend, annual projection, etc.)
│   │   ├── filters.ts                  # Subscription filtering logic
│   │   ├── formatters.ts               # Currency, date, and label formatting
│   │   └── index.ts                    # Utility exports
│   ├── 📁 styles/
│   │   └── index.css                   # Global styles and component styles
│   ├── App.tsx                         # Root app component with providers
│   ├── main.tsx                        # React entry point
│   └── vite-env.d.ts                   # Vite type definitions
├── 📁 public/                          # Static assets (empty)
├── index.html                          # HTML entry point
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript root config
├── tsconfig.app.json                   # TypeScript app config
├── tsconfig.node.json                  # TypeScript node config
├── vite.config.ts                      # Vite configuration with path aliases
├── eslint.config.js                    # ESLint configuration
├── .gitignore                          # Git ignore rules
├── README.md                           # Project documentation
└── spec.md                             # Product specification

```

## Key Features by File

### Type Definitions (`src/types/subscription.ts`)
- `Subscription` interface - Core data model
- `DashboardMetrics` interface - Calculated metrics
- `FilterOptions` interface - Filter state
- Enums for billing frequency, status, categories

### Utilities (`src/utils/`)
- **calculations.ts** - Financial calculations, metric aggregation
- **filters.ts** - Subscription filtering by various criteria
- **formatters.ts** - Display formatting for currency, dates, labels

### Context (`src/contexts/SubscriptionContext.tsx`)
- Global subscription state management
- CRUD operations (add, update, delete)
- Filtering logic integration
- localStorage persistence
- Automatic metric calculations

### Components

#### Dashboard Components
- **MetricCard** - Reusable card for displaying single metric
- **MetricsGrid** - Layout for 5 key metrics with icons

#### Subscription Components
- **SubscriptionTable** - Full table with headers and rows
- **SubscriptionRow** - Single subscription with expandable details

#### UI Components
- **SearchBar** - Text search with keyboard shortcut support (Cmd/Ctrl+K ready)
- **FilterBar** - Quick filter chips + advanced filter dropdowns

#### Layout Components
- **Header** - App title and primary action button

#### Form Components
- **SubscriptionForm** - Modal form for add/edit with validation

### Pages (`src/pages/Dashboard.tsx`)
Main dashboard orchestration:
- Metrics display
- Search and filter controls
- Subscription table
- Modal state management for add/edit

## Path Aliases
Configured in `tsconfig.json` and `vite.config.ts`:

```typescript
@/*           → src/*
@components/* → src/components/*
@hooks/*      → src/hooks/*
@utils/*      → src/utils/*
@types/*      → src/types/*
@contexts/*   → src/contexts/*
@services/*   → src/services/*
@pages/*      → src/pages/*
```

## Data Flow

1. **SubscriptionContext** holds all subscription data
2. **Dashboard** page consumes context
3. **Components** receive filtered data and callbacks
4. **User actions** trigger context updates
5. **localStorage** automatically syncs changes
6. **Metrics** recalculate on every change

## Next Steps

To run the application:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

## Implementation Status

✅ Complete:
- Project structure
- Type definitions
- Utility functions
- Context/state management
- All core components
- Styling
- Configuration files

🔄 Ready to implement:
- Calendar view
- Family member management
- External API integration
- Cloud sync
- Advanced analytics
