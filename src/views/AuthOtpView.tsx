import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { RuralBackdrop } from '../components/RuralBackdrop';
import { ChevronLeft } from 'lucide-react';

export const AuthOtpView: React.FC = () => {
  const { user, navigateTo } = useApp();
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
    navigateTo('auth-profile');
  };

  const formattedPhone = user.phone 
    ? `+91 ${user.phone.slice(0, 5)} ${user.phone.slice(5)}` 
    : '+91 98765 43210';

  return (
    <div className="flex-1 flex flex-col items-center justify-between min-h-[640px] text-center px-6 pt-4 pb-0 bg-white relative">
      
      {/* Top Header with Back button */}
      <div className="w-full flex items-center justify-start pt-2">
        <button
          onClick={() => navigateTo('auth-phone')}
          className="p-1 -ml-1 text-slate-800 hover:text-black transition-colors cursor-pointer"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Main Stack: Logo, Titles, OTP Boxes, Verify CTA */}
      <div className="w-full max-w-sm flex flex-col items-center pt-2">
        {/* Brand Logo */}
        <div className="mb-6">
          <Logo size="md" />
        </div>

        {/* Center OTP Section */}
        <form onSubmit={handleVerify} className="w-full">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Verify your number
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            Enter the 6-digit OTP sent to <br />
            <strong className="text-slate-800 font-bold">{formattedPhone}</strong>
          </p>

          {/* 6 Digit OTP Boxes */}
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                className="w-11 h-14 sm:w-12 sm:h-14 rounded-xl border border-slate-300 focus:border-brand-700 focus:ring-2 focus:ring-brand-100 text-center text-xl font-bold text-slate-900 bg-white shadow-sm outline-none transition-all"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-base shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            Verify
          </button>

          <div className="text-xs sm:text-sm text-slate-500 mt-4 leading-relaxed">
            Didn't receive the OTP? <br />
            {timer > 0 ? (
              <span className="text-brand-700 font-bold">
                Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setTimer(28)}
                className="text-brand-700 font-bold hover:underline cursor-pointer"
              >
                Resend OTP now
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Bottom Countryside Artwork */}
      <RuralBackdrop />
    </div>
  );
};
