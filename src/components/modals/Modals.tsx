import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WORKERS_DATABASE } from '../../data/mockData';
import { Check, X, AlertCircle, Star, Heart } from 'lucide-react';
import { JobDetailsModal } from './JobDetailsModal';
import { WorkerProfileModal } from './WorkerProfileModal';
import { RequestConfirmedModal } from './RequestConfirmedModal';

export const Modals: React.FC = () => {
  const {
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
    openKeyboard
  } = useApp();

  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');

  // 2. Rating Modal worker info
  const ratingJob = jobs.find(j => j.id === rateTargetJobId);
  const acceptedReqs = ratingJob?.requests.filter(r => r.status === 'accepted') || [];
  const matchedWorkers = acceptedReqs
    .map(r => WORKERS_DATABASE.find(w => w.id === r.workerId))
    .filter((w): w is NonNullable<typeof w> => Boolean(w));
  const matchedWorker = matchedWorkers[0] || null;

  return (
    <>
      {/* 0. Job Details Requirement Modal (Bottom Sheet) */}
      <JobDetailsModal />

      {/* 0.1 Worker Profile Product-style Modal (Image 1) */}
      <WorkerProfileModal />

      {/* 0.2 Request Confirmed Celebration Modal (Image 2) */}
      <RequestConfirmedModal />

      {/* 2. Confirm Multi-Request Modal */}
      {isConfirmModalOpen && (
        <div 
          className="absolute inset-0 z-50 flex items-end justify-center bg-[rgba(15,40,28,0.4)] backdrop-blur-[4px] p-0 animate-fade-in"
          onClick={closeConfirmModal}
        >
          <div 
            className="w-full bg-white rounded-t-[32px] sm:rounded-t-[36px] p-5 sm:p-6 shadow-[0_-12px_40px_rgba(10,50,30,0.25)] border-t border-[#E3ECE0] animate-slide-up flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-11 h-1.5 bg-[#CBD8CA] rounded-full mx-auto mb-4" />
            
            <h3 className="font-display text-xl font-semibold text-[#16261E] mb-2">
              Send Job Request to {selectedWorkerIds.length} Worker{selectedWorkerIds.length > 1 ? 's' : ''}?
            </h3>
            <p className="text-sm text-[#4F6057] leading-relaxed mb-6 font-normal">
              You are requesting <strong className="text-[#0A5A39] font-bold">{selectedWorkerIds.length} worker{selectedWorkerIds.length > 1 ? 's' : ''}</strong> for this job. Each worker who accepts will be hired and given work.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="w-full py-3.5 rounded-full bg-white hover:bg-[#F6FAF4] text-[#16261E] border border-[#E3ECE0] font-semibold text-sm transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={createJobFromDraft}
                className="w-full py-3.5 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white font-semibold text-sm shadow-[0_10px_20px_rgba(10,90,57,0.2)] transition-all active:scale-95 cursor-pointer"
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
          className="absolute inset-0 z-50 flex items-end justify-center bg-[rgba(15,40,28,0.4)] backdrop-blur-[4px] p-0 animate-fade-in"
          onClick={closeCancelModal}
        >
          <div 
            className="w-full bg-white rounded-t-[32px] sm:rounded-t-[36px] p-5 sm:p-6 shadow-[0_-12px_40px_rgba(10,50,30,0.25)] border-t border-[#E3ECE0] animate-slide-up flex flex-col text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-11 h-1.5 bg-[#CBD8CA] rounded-full mx-auto mb-4" />
            
            <div className="w-12 h-12 rounded-full bg-[#FCE4E1] text-[#D3362B] border border-[#F1B5AE] flex items-center justify-center mb-3 mx-auto shadow-2xs">
              <AlertCircle className="w-6 h-6 stroke-[2.2]" />
            </div>

            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#16261E] mb-1.5">Cancel this job request?</h3>
            <p className="text-xs sm:text-sm text-[#4F6057] leading-relaxed mb-6 font-normal px-2">
              Any pending worker requests will be withdrawn and this job will move to your Past History. You can request again anytime.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeCancelModal}
                className="w-full py-3.5 rounded-full bg-white hover:bg-[#F6FAF4] text-[#16261E] border border-[#E3ECE0] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Keep Job
              </button>
              <button
                type="button"
                onClick={() => cancelJob(cancelTargetJobId)}
                className="w-full py-3.5 rounded-full bg-[#D3362B] hover:bg-[#B3271D] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
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
          className="absolute inset-0 z-50 flex items-end justify-center bg-[rgba(15,40,28,0.4)] backdrop-blur-[4px] p-0 animate-fade-in"
          onClick={closeCompleteConfirmModal}
        >
          <div 
            className="w-full bg-white rounded-t-[32px] sm:rounded-t-[36px] p-5 sm:p-6 shadow-[0_-12px_40px_rgba(10,50,30,0.25)] border-t border-[#E3ECE0] animate-slide-up flex flex-col text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-11 h-1.5 bg-[#CBD8CA] rounded-full mx-auto mb-4" />
            
            <div className="w-12 h-12 rounded-full bg-[#E2F3DD] text-[#0A5A39] border border-[#E3ECE0] flex items-center justify-center mb-3 mx-auto shadow-2xs">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#16261E] mb-1.5">Mark this job as completed?</h3>
            <p className="text-xs sm:text-sm text-[#4F6057] leading-relaxed mb-6 font-normal px-2">
              Confirm that the service has been finished. You will be able to review and rate the worker right after.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeCompleteConfirmModal}
                className="w-full py-3.5 rounded-full bg-white hover:bg-[#F6FAF4] text-[#16261E] border border-[#E3ECE0] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
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
                className="w-full py-3.5 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white font-semibold text-xs sm:text-sm shadow-[0_10px_20px_rgba(10,90,57,0.2)] transition-all active:scale-95 cursor-pointer"
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
          className="absolute inset-0 z-50 flex items-end justify-center bg-[rgba(15,40,28,0.4)] backdrop-blur-[4px] p-0 animate-fade-in"
          onClick={closeRateModal}
        >
          <div 
            className="w-full bg-white rounded-t-[32px] sm:rounded-t-[36px] p-5 sm:p-6 shadow-[0_-12px_40px_rgba(10,50,30,0.25)] border-t border-[#E3ECE0] animate-slide-up flex flex-col text-center max-h-[85%] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-11 h-1.5 bg-[#CBD8CA] rounded-full mx-auto mb-3" />
            
            {/* Header with dismiss X */}
            <div className="flex items-center justify-between mb-2">
              <span className="tag green text-[11px]">
                Service Completed ✨
              </span>
              <button
                type="button"
                onClick={closeRateModal}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#F6FAF4] border border-[#E3ECE0] flex items-center justify-center text-[#76857D] hover:text-[#16261E] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Worker Spotlight Card(s) */}
            {matchedWorkers.length > 0 && (
              <div className="space-y-2 my-2 max-h-48 overflow-y-auto pr-1">
                {matchedWorkers.map(worker => (
                  <div key={worker.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F6FAF4] border border-[#E3ECE0] text-left">
                    <div className="relative shrink-0">
                      {worker.avatar ? (
                        <img 
                          src={worker.avatar} 
                          alt={worker.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-[#E3ECE0] shadow-2xs" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0C6B44] to-[#0A5A39] text-white font-display font-bold flex items-center justify-center text-sm">
                          {worker.initial}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-2xs" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-xs font-semibold text-[#16261E] truncate">
                        {worker.name}
                      </h4>
                      <p className="text-[11px] text-[#4F6057] font-medium truncate">
                        {ratingJob?.category || worker.category} • {worker.wage}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavourite(worker.id)}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                      title={favourites.includes(worker.id) ? "Saved in favourites" : "Add to favourites"}
                    >
                      <Heart className={`w-4 h-4 ${favourites.includes(worker.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <h3 className="font-display text-lg font-semibold text-[#16261E] mt-2 mb-1">
              {matchedWorkers.length > 1
                ? `How was the work by your team of ${matchedWorkers.length} workers?`
                : `How was ${matchedWorker?.name ? `${matchedWorker.name}'s` : 'the'} work?`
              }
            </h3>
            <p className="text-xs text-[#4F6057] mb-3 font-normal">
              Tap stars to rate the completed service
            </p>

            {/* Tactile Star Rating Picker */}
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
                        ? 'bg-[#FBF0CF] border-[#F0D070] text-[#D97706] scale-110 shadow-2xs'
                        : 'bg-white border-[#E3ECE0] text-[#CBD8CA] hover:text-[#D97706] hover:border-[#F0D070]'
                    }`}
                  >
                    <Star className={`w-6 h-6 sm:w-7 sm:h-7 ${isLit ? 'fill-[#D97706] text-[#D97706]' : 'text-[#CBD8CA]'}`} />
                  </button>
                );
              })}
            </div>

            {/* Dynamic Mood Feedback Pill */}
            <div className="h-6 flex items-center justify-center mb-3">
              {(hoverStars || selectedStars) > 0 ? (
                <span className={`tag ${
                  (hoverStars || selectedStars) >= 4 ? 'green' :
                  (hoverStars || selectedStars) >= 2 ? 'amber' :
                  'red'
                }`}>
                  {(hoverStars || selectedStars) === 5 && 'Outstanding Work! 🌟'}
                  {(hoverStars || selectedStars) === 4 && 'Very Good Service! 👍'}
                  {(hoverStars || selectedStars) === 3 && 'Good Work'}
                  {(hoverStars || selectedStars) === 2 && 'Fair • Could be better'}
                  {(hoverStars || selectedStars) === 1 && 'Needs Improvement'}
                </span>
              ) : (
                <span className="text-[11px] text-[#76857D] font-medium">Select a rating</span>
              )}
            </div>

            {/* Optional Feedback Text Area */}
            <div className="mb-3 text-left">
              <label htmlFor="rating-feedback" className="text-[11px] font-bold text-[#16261E] uppercase tracking-wider block mb-1.5">
                Feedback (Optional)
              </label>
              <textarea
                id="rating-feedback"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                onFocus={openKeyboard}
                placeholder="Share any comments or notes about the service..."
                rows={2}
                className="w-full p-3 rounded-2xl bg-white border border-[#E3ECE0] focus:border-[#3AAA48] focus:ring-2 focus:ring-[#3AAA48]/20 focus:outline-none text-xs text-[#16261E] placeholder:text-[#76857D] resize-none transition-all leading-relaxed"
              />
            </div>

            {/* Save to Favourites Option */}
            {matchedWorker && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleFavourite(matchedWorker.id)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    favourites.includes(matchedWorker.id)
                      ? 'bg-[#FCE4E1] border-[#F1B5AE] text-[#A42319] shadow-2xs'
                      : 'bg-white border-[#E3ECE0] text-[#4F6057] hover:bg-[#F6FAF4]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart className={`w-3.5 h-3.5 transition-transform ${
                      favourites.includes(matchedWorker.id) ? 'fill-[#D3362B] text-[#D3362B] scale-110' : 'text-[#76857D]'
                    }`} />
                    <span>
                      {favourites.includes(matchedWorker.id) ? 'Saved in Favourite Workers' : 'Save as Favourite Worker'}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    favourites.includes(matchedWorker.id) ? 'bg-[#FCE4E1] text-[#A42319]' : 'bg-[#EEF2EC] text-[#4F6057]'
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
                className="w-full py-3.5 rounded-full bg-white hover:bg-[#F6FAF4] text-[#16261E] border border-[#E3ECE0] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
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
                className="w-full py-3.5 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] disabled:bg-[#E3ECE0] disabled:text-[#76857D] text-white font-semibold text-xs sm:text-sm shadow-[0_10px_20px_rgba(10,90,57,0.2)] transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
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
