import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();
  if (!toast) return null;

  const lower = toast.toLowerCase();

  // Classify toast type for appropriate icon, accent color, and border
  const isWarning = 
    lower.includes('please') ||
    lower.includes('cannot') ||
    lower.includes('empty') ||
    lower.includes('already') ||
    lower.includes('cancel') ||
    lower.includes('no worker') ||
    lower.includes('not matched') ||
    lower.includes('error') ||
    lower.includes('failed');

  const isInfo = 
    lower.includes('removed') ||
    lower.includes('dialing') ||
    lower.includes('reset') ||
    lower.includes('switched');

  let Icon = CheckCircle2;
  let iconColor = 'text-emerald-400';
  let borderColor = 'border-emerald-500/30';
  let glowColor = 'shadow-[0_12px_28px_rgba(16,185,129,0.22)]';

  if (isWarning) {
    Icon = AlertCircle;
    iconColor = 'text-amber-400';
    borderColor = 'border-amber-500/30';
    glowColor = 'shadow-[0_12px_28px_rgba(245,158,11,0.22)]';
  } else if (isInfo) {
    Icon = Info;
    iconColor = 'text-sky-400';
    borderColor = 'border-sky-500/30';
    glowColor = 'shadow-[0_12px_28px_rgba(56,189,248,0.22)]';
  }

  return (
    <div className="fixed top-14 sm:top-18 left-0 right-0 z-[70] flex justify-center px-4 pointer-events-none transition-all">
      <div className="w-full max-w-[390px] flex justify-center">
        <div
          onClick={hideToast}
          role="status"
          aria-live="polite"
          className={`pointer-events-auto cursor-pointer animate-toast-in bg-slate-900/95 text-white backdrop-blur-md border ${borderColor} ${glowColor} px-4 py-2.5 rounded-full flex items-center gap-2.5 max-w-full select-none active:scale-95 transition-all shadow-2xl`}
          title="Click to dismiss"
        >
          <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
          <span className="text-xs sm:text-[13px] font-semibold tracking-tight text-slate-100 leading-tight">
            {toast}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              hideToast();
            }}
            className="ml-1 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 transition-colors"
            title="Dismiss notification"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
