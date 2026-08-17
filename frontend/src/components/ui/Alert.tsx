import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  onClose,
  className = '',
  children,
  ...props
}) => {
  const styles: Record<NonNullable<AlertProps['variant']>, { bg: string; icon: React.ReactNode }> = {
    success: {
      bg: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-950/60 border-amber-500/30 text-amber-300',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-950/60 border-rose-500/30 text-rose-300',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    },
    info: {
      bg: 'bg-sky-950/60 border-sky-500/30 text-sky-300',
      icon: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
    },
  };

  const current = styles[variant];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md ${current.bg} ${className}`.trim()}
      role="alert"
      {...props}
    >
      {current.icon}
      <div className="flex-1 text-sm">
        {title && <h6 className="font-semibold mb-1 text-white">{title}</h6>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
