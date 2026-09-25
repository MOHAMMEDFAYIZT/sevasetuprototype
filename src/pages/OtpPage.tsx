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
    <div className="min-h-screen w-full bg-[#f4f7f5] flex justify-center items-center sm:py-6 selection:bg-brand-100 selection:text-brand-900">
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[860px] bg-white sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(20,80,50,0.12)] sm:border sm:border-slate-200/80 flex flex-col justify-between items-center text-center px-0 pt-0 pb-0 relative overflow-hidden">
        
        {/* Floating Functional Back Button (does not displace logo) */}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="absolute top-4 left-4 sm:top-6 sm:left-5 z-20 p-2 text-slate-800 hover:text-black hover:bg-slate-100 rounded-full transition-colors cursor-pointer flex items-center justify-center"
          title="Back to login"
          aria-label="Back to login"
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
        <div className="w-full max-w-[360px] px-6 mx-auto flex-1 flex flex-col justify-start pt-6 sm:pt-8 text-center">
          <form onSubmit={handleVerify} className="w-full">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight mb-1">
              Verify your number
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mb-6 leading-relaxed font-normal">
              Enter the 6-digit OTP sent to <br />
              <strong className="text-slate-800 font-semibold">{formattedPhone}</strong>
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
                    className="w-full h-full rounded-[14px] border border-[#CBD5E1] focus:border-[#1E513B] focus:ring-2 focus:ring-[#1E513B]/10 text-center text-[20px] font-semibold text-slate-900 bg-white outline-none transition-all shadow-2xs"
                  />
                  {!digit && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-sm font-light">
                      |
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="w-full h-[56px] rounded-[18px] bg-[#1E513B] hover:bg-[#164230] text-white font-bold text-[16px] shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              Verify
            </button>

            <div className="text-[13px] text-[#64748B] mt-4 leading-relaxed font-normal select-none">
              Didn't receive the OTP? <br />
              {timer > 0 ? (
                <span className="text-[#1E513B] font-medium">
                  Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(28)}
                  className="text-[#1E513B] font-bold hover:underline cursor-pointer"
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
  );
};
