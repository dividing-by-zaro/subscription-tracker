# Subscription Tracker Dashboard

A React + TypeScript dashboard application for tracking and managing recurring subscriptions and one-time purchases.

## Features

### Dashboard Overview
- **Summary Cards**: Monthly spend, lifetime purchases, annual projection, active subscriptions, and upcoming renewals
- **Multi-view Support**: List view (default) and calendar view (coming soon)

### Subscription Management
- Add, edit, and delete subscriptions
- Track billing frequency (monthly, annual, quarterly, weekly, one-time)
- Categorize subscriptions
- Assign subscriptions to family members
- Mark subscriptions as reimbursable for expense tracking
- Track subscription status (active, paused, cancelled, trial)

### Search & Filtering
- Full-text search across service names, categories, and notes
- Quick filters: Today, Upcoming, This Week, This Month
- Advanced filters: Category, Status, Billing Frequency, Family Member, Reimbursable
- Real-time filtering as you type

### Reimbursable Tracking
- Mark subscriptions as reimbursable
- View reimbursable vs. out-of-pocket breakdown
- Filter by reimbursable status
- Export for expense reporting

## Project Structure

```
subscription-tracker/
├── src/
│   ├── components/
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── MetricCard.tsx
│   │   │   └── MetricsGrid.tsx
│   │   ├── subscriptions/   # Subscription list components
│   │   │   ├── SubscriptionTable.tsx
│   │   │   └── SubscriptionRow.tsx
│   │   ├── layout/          # Layout components
│   │   │   └── Header.tsx
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── SearchBar.tsx
│   │   │   └── FilterBar.tsx
│   │   └── forms/           # Form components
│   │       └── SubscriptionForm.tsx
│   ├── contexts/            # React contexts
│   │   └── SubscriptionContext.tsx
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   │   └── Dashboard.tsx
│   ├── services/            # External services/API calls
│   ├── types/               # TypeScript type definitions
│   │   └── subscription.ts
│   ├── utils/               # Utility functions
│   │   ├── calculations.ts  # Metric calculations
│   │   ├── filters.ts       # Filter logic
│   │   └── formatters.ts    # Formatting helpers
│   ├── styles/              # CSS styles
│   │   └── index.css
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── README.md

```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **date-fns** - Date manipulation
- **lucide-react** - Icon library
- **Local Storage** - Data persistence

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Data Model

### Subscription Object
```typescript
{
  id: string;
  serviceName: string;
  amount: number;
  billingFrequency: 'monthly' | 'annual' | 'quarterly' | 'weekly' | 'one-time';
  nextBillingDate: Date;
  category: string;
  familyMember?: FamilyMember;
  status: 'active' | 'paused' | 'cancelled' | 'trial';
  paymentMethod?: string;
  autoRenew: boolean;
  reimbursable: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  icon?: string;
  syncEnabled: boolean;
}
```

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@/*` - src directory
- `@components/*` - components directory
- `@hooks/*` - hooks directory
- `@utils/*` - utils directory
- `@types/*` - types directory
- `@contexts/*` - contexts directory
- `@services/*` - services directory
- `@pages/*` - pages directory

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use functional components with hooks
- Prefer TypeScript interfaces for props
- Use path aliases for imports
- Keep components focused and single-purpose

## Future Enhancements

- Calendar view for subscriptions
- Budget alerts
- Price change notifications
- Bank API integration for automatic tracking
- Analytics and spending insights
- Multi-device cloud sync
- Receipt attachment
- Duplicate detection
