import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import { 
  ChevronLeft,
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Star, 
  IndianRupee,
  AlertCircle,
  Radio,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Plus,
  ArrowRight,
  Heart
} from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    jobs, 
    currentJobId, 
    callWorker, 
    openCancelModal, 
    openCompleteConfirmModal, 
    openRateModal,
    openCreateJobModal,
    favourites,
    toggleFavourite
  } = useApp();

  const [workersListExpanded, setWorkersListExpanded] = useState(true);

  const jobId = id ? Number(id) : currentJobId;
  const job = jobs.find(j => j.id === jobId) || jobs[0];

  if (!job) {
    return (
      <div className="w-full flex justify-center pb-28 pt-6">
        <div className="w-full max-w-[430px] p-6 text-center">
          <h2 className="text-lg font-bold text-slate-800">Job not found</h2>
          <Link to="/jobs" className="mt-4 inline-block text-[#1B5E3C] font-bold text-sm underline">
            Go back to My Jobs
          </Link>
        </div>
      </div>
    );
  }

  // Find accepted worker (if matched)
  const acceptedRequest = job.requests.find(r => r.status === 'accepted');
  const matchedWorker = acceptedRequest 
    ? WORKERS_DATABASE.find(w => w.id === acceptedRequest.workerId)
    : null;

  // Format date nicely
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Determine current lifecycle step for progress stepper (1: Broadcasted, 2: Matched, 3: Completed)
  const getStepStatus = () => {
    if (job.status === 'looking') return 1;
    if (job.status === 'matched') return 2;
    if (job.status === 'completed') return 3;
    return 0; // cancelled or unfilled
  };

  const currentStep = getStepStatus();
  const isCancelled = job.status === 'cancelled';
  const isUnfilled = job.status === 'unfilled';
  const isActive = job.status === 'looking' || job.status === 'matched';
  const isLooking = job.status === 'looking';

  return (
    <div className="w-full flex flex-col px-4 sm:px-5 pt-3 pb-24 bg-[#F4F7F5] min-h-[calc(100vh-64px)]">
      
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between gap-3 mb-3 select-none">
        <div className="flex items-center gap-2.5">
          <Link
            to="/jobs"
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-2xs border border-slate-200/80 cursor-pointer"
            title="Back to My Jobs"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#1B5E3C] uppercase tracking-wider">
                Request #{job.id.toString().slice(-4)}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[11px] font-semibold text-slate-400">
                {formatDate(job.date)}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
              {job.category}
            </h1>
          </div>
        </div>

        {/* Real-time Status Badge */}
        <div>
          {job.status === 'looking' && (
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Broadcasting
            </span>
          )}
          {job.status === 'matched' && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold flex items-center gap-1 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Worker Matched
            </span>
          )}
          {job.status === 'completed' && (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold flex items-center gap-1 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1B5E3C]" />
              Completed
            </span>
          )}
          {isCancelled && (
            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold shadow-2xs">
              Cancelled
            </span>
          )}
          {isUnfilled && (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-bold shadow-2xs">
              Unfilled
            </span>
          )}
        </div>
      </div>

      {/* Progress Map / Service Timeline (Real-app stepper) */}
      {!isCancelled && !isUnfilled && (
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs mb-3">
          <div className="relative flex items-center justify-between">
            {/* Background Connecting Line */}
            <div className="absolute left-6 right-6 top-4 h-0.5 bg-slate-100 z-0" />
            <div 
              className="absolute left-6 top-4 h-0.5 bg-[#1B5E3C] transition-all duration-500 z-0"
              style={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'
              }}
            />

            {/* Step 1: Broadcasted */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 1 
                  ? 'bg-[#1B5E3C] text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : <Radio className="w-4 h-4 animate-pulse" />}
              </div>
              <span className={`text-[10px] mt-1.5 font-bold tracking-tight ${
                currentStep === 1 ? 'text-[#1B5E3C]' : 'text-slate-600'
              }`}>
                Broadcasted
              </span>
            </div>

            {/* Step 2: Worker Matched */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 2 
                  ? 'bg-[#1B5E3C] text-white shadow-xs' 
                  : 'bg-white border-2 border-slate-200 text-slate-400'
              }`}>
                {currentStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] mt-1.5 font-bold tracking-tight ${
                currentStep === 2 ? 'text-[#1B5E3C]' : currentStep > 2 ? 'text-slate-700' : 'text-slate-400'
              }`}>
                Worker Assigned
              </span>
            </div>

            {/* Step 3: Work Completed */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep === 3 
                  ? 'bg-[#1B5E3C] text-white shadow-xs' 
                  : 'bg-white border-2 border-slate-200 text-slate-400'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className={`text-[10px] mt-1.5 font-bold tracking-tight ${
                currentStep === 3 ? 'text-[#1B5E3C]' : 'text-slate-400'
              }`}>
                Completed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Unified Service Card (Consolidated single surface instead of separate cards) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        
        {/* Section 1: Live Status Spotlight & Interaction (Matched, Completed, Cancelled, Unfilled) */}
        {!isLooking && (
          <div className="p-4 sm:p-5 border-b border-slate-100">
            {/* MATCHED STATE: Worker Spotlight & Direct Contact Button */}
            {job.status === 'matched' && matchedWorker && (
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-900 text-xl font-black shrink-0 shadow-2xs">
                  {matchedWorker.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 truncate leading-tight">
                      {matchedWorker.name}
                    </h3>
                    <span title="Verified Worker">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-0.5 text-amber-700 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {matchedWorker.rating}
                    </span>
                    <span>•</span>
                    <span>{matchedWorker.distance} km away</span>
                    <span>•</span>
                    <span className="text-[#1B5E3C] font-bold">{matchedWorker.wage}</span>
                  </div>
                </div>
              </div>

              {/* Direct Contact Button (Button instead of exposed raw number) */}
              <button
                type="button"
                onClick={() => callWorker(matchedWorker)}
                className="w-full py-3 px-4 rounded-2xl bg-[#1B5E3C] hover:bg-[#14472d] text-white font-bold text-xs flex items-center justify-between shadow-xs transition-transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold leading-tight">Direct Contact</span>
                    <span className="text-[11px] text-emerald-100 font-medium block">Tap to call {matchedWorker.name}</span>
                  </div>
                </div>
                <span className="text-xs font-bold bg-white text-[#1B5E3C] px-3 py-1.5 rounded-xl shadow-2xs">
                  Call Now
                </span>
              </button>
            </div>
          )}

          {/* COMPLETED STATE: Summary & Ratings */}
          {job.status === 'completed' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#1B5E3C] shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Service completed successfully
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {matchedWorker ? `Carried out by ${matchedWorker.name}.` : 'Service marked finished.'}
                  </p>
                </div>
              </div>

              {job.rating ? (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-amber-950">Your rating:</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3.5 h-3.5 ${star <= job.rating! ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-800">{job.rating}.0 / 5.0</span>
                </div>
              ) : (
                <button
                  onClick={() => openRateModal(job.id)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>Rate this service & worker</span>
                </button>
              )}

              {/* Add / Toggle Favourite for Completed Worker */}
              {matchedWorker && (
                <button
                  type="button"
                  onClick={() => toggleFavourite(matchedWorker.id)}
                  className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    favourites.includes(matchedWorker.id)
                      ? 'bg-rose-50/80 border-rose-200 text-rose-700 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart className={`w-4 h-4 transition-transform ${
                      favourites.includes(matchedWorker.id) ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'
                    }`} />
                    <span>
                      {favourites.includes(matchedWorker.id) 
                        ? `Saved ${matchedWorker.name} in Favourites` 
                        : `Save ${matchedWorker.name} to Favourites`
                      }
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    favourites.includes(matchedWorker.id) ? 'bg-rose-100 text-rose-800' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {favourites.includes(matchedWorker.id) ? 'Saved' : '+ Add'}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* CANCELLED STATE: Context & Real Reschedule Option */}
          {isCancelled && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Request was cancelled
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    This request was closed. You can re-book the service with a fresh date and budget anytime.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openCreateJobModal(job.category)}
                className="w-full py-2.5 rounded-xl bg-[#1B5E3C] hover:bg-[#14472d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 cursor-pointer"
              >
                <span>Reschedule / Book Again</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* UNFILLED STATE: Timeout & Re-broadcast */}
          {isUnfilled && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    No worker accepted in time
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Local workers were either occupied or unavailable for this scheduled slot. You can reschedule for another day or adjust expected wages.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openCreateJobModal(job.category)}
                className="w-full py-2.5 rounded-xl bg-[#1B5E3C] hover:bg-[#14472d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 cursor-pointer"
              >
                <span>Try Rescheduling Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          </div>
        )}

        {/* Section 2: Job Specification Details */}
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Job Details & Requirement
          </span>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-medium">Date & Time</span>
                <span className="font-bold text-slate-900 truncate block">{formatDate(job.date)} · {job.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <IndianRupee className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-medium">Expected Wage</span>
                <span className="font-bold text-[#1B5E3C] truncate block">{job.wage}</span>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-2 text-slate-700 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 block font-medium">Service Location</span>
                <span className="font-bold text-slate-900 truncate block">{job.location}</span>
              </div>
            </div>
          </div>

          {job.description && (
            <div className="pt-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Notes / Special Instructions
              </span>
              <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700 font-medium leading-relaxed italic">
                "{job.description}"
              </p>
            </div>
          )}
        </div>

        {/* Section 3: Broadcasted Workers Activity (Collapsible) */}
        <div className="p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setWorkersListExpanded(!workersListExpanded)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Requested Workers ({job.requests.length})
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                • {job.requests.filter(r => r.status === 'accepted').length > 0 ? '1 accepted' : 'Waiting for reply'}
              </span>
            </div>
            {workersListExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {workersListExpanded && (
            <div className="mt-3 divide-y divide-slate-100">
              {job.requests.map((req) => {
                const worker = WORKERS_DATABASE.find(w => w.id === req.workerId);
                if (!worker) return null;

                return (
                  <div key={req.workerId} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                        {worker.initial}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{worker.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                          <span>{worker.rating} · {worker.wage}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Waiting
                        </span>
                      )}
                      {req.status === 'accepted' && (
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Accepted
                        </span>
                      )}
                      {req.status === 'inactive' && (
                        <span className="inline-flex items-center text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Paused
                        </span>
                      )}
                      {req.status === 'cancelled' && (
                        <span className="inline-flex items-center text-[10px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          Cancelled
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="inline-flex items-center text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Request More Workers button directly below the requested workers list (Only for looking jobs) */}
              {isLooking && (
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/workers?jobId=${job.id}`)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200 text-[#185E3B] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Request More Workers</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Customer Actions */}
      <div className="space-y-3 mt-4">
        {job.status === 'matched' && (
          <button
            onClick={() => openCompleteConfirmModal(job.id)}
            className="w-full py-3.5 rounded-2xl bg-[#1B5E3C] hover:bg-[#14472d] text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
          >
            Mark service as completed
          </button>
        )}

        {isActive && (
          <div className="pt-2 pb-6 flex justify-center">
            <button
              type="button"
              onClick={() => openCancelModal(job.id)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-rose-50/60 border border-slate-200 hover:border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Cancel this request</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
