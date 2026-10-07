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
    <div className="phone-frame">
      <div className="device-container">
        <div className="screen-content flex flex-col justify-between items-center text-center px-0 pt-0 pb-0">
          {/* Top Logo Section - Exactly matching Splash Page placement and sizing */}
          <div className="w-full flex justify-center pt-20 sm:pt-24 pb-2 select-none">
            <img 
              src="/images/splash_logo_clean.png" 
              alt="Seva Setu"
              className="w-[280px] sm:w-[320px] h-auto block select-none pointer-events-none"
              loading="eager"
            />
          </div>

          {/* Form Content Area */}
          <div className="w-full max-w-[360px] px-6 mx-auto flex-1 flex flex-col justify-start pt-6 sm:pt-8 text-left">
            <form onSubmit={handleContinue} className="w-full">
              {/* Phone Input Box matching Theme */}
              <div className="flex items-center bg-white border border-[#E3ECE0] focus-within:border-[#3AAA48] focus-within:ring-3 focus-within:ring-[#3AAA48]/20 rounded-[18px] px-4 h-[58px] shadow-[0_2px_8px_rgba(16,60,38,0.05)] transition-all">
                <span className="text-[17px] font-bold text-[#16261E] pr-3.5 mr-3.5 border-r border-[#E3ECE0] select-none font-display">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter your mobile number"
                  className="w-full text-[16px] font-normal text-[#16261E] bg-transparent outline-none placeholder:text-[#76857D]"
                  maxLength={10}
                  autoFocus
                />
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={phone.length < 10}
                className="w-full h-[54px] mt-4 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] disabled:bg-[#E3ECE0] disabled:text-[#76857D] text-white font-display font-semibold text-[16px] flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(10,90,57,0.2)] transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed group"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <p className="text-[13px] text-[#4F6057] text-center mt-4 font-normal select-none">
                We'll send you an OTP to verify your number
              </p>
            </form>
          </div>

          {/* Bottom Countryside Landscape */}
          <RuralBackdrop />
        </div>
      </div>
    </div>
  );
};
