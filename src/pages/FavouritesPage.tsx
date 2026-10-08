import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import type { Worker } from '../types';
import { 
  Heart, 
  Star, 
  MapPin, 
  ChevronRight, 
  ArrowRight,
  Send,
  X,
  Wrench
} from 'lucide-react';

export const FavouritesPage: React.FC = () => {
  const { 
    favourites, 
    toggleFavourite, 
    requestFavouriteDirectly,
    openWorkerProfile,
    showToast 
  } = useApp();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [serviceSelectionWorker, setServiceSelectionWorker] = useState<Worker | null>(null);

  const favWorkers = WORKERS_DATABASE.filter(w => favourites.includes(w.id));

  // Extract unique trade categories across saved workers (including secondary skills)
  const allSavedCategories = Array.from(
    new Set(favWorkers.flatMap(w => w.skills && w.skills.length > 0 ? w.skills : [w.category]))
  );

  // Filter workers based on selected tab
  const displayedWorkers = selectedCategoryFilter === 'all'
    ? favWorkers
    : favWorkers.filter(w => {
        const skills = w.skills && w.skills.length > 0 ? w.skills : [w.category];
        return skills.some(s => s.toLowerCase() === selectedCategoryFilter.toLowerCase());
      });

  const handleInitiateRequest = (e: React.MouseEvent, worker: Worker) => {
    e.stopPropagation();

    // If currently filtered by a specific category (not 'all'), directly use that category
    if (selectedCategoryFilter !== 'all') {
      requestFavouriteDirectly(worker.id, selectedCategoryFilter);
      return;
    }

    const availableSkills = worker.skills && worker.skills.length > 0 
      ? worker.skills 
      : [worker.category];

    // If worker offers multiple services, prompt user with centered modal
    if (availableSkills.length > 1) {
      setServiceSelectionWorker(worker);
    } else {
      requestFavouriteDirectly(worker.id, availableSkills[0]);
    }
  };

  const handleSelectServiceAndProceed = (serviceName: string) => {
    if (!serviceSelectionWorker) return;
    const workerId = serviceSelectionWorker.id;
    setServiceSelectionWorker(null);
    requestFavouriteDirectly(workerId, serviceName);
  };

  const handleRemoveFavourite = (e: React.MouseEvent, workerId: number, workerName: string) => {
    e.stopPropagation();
    toggleFavourite(workerId);
    showToast(`${workerName} removed from favourites.`);
  };

  return (
    <div className="w-full flex-1 flex flex-col px-4 sm:px-5 pt-3 pb-24">
      
      {/* Page Header (Starts mt-22 from top, same as workers list & other pages) */}
      <div className="flex items-center justify-between mt-13 mb-3.5 select-none">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#16261E] tracking-tight leading-tight">
            Favourites
          </h1>
          <p className="text-xs text-[#4F6057] font-medium mt-0.5">
            Quickly book your saved verified workers
          </p>
        </div>
      </div>

      {/* Category Filter Pills (All, Electrician, Plumber, etc.) */}
      {favWorkers.length > 0 && allSavedCategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3.5 scrollbar-none select-none">
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#0C6B44] text-white shadow-2xs font-bold'
                : 'bg-white text-[#4F6057] hover:text-[#16261E] border border-[#E3ECE0]'
            }`}
          >
            <span>All ({favWorkers.length})</span>
          </button>

          {allSavedCategories.map(cat => {
            const count = favWorkers.filter(w => {
              const skills = w.skills && w.skills.length > 0 ? w.skills : [w.category];
              return skills.some(s => s.toLowerCase() === cat.toLowerCase());
            }).length;
            const isSelected = selectedCategoryFilter.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#0C6B44] text-white shadow-2xs font-bold'
                    : 'bg-white text-[#4F6057] hover:text-[#16261E] border border-[#E3ECE0]'
                }`}
              >
                <span>{cat} ({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Saved Workers List */}
      {favWorkers.length === 0 ? (
        <div className="p-8 text-center glass rounded-[28px] border border-white my-4 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Heart className="w-7 h-7 fill-rose-500 text-rose-500" />
          </div>
          <h3 className="font-display text-base font-bold text-[#16261E] mb-1">No favourites saved yet</h3>
          <p className="text-xs text-[#4F6057] mb-5 leading-relaxed max-w-xs mx-auto">
            Tap the heart icon on any worker to save them here for instant booking whenever you need work done.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : displayedWorkers.length === 0 ? (
        <div className="p-8 text-center glass rounded-[28px] border border-white my-4 shadow-2xs">
          <h3 className="font-display text-sm font-bold text-[#16261E] mb-1">No {selectedCategoryFilter} workers saved</h3>
          <p className="text-xs text-[#4F6057] mb-3">You don't have any saved workers offering {selectedCategoryFilter}.</p>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className="text-xs font-bold text-[#0C6B44] underline cursor-pointer"
          >
            View all saved
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedWorkers.map((worker) => {
            const skillsList = worker.skills && worker.skills.length > 0 
              ? worker.skills 
              : [worker.category];

            return (
              <div
                key={worker.id}
                onClick={() => openWorkerProfile(worker, 'favourites')}
                className="glass rounded-2xl sm:rounded-3xl border border-white hover:border-[#3AAA48]/40 shadow-[0_6px_20px_rgba(16,60,38,0.06),0_1px_2px_rgba(16,40,25,0.04)] overflow-hidden transition-all duration-200 cursor-pointer"
              >
                {/* Top Floor: Profile Information (Identical to Workers List) */}
                <div className="p-3.5 sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Squared-Circle Avatar with Active Status Dot */}
                      <div className="relative shrink-0">
                        {worker.avatar ? (
                          <img
                            src={worker.avatar}
                            alt={worker.name}
                            className="w-13 h-13 rounded-2xl object-cover border border-[#E3ECE0] shadow-2xs"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0C6B44] to-[#0A5A39] text-white flex items-center justify-center font-display font-bold text-lg shadow-2xs border border-white/20">
                            {worker.initial}
                          </div>
                        )}
                        <span 
                          className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-2xs" 
                          title="Available now" 
                        />
                      </div>

                      {/* Worker Name, Rating & Distance */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-[15px] font-bold text-[#16261E] leading-snug truncate">
                          {worker.name}
                        </h3>

                        {/* Single clean line: Rating · Distance */}
                        <div className="flex items-center gap-1.5 text-xs text-[#4F6057] mt-0.5 font-medium">
                          <span className="flex items-center gap-1 text-[#16261E] font-bold">
                            <Star className="w-3.5 h-3.5 fill-[#E0A800] text-[#E0A800] stroke-none shrink-0" />
                            <span>{worker.rating}</span>
                          </span>
                          <span className="text-[#CBD8CA]">•</span>
                          <span className="flex items-center gap-1 text-[#76857D]">
                            <MapPin className="w-3.5 h-3.5 text-[#76857D] shrink-0" />
                            <span>{worker.distance} km away</span>
                          </span>
                        </div>

                        {/* Clean View Profile action */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openWorkerProfile(worker, 'favourites');
                          }}
                          className="text-xs font-bold text-[#0C6B44] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer"
                        >
                          <span>View Profile</span>
                          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    {/* Top Right: Favourite Heart */}
                    <div className="flex items-center shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleRemoveFavourite(e, worker.id, worker.name)}
                        className="p-1 text-rose-500 hover:scale-110 transition-transform cursor-pointer"
                        title="Remove from favourites"
                      >
                        <Heart className="w-5 h-5 fill-rose-500 text-rose-500 stroke-[1.8]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Shelf: Services on the left, Request button on the right */}
                <div className="px-3.5 py-2.5 border-t border-[#E3ECE0] bg-[#F6FAF4] flex items-center justify-between gap-3 select-none">
                  {/* Left: Services Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    {skillsList.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#E2F3DD] text-[#0C6B44] text-xs font-bold truncate select-none"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Right: Compact Tactile Request Button */}
                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleInitiateRequest(e, worker)}
                      className="h-8 px-4 rounded-full font-display font-bold text-xs bg-[#0C6B44] hover:bg-[#0A5A39] text-white flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(10,90,57,0.2)] transition-all active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3 h-3 stroke-[2.2]" />
                      <span>Request</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Centered Modal: Choose Service (When requesting multi-trade worker from 'All') */}
      {serviceSelectionWorker && (
        <div 
          className="absolute inset-0 z-60 flex items-center justify-center bg-[rgba(15,40,28,0.45)] backdrop-blur-[4px] p-4 animate-fade-in"
          onClick={() => setServiceSelectionWorker(null)}
        >
          <div 
            className="w-[calc(100%-32px)] max-w-[340px] bg-white rounded-[24px] p-5 shadow-[0_20px_50px_rgba(10,40,25,0.3)] border border-[#E3ECE0] animate-scale-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E3ECE0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E2F3DD] text-[#0C6B44] flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-[#16261E]">
                    Select Service
                  </h3>
                  <p className="text-[11px] text-[#76857D]">
                    for {serviceSelectionWorker.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setServiceSelectionWorker(null)}
                className="w-7 h-7 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] flex items-center justify-center text-[#76857D] hover:text-[#16261E] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Prompt description */}
            <p className="text-xs text-[#4F6057] mt-3 mb-2.5 font-normal">
              {serviceSelectionWorker.name} offers multiple services. Which work do you need assistance with?
            </p>

            {/* Service Options List */}
            <div className="space-y-2 py-1">
              {(serviceSelectionWorker.skills || [serviceSelectionWorker.category]).map((skill) => {
                const wageInfo = serviceSelectionWorker.serviceWages?.[skill] || {
                  hourly: serviceSelectionWorker.wage,
                  daily: serviceSelectionWorker.dailyWage || '₹850/day'
                };

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSelectServiceAndProceed(skill)}
                    className="w-full p-3 rounded-2xl border border-[#E3ECE0] hover:border-[#0C6B44] bg-[#F6FAF4] hover:bg-[#E2F3DD]/40 flex items-center justify-between transition-all cursor-pointer text-left group"
                  >
                    <div>
                      <span className="font-display text-sm font-bold text-[#16261E] group-hover:text-[#0C6B44] block">
                        {skill}
                      </span>
                      <span className="text-[11px] text-[#4F6057] mt-0.5 block font-medium">
                        {wageInfo.hourly} • {wageInfo.daily}
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-white group-hover:bg-[#0C6B44] text-[#76857D] group-hover:text-white border border-[#E3ECE0] flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
