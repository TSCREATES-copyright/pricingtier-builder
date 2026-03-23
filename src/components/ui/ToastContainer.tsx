import React, { useEffect, useState, useRef } from 'react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../types/toast';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (toast.duration && toast.duration > 0 && !isHovered) {
      timerRef.current = setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [toast.duration, toast.id, isHovered, removeToast]);

  const isLeaving = toast.isLeaving;
  
  const variants = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto flex items-center gap-3 w-80 p-4 rounded-xl border shadow-lg transition-all duration-300 ${
        variants[toast.variant]
      } ${
        isLeaving
          ? 'opacity-0 translate-y-2 scale-95'
          : 'animate-in slide-in-from-bottom-5 fade-in'
      }`}
    >
      <div className="shrink-0">{icons[toast.variant]}</div>
      <div className="flex-1 text-sm font-medium">{toast.message}</div>
      
      {toast.action && (
        <button
          onClick={() => {
            toast.action!.onClick();
            removeToast(toast.id);
          }}
          className="shrink-0 px-3 py-1.5 text-xs font-bold rounded-md bg-white/50 hover:bg-white/80 transition-colors shadow-sm border border-black/5"
        >
          {toast.action.label}
        </button>
      )}

      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors opacity-60 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
