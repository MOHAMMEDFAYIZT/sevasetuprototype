import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft,
  MapPin, 
  LogOut, 
  ShieldCheck
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, jobs, favourites, showToast } = useApp();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [location, setLocation] = useState(user.location || 'Palakkad Town');

  const completedCount = jobs.filter(j => j.status === 'completed').length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty');
      return;
    }
    updateUser({ name: name.trim(), location: location.trim() });
    setIsEditing(false);
    showToast('Profile updated successfully!');
  };

  const handleLogout = () => {
    updateUser({ isLoggedIn: false });
    navigate('/login');
  };

  return (
    <div className="w-full flex flex-col px-5 pt-4 pb-24">
      {/* Page Title with In-Page Back Button */}
      <div className="flex items-center gap-3 mb-4 select-none">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
          title="Go back"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
          Account & Profile
        </h1>
      </div>

      <div className="space-y-4">
        {/* User Account Card (Minimal with Edit capability) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          {!isEditing ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#1B5E3C] text-xl font-black shrink-0 shadow-2xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-bold text-slate-900 leading-tight truncate">
                      {user.name || 'Citizen User'}
                    </h2>
                    <ShieldCheck className="w-4 h-4 text-[#1B5E3C] shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    +91 {user.phone}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{user.location || 'Palakkad Town'}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                Edit
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-[#F8FAF9] focus:bg-white focus:border-[#1B5E3C] text-xs font-semibold text-slate-900 outline-none"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Area / Locality
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-[#F8FAF9] focus:bg-white focus:border-[#1B5E3C] text-xs font-semibold text-slate-900 outline-none"
                  placeholder="Enter your village or locality"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#1B5E3C] hover:bg-[#14472d] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName(user.name || '');
                    setLocation(user.location || 'Palakkad Town');
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* The 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-xl font-black text-slate-900">{jobs.length}</span>
            <span className="text-[11px] text-slate-500 block font-bold mt-0.5">Requests</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-xl font-black text-[#1B5E3C]">{completedCount}</span>
            <span className="text-[11px] text-slate-500 block font-bold mt-0.5">Completed</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-xl font-black text-rose-600">{favourites.length}</span>
            <span className="text-[11px] text-slate-500 block font-bold mt-0.5">Favourites</span>
          </div>
        </div>

        {/* Clean Logout Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
