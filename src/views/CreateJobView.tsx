import React from 'react';
import { useApp } from '../context/AppContext';
import { MOST_SEARCHED_SERVICES, OTHER_SERVICES } from '../data/mockData';
import { ChevronLeft, ArrowRight, Info, MapPin, Calendar, Clock, IndianRupee, Sparkles } from 'lucide-react';

export const CreateJobView: React.FC = () => {
  const { 
    user, 
    selectedCategory, 
    draftJob, 
    updateDraftJob, 
    navigateTo, 
    openLocationModal,
    showToast 
  } = useApp();

  const allServices = [...MOST_SEARCHED_SERVICES, ...OTHER_SERVICES];
  const serviceInfo = allServices.find(s => s.name.toLowerCase() === selectedCategory.toLowerCase());

  const handleQuickDate = (type: 'today' | 'tomorrow') => {
    let dateStr = new Date().toISOString().split('T')[0];
    if (type === 'tomorrow') {
      dateStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    }
    updateDraftJob({ date: dateStr });
  };

  const handleQuickTime = (slot: string, time: string) => {
    updateDraftJob({ timeSlot: slot, time });
  };

  const handleQuickWage = (min: number, max: number) => {
    updateDraftJob({ wageMin: min, wageMax: max });
  };

  const quickRequirementTags: Record<string, string[]> = {
    'Electrician': ['Ceiling fan repair', 'Switchboard wiring', 'MCB tripping fix', 'Inverter battery check'],
    'Plumber': ['Tap leaking fix', 'Pipe blockage clearing', 'Water motor check', 'Bathroom fitting'],
    'Cleaning': ['Full house cleaning', 'Courtyard sweeping', 'Water tank wash', 'Post-event cleanup'],
    'Carpenter': ['Door lock repair', 'Cupboard hinge fix', 'Window frame repair', 'Chair repair'],
    'Painter': ['One room touchup', 'Exterior whitewash', 'Gate & grill painting', 'Wall water damage paint'],
    'Farming': ['Paddy harvesting helper', 'Weeding & clearing', 'Fertilizer spray', 'Irrigation work'],
  };

  const currentTags = quickRequirementTags[selectedCategory] || [
    'Immediate assistance',
    'General inspection',
    'Half-day work',
    'Full-day work'
  ];

  const handleAddTag = (tag: string) => {
    const current = draftJob.description ? `${draftJob.description}, ${tag}` : tag;
    updateDraftJob({ description: current });
  };

  const handleFindWorkers = () => {
    if (!draftJob.date) {
      showToast('Please select a date for the work');
      return;
    }
    navigateTo('workers');
  };

  return (
    <div className="flex-1 px-4 py-4 pb-28 bg-[#f8faf9]">
      
      {/* Header Bar */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigateTo('home')}
          className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-white bg-white/80 flex items-center justify-center text-slate-700 transition-colors shadow-xs cursor-pointer"
          title="Back to services"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Specify Job Details
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Fill basic details to find available workers
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        
        {/* Selected Category Header Card */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-50/80 border border-brand-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-brand-100 flex items-center justify-center text-2xl shadow-xs">
              {serviceInfo?.icon || '⚡'}
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-brand-700 uppercase tracking-wider">
                Selected Category
              </span>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {selectedCategory}
              </h3>
            </div>
          </div>
          <button
            onClick={() => navigateTo('home')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-brand-50 border border-brand-200 text-xs font-bold text-brand-800 transition-colors shadow-xs cursor-pointer"
          >
            Change
          </button>
        </div>

        {/* 1. Date Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <label className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 mb-2.5">
            <Calendar className="w-3.5 h-3.5 text-brand-700" />
            <span>1. When is the work required?</span>
          </label>
          
          <div className="flex gap-2 mb-2.5">
            <button
              type="button"
              onClick={() => handleQuickDate('today')}
              className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                draftJob.date === new Date().toISOString().split('T')[0]
                  ? 'bg-brand-700 border-brand-700 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              Today ({new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})
            </button>
            <button
              type="button"
              onClick={() => handleQuickDate('tomorrow')}
              className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                draftJob.date === new Date(Date.now() + 86400000).toISOString().split('T')[0]
                  ? 'bg-brand-700 border-brand-700 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              Tomorrow
            </button>
          </div>

          <input
            type="date"
            value={draftJob.date}
            onChange={e => updateDraftJob({ date: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-brand-700 transition-all cursor-pointer"
          />
        </div>

        {/* 2. Preferred Time Slot Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <label className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 mb-2.5">
            <Clock className="w-3.5 h-3.5 text-brand-700" />
            <span>2. Preferred Time of Day</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'morning', label: 'Morning', sub: '09–12 PM', time: '10:00 AM' },
              { id: 'afternoon', label: 'Afternoon', sub: '01–04 PM', time: '02:00 PM' },
              { id: 'evening', label: 'Evening', sub: '04–07 PM', time: '05:00 PM' },
            ].map(slot => (
              <button
                key={slot.id}
                type="button"
                onClick={() => handleQuickTime(slot.id, slot.time)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  draftJob.timeSlot === slot.id
                    ? 'bg-brand-50 border-brand-700 text-brand-900 shadow-xs ring-1 ring-brand-700'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span className="block text-xs font-extrabold">{slot.label}</span>
                <span className="text-[10px] text-slate-500 font-medium">{slot.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Work Location Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-brand-700" />
              <span>3. Work Location</span>
            </label>
            <button
              type="button"
              onClick={openLocationModal}
              className="text-[11px] font-bold text-brand-700 hover:underline cursor-pointer"
            >
              Change Area
            </button>
          </div>

          <div className="space-y-2">
            <div
              onClick={() => updateDraftJob({ locationMode: 'saved' })}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                draftJob.locationMode === 'saved'
                  ? 'bg-brand-50/60 border-brand-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  draftJob.locationMode === 'saved' ? 'border-brand-700' : 'border-slate-300'
                }`}>
                  {draftJob.locationMode === 'saved' && <div className="w-2 h-2 rounded-full bg-brand-700" />}
                </div>
                <div>
                  <b className="text-xs font-bold text-slate-900 block">📍 Saved Address</b>
                  <small className="text-[11px] text-slate-600">{user.location}</small>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                Primary
              </span>
            </div>

            <div
              onClick={() => updateDraftJob({ locationMode: 'current' })}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                draftJob.locationMode === 'current'
                  ? 'bg-brand-50/60 border-brand-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  draftJob.locationMode === 'current' ? 'border-brand-700' : 'border-slate-300'
                }`}>
                  {draftJob.locationMode === 'current' && <div className="w-2 h-2 rounded-full bg-brand-700" />}
                </div>
                <div>
                  <b className="text-xs font-bold text-slate-900 block">◎ Current GPS Location</b>
                  <small className="text-[11px] text-slate-500">Auto-detected within 15 km</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Expected Wage Range Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
              <IndianRupee className="w-3.5 h-3.5 text-brand-700" />
              <span>4. Expected Wage Range</span>
            </label>
            <span className="text-xs font-black text-brand-800 bg-brand-50 px-2.5 py-0.5 rounded-lg border border-brand-200">
              ₹{draftJob.wageMin} – ₹{draftJob.wageMax} / hr
            </span>
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {[
              { min: 300, max: 450, label: '₹300–450' },
              { min: 350, max: 500, label: '₹350–500' },
              { min: 400, max: 600, label: '₹400–600' },
              { min: 600, max: 900, label: '₹600–900' },
            ].map((wage, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickWage(wage.min, wage.max)}
                className={`py-1.5 rounded-lg border text-[11px] font-bold text-center transition-all cursor-pointer ${
                  draftJob.wageMin === wage.min && draftJob.wageMax === wage.max
                    ? 'bg-brand-700 border-brand-700 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {wage.label}
              </button>
            ))}
          </div>

          {/* Dual Range Sliders */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
              <span>Min: ₹{draftJob.wageMin}/hr</span>
              <span>Max: ₹{draftJob.wageMax}/hr</span>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="range"
                min={200}
                max={700}
                step={50}
                value={draftJob.wageMin}
                onChange={e => {
                  const val = Number(e.target.value);
                  updateDraftJob({ wageMin: val, wageMax: Math.max(val, draftJob.wageMax) });
                }}
                className="w-full accent-brand-700 cursor-pointer"
              />
              <input
                type="range"
                min={300}
                max={1200}
                step={50}
                value={draftJob.wageMax}
                onChange={e => {
                  const val = Number(e.target.value);
                  updateDraftJob({ wageMax: val, wageMin: Math.min(val, draftJob.wageMin) });
                }}
                className="w-full accent-brand-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 5. Requirement Description Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <label className="flex items-center justify-between text-xs font-extrabold text-slate-800 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-700" />
              <span>5. Describe what needs to be done</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">Optional</span>
          </label>

          {/* Quick Prompt Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {currentTags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-800 hover:border-brand-200 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                + {tag}
              </button>
            ))}
          </div>

          <textarea
            value={draftJob.description}
            onChange={e => updateDraftJob({ description: e.target.value })}
            placeholder="e.g. Need to fix bathroom tap leakage and replace kitchen sink pipe..."
            rows={3}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-700 focus:bg-white text-xs sm:text-sm font-medium text-slate-900 outline-none resize-none placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Informative Notice */}
        <div className="p-3 rounded-2xl bg-brand-50 border border-brand-200/90 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-700 mt-0.5 shrink-0" />
          <p className="text-xs text-brand-950 leading-relaxed font-medium">
            Next, you can select multiple available workers in your area. The <strong>first worker to accept</strong> gets assigned.
          </p>
        </div>

      </div>

      {/* Primary Action Button */}
      <button
        onClick={handleFindWorkers}
        className="w-full py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
      >
        <span>Find available workers</span>
        <ArrowRight className="w-5 h-5" />
      </button>

    </div>
  );
};
