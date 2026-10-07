import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Briefcase, Heart, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { screen, navigateTo } = useApp();

  const isAuthScreen = ['auth-phone', 'auth-otp', 'auth-profile'].includes(screen);
  if (isAuthScreen) return null;

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'jobs' as const, label: 'My Jobs', icon: Briefcase },
    { id: 'favourites' as const, label: 'Favourites', icon: Heart },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="absolute bottom-3 left-3 right-3 z-30 pointer-events-none">
      <nav className="w-full h-[62px] bg-[#0C6B44] rounded-full shadow-[0_12px_32px_rgba(12,107,68,0.35)] border border-[#3AAA48]/40 flex items-center justify-around px-2 pointer-events-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = screen === item.id || 
            (item.id === 'home' && (screen === 'create-job' || screen === 'workers')) || 
            (item.id === 'jobs' && screen === 'job-detail');

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors duration-150 select-none cursor-pointer ${
                isActive ? 'text-white font-semibold' : 'text-white/75 hover:text-white font-normal'
              }`}
            >
              <Icon className={`w-[22px] h-[22px] transition-all duration-150 ${
                isActive 
                  ? 'text-white stroke-[2.4] scale-105' 
                  : 'text-white/75 stroke-[1.8]'
              }`} />
              <span className={`text-[11px] tracking-tight leading-tight ${
                isActive ? 'text-white font-medium' : 'text-white/75'
              }`}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
