import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RuralBackdrop } from '../components/common/RuralBackdrop';
import { User, MapPin, ChevronRight, ChevronLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ProfileSetupPage: React.FC = () => {
  const { user, updateUser, openLocationModal, showToast } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name || '');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdName, setCreatedName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Manoj Kumar';
    setCreatedName(finalName);
    updateUser({ name: finalName, isLoggedIn: true });
    setIsSuccess(true);
    setTimeout(() => {
      showToast(`Welcome to Seva Setu, ${finalName}!`);
      navigate('/');
    }, 1300);
  };

  return (
    <div className="phone-frame">
      <div className="device-container">
        <div className="screen-content flex flex-col justify-between items-center text-center px-0 pt-0 pb-0">
        
        {/* Floating Functional Back Button */}
        {!isSuccess && (
          <button
            type="button"
            onClick={() => navigate('/verify-otp')}
            className="absolute top-4 left-4 sm:top-6 sm:left-5 z-20 w-10 h-10 glass rounded-full flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-all cursor-pointer shadow-xs active:scale-95 border border-white"
            title="Back to OTP verification"
            aria-label="Back to OTP verification"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {isSuccess ? (
          /* Celebratory Account Created State */
          <div className="w-full max-w-[360px] px-6 mx-auto flex-1 flex flex-col items-center justify-center pt-16 z-20 animate-fade-in text-center">
            {/* Animated Celebration Icon */}
            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#E2F3DD] flex items-center justify-center shadow-[0_12px_28px_rgba(12,107,68,0.2)] animate-scale-in">
                <CheckCircle2 className="w-11 h-11 text-[#0C6B44] stroke-[2.2]" />
              </div>
              <div className="absolute inset-0 rounded-full bg-[#3AAA48]/20 animate-ping" />
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A5A39] tracking-tight mb-2">
              Account Created!
            </h2>
            <p className="text-[15px] font-medium text-[#16261E] mb-1">
              Welcome to Seva Setu, <span className="font-bold text-[#0C6B44]">{createdName}</span>
            </p>
            <p className="text-xs text-[#76857D] font-normal">
              Taking you to home screen...
            </p>

            <div className="mt-6 flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-[#0C6B44] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-[#0C6B44] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-[#0C6B44] animate-bounce" />
            </div>
          </div>
        ) : (
          /* Form Content Area */
          <div className="w-full max-w-[360px] px-6 mt-60 mx-auto flex-1 flex flex-col justify-start pt-2 sm:pt-3 text-left">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="text-center mb-5">
                <h2 className="font-display text-xl sm:text-[25px] font-semibold text-[#0A5A39] tracking-tight mb-1">
                  Tell us a bit about you
                </h2>
              </div>

              {/* Name Input matching Theme */}
              <div className="mb-3.5">
                <label className="block text-[13px] font-semibold text-[#16261E] mb-1.5">
                  Your name
                </label>
                <div className="flex items-center bg-white border border-[#E3ECE0] focus-within:border-[#3AAA48] focus-within:ring-3 focus-within:ring-[#3AAA48]/20 rounded-[18px] px-4 h-[54px] shadow-[0_2px_8px_rgba(16,60,38,0.04)] transition-all">
                  <User className="w-5 h-5 text-[#76857D] mr-3 shrink-0 stroke-[1.8]" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full text-[15px] font-normal text-[#16261E] bg-transparent outline-none placeholder:text-[#76857D]"
                    autoFocus
                  />
                </div>
              </div>

              {/* Work Location Picker matching Theme */}
              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-[#16261E] mb-1.5">
                  Your work location
                </label>
                <div 
                  onClick={openLocationModal}
                  className="flex items-center justify-between bg-white border border-[#E3ECE0] hover:border-[#3AAA48] rounded-[18px] px-4 h-[54px] shadow-[0_2px_8px_rgba(16,60,38,0.04)] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#0C6B44] shrink-0 stroke-[1.8]" />
                    <span className="text-[15px] font-medium text-[#16261E]">
                      {user.location || 'Select location'}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#76857D] stroke-[1.8]" />
                </div>
              </div>

              {/* Continue Button matching Theme */}
              <button
                type="submit"
                className="w-full h-[54px] rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white font-display font-semibold text-[16px] flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(10,90,57,0.2)] transition-all active:scale-[0.98] cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>
        )}

        {/* Bottom Countryside Landscape */}
        <RuralBackdrop />
        </div>
      </div>
    </div>
  );
};
