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
      className={`min-h-screen w-full bg-[#f4f7f5] flex justify-center items-center sm:py-6 selection:bg-brand-100 selection:text-brand-900 cursor-pointer select-none transition-opacity duration-300 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      title="Click anywhere to continue"
    >
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[860px] bg-white sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(20,80,50,0.12)] sm:border sm:border-slate-200/80 flex flex-col justify-between items-center relative overflow-hidden">
        
        {/* Top Area: Clean Logo & Text situated with fixed anchor */}
        <div className="w-full flex-1 flex flex-col items-center justify-start pt-24 sm:pt-28 px-6 z-10">
          <img 
            src="/images/splash_logo_clean.png" 
            alt="Seva Sethu" 
            className="w-[280px] sm:w-[320px] h-auto block select-none pointer-events-none"
            loading="eager"
          />

          {/* Elegant Three Dots Loading Indicator */}
          <div className="flex items-center gap-2 mt-8 select-none" aria-label="Loading">
            <span className="w-2 h-2 rounded-full bg-[#185E3B] animate-bounce [animation-delay:-0.32s] opacity-80"></span>
            <span className="w-2 h-2 rounded-full bg-[#185E3B] animate-bounce [animation-delay:-0.16s] opacity-80"></span>
            <span className="w-2 h-2 rounded-full bg-[#185E3B] animate-bounce opacity-80"></span>
          </div>
        </div>

        {/* Bottom Illustration: Firmly pinned to the bottom edge with 0 gap */}
        <div className="w-full mt-auto relative z-0 select-none pointer-events-none">
          <img 
            src="/images/splash_art_bottom.png" 
            alt="Rural community landscape with customer and worker" 
            className="w-full h-auto object-cover object-bottom block"
            loading="eager"
          />
        </div>

      </div>
    </div>
  );
};
