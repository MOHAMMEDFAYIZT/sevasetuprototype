import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import { ChevronLeft, ChevronRight, Star, Heart, Check, Plus, MapPin, Send } from 'lucide-react';

export const WorkersListPage: React.FC = () => {
  const { 
    selectedCategory, 
    selectedWorkerIds, 
    toggleWorkerSelection, 
    draftJob,
    openCreateJobModal,
    favourites, 
    toggleFavourite, 
    createJobWithRequests,
    requestWorkerForJob,
    openWorkerProfile,
    jobs, 
    showToast 
  } = useApp();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetJobId = searchParams.get('jobId') ? Number(searchParams.get('jobId')) : null;
  const targetJob = targetJobId ? jobs.find(j => j.id === targetJobId) : null;
  const isRequestMoreMode = !!targetJob;

  const neededCount = isRequestMoreMode ? 10 : (draftJob.workersNeeded || 1);

  const [additionalSelectedIds, setAdditionalSelectedIds] = useState<number[]>([]);

  const alreadyRequestedIds = targetJob ? targetJob.requests.map(r => r.workerId) : [];

  // Match category workers
  const activeCategory = targetJob ? targetJob.category : selectedCategory;
  const categoryWorkers = WORKERS_DATABASE.filter(
    w => w.category.toLowerCase().includes((activeCategory || '').toLowerCase()) || 
         (activeCategory || '').toLowerCase().includes(w.category.toLowerCase()) ||
         (w.skills && w.skills.some(s => s.toLowerCase() === (activeCategory || '').toLowerCase()))
  );

  // Fallback to first few workers if none explicitly match
  const workers = categoryWorkers.length > 0 ? categoryWorkers : WORKERS_DATABASE.slice(0, 8);

  const handleBack = () => {
    if (isRequestMoreMode && targetJob) {
      navigate(`/jobs/${targetJob.id}`);
    } else {
      navigate('/');
      openCreateJobModal(activeCategory || 'Electrician');
    }
  };

  const handleWorkerClick = (workerId: number) => {
    if (isRequestMoreMode) {
      if (alreadyRequestedIds.includes(workerId)) {
        showToast('Request already sent to this worker');
        return;
      }
      setAdditionalSelectedIds(prev => 
        prev.includes(workerId) ? prev.filter(id => id !== workerId) : [...prev, workerId]
      );
    } else {
      const isAlreadySelected = selectedWorkerIds.includes(workerId);
      if (!isAlreadySelected && selectedWorkerIds.length >= neededCount) {
        showToast(
          neededCount === 1
            ? 'You requested 1 worker. Unselect to choose someone else.'
            : `You requested ${neededCount} workers. Unselect one to choose someone else.`
        );
        return;
      }
      toggleWorkerSelection(workerId);
    }
  };

  const handleSend = () => {
    if (isRequestMoreMode && targetJob) {
      if (additionalSelectedIds.length === 0) {
        showToast('Please select at least 1 worker');
        return;
      }
      additionalSelectedIds.forEach(workerId => {
        requestWorkerForJob(targetJob.id, workerId);
      });
      showToast(`Request sent to ${additionalSelectedIds.length} more worker${additionalSelectedIds.length > 1 ? 's' : ''}!`);
      navigate(`/jobs/${targetJob.id}`, { replace: true });
    } else {
      if (selectedWorkerIds.length < neededCount) {
        showToast(
          neededCount === 1
            ? 'Please select 1 worker'
            : `Please select ${neededCount} workers (${selectedWorkerIds.length}/${neededCount} selected)`
        );
        return;
      }
      createJobWithRequests();
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col px-4 sm:px-5 pt-0 pb-0 min-h-full relative">
      {/* Back button at the top */}
      <button
        type="button"
        onClick={handleBack}
        className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-all cursor-pointer border border-white shadow-[0_2px_8px_rgba(16,60,38,0.06)] active:scale-95"
        title={isRequestMoreMode ? "Back to job details" : "Back to job details"}
        aria-label={isRequestMoreMode ? "Back to job details" : "Back to job details"}
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Header title at mt-22 starting at the same level as the cards */}
      <div className="mt-22 mb-3 select-none">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-[#16261E] tracking-tight leading-tight">
          {isRequestMoreMode && targetJob 
            ? `Request More ${targetJob.category} Workers`
            : `${selectedCategory || 'Worker'}s Near You`
          }
        </h1>
      </div>

      {/* Workers Cards List */}
      <div className="space-y-3.5 mt-1">
        {workers.map(worker => {
          const isAlreadyRequested = isRequestMoreMode && alreadyRequestedIds.includes(worker.id);
          const isSelected = isRequestMoreMode 
            ? additionalSelectedIds.includes(worker.id)
            : selectedWorkerIds.includes(worker.id);
          const isFav = favourites.includes(worker.id);

          return (
            <div 
              key={worker.id}
              onClick={() => handleWorkerClick(worker.id)}
              className={`rounded-[24px] overflow-hidden transition-all duration-150 select-none ${
                isAlreadyRequested
                  ? 'border border-[#E3ECE0] bg-slate-50/70 opacity-80 cursor-default'
                  : isSelected 
                    ? 'border-2 border-[#0C6B44] bg-white ring-2 ring-[#0C6B44]/20 shadow-[0_8px_24px_rgba(10,90,57,0.18)] cursor-pointer' 
                    : 'glass border border-white hover:border-[#3AAA48]/40 shadow-[0_6px_20px_rgba(16,60,38,0.06),0_1px_2px_rgba(16,40,25,0.04)] cursor-pointer'
              }`}
            >
              {/* Top Floor: Profile Information & Wage Badge */}
              <div className="p-3.5 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Squared-Circle Avatar with Active Status Dot */}
                    <div 
                      className="relative shrink-0 cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWorkerProfile(worker, 'list');
                      }}
                      title="View worker profile"
                    >
                      {worker.avatar ? (
                        <img
                          src={worker.avatar}
                          alt={worker.name}
                          className="w-13 h-13 rounded-2xl object-cover border border-[#E3ECE0] shadow-2xs group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0C6B44] to-[#0A5A39] text-white flex items-center justify-center font-display font-bold text-lg shadow-2xs border border-white/20 group-hover:scale-105 transition-transform">
                          {worker.initial}
                        </div>
                      )}
                      {/* Active green status indicator */}
                      <span 
                        className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-2xs" 
                        title="Available now" 
                      />
                    </div>

                    {/* Worker Name, Rating & Distance */}
                    <div className="min-w-0 flex-1">
                      <h3 
                        className="font-display text-[15px] font-bold text-[#16261E] leading-snug truncate hover:text-[#0C6B44] cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openWorkerProfile(worker, 'list');
                        }}
                      >
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
                          openWorkerProfile(worker, 'list');
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
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavourite(worker.id);
                      }}
                      className="p-1 text-[#76857D] hover:text-rose-500 transition-colors cursor-pointer"
                      title={isFav ? "Saved in favourites" : "Add to favourites"}
                    >
                      <Heart 
                        className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : 'stroke-[1.8]'}`} 
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Shelf: Hourly & Daily Wage on the left, Select button on the right */}
              <div className={`px-3.5 py-2.5 border-t flex items-center justify-between gap-3 transition-colors ${
                isAlreadyRequested
                  ? 'bg-[#F6FAF4] border-[#E3ECE0]'
                  : isSelected 
                    ? 'bg-[#E2F3DD]/70 border-[#0C6B44]/20' 
                    : 'bg-[#F6FAF4] border-[#E3ECE0]'
              }`}>
                {/* Left: Hourly & Daily Wage directly in line with Select button */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-bold text-[#0C6B44] bg-[#E2F3DD] px-2.5 py-1 rounded-lg">
                    {worker.wage}
                  </span>
                  <span className="text-[#CBD8CA] font-bold">•</span>
                  <span className="font-bold text-[#0C6B44] bg-[#E2F3DD] px-2.5 py-1 rounded-lg">
                    {worker.dailyWage || '₹850/day'}
                  </span>
                </div>

                {/* Right: Tactile Select / Selected / Request Sent Button */}
                <div className="shrink-0">
                  {isAlreadyRequested ? (
                    <div className="w-[114px] h-8 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 bg-[#EEF2EC] text-[#76857D] border border-[#E3ECE0] select-none">
                      <Check className="w-3.5 h-3.5 text-[#0C6B44] stroke-[2.5]" />
                      <span>Request Sent</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWorkerClick(worker.id);
                      }}
                      className={`w-[96px] h-8.5 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0C6B44] text-white shadow-[0_4px_12px_rgba(10,90,57,0.2)]'
                          : 'bg-white hover:bg-[#E2F3DD] text-[#0C6B44] border border-[#0C6B44]/40 shadow-2xs active:scale-95'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Select</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clean Bottom Action Dock - docked inside phone frame */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 px-4 sm:px-5 py-3 z-40 bg-white/95 backdrop-blur-md border-t border-[#E3ECE0] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] mt-auto flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="font-display font-bold text-sm sm:text-[15px] text-[#16261E] block truncate">
            {isRequestMoreMode
              ? (additionalSelectedIds.length > 0
                  ? `${additionalSelectedIds.length} worker${additionalSelectedIds.length > 1 ? 's' : ''} selected`
                  : 'Select workers')
              : (selectedWorkerIds.length === 0
                  ? `Select ${neededCount} worker${neededCount > 1 ? 's' : ''}`
                  : selectedWorkerIds.length < neededCount
                    ? `${selectedWorkerIds.length} of ${neededCount} selected`
                    : `${neededCount} worker${neededCount > 1 ? 's' : ''} selected`)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={isRequestMoreMode ? additionalSelectedIds.length === 0 : selectedWorkerIds.length < neededCount}
          className={`h-11 px-5 rounded-full font-display font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-[0.98] shrink-0 ${
            (isRequestMoreMode ? additionalSelectedIds.length > 0 : selectedWorkerIds.length === neededCount)
              ? 'bg-[#0C6B44] hover:bg-[#0A5A39] text-white shadow-[0_8px_20px_rgba(10,90,57,0.25)] cursor-pointer'
              : 'bg-[#E3ECE0] text-[#76857D] cursor-not-allowed shadow-none'
          }`}
        >
          <Send className="w-4 h-4 stroke-[2.2]" />
          <span>
            {isRequestMoreMode
              ? `Request (${additionalSelectedIds.length})`
              : (neededCount === 1 ? 'Send Request' : `Send Request (${selectedWorkerIds.length})`)}
          </span>
        </button>
      </div>
    </div>
  );
};
