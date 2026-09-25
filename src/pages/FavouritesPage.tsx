import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import type { Worker } from '../types';
import { 
  Heart, 
  Star, 
  ArrowRight,
  ShieldCheck,
  IndianRupee,
  Calendar,
  X,
  Check
} from 'lucide-react';

export const FavouritesPage: React.FC = () => {
  const { 
    favourites, 
    toggleFavourite, 
    requestFavouriteDirectly,
    showToast 
  } = useApp();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [skillChoiceWorker, setSkillChoiceWorker] = useState<Worker | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>('');

  const favWorkers = WORKERS_DATABASE.filter(w => favourites.includes(w.id));

  // Extract unique trade categories present across all saved workers (primary or secondary trades)
  const categoriesInFav = Array.from(
    new Set(favWorkers.flatMap(w => (w.skills && w.skills.length > 0 ? w.skills : [w.category])))
  );

  // Filtered workers based on active category tab (matches either primary category or secondary trades)
  const displayedWorkers = selectedCategoryFilter === 'all'
    ? favWorkers
    : favWorkers.filter(w => 
        w.category.toLowerCase() === selectedCategoryFilter.toLowerCase() ||
        (w.skills && w.skills.some(s => s.toLowerCase() === selectedCategoryFilter.toLowerCase()))
      );

  // Handle booking:
  // If in a category tab (e.g. Electrician or Plumber), no need to ask which trade it is!
  // If in 'All' tab, and worker has multiple trades (e.g. Rajesh does Electrician & Plumber), ask which trade.
  const handleBookWorker = (worker: Worker) => {
    if (selectedCategoryFilter !== 'all') {
      // In specific category tab - no need to ask which trade!
      requestFavouriteDirectly(worker.id, selectedCategoryFilter);
    } else {
      // In 'All' tab:
      if (worker.skills && worker.skills.length > 1) {
        setSkillChoiceWorker(worker);
        setSelectedSkill(worker.skills[0]);
      } else {
        const trade = (worker.skills && worker.skills.length === 1) ? worker.skills[0] : worker.category;
        requestFavouriteDirectly(worker.id, trade);
      }
    }
  };

  const handleConfirmSkillAndOpenForm = () => {
    if (!skillChoiceWorker) return;
    const worker = skillChoiceWorker;
    const trade = selectedSkill || (worker.skills ? worker.skills[0] : worker.category);

    setSkillChoiceWorker(null);
    requestFavouriteDirectly(worker.id, trade);
  };

  const handleRemoveFavourite = (workerId: number, workerName: string) => {
    toggleFavourite(workerId);
    showToast(`${workerName} removed from favourites.`);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#F4F7F5] px-4 sm:px-5 pt-3.5 pb-32 min-h-[calc(100vh-64px)]">
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-3.5 select-none">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            Favourites
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Your saved workers & fast 1-tap direct request
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#1B5E3C] border border-emerald-200/80 text-[11px] font-bold shadow-2xs">
          {favWorkers.length} Saved
        </span>
      </div>

      {/* Category Filter Pills (When favourites exist) */}
      {favWorkers.length > 0 && categoriesInFav.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none select-none">
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#1B5E3C] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
            }`}
          >
            <span>All</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedCategoryFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {favWorkers.length}
            </span>
          </button>

          {categoriesInFav.map(cat => {
            const count = favWorkers.filter(w => 
              w.category.toLowerCase() === cat.toLowerCase() ||
              (w.skills && w.skills.some(s => s.toLowerCase() === cat.toLowerCase()))
            ).length;
            const isSelected = selectedCategoryFilter.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1B5E3C] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Saved Workers List */}
      {favWorkers.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-[24px] border border-slate-200/90 shadow-2xs my-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Heart className="w-7 h-7 fill-rose-500 text-rose-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No saved workers yet</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed max-w-xs mx-auto">
            Tap the heart icon on any worker card to save them here for quick direct requests anytime.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B5E3C] hover:bg-[#14472d] text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : displayedWorkers.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-[24px] border border-slate-200/90 shadow-2xs my-4">
          <h3 className="text-sm font-bold text-slate-800 mb-1">No {selectedCategoryFilter} workers saved</h3>
          <p className="text-xs text-slate-500 mb-3">You don't have any saved workers under this specific category.</p>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className="text-xs font-bold text-[#1B5E3C] underline cursor-pointer"
          >
            View all favourites
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedWorkers.map((worker) => (
            <div
              key={worker.id}
              className="rounded-[22px] bg-white border border-slate-200/90 p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(20,80,50,0.09)] transition-all space-y-3"
            >
              {/* Top Row: Avatar, Name, Category & Heart Toggle */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-900 text-lg font-black shrink-0 shadow-2xs">
                    {worker.initial}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-base font-bold text-slate-900 truncate leading-tight">
                        {worker.name}
                      </h2>
                      <span title="Verified Worker">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#1B5E3C] border border-emerald-200/80 text-[10px] font-bold">
                        {worker.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        • Verified Trade
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove from Favourites Heart */}
                <button
                  type="button"
                  onClick={() => handleRemoveFavourite(worker.id, worker.name)}
                  className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-colors shadow-2xs cursor-pointer shrink-0"
                  title="Remove from favourites"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </button>
              </div>

              {/* Rate & Rating Info Strip (NO distance / place) */}
              <div className="flex items-center justify-between text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 font-medium">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <div className="flex items-center gap-1 text-amber-700 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{worker.rating}</span>
                  </div>
                  {worker.reviewsCount && (
                    <span className="text-[11px] text-slate-500">
                      ({worker.reviewsCount} reviews)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 font-bold text-[#1B5E3C]">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>{worker.wage}</span>
                </div>
              </div>

              {/* Platform Service Categories (e.g. Electrician, Plumber) */}
              {worker.skills && worker.skills.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Services:
                  </span>
                  {worker.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#1B5E3C] text-[11px] font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Button: Book Worker (Opens normal job form for him only) */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleBookWorker(worker)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1B5E3C] hover:bg-[#14472d] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book {worker.name.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* OPTION 3: Trade Choice Modal (Shown when requesting a worker with multiple trades) */}
      {skillChoiceWorker && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
          onClick={() => setSkillChoiceWorker(null)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl animate-slide-up flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <span className="text-[10px] font-bold text-[#1B5E3C] uppercase tracking-wider block">
                  Select Specific Trade
                </span>
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  Book {skillChoiceWorker.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {skillChoiceWorker.name} provides multiple trades. Which work do you require?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSkillChoiceWorker(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Skills as selectable radio options */}
            <div className="space-y-2 py-2 overflow-y-auto max-h-64">
              {skillChoiceWorker.skills?.map((skill, index) => {
                const isSelected = selectedSkill === skill;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedSkill(skill)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#1B5E3C] bg-emerald-50/70 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#1B5E3C] bg-[#1B5E3C] text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{skill}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Standard rate: {skillChoiceWorker.wage}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {skill}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Confirmation CTA */}
            <div className="pt-3 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={handleConfirmSkillAndOpenForm}
                className="w-full py-3 rounded-xl bg-[#1B5E3C] hover:bg-[#14472d] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <span>Continue with {selectedSkill}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

