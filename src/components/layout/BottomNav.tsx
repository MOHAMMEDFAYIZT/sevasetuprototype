import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Heart, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const isMainTab = ['/', '/jobs', '/favourites', '/profile'].includes(location.pathname);

  if (!isMainTab) return null;

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/jobs', label: 'My Jobs', icon: FileText },
    { to: '/favourites', label: 'Favourites', icon: Heart },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav 
      aria-label="Main menu"
      className="absolute bottom-0 left-0 right-0 z-40 w-full h-[64px] sm:h-[68px] bg-[#0C6B44] border-t border-[#3AAA48]/40 shadow-[0_-4px_24px_rgba(12,107,68,0.2)] px-2.5 flex items-center justify-around select-none"
    >
      {navItems.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors duration-150 select-none cursor-pointer ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-white/75 hover:text-white font-normal'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon 
                  className={`w-[22px] h-[22px] transition-all duration-150 ${
                    isActive 
                      ? 'text-white stroke-[2.4] scale-105' 
                      : 'text-white/75 stroke-[1.8]'
                  }`} 
                />
                <span className={`text-[11px] tracking-tight leading-tight ${
                  isActive ? 'text-white font-medium' : 'text-white/75'
                }`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

