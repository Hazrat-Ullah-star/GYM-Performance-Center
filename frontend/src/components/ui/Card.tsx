import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  hoverEffect = true,
  className = '',
  children,
  ...props
}) => {
  const base = variant === 'glass' ? 'g-glass-card' : 'bg-dark-800 border border-secondary border-opacity-10 rounded-4';
  const hover = hoverEffect ? 'transition-all duration-300' : '';

  return (
    <div className={`${base} ${hover} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-4 border-b border-white/5 ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-4 ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-4 border-t border-white/5 ${className}`.trim()} {...props}>
    {children}
  </div>
);

export default Card;
