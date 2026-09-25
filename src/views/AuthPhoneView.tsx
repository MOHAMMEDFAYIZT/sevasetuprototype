import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { RuralBackdrop } from '../components/RuralBackdrop';
import { ArrowRight } from 'lucide-react';

export const AuthPhoneView: React.FC = () => {
  const { user, updateUser, navigateTo } = useApp();
  const [phone, setPhone] = useState(user.phone || '9876543210');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      updateUser({ phone });
      navigateTo('auth-otp');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between min-h-[640px] text-center px-6 pt-10 sm:pt-14 pb-0 bg-white">
      
      {/* Top Section: Logo & Tagline */}
      <div className="w-full flex flex-col items-center pt-4 sm:pt-8">
        <Logo size="lg" showTagline={true} />

        {/* Phone Form Container (tightly placed below logo) */}
        <form onSubmit={handleContinue} className="w-full max-w-sm mt-10 sm:mt-12 text-left">
          {/* Phone Input Box */}
          <div className="flex items-center bg-white border border-slate-300 focus-within:border-brand-700 focus-within:ring-2 focus-within:ring-brand-100 rounded-2xl px-4 py-1 mb-4 shadow-sm transition-all">
            <span className="text-base font-bold text-slate-800 pr-3.5 mr-3.5 border-r border-slate-200">
              +91
            </span>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter your mobile number"
              className="w-full py-3.5 text-base font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-400 placeholder:font-normal"
              maxLength={10}
              autoFocus
            />
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={phone.length < 10}
            className="w-full py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-base shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-xs text-slate-500 text-center mt-3.5">
            We'll send you an OTP to verify your number
          </p>
        </form>
      </div>

      {/* Bottom Countryside Artwork */}
      <RuralBackdrop />
    </div>
  );
};
