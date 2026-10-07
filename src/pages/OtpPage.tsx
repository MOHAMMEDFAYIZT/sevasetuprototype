import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RuralBackdrop } from '../components/common/RuralBackdrop';
import { ChevronLeft } from 'lucide-react';

export const OtpPage: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(28);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const id = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(id);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    const val = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = val ? val[val.length - 1] : '';
    setOtp(newOtp);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/setup-profile');
  };

  const formattedPhone = user.phone 
    ? `+91 ${user.phone.slice(0, 5)} ${user.phone.slice(5)}` 
    : '+91 98765 43210';

  return (
    <div className="phone-frame">
      <div className="device-container">
        <div className="screen-content flex flex-col justify-between items-center text-center px-0 pt-0 pb-0">
        
        {/* Floating Functional Back Button */}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="absolute top-4 left-4 sm:top-6 sm:left-5 z-20 w-10 h-10 glass rounded-full flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-all cursor-pointer shadow-xs active:scale-95 border border-white"
          title="Back to login"
          aria-label="Back to login"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Top Logo Section */}
        <div className="w-full flex justify-center pt-20 sm:pt-24 pb-2 select-none">
          <img 
            src="/images/splash_logo_clean.png" 
            alt="Seva Setu"
            className="w-[280px] sm:w-[320px] h-auto block select-none pointer-events-none"
            loading="eager"
          />
        </div>

        {/* Form Content Area */}
        <div className="w-full max-w-[360px] px-6 mx-auto flex-1 flex flex-col justify-start pt-6 sm:pt-8 text-center">
          <form onSubmit={handleVerify} className="w-full">
            <h2 className="font-display text-xl sm:text-[22px] font-semibold text-[#16261E] tracking-tight mb-1">
              Verify your number
            </h2>
            <p className="text-xs sm:text-sm text-[#4F6057] mb-6 leading-relaxed font-normal">
              Enter the 6-digit OTP sent to <br />
              <strong className="text-[#16261E] font-semibold">{formattedPhone}</strong>
            </p>

            {/* 6 Digit OTP Boxes */}
            <div className="flex justify-between gap-2 mb-6">
              {otp.map((digit, idx) => (
                <div key={idx} className="relative w-11 h-13 sm:w-12 sm:h-14">
                  <input
                    ref={el => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                    className="w-full h-full rounded-[16px] border border-[#E3ECE0] focus:border-[#3AAA48] focus:ring-3 focus:ring-[#3AAA48]/20 text-center text-[22px] font-display font-semibold text-[#16261E] bg-white outline-none transition-all shadow-[0_2px_8px_rgba(16,60,38,0.04)]"
                  />
                  {!digit && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[#CBD5E1] text-sm font-light">
                      |
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="w-full h-[54px] rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white font-display font-semibold text-[16px] shadow-[0_10px_20px_rgba(10,90,57,0.2)] transition-all active:scale-[0.98] cursor-pointer"
            >
              Verify
            </button>

            <div className="text-[13px] text-[#4F6057] mt-4 leading-relaxed font-normal select-none">
              Didn't receive the OTP? <br />
              {timer > 0 ? (
                <span className="text-[#0C6B44] font-medium">
                  Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(28)}
                  className="text-[#0C6B44] font-bold hover:underline cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Bottom Countryside Landscape */}
        <RuralBackdrop />
        </div>
      </div>
    </div>
  );
};
