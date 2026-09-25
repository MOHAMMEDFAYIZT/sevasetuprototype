import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RURAL_LOCATIONS, WORKERS_DATABASE } from '../data/mockData';
import { MapPin, Check, X, AlertCircle } from 'lucide-react';

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
    isRateModalOpen,
    rateTargetJobId,
    closeRateModal,
    rateJob,
    jobs,
    showToast
  } = useApp();

  const [selectedStars, setSelectedStars] = useState<number>(0);

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
      {/* 1. Location Picker Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
          <div 
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up max-h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-extrabold text-slate-900">Select Your Area</h3>
              <button 
                onClick={closeLocationModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              Choose your locality for nearby worker matching.
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
              {RURAL_LOCATIONS.map(loc => {
                const isSelected = loc === user.location;
                return (
                  <button
                    key={loc}
                    onClick={() => handleSelectLocation(loc)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-bold transition-all text-left ${
                      isSelected 
                        ? 'border-brand-600 bg-brand-50 text-brand-800 shadow-sm' 
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
              className="mt-4 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
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
            
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Send Worker Requests?</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              You are sending this request to <strong className="text-brand-700 font-bold">{selectedWorkerIds.length} workers</strong>. The first worker who accepts becomes your matched worker; the other requests will become inactive.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={closeConfirmModal}
                className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={createJobFromDraft}
                className="w-full py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Send Requests
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Cancel Job Modal */}
      {isCancelModalOpen && cancelTargetJobId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl flex flex-col">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 text-center mb-2">Cancel this Job?</h3>
            <p className="text-sm text-slate-600 text-center leading-relaxed mb-6">
              You can cancel this job any time before it starts. All pending requests will be cancelled and the job will move to Past.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={closeCancelModal}
                className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
              >
                Keep Job
              </button>
              <button
                onClick={() => cancelJob(cancelTargetJobId)}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Rate Worker Modal */}
      {isRateModalOpen && rateTargetJobId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl flex flex-col text-center">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Rate Worker</h3>
            <p className="text-sm text-slate-600 mb-4">
              How was the work done by <strong className="text-slate-900">{matchedWorker?.name || 'the worker'}</strong>?
            </p>

            {/* Stars Picker */}
            <div className="flex justify-center gap-2.5 my-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setSelectedStars(star)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl transition-all ${
                    star <= selectedStars
                      ? 'bg-amber-50 border-amber-300 text-amber-500 scale-110 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-amber-400'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-400 mb-6">
              Rating is optional and permanent once submitted.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={closeRateModal}
                className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
              >
                Skip
              </button>
              <button
                disabled={selectedStars === 0}
                onClick={() => rateJob(rateTargetJobId, selectedStars)}
                className="w-full py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-md transition-all active:scale-95"
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
