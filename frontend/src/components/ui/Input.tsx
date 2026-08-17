import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, name, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id || name || defaultId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-secondary text-sm font-medium mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-secondary flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            className={`w-full bg-dark-900 border text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all duration-200 placeholder:text-gray-500
              ${leftIcon ? 'ps-10' : ''}
              ${rightIcon ? 'pe-10' : ''}
              ${error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'}
              ${className}`.trim()}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-secondary flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-red-500 fw-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-secondary">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
