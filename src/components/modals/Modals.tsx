import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RURAL_LOCATIONS, WORKERS_DATABASE } from '../../data/mockData';
import { MapPin, Check, X, AlertCircle, Star, Heart } from 'lucide-react';
import { JobDetailsModal } from './JobDetailsModal';
import { WorkerBadge } from '../common/WorkerBadge';

export const Modals: React.FC = () => {
  const {
    user,
    updateUser,
    isLocationModalOpen,
    closeLocationModal,
    isConfirmModalOpen,
    closeConfirmModal,
    createJobFromDraft,
    selectedWorkerIds,
    isCancelModalOpen,
    cancelTargetJobId,
    closeCancelModal,
    cancelJob,
    isCompleteConfirmModalOpen,
    completeTargetJobId,
    closeCompleteConfirmModal,
    completeJob,
    isRateModalOpen,
    rateTargetJobId,
    closeRateModal,
    rateJob,
    favourites,
    toggleFavourite,
    jobs,
    showToast
  } = useApp();

  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');

  // 1. Location Selection Modal
  const handleSelectLocation = (loc: string) => {
    updateUser({ location: loc });
    closeLocationModal();
    showToast(`Location set to ${loc}`);
  };

  // 2. Rating Modal worker info
  const ratingJob = jobs.find(j => j.id === rateTargetJobId);
  const acceptedReq = ratingJob?.requests.find(r => r.status === 'accepted');
  const matchedWorker = acceptedReq ? WORKERS_DATABASE.find(w => w.id === acceptedReq.workerId) : null;

  return (
    <>
      {/* 0. Job Details Requirement Modal (Bottom Sheet) */}
      <JobDetailsModal />

      {/* 1. Location Picker Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
          <div 
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up max-h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-black text-slate-900">Select Locality</h3>
              <button 
                onClick={closeLocationModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              Select your area in Palakkad for nearby independent worker matching (15–20 km).
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
              {RURAL_LOCATIONS.map(loc => {
                const isSelected = loc === user.location;
                return (
                  <button
                    key={loc}
                    onClick={() => handleSelectLocation(loc)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-bold transition-all text-left cursor-pointer ${
                      isSelected 
                        ? 'border-brand-700 bg-brand-50 text-brand-900 shadow-xs' 
                        : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-brand-700' : 'text-slate-400'}`} />
                      <span>{loc}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-700" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={closeLocationModal}
              className="mt-4 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 2. Confirm Multi-Request Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl flex flex-col">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            
            <h3 className="text-xl font-black text-slate-900 mb-2">Send Broadcast Requests?</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
              You are sending requests to <strong className="text-brand-800 font-black">{selectedWorkerIds.length} workers</strong>. The <strong>first worker who accepts</strong> gets assigned to you directly; other requests become inactive automatically.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={closeConfirmModal}
                className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={createJobFromDraft}
                className="w-full py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Send Requests
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Cancel Job Bottom Sheet Modal */}
      {isCancelModalOpen && cancelTargetJobId && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
          onClick={closeCancelModal}
        >
          <div 
            className="w-full max-w-[430px] bg-white rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl animate-slide-up flex flex-col text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
            
            <div className="w-13 h-13 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/70 flex items-center justify-center mb-3 mx-auto shadow-2xs">
              <AlertCircle className="w-6 h-6 stroke-[2.2]" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">Cancel this job request?</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-medium px-2">
              Any pending worker requests will be withdrawn and this job will move to your Past History. You can request again anytime.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeCancelModal}
                className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Keep Job
              </button>
              <button
                type="button"
                onClick={() => cancelJob(cancelTargetJobId)}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3.5. Mark As Completed Confirmation Bottom Sheet */}
      {isCompleteConfirmModalOpen && completeTargetJobId && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
          onClick={closeCompleteConfirmModal}
        >
          <div 
            className="w-full max-w-[430px] bg-white rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl animate-slide-up flex flex-col text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
            
            <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-[#185E3B] border border-emerald-200/80 flex items-center justify-center mb-3 mx-auto shadow-2xs">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">Mark this job as completed?</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-medium px-2">
              Confirm that the service has been finished. You will be able to review and rate the worker right after.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeCompleteConfirmModal}
                className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Not Yet
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = completeTargetJobId;
                  closeCompleteConfirmModal();
                  completeJob(targetId);
                }}
                className="w-full py-3.5 rounded-xl bg-[#185E3B] hover:bg-[#144E31] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Yes, Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Rate Worker Bottom Sheet Modal */}
      {isRateModalOpen && rateTargetJobId && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
          onClick={closeRateModal}
        >
          <div 
            className="w-full max-w-[430px] bg-white rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl animate-slide-up flex flex-col text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3" />
            
            {/* Header with dismiss X */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Service Completed ✨
              </span>
              <button
                type="button"
                onClick={closeRateModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Worker Spotlight Card */}
            {matchedWorker && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F4F7F5] border border-slate-200/90 text-left my-2">
                <div className="relative shrink-0">
                  {matchedWorker.avatar ? (
                    <img 
                      src={matchedWorker.avatar} 
                      alt={matchedWorker.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#185E3B] to-[#124229] text-white font-bold flex items-center justify-center text-base">
                      {matchedWorker.initial}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-1.5 z-10">
                    <WorkerBadge rating={matchedWorker.rating} size="sm" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {matchedWorker.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {ratingJob?.category || matchedWorker.category} • Palakkad
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFavourite(matchedWorker.id)}
                  className="p-2 rounded-xl hover:bg-white/80 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                  title={favourites.includes(matchedWorker.id) ? "Saved in favourites" : "Add to favourites"}
                >
                  <Heart className={`w-5 h-5 ${favourites.includes(matchedWorker.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                </button>
              </div>
            )}

            <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">
              How was {matchedWorker?.name ? `${matchedWorker.name}'s` : 'the'} work?
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Tap stars to rate the completed service
            </p>

            {/* Tactile Star Rating Picker with Lucide Star */}
            <div className="flex justify-center items-center gap-2 my-2">
              {[1, 2, 3, 4, 5].map(star => {
                const isLit = star <= (hoverStars || selectedStars);
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverStars(star)}
                    onMouseLeave={() => setHoverStars(0)}
                    onClick={() => setSelectedStars(star)}
                    className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border flex items-center justify-center transition-all duration-150 cursor-pointer ${
                      isLit
                        ? 'bg-amber-50 border-amber-400 text-amber-500 scale-110 shadow-xs'
                        : 'bg-slate-50/80 border-slate-200 text-slate-300 hover:text-amber-400 hover:border-amber-300'
                    }`}
                  >
                    <Star className={`w-6 h-6 sm:w-7 sm:h-7 ${isLit ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>

            {/* Dynamic Mood Feedback Pill */}
            <div className="h-6 flex items-center justify-center mb-3">
              {(hoverStars || selectedStars) > 0 ? (
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border transition-all ${
                  (hoverStars || selectedStars) === 5 ? 'bg-emerald-50 border-emerald-300 text-[#185E3B]' :
                  (hoverStars || selectedStars) >= 4 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                  (hoverStars || selectedStars) === 3 ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  (hoverStars || selectedStars) === 2 ? 'bg-amber-50 border-amber-200 text-amber-700' :
                  'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                  {(hoverStars || selectedStars) === 5 && 'Outstanding Work! 🌟'}
                  {(hoverStars || selectedStars) === 4 && 'Very Good Service! 👍'}
                  {(hoverStars || selectedStars) === 3 && 'Good Work'}
                  {(hoverStars || selectedStars) === 2 && 'Fair • Could be better'}
                  {(hoverStars || selectedStars) === 1 && 'Needs Improvement'}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">Select a rating</span>
              )}
            </div>

            {/* Optional Feedback Text Area */}
            <div className="mb-3 text-left">
              <label htmlFor="rating-feedback" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Feedback (Optional)
              </label>
              <textarea
                id="rating-feedback"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share any comments or notes about the service..."
                rows={2}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#185E3B] focus:bg-white focus:outline-none text-xs text-slate-800 placeholder:text-slate-400 resize-none transition-all leading-relaxed"
              />
            </div>

            {/* Save to Favourites Option */}
            {matchedWorker && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleFavourite(matchedWorker.id)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    favourites.includes(matchedWorker.id)
                      ? 'bg-rose-50/70 border-rose-200 text-rose-700 shadow-2xs'
                      : 'bg-slate-50/80 border-slate-200/90 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart className={`w-3.5 h-3.5 transition-transform ${
                      favourites.includes(matchedWorker.id) ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'
                    }`} />
                    <span>
                      {favourites.includes(matchedWorker.id) ? 'Saved to Favourite Workers' : 'Save as Favourite Worker'}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    favourites.includes(matchedWorker.id) ? 'bg-rose-100 text-rose-800' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {favourites.includes(matchedWorker.id) ? 'Saved' : '+ Add'}
                  </span>
                </button>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  closeRateModal();
                  setSelectedStars(0);
                  setFeedbackText('');
                }}
                className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Skip for now
              </button>
              <button
                type="button"
                disabled={selectedStars === 0}
                onClick={() => {
                  rateJob(rateTargetJobId, selectedStars);
                  setSelectedStars(0);
                  setFeedbackText('');
                }}
                className="w-full py-3.5 rounded-xl bg-[#185E3B] hover:bg-[#144E31] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
