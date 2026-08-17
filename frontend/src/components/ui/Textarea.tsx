import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, name, rows = 4, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id || name || defaultId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-secondary text-sm font-medium mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          name={name}
          rows={rows}
          className={`w-full bg-dark-900 border text-white text-sm rounded-lg p-3.5 outline-none transition-all duration-200 placeholder:text-gray-500
            ${error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'}
            ${className}`.trim()}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-red-500 fw-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-secondary">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
