import { Category } from './subscription';

export type FamilyMemberFilterType = 'individual' | 'shared' | 'none';

export interface FamilyMemberFilter {
  memberId: string;
  type: FamilyMemberFilterType;
}

export interface CustomViewFilters {
  categories?: Category[];
  familyMemberFilters?: FamilyMemberFilter[];
  reimbursable?: boolean;
}

export interface CustomView {
  id: string;
  name: string;
  filters: CustomViewFilters;
  createdAt: Date;
}
