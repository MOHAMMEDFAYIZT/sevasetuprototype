import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { Modals } from '../modals/Modals';
import { Toast } from '../common/Toast';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col font-sans text-slate-900 selection:bg-brand-100 selection:text-brand-900">
      {/* Centered Mobile Container */}
      <div className="w-full flex justify-center flex-1">
        <div className="w-full max-w-[430px] min-h-screen bg-white sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(20,80,50,0.12)] sm:border sm:border-slate-200/80 flex flex-col relative pb-28 sm:my-3 sm:overflow-hidden">
          {/* Universal Sticky Topbar common to all pages */}
          <AppHeader />

          {/* Page Content Viewport */}
          <main className="flex-1 flex flex-col w-full">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Sticky Bottom Tab Bar */}
      <BottomNav />

      {/* Global Modals & Notifications */}
      <Modals />
      <Toast />
    </div>
  );
};

