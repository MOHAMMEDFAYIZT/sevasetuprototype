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
    <nav className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-nav h-16 flex items-center justify-around px-2 shrink-0">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = screen === item.id || 
          (item.id === 'home' && (screen === 'create-job' || screen === 'workers')) || 
          (item.id === 'jobs' && screen === 'job-detail');

        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all select-none cursor-pointer ${
              isActive ? 'text-brand-700 font-extrabold' : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 transition-transform duration-150 ${isActive ? 'scale-110 text-brand-700' : ''}`} />
            <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
