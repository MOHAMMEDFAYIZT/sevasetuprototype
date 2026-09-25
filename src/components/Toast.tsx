import React from 'react';
import { useApp } from '../context/AppContext';
import { Check } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-900 text-white text-sm font-bold shadow-2xl border border-brand-700">
        <span className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center text-xs">
          <Check className="w-3 h-3" />
        </span>
        <span>{toast}</span>
      </div>
    </div>
  );
};
