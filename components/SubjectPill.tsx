'use client';

interface SubjectPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function SubjectPill({ label, active, onClick }: SubjectPillProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${
        active
          ? 'bg-ios-blue dark:bg-ios-blue-dark text-white shadow-ios'
          : 'bg-ios-surface dark:bg-ios-surface-dark text-ios-label dark:text-ios-label-dark shadow-ios hover:shadow-ios-md'
      }`}
    >
      {label}
    </button>
  );
}
