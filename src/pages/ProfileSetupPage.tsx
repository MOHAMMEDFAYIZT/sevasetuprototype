import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RuralBackdrop } from '../components/common/RuralBackdrop';
import { User, MapPin, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

export const ProfileSetupPage: React.FC = () => {
  const { user, updateUser, openLocationModal, showToast } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Manoj Kumar';
    updateUser({ name: finalName, isLoggedIn: true });
    showToast('Profile created! Welcome to Seva Setu.');
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7f5] flex justify-center items-center sm:py-6 selection:bg-brand-100 selection:text-brand-900">
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[860px] bg-white sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(20,80,50,0.12)] sm:border sm:border-slate-200/80 flex flex-col justify-between items-center text-center px-0 pt-0 pb-0 relative overflow-hidden">
        
        {/* Floating Functional Back Button (does not displace logo) */}
        <button
          type="button"
          onClick={() => navigate('/verify-otp')}
          className="absolute top-4 left-4 sm:top-6 sm:left-5 z-20 p-2 text-slate-800 hover:text-black hover:bg-slate-100 rounded-full transition-colors cursor-pointer flex items-center justify-center"
          title="Back to OTP verification"
          aria-label="Back to OTP verification"
        >
          <ChevronLeft className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Top Logo Section - Exactly matching Splash Page placement and sizing */}
        <div className="w-full flex justify-center pt-24 sm:pt-28 pb-2 select-none">
          <img 
            src="/images/splash_logo_clean.png" 
            alt="Seva Sethu"
            className="w-[280px] sm:w-[320px] h-auto block select-none pointer-events-none"
            loading="eager"
          />
        </div>

        {/* Form Content Area */}
        <div className="w-full max-w-[360px] px-6 mx-auto flex-1 flex flex-col justify-start pt-6 sm:pt-8 text-left">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="text-center mb-5">
              <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight mb-1">
                Tell us a bit about you
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] font-normal">
                This helps us find the right workers for you.
              </p>
            </div>

            {/* Name Input matching Screen 4 */}
            <div className="mb-3.5">
              <label className="block text-[13px] font-bold text-slate-800 mb-1">
                Your name
              </label>
              <div className="flex items-center bg-white border border-[#CBD5E1] focus-within:border-[#1E513B] focus-within:ring-2 focus-within:ring-[#1E513B]/10 rounded-[16px] px-4 h-[54px] shadow-2xs transition-all">
                <User className="w-5 h-5 text-slate-400 mr-3 shrink-0 stroke-[1.8]" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full text-[15px] font-normal text-slate-900 bg-transparent outline-none placeholder:text-[#94A3B8]"
                  autoFocus
                />
              </div>
            </div>

            {/* Work Location Picker matching Screen 4 */}
            <div className="mb-5">
              <label className="block text-[13px] font-bold text-slate-800 mb-1">
                Your work location
              </label>
              <div 
                onClick={openLocationModal}
                className="flex items-center justify-between bg-white border border-[#CBD5E1] hover:border-[#1E513B] rounded-[16px] px-4 h-[54px] shadow-2xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0 stroke-[1.8]" />
                  <span className="text-[15px] font-normal text-slate-800">
                    {user.location || 'Select location'}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 stroke-[1.8]" />
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-1 font-normal">
                Choose the area where you usually need workers.
              </p>
            </div>

            {/* Continue Button matching Screen 4 */}
            <button
              type="submit"
              className="w-full h-[56px] rounded-[18px] bg-[#1E513B] hover:bg-[#164230] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        </div>

        {/* Bottom Countryside Landscape */}
        <RuralBackdrop />
      </div>
    </div>
  );
};
