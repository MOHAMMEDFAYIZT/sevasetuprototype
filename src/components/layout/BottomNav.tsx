import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, Heart, User } from 'lucide-react';

interface BottomNavProps {
  isVisible?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isVisible = true }) => {
  const location = useLocation();
  const isMainTab = ['/', '/jobs', '/favourites', '/profile'].includes(location.pathname);

  if (!isMainTab) return null;

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/jobs', label: 'My Jobs', icon: Calendar },
    { to: '/favourites', label: 'Favourites', icon: Heart },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav 
      className={`ss-navwrap transition-all duration-300 ease-out ${
        isVisible 
          ? 'translate-y-0 opacity-100 pointer-events-auto' 
          : 'translate-y-[120px] opacity-0 pointer-events-none'
      }`} 
      aria-label="Main menu"
    >
      <div className="ss-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `ss-navbtn ${isActive ? 'on' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2.2]' : 'stroke-[1.9]'}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

