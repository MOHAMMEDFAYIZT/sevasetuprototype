import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, screen, navigateTo, openLocationModal } = useApp();

  const isAuthScreen = ['auth-phone', 'auth-otp', 'auth-profile'].includes(screen);
  if (isAuthScreen) return null;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
      
      {/* Brand Title */}
      <div 
        onClick={() => navigateTo('home')} 
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
          <svg className="w-4 h-4" viewBox="0 0 120 100" fill="none">
            <circle cx="38" cy="22" r="10" fill="#185E3B" />
            <path d="M18 64C18 44 26 34 46 34C60 34 68 46 72 58C62 50 48 48 38 52C28 56 22 64 18 64Z" fill="#185E3B" />
            <circle cx="82" cy="22" r="10" fill="#E88A1A" />
            <path d="M102 64C102 44 94 34 74 34C60 34 52 46 48 58C58 50 72 48 82 52C92 56 98 64 102 64Z" fill="#E88A1A" />
            <path d="M30 62L60 38L90 62" stroke="#185E3B" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-lg font-extrabold text-brand-700 tracking-tight">
          Seva Setu
        </span>
      </div>

      {/* Locality Pill */}
      <button 
        onClick={openLocationModal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-brand-50 border border-slate-200 text-xs font-bold text-slate-800 transition-all shadow-sm active:scale-95"
        title="Change Location"
      >
        <MapPin className="w-3.5 h-3.5 text-saffron-600" />
        <span className="max-w-[140px] truncate">{user.location}</span>
      </button>

    </header>
  );
};
