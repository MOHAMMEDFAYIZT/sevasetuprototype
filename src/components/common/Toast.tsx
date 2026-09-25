import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-in max-w-sm w-[90%] pointer-events-none">
      <div className="bg-brand-950 text-white border border-brand-700/80 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5">
        <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0" />
        <span className="text-xs sm:text-sm font-bold leading-tight">{toast}</span>
      </div>
    </div>
  );
};
