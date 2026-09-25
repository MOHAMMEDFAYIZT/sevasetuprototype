import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layers, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

export const PrototypeNavigator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const screens = [
    { path: '/splash', label: '1. Splash Screen', badge: 'Ref #1' },
    { path: '/login', label: '2. Phone Login', badge: 'Ref #2' },
    { path: '/verify-otp', label: '3. Verify OTP', badge: 'Ref #3' },
    { path: '/setup-profile', label: '4. Profile Setup', badge: 'Ref #4' },
    { path: '/', label: '5. Home Screen', badge: 'Ref #5' },
    { path: '/jobs', label: '6. My Jobs Tracker', badge: 'Flow' },
    { path: '/create-job', label: '7. Request Worker', badge: 'Flow' },
    { path: '/workers', label: '8. Worker Directory', badge: 'Flow' },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-50 select-none">
      {isOpen && (
        <div className="mb-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-2.5 animate-slide-up">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-[#1B5E3C]" />
              <span>Prototype Flow Switcher</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              High Fidelity
            </span>
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {screens.map(s => {
              const isActive = location.pathname === s.path;
              return (
                <button
                  key={s.path}
                  onClick={() => {
                    navigate(s.path);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#1B5E3C] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{s.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {s.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl hover:shadow-2xl border border-white/20 text-xs font-black transition-all active:scale-95 cursor-pointer backdrop-blur-md"
        title="Quick jump between reference screens"
      >
        <Layers className="w-4 h-4 text-emerald-400" />
        <span className="hidden sm:inline">Screen Switcher</span>
        <span className="sm:hidden">Screens</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

