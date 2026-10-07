import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BottomNav } from './BottomNav';
import { Modals } from '../modals/Modals';
import { HomeActiveJobsFloating } from '../home/HomeActiveJobsFloating';
import { VirtualKeyboard } from '../common/VirtualKeyboard';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { openKeyboard } = useApp();
  const isMainTab = ['/', '/jobs', '/favourites', '/profile'].includes(location.pathname);
  const isHomePage = location.pathname === '/';

  // Automatically activate the mobile keyboard whenever user taps any input or textarea
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        // Exclude radio / checkbox / hidden inputs
        const inputType = (target as HTMLInputElement).type;
        if (!['checkbox', 'radio', 'button', 'submit', 'file', 'hidden'].includes(inputType)) {
          openKeyboard();
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [openKeyboard]);

  return (
    <div className="phone-frame">
      <div className="device-container">
        {/* Scrollable Viewport with permanently fixed background behind */}
        <main className={`screen-content flex flex-col w-full ${isMainTab ? 'pb-[calc(76px+env(safe-area-inset-bottom,0px))]' : 'pb-0'}`}>
          <Outlet />
        </main>

        {/* Floating Live Orders Carousel (Swiggy / Zomato style) */}
        {isHomePage && <HomeActiveJobsFloating />}

        {/* Floating Glass Pill Bottom Navigation */}
        <BottomNav />

        {/* Global Modals */}
        <Modals />

        {/* Simulated Mobile Keyboard */}
        <VirtualKeyboard />
      </div>
    </div>
  );
};

