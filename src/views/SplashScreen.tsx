import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { user, navigateTo } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user.isLoggedIn) {
        navigateTo('home');
      } else {
        navigateTo('auth-phone');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [user.isLoggedIn, navigateTo]);

  const handleSkip = () => {
    if (user.isLoggedIn) {
      navigateTo('home');
    } else {
      navigateTo('auth-phone');
    }
  };

  return (
    <div 
      onClick={handleSkip}
      className="flex-1 w-full h-full min-h-[680px] bg-white flex flex-col justify-between items-center cursor-pointer select-none relative overflow-hidden animate-fade-in"
      title="Tap anywhere to skip"
    >
      <img 
        src="/images/splash_bg.png" 
        alt="Seva Setu Intro" 
        className="w-full h-full object-contain sm:object-cover object-center"
      />
    </div>
  );
};
