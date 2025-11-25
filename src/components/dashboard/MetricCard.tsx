import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({ title, value, subtitle, icon, className = '' }: MetricCardProps) {
  return (
    <div className={`metric-card ${className}`}>
      <div className="metric-card-header">
        {icon && <div className="metric-card-icon">{icon}</div>}
        <h3 className="metric-card-title">{title}</h3>
      </div>
      <div className="metric-card-value">{value}</div>
      {subtitle && <p className="metric-card-subtitle">{subtitle}</p>}
    </div>
  );
}
