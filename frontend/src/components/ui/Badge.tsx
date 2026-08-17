import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral';
  pill?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  pill = true,
  className = '',
  children,
  ...props
}) => {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    success: 'bg-success bg-opacity-20 text-success border border-success border-opacity-30',
    warning: 'bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30',
    danger: 'bg-danger bg-opacity-20 text-danger border border-danger border-opacity-30',
    info: 'bg-info bg-opacity-20 text-info border border-info border-opacity-30',
    primary: 'bg-orange-500 bg-opacity-20 text-orange-400 border border-orange-500 border-opacity-30',
    neutral: 'bg-secondary bg-opacity-20 text-light border border-secondary border-opacity-30',
  };

  const rounded = pill ? 'rounded-pill' : 'rounded-md';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold ${variants[variant]} ${rounded} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
