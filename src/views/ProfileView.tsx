import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw, LogOut, Info, User, MapPin, Phone, Sparkles } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateUser, navigateTo, resetDemoData, openLocationModal, showToast } = useApp();
  const [name, setName] = useState(user.name);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: name.trim() || 'Manoj Kumar' });
    showToast('Profile updated');
  };

  return (
    <div className="flex-1 px-4 py-4 pb-24 bg-[#f8faf9]">
      
      {/* Top Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Profile & Account
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Manage your account and matching preferences
        </p>
      </div>

      <div className="space-y-4 mb-6">
        
        {/* User Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-800 font-black text-2xl flex items-center justify-center shadow-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 leading-tight">{user.name}</h2>
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>+91 {user.phone}</span>
            </p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-extrabold">
              Service Requester
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Full Name
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-brand-700 focus-within:bg-white rounded-xl px-3 py-0.5 transition-all">
              <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Primary Locality (Palakkad region)
            </label>
            <div
              onClick={openLocationModal}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-brand-300 hover:bg-slate-100 text-xs sm:text-sm font-semibold text-slate-900 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-700" />
                <span>{user.location}</span>
              </div>
              <span className="text-xs text-brand-700 font-bold">Change</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            Save Changes
          </button>
        </form>

        {/* Navigation & Prototype Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1">
            Flow Shortcuts
          </h3>

          <button
            onClick={() => navigateTo('splash')}
            className="w-full py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-900 font-bold text-xs border border-brand-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-700" />
            <span>Replay Intro / Splash Screen (Image 1)</span>
          </button>

          <button
            onClick={() => navigateTo('auth-phone')}
            className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span>View Onboarding & Auth Flow (Images 2, 3, 4)</span>
          </button>

          <button
            onClick={resetDemoData}
            className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Platform Info */}
        <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-200/80 text-xs text-brand-950 leading-relaxed font-medium flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-brand-900 font-extrabold mb-0.5">About Seva Setu</strong>
            Seva Setu is a direct two-sided local marketplace connecting community members with verified independent local workers.
          </div>
        </div>

      </div>

    </div>
  );
};
