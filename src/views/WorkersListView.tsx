import React from 'react';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import { ChevronLeft, Star, Heart, Check, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export const WorkersListView: React.FC = () => {
  const {
    selectedCategory,
    selectedWorkerIds,
    toggleWorkerSelection,
    toggleFavourite,
    isFavourite,
    openConfirmModal,
    navigateTo,
    showToast
  } = useApp();

  const relevantWorkers = WORKERS_DATABASE.filter(
    w => w.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  // Fallback workers if category has fewer dedicated records
  const displayWorkers = relevantWorkers.length > 0
    ? relevantWorkers
    : WORKERS_DATABASE.slice(0, 6).map((w, i) => ({
        ...w,
        category: selectedCategory,
        distance: Number((2.4 + i * 1.5).toFixed(1))
      }));

  const handleSendRequests = () => {
    if (selectedWorkerIds.length === 0) {
      showToast('Please select at least 1 worker');
      return;
    }
    openConfirmModal();
  };

  return (
    <div className="flex-1 px-4 py-4 pb-32 bg-[#f8faf9]">
      
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-3.5">
        <button
          onClick={() => navigateTo('create-job')}
          className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-white bg-white/80 flex items-center justify-center text-slate-700 transition-colors shadow-xs cursor-pointer"
          title="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            {selectedCategory}s nearby
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Available in your 15–20 km radius
          </p>
        </div>
      </div>

      {/* Multi-Request Strategy Notice */}
      <div className="p-3 rounded-2xl bg-brand-50 border border-brand-200/90 mb-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
          <p className="text-xs font-bold text-brand-900 leading-tight">
            Select 2–3 workers for faster response. First to accept gets matched.
          </p>
        </div>
      </div>

      {/* Worker Cards Grid */}
      <div className="space-y-3 mb-6">
        {displayWorkers.map(worker => {
          const isSelected = selectedWorkerIds.includes(worker.id);
          const isFav = isFavourite(worker.id);

          return (
            <div
              key={worker.id}
              onClick={() => toggleWorkerSelection(worker.id)}
              className={`bg-white border rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 shadow-xs hover:shadow-md ${
                isSelected 
                  ? 'border-brand-700 bg-brand-50/30 ring-2 ring-brand-700/20' 
                  : 'border-slate-200 hover:border-brand-300'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-800 font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                  {worker.initial}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="text-sm font-extrabold text-slate-900 truncate">
                      {worker.name}
                    </h3>
                    <span title="Verified Worker">
                      <Award className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mb-1">
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {worker.rating}
                    </span>
                    <span>·</span>
                    <span>📍 {worker.distance} km away</span>
                  </div>

                  <div className="text-xs font-black text-brand-800">
                    {worker.wage}
                  </div>
                </div>
              </div>

              {/* Right Selection & Favourite Actions */}
              <div className="flex flex-col items-end gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => toggleFavourite(worker.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    isFav 
                      ? 'bg-rose-50 text-rose-600' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-400'
                  }`}
                  title="Save to Favourites"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => toggleWorkerSelection(worker.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-brand-50 hover:text-brand-800 text-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{isSelected ? 'Selected' : 'Select'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Multi-Worker Bottom Selection Dock */}
      {selectedWorkerIds.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-[400px] px-4 animate-slide-up">
          <div className="bg-brand-950 text-white border border-brand-700/80 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3">
            <div className="text-xs font-semibold pl-1.5">
              <strong className="text-saffron-400 font-black text-sm">
                {selectedWorkerIds.length} worker{selectedWorkerIds.length > 1 ? 's' : ''}
              </strong> selected
              <p className="text-[10px] text-slate-300 font-normal">First to accept connects</p>
            </div>
            <button
              onClick={handleSendRequests}
              className="px-4 py-2.5 rounded-xl bg-white text-brand-950 hover:bg-brand-50 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Send Requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
