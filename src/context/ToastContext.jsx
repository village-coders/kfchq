import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const STYLES = {
  success: {
    wrap: 'bg-stone-950/95 text-white border-emerald-500/40',
    icon: 'bg-emerald-500/20 text-emerald-400',
    Icon: CheckCircle2
  },
  error: {
    wrap: 'bg-stone-950/95 text-white border-rose-500/40',
    icon: 'bg-rose-500/20 text-rose-400',
    Icon: AlertCircle
  },
  info: {
    wrap: 'bg-stone-950/95 text-white border-amber-500/40',
    icon: 'bg-amber-500/20 text-amber-400',
    Icon: Info
  }
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message, title) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { id, type, message, title }]);
      setTimeout(() => dismiss(id), type === 'error' ? 4500 : 3500);
    },
    [dismiss]
  );

  const toast = {
    success: (m, t = 'Submitted') => push('success', m, t),
    error: (m, t = 'Error') => push('error', m, t),
    info: (m, t = 'Notice') => push('info', m, t)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-[100] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((item) => {
          const st = STYLES[item.type] || STYLES.info;
          const IconComp = st.Icon;
          return (
            <div
              key={item.id}
              className={`pointer-events-auto backdrop-blur-md border rounded-2xl p-3.5 shadow-2xl flex items-start gap-3 ${st.wrap}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${st.icon}`}>
                <IconComp className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-xs font-bold tracking-tight">{item.title}</div>
                <div className="text-xs text-stone-300 mt-0.5 leading-snug">{item.message}</div>
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="p-1 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
