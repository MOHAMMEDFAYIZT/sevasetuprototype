import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import { isJobUrgent, getUrgentJobTimeRemaining } from '../utils/urgency';
import { 
  ChevronLeft,
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Star, 
  IndianRupee,
  Users,
  Clock,
  ChevronRight,
  Sparkles,
  Plus,
  Zap,
  RotateCcw
} from 'lucide-react';

// Exact service illustrations used across HomePage and MyJobs
const SERVICE_ILLUSTRATIONS: Record<string, string> = {
  'electrician': '/images/services/most-searched/electrician.png',
  'plumber': '/images/services/most-searched/plumber.png',
  'cleaning': '/images/services/most-searched/cleaning.png',
  'carpenter': '/images/services/most-searched/carpenter.png',
  'painter': '/images/service-icons/painter.png',
  'gardening': '/images/service-icons/gardening.png',
  'farm-work': '/images/service-icons/farm-work.png',
  'farm work': '/images/service-icons/farm-work.png',
  'mechanic': '/images/service-icons/mechanic.png',
  'cooking': '/images/service-icons/cooking.png',
  'transport': '/images/service-icons/transport.png',
  'animal-care': '/images/service-icons/animal-care.png',
  'animal care': '/images/service-icons/animal-care.png',
  'general-labour': '/images/service-icons/general-labour.png',
  'general labour': '/images/service-icons/general-labour.png',
  'tailor': '/images/service-icons/tailor.png',
};

const getServiceIllustration = (category: string) => {
  const slug = (category || 'Electrician').toLowerCase().replace(/\s+/g, '-');
  if (SERVICE_ILLUSTRATIONS[slug]) return SERVICE_ILLUSTRATIONS[slug];
  const simple = category.toLowerCase().trim();
  if (SERVICE_ILLUSTRATIONS[simple]) return SERVICE_ILLUSTRATIONS[simple];
  return '/images/services/most-searched/electrician.png';
};

// Compact, intuitive Slide-to-Cancel slider component
const SlideToCancel: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const maxSlide = 210; // comfortable slide distance

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const newPos = Math.max(0, Math.min(clientX - rect.left - 20, maxSlide));
    setSliderPosition(newPos);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (sliderPosition >= maxSlide * 0.8) {
      setSliderPosition(maxSlide);
      onCancel();
    } else {
      setSliderPosition(0);
    }
  };

  return (
    <div className="flex flex-col items-center pt-2 select-none">
      <div 
        ref={trackRef}
        className="w-[260px] h-11 rounded-full bg-rose-50 border border-rose-200 relative flex items-center px-1 overflow-hidden shadow-2xs"
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseMove={(e) => isDragging && handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {/* Track label */}
        <span className="w-full text-center text-[11px] font-bold text-rose-500 tracking-wide pointer-events-none pl-6">
          Slide to cancel request ❯❯
        </span>

        {/* Drag handle thumb */}
        <div 
          style={{ transform: `translateX(${sliderPosition}px)` }}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          className="absolute left-1 w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing transition-transform"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    jobs, 
    currentJobId, 
    callWorker, 
    cancelJob,
    openCompleteConfirmModal, 
    openRateModal,
    requestMoreWorkers,
    retryUrgentJob,
    showToast
  } = useApp();

  const jobId = id ? Number(id) : currentJobId;
  const job = jobs.find(j => j.id === jobId) || jobs[0];

  // Urgency check and live timer
  const isUrgent = job ? isJobUrgent(job) : false;
  const [, setTicker] = useState(0);

  useEffect(() => {
    if (!isUrgent) return;
    const interval = setInterval(() => {
      setTicker(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isUrgent]);

  if (!job) {
    return (
      <div className="w-full flex justify-center pb-28 pt-24">
        <div className="w-full max-w-[430px] p-6 text-center">
          <h2 className="text-lg font-bold text-slate-800">Job not found</h2>
          <button 
            type="button"
            onClick={() => navigate('/jobs')} 
            className="mt-4 inline-block text-[#0C6B44] font-bold text-sm underline cursor-pointer"
          >
            Go back to My Jobs
          </button>
        </div>
      </div>
    );
  }

  const isMatched = job.status === 'matched';
  const isLooking = job.status === 'looking';
  const isCompleted = job.status === 'completed';
  const isCancelled = job.status === 'cancelled';
  const isActive = isLooking || isMatched;

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

  const handleCancelJob = () => {
    cancelJob(job.id);
    showToast('Job request cancelled');
  };

  return (
    <div className="w-full max-w-xl mx-auto flex-1 flex flex-col px-3.5 sm:px-4 pt-3 pb-32">
      
      {/* Top Bar: Back Button & Status Badge (Clean, No Job ID) */}
      <div className="mt-22 flex items-center justify-between gap-3 mb-2 select-none">
        <button
          type="button"
          onClick={() => navigate('/jobs')}
          className="w-9 h-9 rounded-full bg-white hover:bg-[#E2F3DD] border border-[#CBD8CA] flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-colors shadow-2xs cursor-pointer active:scale-95"
          title="Back to My Jobs"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Real-time Status Badge */}
        <div>
          {isLooking && (
            isUrgent && getUrgentJobTimeRemaining(job).isExpired ? (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>No Worker Found</span>
              </span>
            ) : isUrgent ? (
              <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Finding Worker • {getUrgentJobTimeRemaining(job).formatted}</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Looking for Workers</span>
              </span>
            )
          )}
          {isMatched && (
            <span className="px-3 py-1 rounded-full bg-[#E2F3DD] text-[#0C6B44] text-xs font-bold border border-[#3AAA48]/30 flex items-center gap-1 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Worker Matched</span>
            </span>
          )}
          {isCompleted && (
            <span className="px-3 py-1 rounded-full bg-[#E2F3DD] text-[#0C6B44] text-xs font-bold border border-[#CBD8CA] flex items-center gap-1 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </span>
          )}
          {isCancelled && (
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 shadow-2xs">
              Cancelled
            </span>
          )}
        </div>
      </div>

      {/* Service Header: Exact Service Image & Title */}
      <div className="flex items-center gap-3.5 my-3 select-none">
        <div className="w-13 h-13 rounded-2xl bg-[#F6FAF4] border border-[#E3ECE0] p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
          <img 
            src={getServiceIllustration(job.category)} 
            alt={job.category} 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#16261E] tracking-tight leading-tight truncate">
              {job.category}
            </h1>
            {isUrgent && isLooking && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider border border-amber-300">
                ⚡ Today's Work
              </span>
            )}
          </div>

          {/* Status timer row for pending/looking jobs */}
          {isLooking && (
            isUrgent ? (
              getUrgentJobTimeRemaining(job).isExpired ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-amber-800 font-semibold">No worker available right now</span>
                  <button
                    type="button"
                    onClick={() => retryUrgentJob(job.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0C6B44] text-white text-[11px] font-bold shadow-2xs hover:bg-[#0A5A39] cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Request Again</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-amber-800 font-bold mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Looking for nearby available workers • {getUrgentJobTimeRemaining(job).formatted}</span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-1 text-xs text-amber-700 font-semibold mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Request sent • 2h 45m left</span>
              </div>
            )
          )}
          {isMatched && (
            <div className="flex items-center gap-1 text-xs text-[#0C6B44] font-semibold mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0C6B44] shrink-0" />
              <span>Confirmed for scheduled service</span>
            </div>
          )}
          {isCompleted && (
            <div className="flex items-center gap-1 text-xs text-[#76857D] font-medium mt-0.5">
              <span>Finished and verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Collected Requirement Details (Only What Was Filled During Creation) */}
      <div className="glass rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-white shadow-xs space-y-3 mb-3.5">
        <span className="text-[11px] font-bold text-[#76857D] uppercase tracking-wider block">
          Requirement Details
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Date & Time */}
          <div className="p-2.5 rounded-xl bg-[#F6FAF4] border border-[#E3ECE0] flex items-start gap-2">
            <Calendar className="w-4 h-4 text-[#0C6B44] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#76857D] block font-medium">Date & Time</span>
              <span className="font-bold text-[#16261E] block truncate mt-0.5">
                {formatDate(job.date)} · {job.time}
              </span>
            </div>
          </div>

          {/* Expected Wage */}
          <div className="p-2.5 rounded-xl bg-[#F6FAF4] border border-[#E3ECE0] flex items-start gap-2">
            <IndianRupee className="w-4 h-4 text-[#0C6B44] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#76857D] block font-medium">Expected Wage</span>
              <span className="font-bold text-[#0C6B44] font-display block truncate mt-0.5">
                {job.wage}
              </span>
            </div>
          </div>

          {/* Service Location */}
          <div className="p-2.5 rounded-xl bg-[#F6FAF4] border border-[#E3ECE0] flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#0C6B44] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#76857D] block font-medium">Location</span>
              <span className="font-bold text-[#16261E] block truncate mt-0.5">
                {job.location}
              </span>
            </div>
          </div>

          {/* Workers Needed */}
          <div className="p-2.5 rounded-xl bg-[#F6FAF4] border border-[#E3ECE0] flex items-start gap-2">
            <Users className="w-4 h-4 text-[#0C6B44] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#76857D] block font-medium">Workers Needed</span>
              <span className="font-bold text-[#16261E] block truncate mt-0.5">
                {job.requests.length || 1} Worker{job.requests.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Notes / Special Instructions if present */}
        {job.description && (
          <div className="p-2.5 rounded-xl bg-[#F6FAF4] border border-[#E3ECE0]">
            <span className="text-[10px] text-[#76857D] block font-bold uppercase tracking-wider mb-0.5">
              Notes
            </span>
            <p className="text-xs text-[#4F6057] font-normal leading-relaxed">
              "{job.description}"
            </p>
          </div>
        )}
      </div>

      {/* Requested Workers List (Consolidated at Bottom with Pure Status & Phone Icon for Matched) */}
      <div className="glass rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-white shadow-xs space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#76857D] uppercase tracking-wider block">
            Requested Workers ({job.requests.length})
          </span>

          {/* Request Additional Workers: ONLY for scheduled jobs (NOT urgent 5m jobs) */}
          {!isUrgent && isActive && (
            <button
              type="button"
              onClick={() => {
                requestMoreWorkers(job.id);
                navigate('/workers');
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-[#E2F3DD] text-[#0C6B44] border border-[#CBD8CA] text-[11px] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Request Additional Workers</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-[#E3ECE0]">
          {job.requests.map((req) => {
            const worker = WORKERS_DATABASE.find(w => w.id === req.workerId);
            if (!worker) return null;

            const isWorkerMatched = req.status === 'accepted';
            const isWorkerWaiting = req.status === 'pending';
            const isWorkerRejected = req.status === 'rejected';
            const isWorkerCancelled = req.status === 'cancelled';

            return (
              <div key={req.workerId} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                {/* Worker Avatar & Identity */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {worker.avatar ? (
                    <img 
                      src={worker.avatar} 
                      alt={worker.name} 
                      className="w-10 h-10 rounded-2xl object-cover border border-[#E3ECE0] shadow-2xs shrink-0" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0C6B44] to-[#0A5A39] text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
                      {worker.initial}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-sm font-bold text-[#16261E] truncate">
                      {worker.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-[#76857D] mt-0.5">
                      <span className="flex items-center gap-0.5 text-[#16261E] font-bold">
                        <Star className="w-3 h-3 fill-[#E0A800] text-[#E0A800] stroke-none shrink-0" />
                        <span>{worker.rating}</span>
                      </span>
                      <span>•</span>
                      <span>{worker.distance} km</span>
                    </div>
                  </div>
                </div>

                {/* Pure Status Badge & Phone Icon ONLY if matched */}
                <div className="flex items-center gap-2 shrink-0">
                  {isWorkerMatched && (
                    <span className="px-2.5 py-1 rounded-full bg-[#E2F3DD] text-[#0C6B44] text-[11px] font-bold border border-[#3AAA48]/30">
                      Matched
                    </span>
                  )}
                  {isWorkerWaiting && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                      Waiting
                    </span>
                  )}
                  {isWorkerRejected && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold border border-slate-200">
                      Rejected
                    </span>
                  )}
                  {isWorkerCancelled && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold border border-slate-200">
                      Cancelled
                    </span>
                  )}

                  {/* ONLY show Phone Icon if worker is matched */}
                  {isWorkerMatched && (
                    <button
                      type="button"
                      onClick={() => callWorker(worker)}
                      className="w-8 h-8 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer"
                      title={`Call ${worker.name}`}
                    >
                      <Phone className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Grounded Actions */}
      <div className="space-y-3">
        {/* Grounded Button: Mark as Completed (When Matched) */}
        {isMatched && (
          <button
            type="button"
            onClick={() => openCompleteConfirmModal(job.id)}
            className="w-full h-12 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(10,90,57,0.25)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
            <span>Mark as Completed</span>
          </button>
        )}

        {/* Rating Button if Completed and Not Rated */}
        {isCompleted && !job.rating && (
          <button
            type="button"
            onClick={() => openRateModal(job.id)}
            className="w-full h-12 rounded-full bg-[#E0A800] hover:bg-[#c99700] text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Star className="w-4 h-4 fill-white" />
            <span>Rate this service & workers</span>
          </button>
        )}

        {/* Completed Rating Display */}
        {isCompleted && job.rating && (
          <div className="p-3.5 rounded-2xl bg-[#FBF0CF] border border-[#faeab5] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6F4C00]" />
              <span className="font-bold text-[#6F4C00]">Your Rating:</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-3.5 h-3.5 ${star <= job.rating! ? 'fill-[#E0A800] text-[#E0A800]' : 'text-slate-300'}`} 
                  />
                ))}
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#6F4C00]">{job.rating}.0 / 5.0</span>
          </div>
        )}

        {/* Slide-to-Cancel slider for active requests (Compact ~260px) */}
        {isActive && (
          <SlideToCancel onCancel={handleCancelJob} />
        )}

        {/* Generous empty space at the bottom so last element never touches the bottom window of phone */}
        <div className="h-16 sm:h-20 w-full shrink-0" aria-hidden="true" />
      </div>

    </div>
  );
};
