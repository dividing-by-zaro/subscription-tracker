export type BillingFrequency = 'monthly' | 'annual' | 'quarterly' | 'weekly' | 'one-time';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'trial';
export type Category =
  | 'entertainment'
  | 'utilities'
  | 'productivity'
  | 'health-fitness'
  | 'education'
  | 'shopping'
  | 'finance'
  | 'other';

export interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  isCurrentUser?: boolean;
}

export interface SplitAllocation {
  familyMemberId: string;
  percentage: number;
}

export interface Subscription {
  id: string;
  serviceName: string;
  amount: number;
  billingFrequency: BillingFrequency;
  nextBillingDate: Date;
  category: Category;
  familyMember?: FamilyMember;
  splitAllocations?: SplitAllocation[];
  status: SubscriptionStatus;
  paymentMethod?: string;
  autoRenew: boolean;
  reimbursable: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  icon?: string;
  syncEnabled: boolean;
}

export interface DashboardMetrics {
  monthlySpend: number;
  monthlySpendReimbursable: number;
  monthlySpendOutOfPocket: number;
  lifetimePurchases: number;
  lifetimePurchasesCount: number;
  annualProjection: number;
  annualProjectionReimbursable: number;
  activeSubscriptions: number;
  upcomingRenewals: number;
}

export type ViewMode = 'list' | 'calendar';

export type QuickFilter = 'all' | 'today' | 'upcoming' | 'this-week' | 'this-month';

export interface FilterOptions {
  category?: Category | 'all';
  status?: SubscriptionStatus | 'all';
  billingFrequency?: BillingFrequency | 'all';
  familyMember?: string | 'all';
  reimbursable?: boolean | 'all';
  quickFilter?: QuickFilter;
  searchQuery?: string;
}
