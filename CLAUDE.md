# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development & Build
- `npm run dev` - Start Vite development server (default port 5173)
- `npm run build` - TypeScript compilation + production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on codebase

### Testing
- `npm test` - Run all tests in watch mode
- `npm run test:ui` - Open Vitest UI for interactive testing
- `npm run test:coverage` - Generate test coverage report with thresholds (80% required)
- `npx vitest run` - Run tests once without watch mode
- `npx vitest run path/to/file.test.tsx` - Run a specific test file

## Architecture Overview

### State Management Pattern
This application uses **React Context + Local Storage** for state management, not Redux or other state libraries. All subscription data is managed through `SubscriptionContext` (`src/contexts/SubscriptionContext.tsx`), which:
- Provides centralized subscription CRUD operations
- Automatically persists to localStorage on every change
- Handles date serialization/deserialization (convert between Date objects and strings)
- Computes derived state: filtered subscriptions and dashboard metrics
- All components access this via `useSubscriptions()` hook

### Data Flow Architecture
1. **Single Source of Truth**: `SubscriptionContext` holds all subscriptions array
2. **Automatic Persistence**: Every subscription change triggers localStorage save
3. **Derived State**: Filters and metrics are computed from subscriptions, not stored separately
4. **Date Handling**: Dates are Date objects in memory, strings in localStorage

### Path Aliases
The project uses TypeScript path aliases (configured in both tsconfig.json and vite.config.ts):
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@hooks/*` → `src/hooks/*`
- `@utils/*` → `src/utils/*`
- `@types/*` → `src/types/*`
- `@contexts/*` → `src/contexts/*`
- `@services/*` → `src/services/*`
- `@pages/*` → `src/pages/*`

**Always use path aliases for imports**, never relative paths like `../../utils/`.

### Core Utilities Organization
Three main utility modules handle business logic:
- **`calculations.ts`**: Metric computations (monthly spend, annual projection, upcoming renewals), billing frequency normalization
- **`filters.ts`**: All subscription filtering logic (search, quick filters, advanced filters)
- **`formatters.ts`**: Display formatting (currency, dates, billing frequencies)

### Testing Setup
- **Test Framework**: Vitest with jsdom environment
- **Setup File**: `src/test/setup.ts` - mocks localStorage, window.matchMedia, window.confirm
- **Test Utilities**: `src/test/testUtils.tsx` - provides wrapper with SubscriptionContext
- **Mock Data**: `src/test/mockData.ts` - shared test fixtures
- **Coverage Thresholds**: 80% for lines, functions, branches, statements
- **Test Naming**: `*.test.tsx` for components, `*.test.ts` for utilities
- Always use the test utilities wrapper when testing components that need SubscriptionContext

### Subscription Data Model
Key fields in the `Subscription` interface:
- `billingFrequency`: `'monthly' | 'annual' | 'quarterly' | 'weekly' | 'one-time'`
- `status`: `'active' | 'paused' | 'cancelled' | 'trial'`
- `category`: 8 predefined categories (entertainment, utilities, productivity, etc.)
- `reimbursable`: boolean for expense tracking
- `nextBillingDate`: Date object (critical for renewal tracking)
- One-time purchases have `billingFrequency: 'one-time'` and don't contribute to monthly/annual spend

### Component Organization
- **dashboard/**: Metric cards and grid displaying financial summaries
- **subscriptions/**: Table and row components for subscription list
- **forms/**: SubscriptionForm handles both add and edit operations
- **ui/**: Reusable components (SearchBar, FilterBar) - no business logic
- **layout/**: Header and other layout components

## Development Guidelines

### Date Handling
- Always use `date-fns` for date manipulation (already imported throughout codebase)
- Dates in localStorage are ISO strings, convert with `new Date(dateString)` on load
- Use `startOfToday()`, `addDays()`, `isWithinInterval()` from date-fns

### Billing Frequency Calculations
The `normalizeToMonthly()` function standardizes all billing frequencies to monthly equivalents:
- Annual: divide by 12
- Quarterly: divide by 3
- Weekly: multiply by 52, divide by 12
- One-time: returns 0 (doesn't contribute to recurring spend)

### Filtering System
Filters are applied in this order (see `filters.ts`):
1. Search query (searches serviceName, category, notes)
2. Quick filters (today, upcoming, this-week, this-month)
3. Advanced filters (category, status, billing frequency, family member, reimbursable)

### Component Patterns
- Use functional components with TypeScript interfaces for props
- Destructure props in function signature
- Import from path aliases, not relative paths
- Keep business logic in utils, components should be thin
