import React, { useState } from 'react';
import { Subscription, Category } from '@types/subscription';
import { normalizeToMonthly } from '@utils/calculations';
import { getCategoryColor, getCategoryLabel, formatCurrency } from '@utils/formatters';
import { PieChart } from 'lucide-react';

interface SpendingBreakdownProps {
  subscriptions: Subscription[];
}

interface CategorySpending {
  category: Category;
  amount: number;
  percentage: number;
}

export function SpendingBreakdown({ subscriptions }: SpendingBreakdownProps) {
  const [hoveredSegment, setHoveredSegment] = useState<CategorySpending | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Calculate spending by category
  const categorySpending = subscriptions
    .filter((sub) => sub.status === 'active')
    .reduce((acc, sub) => {
      const monthlyAmount = normalizeToMonthly(sub.amount, sub.billingFrequency);
      acc[sub.category] = (acc[sub.category] || 0) + monthlyAmount;
      return acc;
    }, {} as Record<Category, number>);

  // Calculate total spending
  const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);

  // Convert to array and calculate percentages
  const categoryData: CategorySpending[] = Object.entries(categorySpending)
    .map(([category, amount]) => ({
      category: category as Category,
      amount,
      percentage: (amount / totalSpending) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);

  const handleMouseEnter = (item: CategorySpending, e: React.MouseEvent) => {
    setHoveredSegment(item);
    updateTooltipPosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredSegment) {
      updateTooltipPosition(e);
    }
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
  };

  const updateTooltipPosition = (e: React.MouseEvent) => {
    const tooltipWidth = 220; // min-width from CSS
    const tooltipHeight = 100; // approximate height
    const offset = 16;

    // Check if tooltip would go off-screen on the right
    const wouldOverflowRight = e.clientX + offset + tooltipWidth > window.innerWidth;

    // Check if tooltip would go off-screen on the bottom
    const wouldOverflowBottom = e.clientY + offset + tooltipHeight > window.innerHeight;

    setTooltipPosition({
      x: wouldOverflowRight ? e.clientX - tooltipWidth - offset : e.clientX + offset,
      y: wouldOverflowBottom ? e.clientY - tooltipHeight - offset : e.clientY + offset,
    });
  };

  // If no spending data, show empty state
  if (categoryData.length === 0 || totalSpending === 0) {
    return (
      <div className="spending-breakdown-card">
        <div className="spending-breakdown-header">
          <div className="spending-breakdown-title-group">
            <PieChart className="spending-breakdown-icon" />
            <h3 className="spending-breakdown-title">Spending by Category</h3>
          </div>
        </div>
        <div className="spending-breakdown-empty">
          <p>No active subscriptions to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="spending-breakdown-card">
      <div className="spending-breakdown-header">
        <div className="spending-breakdown-title-group">
          <PieChart className="spending-breakdown-icon" />
          <h3 className="spending-breakdown-title">Spending by Category</h3>
        </div>
      </div>

      {/* Segmented bar chart */}
      <div className="spending-breakdown-bar-container">
        <div className="spending-breakdown-bar">
        {categoryData.map((item, index) => {
          const colors = getCategoryColor(item.category);
          return (
            <div
              key={item.category}
              className="spending-breakdown-segment"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: colors.border,
                borderTop: `1px solid ${colors.text}`,
                borderBottom: `1px solid ${colors.text}`,
                borderLeft: index === 0 ? `1px solid ${colors.text}` : 'none',
                borderRight: `1px solid ${colors.text}`,
                borderTopLeftRadius: index === 0 ? '9999px' : '0',
                borderBottomLeftRadius: index === 0 ? '9999px' : '0',
                borderTopRightRadius: index === categoryData.length - 1 ? '9999px' : '0',
                borderBottomRightRadius: index === categoryData.length - 1 ? '9999px' : '0',
              }}
              onMouseEnter={(e) => handleMouseEnter(item, e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredSegment && (
        <div
          className="spending-breakdown-tooltip"
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            pointerEvents: 'none',
          }}
        >
          <span
            className="spending-breakdown-tooltip-category"
            style={{
              backgroundColor: getCategoryColor(hoveredSegment.category).bg,
              color: getCategoryColor(hoveredSegment.category).text,
              border: `1px solid ${getCategoryColor(hoveredSegment.category).border}`,
            }}
          >
            {getCategoryLabel(hoveredSegment.category)}
          </span>
          <div className="spending-breakdown-tooltip-amount">
            {formatCurrency(hoveredSegment.amount)}
          </div>
          <div className="spending-breakdown-tooltip-percentage">
            {hoveredSegment.percentage.toFixed(1)}% of total spending
          </div>
        </div>
      )}
    </div>
  );
}
