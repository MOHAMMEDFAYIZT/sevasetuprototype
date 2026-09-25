import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RuralBackdrop } from '../components/common/RuralBackdrop';
import { ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { user, updateUser } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(user.phone || '');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      updateUser({ phone });
      navigate('/verify-otp');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7f5] flex justify-center items-center sm:py-6 selection:bg-brand-100 selection:text-brand-900">
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[860px] bg-white sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(20,80,50,0.12)] sm:border sm:border-slate-200/80 flex flex-col justify-between items-center text-center px-0 pt-0 pb-0 relative overflow-hidden">
        
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
          <form onSubmit={handleContinue} className="w-full">
            {/* Phone Input Box matching Screen 2 */}
            <div className="flex items-center bg-white border border-[#CBD5E1] focus-within:border-[#1E513B] focus-within:ring-2 focus-within:ring-[#1E513B]/10 rounded-[18px] px-4 h-[60px] shadow-2xs transition-all">
              <span className="text-[17px] font-bold text-slate-800 pr-3.5 mr-3.5 border-r border-[#E2E8F0] select-none">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter your mobile number"
                className="w-full text-[16px] font-normal text-slate-900 bg-transparent outline-none placeholder:text-[#94A3B8]"
                maxLength={10}
                autoFocus
              />
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={phone.length < 10}
              className="w-full h-[56px] mt-4 rounded-[18px] bg-[#1E513B] hover:bg-[#164230] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed group"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <p className="text-[13px] text-[#64748B] text-center mt-4 font-normal select-none">
              We'll send you an OTP to verify your number
            </p>
          </form>
        </div>

        {/* Bottom Countryside Landscape */}
        <RuralBackdrop />
      </div>
    </div>
  );
};
