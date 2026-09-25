import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOST_SEARCHED_SERVICES, OTHER_SERVICES } from '../data/mockData';
import { Search, X, ShieldCheck, ArrowRight, Clock, Sparkles } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { user, jobs, setSelectedCategory, updateDraftJob, navigateTo, openJobDetails } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'repair' | 'agri' | 'other'>('all');

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const activeJob = jobs.find(j => j.status === 'looking' || j.status === 'matched');

  const handleSelectService = (categoryName: string) => {
    setSelectedCategory(categoryName);
    updateDraftJob({
      category: categoryName,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      description: '',
      location: user.location,
      locationMode: 'saved',
      wageMin: 350,
      wageMax: 500
    });
    navigateTo('create-job');
  };

  // Service color map for vibrant micro-tiles
  const getServiceColor = (id: string) => {
    const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
      'electrician': { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'hover:border-amber-400' },
      'plumber': { bg: 'bg-sky-50', text: 'text-sky-700', ring: 'hover:border-sky-400' },
      'cleaning': { bg: 'bg-teal-50', text: 'text-teal-700', ring: 'hover:border-teal-400' },
      'carpenter': { bg: 'bg-orange-50', text: 'text-orange-800', ring: 'hover:border-orange-400' },
      'painter': { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'hover:border-emerald-400' },
      'ac-service': { bg: 'bg-cyan-50', text: 'text-cyan-700', ring: 'hover:border-cyan-400' },
      'gardening': { bg: 'bg-lime-50', text: 'text-lime-800', ring: 'hover:border-lime-400' },
      'farming': { bg: 'bg-yellow-50', text: 'text-yellow-800', ring: 'hover:border-yellow-400' },
      'livestock': { bg: 'bg-stone-50', text: 'text-stone-800', ring: 'hover:border-stone-400' },
      'driver': { bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'hover:border-indigo-400' },
      'mason': { bg: 'bg-red-50', text: 'text-red-700', ring: 'hover:border-red-400' },
      'tile-worker': { bg: 'bg-purple-50', text: 'text-purple-700', ring: 'hover:border-purple-400' },
    };
    return colorMap[id] || { bg: 'bg-brand-50', text: 'text-brand-800', ring: 'hover:border-brand-400' };
  };

  const filteredMostSearched = MOST_SEARCHED_SERVICES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'repair') return ['electrician', 'plumber', 'carpenter', 'painter', 'mason', 'tile-worker', 'ac-service'].includes(s.id);
    if (activeTab === 'agri') return ['farming', 'gardening', 'livestock'].includes(s.id);
    if (activeTab === 'popular') return ['electrician', 'plumber', 'cleaning', 'painter'].includes(s.id);
    return true;
  });

  const filteredOther = OTHER_SERVICES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'repair') return ['mechanic', 'appliance-repair', 'welder'].includes(s.id);
    if (activeTab === 'agri') return ['tree-cutter', 'well-digger', 'cattle-care', 'pest-control'].includes(s.id);
    if (activeTab === 'popular') return false;
    return true;
  });

  return (
    <div className="flex-1 px-4 py-4 pb-24 bg-[#f8faf9]">
      
      {/* Top Greeting Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 tracking-wide uppercase">
            {getGreeting()}, <span className="text-brand-800">{user.name.split(' ')[0]}</span>
          </p>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
            📍 {user.location}
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-snug mt-0.5">
          What service do you need?
        </h1>
      </div>

      {/* Active Job Tracker Banner (if any) */}
      {activeJob && (
        <div 
          onClick={() => openJobDetails(activeJob.id)}
          className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-brand-800 to-brand-900 text-white shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-saffron-300">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-saffron-300 uppercase tracking-wider">
                  Active Job · #{activeJob.id}
                </span>
              </div>
              <p className="text-sm font-bold text-white">
                {activeJob.category} ({activeJob.status === 'matched' ? 'Matched with Worker' : 'Broadcasting Requests'})
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-white/80 shrink-0" />
        </div>
      )}

      {/* Trust Guarantee Micro-Banner */}
      <div className="mb-4 p-2.5 px-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
          <span className="font-semibold text-slate-700">
            Direct local connect · <strong>15–20 km radius</strong> · Zero commission
          </span>
        </div>
      </div>

      {/* Modern Search Box */}
      <div className="relative mb-3.5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search electrician, plumber, cleaner..."
          className="w-full pl-10 pr-9 py-3 rounded-2xl bg-white border border-slate-200 focus:border-brand-700 focus:ring-2 focus:ring-brand-100 text-sm font-semibold text-slate-900 shadow-xs outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      {!searchQuery && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-4 no-scrollbar">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'popular', label: '⭐ Popular' },
            { id: 'repair', label: '🔨 Home Repair' },
            { id: 'agri', label: '🌾 Agri & Yard' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Section 1 — Most searched Services */}
      {filteredMostSearched.length > 0 && (
        <section className="mb-6">
          <div className="flex items-baseline justify-between mb-2.5">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Most Searched</span>
              <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">
              Verified within 20 km
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {filteredMostSearched.map(service => {
              const theme = getServiceColor(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => handleSelectService(service.name)}
                  className={`bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col items-start cursor-pointer transition-all duration-150 active:scale-[0.97] hover:shadow-md ${theme.ring} shadow-xs select-none`}
                >
                  <div className={`w-10 h-10 rounded-xl ${theme.bg} ${theme.text} flex items-center justify-center text-xl mb-2.5 shadow-xs`}>
                    {service.icon}
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-0.5 leading-snug">
                    {service.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section 2 — Other Services */}
      {filteredOther.length > 0 && (
        <section className="mb-4">
          <div className="flex items-baseline justify-between mb-2.5">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Other Rural & Daily Services
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {filteredOther.map(service => {
              const theme = getServiceColor(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => handleSelectService(service.name)}
                  className={`bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col items-start cursor-pointer transition-all duration-150 active:scale-[0.97] hover:shadow-md ${theme.ring} shadow-xs select-none`}
                >
                  <div className={`w-10 h-10 rounded-xl ${theme.bg} ${theme.text} flex items-center justify-center text-xl mb-2.5 shadow-xs`}>
                    {service.icon}
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-0.5 leading-snug">
                    {service.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {filteredMostSearched.length === 0 && filteredOther.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
          <span className="text-3xl block mb-2">🔍</span>
          <h3 className="text-sm font-extrabold text-slate-900">No service matches your search</h3>
          <p className="text-xs text-slate-500 mt-1">Try searching for Electrician, Plumber, Painter...</p>
        </div>
      )}

    </div>
  );
};
