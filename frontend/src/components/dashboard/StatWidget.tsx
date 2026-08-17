import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatWidgetProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatWidget: React.FC<StatWidgetProps> = ({
  title,
  value,
  unit,
  change,
  isPositive = true,
  icon,
  iconBgColor = 'rgba(243, 97, 0, 0.15)',
  iconColor = '#f36100',
}) => {
  return (
    <div className="g-glass-card p-4 h-100">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <span className="text-secondary text-xs uppercase tracking-wider">{title}</span>
          <h2 className="text-white fw-bold mt-1 mb-0" style={{ fontFamily: 'Oswald', fontSize: '32px' }}>
            {value} {unit && <span className="text-sm font-sans text-secondary">{unit}</span>}
          </h2>
        </div>
        <div
          className="rounded-circle p-3 d-flex align-items-center justify-content-center"
          style={{ background: iconBgColor, color: iconColor }}
        >
          {icon}
        </div>
      </div>
      {change && (
        <small className={`text-xs d-flex align-items-center gap-1 ${isPositive ? 'text-success' : 'text-danger'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {change}
        </small>
      )}
    </div>
  );
};

export default StatWidget;
