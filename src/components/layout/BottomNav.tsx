import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, Heart, User } from 'lucide-react';

interface BottomNavProps {
  isVisible?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isVisible = true }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isNavPage = ['/', '/jobs', '/favourites', '/profile'].includes(currentPath);

  if (!isNavPage) return null;

  const navItems = [
    { 
      to: '/', 
      label: 'Home', 
      icon: Home,
      isActive: currentPath === '/'
    },
    { 
      to: '/jobs', 
      label: 'My Jobs', 
      icon: Calendar,
      isActive: currentPath === '/jobs'
    },
    { 
      to: '/favourites', 
      label: 'Favourites', 
      icon: Heart,
      isActive: currentPath === '/favourites'
    },
    { 
      to: '/profile', 
      label: 'Profile', 
      icon: User,
      isActive: currentPath === '/profile'
    },
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
          const active = item.isActive;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={`ss-navbtn ${active ? 'on' : ''}`}
            >
              <Icon className={`w-[22px] h-[22px] ${active ? 'stroke-[2.2]' : 'stroke-[1.9]'}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

