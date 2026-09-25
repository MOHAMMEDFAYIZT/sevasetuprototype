import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const AppHeader: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isProfile = location.pathname === '/profile';

  return (
    <header className="sticky top-0 z-30 bg-[#F1F7F3]/95 backdrop-blur-md border-b border-[#E2EFE6] px-4 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between select-none shadow-[0_2px_12px_rgba(24,94,59,0.04)] w-full transition-colors">
      {/* Exact Brand Logo in a Single Horizontal Line */}
      <div 
        onClick={() => {
          if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            navigate('/');
          }
        }}
        className="flex items-center cursor-pointer active:scale-98 transition-transform"
        title="Seva Setu Home"
      >
        <img 
          src="/images/platform_logo_inline.png" 
          alt="Seva Sethu" 
          className="h-[30px] sm:h-[34px] w-auto block object-contain pointer-events-none select-none"
          loading="eager"
        />
      </div>

      {/* Profile Avatar Button with Forest Green Theme */}
      <button
        onClick={() => navigate('/profile')}
        className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
          isProfile 
            ? 'bg-[#185E3B] text-white ring-2 ring-[#185E3B] shadow-sm' 
            : 'bg-[#185E3B] hover:bg-[#12482d] text-white ring-2 ring-[#185E3B]/20'
        }`}
        title={`Profile: ${user.name}`}
      >
        <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
        <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border-[1.5px] border-white rounded-full"></span>
      </button>
    </header>
  );
};
