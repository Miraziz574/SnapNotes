import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in">
      <div className="mb-4 opacity-30 text-[var(--color-text)]">{icon}</div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{title}</h3>
      {description && (
        <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
