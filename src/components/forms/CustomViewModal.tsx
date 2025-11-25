import React, { useState } from 'react';
import { useSubscriptions } from '@contexts/SubscriptionContext';
import { CustomViewFilters, FamilyMemberFilterType } from '@types/customView';
import { Category } from '@types/subscription';
import { getCategoryLabel } from '@utils/formatters';

interface CustomViewModalProps {
  onSubmit: (name: string, filters: CustomViewFilters) => void;
  onCancel: () => void;
}

const categories: Category[] = [
  'entertainment',
  'utilities',
  'productivity',
  'health-fitness',
  'education',
  'shopping',
  'finance',
  'other',
];

export function CustomViewModal({ onSubmit, onCancel }: CustomViewModalProps) {
  const { familyMembers } = useSubscriptions();
  const [name, setName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [familyMemberFilters, setFamilyMemberFilters] = useState<Record<string, FamilyMemberFilterType>>({});
  const [reimbursableFilter, setReimbursableFilter] = useState<'all' | 'yes' | 'no'>('all');

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleFamilyMemberFilterChange = (memberId: string, type: FamilyMemberFilterType) => {
    setFamilyMemberFilters((prev) => ({
      ...prev,
      [memberId]: type,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a name for your custom view');
      return;
    }

    const filters: CustomViewFilters = {};

    if (selectedCategories.length > 0) {
      filters.categories = selectedCategories;
    }

    const memberFilters = Object.entries(familyMemberFilters)
      .filter(([_, type]) => type !== 'none')
      .map(([memberId, type]) => ({ memberId, type }));

    if (memberFilters.length > 0) {
      filters.familyMemberFilters = memberFilters;
    }

    if (reimbursableFilter !== 'all') {
      filters.reimbursable = reimbursableFilter === 'yes';
    }

    onSubmit(name, filters);
  };

  return (
    <div className="custom-view-modal">
      <h2>Create Custom View</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="view-name">View Name</label>
          <input
            id="view-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., My Expenses, Work Subscriptions"
            className="form-input"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Filter by Category</label>
          <div className="checkbox-grid">
            {categories.map((category) => (
              <label key={category} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
                <span>{getCategoryLabel(category)}</span>
              </label>
            ))}
          </div>
        </div>

        {familyMembers.length > 0 && (
          <div className="form-group">
            <label>Filter by Family Member</label>
            <div className="family-member-filters">
              {familyMembers.map((member) => (
                <div key={member.id} className="family-member-filter-row">
                  <div className="family-member-filter-name">{member.name}</div>
                  <div className="family-member-filter-options">
                    <label className="radio-label-inline">
                      <input
                        type="radio"
                        name={`family-${member.id}`}
                        checked={!familyMemberFilters[member.id] || familyMemberFilters[member.id] === 'none'}
                        onChange={() => handleFamilyMemberFilterChange(member.id, 'none')}
                      />
                      <span>None</span>
                    </label>
                    <label className="radio-label-inline">
                      <input
                        type="radio"
                        name={`family-${member.id}`}
                        checked={familyMemberFilters[member.id] === 'individual'}
                        onChange={() => handleFamilyMemberFilterChange(member.id, 'individual')}
                      />
                      <span>Individual</span>
                    </label>
                    <label className="radio-label-inline">
                      <input
                        type="radio"
                        name={`family-${member.id}`}
                        checked={familyMemberFilters[member.id] === 'shared'}
                        onChange={() => handleFamilyMemberFilterChange(member.id, 'shared')}
                      />
                      <span>Shared</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Filter by Reimbursable</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="reimbursable"
                checked={reimbursableFilter === 'all'}
                onChange={() => setReimbursableFilter('all')}
              />
              <span>All</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="reimbursable"
                checked={reimbursableFilter === 'yes'}
                onChange={() => setReimbursableFilter('yes')}
              />
              <span>Reimbursable Only</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="reimbursable"
                checked={reimbursableFilter === 'no'}
                onChange={() => setReimbursableFilter('no')}
              />
              <span>Non-Reimbursable Only</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create View
          </button>
        </div>
      </form>
    </div>
  );
}
