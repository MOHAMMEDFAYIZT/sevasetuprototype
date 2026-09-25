import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import { ChevronLeft, Star, Heart, Check, Plus, MapPin, Sparkles, Send, ArrowRight } from 'lucide-react';
import { WorkerBadge } from '../components/common/WorkerBadge';

export const WorkersListPage: React.FC = () => {
  const { 
    selectedCategory, 
    selectedWorkerIds, 
    toggleWorkerSelection, 
    favourites, 
    toggleFavourite, 
    createJobWithRequests,
    requestWorkerForJob,
    jobs,
    showToast 
  } = useApp();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetJobId = searchParams.get('jobId') ? Number(searchParams.get('jobId')) : null;
  const targetJob = targetJobId ? jobs.find(j => j.id === targetJobId) : null;
  const isRequestMoreMode = !!targetJob;

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
      navigate(`/jobs/${targetJob.id}`);
    } else {
      if (selectedWorkerIds.length === 0) {
        showToast('Please select at least 1 worker');
        return;
      }
      createJobWithRequests();
      showToast(`Broadcast sent to ${selectedWorkerIds.length} worker${selectedWorkerIds.length > 1 ? 's' : ''}!`);
      navigate('/jobs');
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#F4F7F5] px-4 sm:px-5 pt-3.5 pb-44 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3.5 select-none">
        <Link
          to={isRequestMoreMode && targetJob ? `/jobs/${targetJob.id}` : "/"}
          className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors cursor-pointer shrink-0 border border-slate-200/90 shadow-2xs"
          title={isRequestMoreMode ? "Back to job details" : "Back to services"}
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </Link>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
            {isRequestMoreMode && targetJob 
              ? `Request More ${targetJob.category} Workers`
              : `${selectedCategory || 'Worker'}s Near You`
            }
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {isRequestMoreMode 
              ? 'Select additional workers to send your request'
              : 'Select 1 or more workers • First to accept connects'
            }
          </p>
        </div>
      </div>

      {/* Workers Cards List with Vibrant Tactile Separation */}
      <div className="space-y-4 mt-1">
        {workers.map(worker => {
          const isAlreadyRequested = isRequestMoreMode && alreadyRequestedIds.includes(worker.id);
          const isSelected = isRequestMoreMode 
            ? additionalSelectedIds.includes(worker.id)
            : selectedWorkerIds.includes(worker.id);
          const isFav = favourites.includes(worker.id);
          const isTopRated = worker.rating >= 4.8;

          return (
            <div 
              key={worker.id}
              onClick={() => handleWorkerClick(worker.id)}
              className={`rounded-[22px] overflow-hidden transition-colors duration-150 select-none border-2 ${
                isAlreadyRequested
                  ? 'border-slate-200/70 bg-slate-50/60 opacity-80 cursor-default'
                  : isSelected 
                    ? 'border-[#185E3B] bg-white ring-2 ring-[#185E3B]/20 shadow-[0_8px_24px_rgba(24,94,59,0.16)] cursor-pointer' 
                    : 'border-slate-200/90 bg-white hover:border-[#185E3B]/40 shadow-[0_4px_16px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.04)] cursor-pointer'
              }`}
            >
              {/* Top Floor: Profile Information & Wage Badge */}
              <div className="p-3.5 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Modern Squared-Circle Avatar with Active Status Dot & Rating Badge */}
                    <div className="relative shrink-0">
                      {worker.avatar ? (
                        <img
                          src={worker.avatar}
                          alt={worker.name}
                          className="w-13 h-13 rounded-2xl object-cover border border-slate-200/90 shadow-2xs"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#185E3B] to-[#124229] text-white flex items-center justify-center font-bold text-lg shadow-2xs border border-emerald-800/20">
                          {worker.initial}
                        </div>
                      )}
                      {/* Active green status indicator */}
                      <span 
                        className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-2xs" 
                        title="Available now" 
                      />
                      {/* Rating Tier Badge attached to bottom of profile image */}
                      <div className="absolute -bottom-2 -right-1.5 z-10">
                        <WorkerBadge rating={worker.rating} size="md" />
                      </div>
                    </div>

                    {/* Worker Name, Rating & Distance */}
                    <div className="min-w-0 flex-1">
                      {/* Line 1: Worker Name & Top Rated Badge */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="text-[15px] font-bold text-slate-900 leading-snug truncate">
                          {worker.name}
                        </h3>
                        {isTopRated && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold shrink-0">
                            <Sparkles className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <span>Top Rated</span>
                          </span>
                        )}
                      </div>

                      {/* Line 2: Rating & Reviews Count */}
                      <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-none shrink-0" />
                        <span className="font-bold text-slate-900">{worker.rating}</span>
                        <span className="text-slate-400 font-normal">
                          ({worker.reviewsCount || 24})
                        </span>
                      </div>

                      {/* Line 3: Distance (Dedicated line for all cards) */}
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{worker.distance} km away</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Right: Expected Wage Badge & Favourite Heart */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-[#144c31] font-bold text-xs border border-emerald-200/80 shadow-2xs">
                      {worker.wage}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavourite(worker.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title={isFav ? "Saved in favourites" : "Add to favourites"}
                    >
                      <Heart 
                        className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : 'stroke-[1.8]'}`} 
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Shelf (Soft Sage Shelf): Skills & Selection CTA */}
              <div className={`px-3.5 py-2.5 border-t flex items-center justify-between gap-3 transition-colors ${
                isAlreadyRequested
                  ? 'bg-slate-100/60 border-slate-200'
                  : isSelected 
                    ? 'bg-emerald-100/60 border-emerald-300/80' 
                    : 'bg-[#F1F6F3] border-[#DFECE3]'
              }`}>
                {/* Left: Skills tags with matched skill highlighted - locked single line */}
                <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-hidden">
                  {worker.skills && worker.skills.map((skill, idx) => {
                    const isMatch = skill.toLowerCase() === (worker.matchedSkill || '').toLowerCase() || idx === 0;
                    return (
                      <span
                        key={skill}
                        className={`shrink-0 text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-lg whitespace-nowrap transition-colors ${
                          isMatch
                            ? 'bg-[#185E3B] text-white font-bold shadow-2xs'
                            : 'bg-white text-slate-600 font-medium border border-slate-200/80 shadow-2xs'
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>

                {/* Right: Tactile Select / Selected / Request Sent Button */}
                <div className="shrink-0">
                  {isAlreadyRequested ? (
                    <div className="w-[114px] h-8 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-slate-100 text-slate-500 border border-slate-200 select-none">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      <span>Request Sent</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWorkerClick(worker.id);
                      }}
                      className={`w-[92px] h-8 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-[#185E3B] text-white shadow-xs'
                          : 'bg-white hover:bg-emerald-50/70 text-[#185E3B] border border-[#185E3B]/40 shadow-2xs active:scale-95'
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

      {/* Elevated Sticky Floating Bar (Positioned ABOVE bottom nav on a higher plane z-50) */}
      <div className="fixed bottom-20 sm:bottom-22 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-slide-up">
        <div className="w-full max-w-md pointer-events-auto">
          <button
            type="button"
            onClick={handleSend}
            disabled={isRequestMoreMode ? additionalSelectedIds.length === 0 : selectedWorkerIds.length === 0}
            className={`w-full h-13 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer group ${
              (isRequestMoreMode ? additionalSelectedIds.length > 0 : selectedWorkerIds.length > 0)
                ? 'bg-[#185E3B] hover:bg-[#144E31] text-white shadow-[0_16px_36px_rgba(20,80,50,0.35)] border border-emerald-400/30'
                : 'bg-slate-200/90 text-slate-400 cursor-not-allowed shadow-none border border-slate-300/60'
            }`}
          >
            <Send className="w-4 h-4 stroke-[2.2]" />
            <span>
              {isRequestMoreMode ? (
                additionalSelectedIds.length > 0
                  ? `Send Request to ${additionalSelectedIds.length} More Worker${additionalSelectedIds.length > 1 ? 's' : ''}`
                  : 'Select workers to send request'
              ) : (
                selectedWorkerIds.length > 0
                  ? `Send Request to ${selectedWorkerIds.length} Worker${selectedWorkerIds.length > 1 ? 's' : ''}`
                  : 'Select workers to send request'
              )}
            </span>
            {(isRequestMoreMode ? additionalSelectedIds.length > 0 : selectedWorkerIds.length > 0) && (
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
