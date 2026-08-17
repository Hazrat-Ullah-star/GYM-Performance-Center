import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message = 'An unexpected error occurred while loading data. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`g-glass-card text-center p-8 p-md-10 max-w-md mx-auto my-6 border-red-500/30 ${className}`.trim()}>
      <div className="d-flex justify-content-center text-red-500 mb-3">
        <AlertTriangle size={44} />
      </div>
      <h4 className="text-white fw-bold mb-2" style={{ fontFamily: 'Oswald', fontSize: '22px' }}>
        {title}
      </h4>
      <p className="text-secondary text-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <div className="d-flex justify-content-center">
          <Button variant="outline" onClick={onRetry} size="sm">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
