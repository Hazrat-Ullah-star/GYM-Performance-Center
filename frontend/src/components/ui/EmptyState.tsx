import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`g-glass-card text-center p-8 p-md-10 max-w-md mx-auto my-6 ${className}`.trim()}>
      {icon && <div className="d-flex justify-content-center text-warning mb-3">{icon}</div>}
      <h4 className="text-white fw-bold mb-2" style={{ fontFamily: 'Oswald', fontSize: '22px' }}>
        {title}
      </h4>
      {description && <p className="text-secondary text-sm mb-4 leading-relaxed">{description}</p>}
      {action && <div className="d-flex justify-content-center">{action}</div>}
    </div>
  );
};

export default EmptyState;
