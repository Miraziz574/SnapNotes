

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div className={`${sizes[size]} spinner border-2 rounded-full`}
        style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }} />
      {message && <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{message}</p>}
    </div>
  );
}
