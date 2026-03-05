import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:opacity-90 active:scale-95 shadow-sm',
    secondary: 'border text-[var(--color-text)] hover:bg-black/5 active:scale-95',
    ghost: 'text-[var(--color-text)] hover:bg-black/5 active:scale-95',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      style={variant === 'secondary' ? { borderColor: 'var(--color-border)' } : undefined}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="spinner w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : icon}
      {children}
    </button>
  );
}
