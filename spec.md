# Product Specification: Subscription Tracker Dashboard

## Overview
A subscription management dashboard that helps users track, manage, and analyze their recurring payments and one-time purchases in a centralized interface.

## Product Goals
- Provide clear visibility into monthly and annual subscription spending
- Enable users to track multiple subscriptions across different billing cycles
- Help users anticipate upcoming payments and avoid surprise charges
- Support multi-user/family tracking of subscriptions
- Identify reimbursable expenses for expense reporting

## Core Features

### 1. Dashboard Overview

#### 1.1 Summary Cards
Five key metric cards displayed prominently at the top of the dashboard:

**Monthly Spend**
- Displays total monthly recurring cost across all active subscriptions
- Shows count of active subscriptions contributing to this total
- Automatically calculates based on subscription billing frequencies
- Updates in real-time as subscriptions are added/removed/modified

**Lifetime Purchases**
- Tracks one-time purchases (non-recurring payments)
- Displays total spent on lifetime/permanent licenses
- Shows count of lifetime purchases

**Annual Projection**
- Calculates projected 12-month spend based on current active subscriptions
- Formula: Sum of (monthly subscriptions × 12) + (annual subscriptions) + (quarterly subscriptions × 4), etc.
- Clarifies calculation basis: "Based on current active subscriptions"
- Updates dynamically as subscriptions change

**Active Subscriptions**
- Displays total count of active subscriptions
- Shows same number as total count (differentiates from paused/cancelled)

**Upcoming Renewals**
- Shows count of subscriptions renewing within next 7 days
- Helps users anticipate upcoming charges
- Configurable time window (7 days default)

#### 1.2 View Modes
Multiple visualization options for subscription data:

**List View** (Default)
- Table format showing all subscription details
- Sortable columns
- Bulk selection capability

**Calendar View**
- Visual calendar showing billing dates
- Color-coded by category or amount
- Monthly/weekly/daily granularity

### 2. Subscription Management

#### 2.1 Add Subscription
Primary action button in top-right corner to add new subscriptions.

**Required Fields:**
- Service name
- Amount
- Billing frequency (Monthly, Annual, Quarterly, Weekly, One-time)
- Next billing date

**Optional Fields:**
- Category
- Family member/assigned user
- Payment method
- Notes
- Auto-renewal status
- Reimbursable flag (NEW)

#### 2.2 Subscription Table
Comprehensive table view with the following columns:

**Service**
- Service logo/icon
- Service name
- Sync status indicator (shows if connected to external account)
- Expandable row for additional details

**Family Member**
- Avatar and name of person using subscription
- Supports assignment to multiple members
- Filter subscriptions by member
- Allows "joint" purchases

**Category**
- Pre-defined categories: Entertainment, Utilities, Productivity, Health & Fitness, Education, etc.
- Custom category creation
- Color-coded badges

**Amount**
- Dollar amount per billing cycle
- Billing frequency label (Monthly, Annual, etc.)
- Normalized monthly cost for comparison

**Next Billing**
- Countdown format: "in X days"
- Specific date on hover/expansion
- Visual urgency indicators (red for < 3 days, yellow for < 7 days)

**Status**
- Active (green badge)
- Paused
- Cancelled
- Trial

**Reimbursable** 
- Boolean flag: Yes/No or checkbox
- Visual indicator (badge or icon)
- Enables filtering reimbursable vs. non-reimbursable expenses

### 3. Search and Filtering

#### 3.1 Search
- Full-text search across service names, categories, and notes
- Real-time filtering as user types
- Keyboard shortcut: Cmd/Ctrl + K

#### 3.2 Quick Filters
Pre-set time-based filters:
- **Today**: Subscriptions billing today
- **Upcoming**: Subscriptions billing soon (within 7 days)
- **This Week**: Subscriptions billing this week
- **This Month**: Subscriptions billing this month

#### 3.3 Advanced Filters
Dropdown filters for refined searching:
- **All Categories**: Filter by specific category
- **All Status**: Filter by subscription status
- **All Billing**: Filter by billing frequency
- **All Members**: Filter by family member
- **Next Billing**: Sort by next billing date
- **Reimbursable**: Filter to show only reimbursable or non-reimbursable (NEW)

### 4. Reimbursable Tracking

#### 4.1 Reimbursable Flag
- Each subscription can be marked as reimbursable or non-reimbursable
- Default: non-reimbursable
- Toggle available in:
  - Add/Edit subscription form
  - Inline editing in table view
  - Bulk edit for multiple subscriptions

#### 4.2 Reimbursable Calculations
- Monthly Spend card shows breakdown: Total / Reimbursable / Out-of-Pocket
- Annual Projection includes reimbursable breakdown
- Export function includes reimbursable flag for expense reports

#### 4.3 Reimbursable Filter
- Dedicated filter option to show:
  - All subscriptions
  - Reimbursable only
  - Non-reimbursable only
- Quick toggle in filter bar

### 5. Table Actions

#### 5.1 Table Options
- Column visibility controls
- Density settings (compact, comfortable, spacious)
- Row height adjustment
- Group by category/member/status

### 6. Subscription Details

#### 6.1 Expandable Rows

Clicking a subscription row expands to show:

- Full billing history
- Payment method details
- Notes and descriptions
- Edit/Delete actions
- Renewal settings
- Reimbursable status

## User Flows

### Primary User Flow: Adding a Subscription
1. User clicks "+ Add Subscription" button
2. Modal/form appears with subscription details
3. User enters service name, amount, billing frequency, next billing date
4. User selects category and assigns family member (optional)
5. User marks as reimbursable if applicable (NEW)
6. User saves subscription
7. Dashboard updates with new subscription
8. Summary cards recalculate automatically

## Technical Considerations

### Data Model
**Subscription Object:**
```javascript
{
  id: string,
  serviceName: string,
  amount: number,
  billingFrequency: 'monthly' | 'annual' | 'quarterly' | 'weekly' | 'one-time',
  nextBillingDate: Date,
  category: string,
  familyMember: string,
  status: 'active' | 'paused' | 'cancelled' | 'trial',
  paymentMethod: string,
  autoRenew: boolean,
  reimbursable: boolean, // NEW
  notes: string,
  createdAt: Date,
  updatedAt: Date,
  icon: string,
  syncEnabled: boolean
}
```

### Calculations
- **Monthly Spend**: Sum of all active subscriptions normalized to monthly cost
- **Annual Projection**: Monthly spend × 12 (accounting for annual-only subscriptions)
- **Upcoming Renewals**: Count of subscriptions where nextBillingDate is within 7 days
- **Reimbursable Monthly**: Sum of reimbursable subscriptions normalized to monthly cost
- **Reimbursable Annual**: Reimbursable monthly × 12

### Data Storage
- Local storage for quick access
- Cloud sync for multi-device access
- Backup and export functionality
- Encryption for sensitive payment data

## Future Enhancements
- Budget alerts when spending exceeds threshold
- Price change notifications
- Subscription recommendations and alternatives
- Sharing capabilities for family plans
- Integration with banking APIs for automatic tracking
- Analytics and insights (spending trends, category breakdown)
- Trial expiration reminders
- Duplicate subscription detection
- Currency conversion for international subscriptions
- Tax calculation for business expenses
- Receipt and invoice attachment
- Spending comparisons (month-over-month, year-over-year)

## Design Principles
- **Clarity**: Financial information presented clearly and unambiguously
- **Speed**: Quick access to key metrics without deep navigation
- **Flexibility**: Multiple views and filters to suit different use cases
- **Accuracy**: Precise calculations and up-to-date information
- **Actionability**: Clear next steps and actions for each subscription
- **Trust**: Secure handling of financial data