import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Heart } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/jobs', label: 'My Jobs', icon: FileText },
    { to: '/favourites', label: 'Favourites', icon: Heart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center">
      <div className="w-full max-w-md flex items-center justify-around px-6 pt-2 pb-1">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 transition-all select-none cursor-pointer ${
                  isActive ? 'text-[#1B5E3C]' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    className={`w-6 h-6 mb-1 transition-transform duration-150 ${
                      isActive ? 'stroke-[2.5] scale-105 text-[#1B5E3C]' : 'stroke-[1.8]'
                    }`} 
                  />
                  <span className={`text-[11px] tracking-tight ${isActive ? 'font-bold text-[#1B5E3C]' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* iOS Native Home Indicator Bar */}
      <div className="w-full flex justify-center pb-2 pt-0.5">
        <div className="w-32 h-1 bg-slate-900 rounded-full"></div>
      </div>
    </nav>
  );
};

