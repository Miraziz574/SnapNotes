import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useNotesStore } from '../../store/notesStore';
import type { Toast as ToastType } from '../../types';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const COLORS = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useNotesStore((s) => s.removeToast);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const Icon = ICONS[toast.type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-lg min-w-72 max-w-sm
        ${COLORS[toast.type]} transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <Icon size={18} className="flex-shrink-0" />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="opacity-70 hover:opacity-100 transition-opacity ml-1"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useNotesStore((s) => s.toasts);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
