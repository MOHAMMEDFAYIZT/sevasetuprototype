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
  let iconColor = 'text-[#A5D63B]';
  let borderColor = 'border-[#3AAA48]/40';
  let glowColor = 'shadow-[0_12px_28px_rgba(10,90,57,0.35)]';

  if (isWarning) {
    Icon = AlertCircle;
    iconColor = 'text-[#FBF0CF]';
    borderColor = 'border-amber-400/40';
    glowColor = 'shadow-[0_12px_28px_rgba(180,83,9,0.3)]';
  } else if (isInfo) {
    Icon = Info;
    iconColor = 'text-[#E3ECFD]';
    borderColor = 'border-sky-400/40';
    glowColor = 'shadow-[0_12px_28px_rgba(14,116,144,0.3)]';
  }

  return (
    <div className="fixed bottom-[255px] sm:bottom-[265px] left-0 right-0 z-[70] flex justify-center px-4 pointer-events-none transition-all">
      <div className="w-full max-w-[380px] flex justify-center">
        <div
          onClick={hideToast}
          role="status"
          aria-live="polite"
          className={`pointer-events-auto cursor-pointer animate-toast-in bg-[#0A5A39]/95 text-white backdrop-blur-md border ${borderColor} ${glowColor} px-4 py-2.5 rounded-2xl flex items-center gap-2.5 max-w-full select-none active:scale-95 transition-all shadow-xl`}
          title="Click to dismiss"
        >
          <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
          <span className="text-xs sm:text-[13.5px] font-medium tracking-tight text-white leading-tight">
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
