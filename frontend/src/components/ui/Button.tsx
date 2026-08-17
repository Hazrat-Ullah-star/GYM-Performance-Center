import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      className = '',
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyle =
      'inline-flex items-center justify-center font-semibold rounded-pill transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed';

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary: 'g-btn-primary border-0',
      secondary: 'bg-dark-700 text-white hover:bg-dark-600 border border-secondary border-opacity-20',
      outline: 'g-btn-outline',
      ghost: 'bg-transparent text-secondary hover:text-white hover:bg-white/5 border-0',
      danger: 'bg-red-600 text-white hover:bg-red-700 border-0',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`.trim()}
        {...props}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
        ) : leftIcon ? (
          <span className="inline-flex items-center me-1">{leftIcon}</span>
        ) : null}

        {children}

        {!loading && rightIcon && <span className="inline-flex items-center ms-1">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
