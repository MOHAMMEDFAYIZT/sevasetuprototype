import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BottomNav } from './BottomNav';
import { Modals } from '../modals/Modals';
import { HomeActiveJobsFloating } from '../home/HomeActiveJobsFloating';
import { VirtualKeyboard } from '../common/VirtualKeyboard';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { openKeyboard, isKeyboardOpen, closeKeyboard } = useApp();
  const isMainTab = ['/', '/jobs', '/favourites', '/profile'].includes(location.pathname);
  const isHomePage = location.pathname === '/';

  // Zomato-style navbar scroll state: hide on scroll down, show on scroll up
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const mainRef = useRef<HTMLElement>(null);

  // Scroll listener on the screen-content container and window
  useEffect(() => {
    const el = mainRef.current;

    const handleScrollEvent = (currentScrollTop: number) => {
      const scrollDiff = currentScrollTop - lastScrollTop.current;

      // Threshold to prevent jitter on tiny sub-pixel scrolls
      if (Math.abs(scrollDiff) > 8) {
        if (currentScrollTop <= 30) {
          // At or near top: always show navbar
          setIsNavVisible(true);
        } else if (scrollDiff > 0) {
          // Scrolling down: hide navbar
          setIsNavVisible(false);
        } else {
          // Scrolling up: reveal navbar
          setIsNavVisible(true);
        }
        lastScrollTop.current = currentScrollTop;
      }
    };

    const onElScroll = () => {
      if (el) handleScrollEvent(el.scrollTop);
    };

    const onWinScroll = () => {
      handleScrollEvent(window.scrollY || document.documentElement.scrollTop);
    };

    if (el) el.addEventListener('scroll', onElScroll, { passive: true });
    window.addEventListener('scroll', onWinScroll, { passive: true });

    return () => {
      if (el) el.removeEventListener('scroll', onElScroll);
      window.removeEventListener('scroll', onWinScroll);
    };
  }, [location.pathname]);

  // When route or tab changes: reset navbar visibility and dismiss keyboard
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setIsNavVisible(true);
      lastScrollTop.current = 0;
      closeKeyboard();
      (document.activeElement as HTMLElement)?.blur();
    }
  }, [location.pathname, closeKeyboard]);

  // Mobile virtual keyboard: opens whenever an input or textarea is tapped
  useEffect(() => {
    let lastFocusTime = 0;

    const isEligibleElement = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      if (el.tagName === 'TEXTAREA') return true;
      if (el.tagName === 'INPUT') {
        const inputType = (el as HTMLInputElement).type;
        return !['checkbox', 'radio', 'button', 'submit', 'file', 'hidden'].includes(inputType);
      }
      return false;
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (isEligibleElement(target)) {
        lastFocusTime = Date.now();
        (window as unknown as { __sevaActiveInput?: HTMLElement | null }).__sevaActiveInput = target;
        openKeyboard();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (isEligibleElement(target)) {
        const timeSinceFocus = Date.now() - lastFocusTime;
        if (timeSinceFocus > 350 && isKeyboardOpen && document.activeElement === target) {
          // Second tap on the already focused input -> dismiss keyboard like Done button
          closeKeyboard();
          target?.blur();
        } else {
          (window as unknown as { __sevaActiveInput?: HTMLElement | null }).__sevaActiveInput = target;
          openKeyboard();
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('click', handleClick);
    };
  }, [openKeyboard, closeKeyboard, isKeyboardOpen]);

  return (
    <div className="phone-frame">
      <div className="device-container">
        {/* Scrollable Viewport with permanently fixed background behind */}
        <main 
          ref={mainRef}
          className={`screen-content flex flex-col w-full ${isMainTab ? 'pb-[calc(108px+env(safe-area-inset-bottom,0px))]' : 'pb-0'}`}
        >
          <Outlet />
        </main>

        {/* Floating Live Orders Carousel (Swiggy / Zomato style) - hidden when keyboard is open */}
        {isHomePage && !isKeyboardOpen && <HomeActiveJobsFloating isNavVisible={isNavVisible} />}

        {/* Floating Glass Pill Bottom Navigation - hidden when keyboard is open */}
        {!isKeyboardOpen && <BottomNav isVisible={isNavVisible} />}

        {/* Global Modals */}
        <Modals />

        {/* Simulated Mobile Keyboard */}
        <VirtualKeyboard />
      </div>
    </div>
  );
};

