import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center p-4 gap-3 ${className}`.trim()}>
      <div
        className={`${sizeClasses} border-orange-500 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label={label || 'Loading...'}
      />
      {label && <p className="text-secondary text-sm font-medium">{label}</p>}
    </div>
  );
};

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string | number;
  width?: string | number;
  rounded?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  height = '20px',
  width = '100%',
  rounded = '8px',
  className = '',
  style,
  ...props
}) => (
  <div
    className={`g-skeleton ${className}`.trim()}
    style={{
      height: typeof height === 'number' ? `${height}px` : height,
      width: typeof width === 'number' ? `${width}px` : width,
      borderRadius: rounded,
      ...style,
    }}
    {...props}
  />
);

export const LoadingOverlay: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => (
  <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <LoadingSpinner size="lg" label={label} />
  </div>
);
