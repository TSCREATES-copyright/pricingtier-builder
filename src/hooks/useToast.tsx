import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastVariant, ToastAction } from '../types/toast';

interface ToastContextType {
  toasts: Toast[];
  toast: (message: string, variant?: ToastVariant, duration?: number, action?: ToastAction) => void;
  removeToast: (id: string) => void;
  confirmDestructive: (message: string, onConfirm: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isLeaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300); // match animation duration
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration: number = 4000, action?: ToastAction) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, variant, message, duration, action };
      
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const confirmDestructive = useCallback(
    (message: string, onConfirm: () => void) => {
      toast(message, 'warning', 0, {
        label: 'Confirm',
        onClick: () => {
          onConfirm();
        },
      });
    },
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast, confirmDestructive }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
