import React from 'react';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, name, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id || name || defaultId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-secondary text-sm font-medium mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          name={name}
          className={`w-full bg-dark-900 border text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all duration-200
            ${error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'}
            ${className}`.trim()}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark-800 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="mt-1 text-xs text-red-500 fw-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-secondary">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
