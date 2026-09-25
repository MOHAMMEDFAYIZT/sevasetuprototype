import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { RuralBackdrop } from '../components/RuralBackdrop';
import { User, MapPin, ChevronRight, ArrowRight } from 'lucide-react';

export const AuthProfileView: React.FC = () => {
  const { user, updateUser, navigateTo, openLocationModal, showToast } = useApp();
  const [name, setName] = useState(user.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Manoj Kumar';
    updateUser({ name: finalName, isLoggedIn: true });
    showToast('Welcome to Seva Setu!');
    navigateTo('home');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between min-h-[640px] text-center px-6 pt-10 sm:pt-12 pb-0 bg-white">
      
      {/* Top Section: Logo & Form Stack */}
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Brand Logo */}
        <div className="mb-6">
          <Logo size="md" showTagline={true} />
        </div>

        {/* Center Setup Form */}
        <form onSubmit={handleSubmit} className="w-full text-left">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
              Tell us a bit about you
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              This helps us find the right workers for you.
            </p>
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
              Your name
            </label>
            <div className="flex items-center bg-white border border-slate-300 focus-within:border-brand-700 focus-within:ring-2 focus-within:ring-brand-100 rounded-2xl px-4 py-1 shadow-sm transition-all">
              <User className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full py-3.5 text-sm sm:text-base font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-400 placeholder:font-normal"
                autoFocus
              />
            </div>
          </div>

          {/* Work Location Picker */}
          <div className="mb-6">
            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
              Your work location
            </label>
            <div 
              onClick={openLocationModal}
              className="flex items-center justify-between bg-white border border-slate-300 hover:border-brand-400 hover:bg-slate-50 rounded-2xl px-4 py-3.5 shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <span className="text-sm sm:text-base font-semibold text-slate-900">{user.location}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 pl-1">
              Choose the area where you usually need workers.
            </p>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-base shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Bottom Countryside Artwork */}
      <RuralBackdrop />
    </div>
  );
};
