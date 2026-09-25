import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MapPin, Briefcase, Heart, User, Home, Plus } from 'lucide-react';

import { Logo } from '../common/Logo';

export const Navbar: React.FC = () => {
  const { user, openLocationModal } = useApp();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/jobs', label: 'My Jobs', icon: Briefcase },
    { to: '/favourites', label: 'Saved Workers', icon: Heart },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2 select-none shrink-0 group">
          <Logo variant="leaf" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-700' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Locality Selector & Post Job CTA */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={openLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-brand-50 border border-slate-200 text-xs font-bold text-slate-800 transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Change Location"
          >
            <MapPin className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
            <span className="max-w-[120px] sm:max-w-[160px] truncate">{user.location}</span>
          </button>

          <Link
            to="/create-job"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-black shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Worker</span>
          </Link>
        </div>

      </div>
    </header>
  );
};
