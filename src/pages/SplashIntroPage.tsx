import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const SplashIntroPage: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 3200);

    return () => clearTimeout(timer);
  }, [user.isLoggedIn, navigate]);

  const handleNext = () => {
    setIsFading(true);
    setTimeout(() => {
      if (user.isLoggedIn) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }, 150);
  };

  return (
    <div 
      onClick={handleNext}
      className={`phone-frame cursor-pointer select-none transition-opacity duration-300 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      title="Click anywhere to continue"
    >
      <div className="device-container justify-between items-center relative overflow-hidden">
        
        {/* Top Area: Clean Logo & Text situated with fixed anchor */}
        <div className="w-full flex-1 flex flex-col items-center justify-start pt-20 sm:pt-24 px-6 z-10">
          <img 
            src="/images/splash_logo_clean.png" 
            alt="Seva Setu" 
            className="w-[280px] sm:w-[320px] h-auto block select-none pointer-events-none"
            loading="eager"
          />

          {/* Three Dots Loading Indicator */}
          <div className="flex items-center gap-2 mt-10 select-none" aria-label="Loading">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0C6B44] animate-bounce [animation-delay:-0.32s] opacity-90"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#0C6B44] animate-bounce [animation-delay:-0.16s] opacity-90"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#0C6B44] animate-bounce opacity-90"></span>
          </div>

          {/* High-fidelity crisp tagline text */}
          <div className="text-center mt-6 px-4 max-w-sm">
            <p className="text-lg sm:text-xl mt-2 font-semibold text-[#324b3c] tracking-tight">
              Find the right person <br /> for your work.
            </p>
          </div>
        </div>

        {/* Bottom Illustration */}
        <div className="w-full mt-auto relative z-0 select-none pointer-events-none">
          <img 
            src="/images/splash_art_bottom.png" 
            alt="Rural community landscape with customer and worker" 
            className="w-full h-auto object-contain object-bottom block"
            loading="eager"
          />
        </div>

      </div>
    </div>
  );
};
