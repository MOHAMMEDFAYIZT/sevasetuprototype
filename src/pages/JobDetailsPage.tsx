import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import { isJobUrgent, getUrgentJobTimeRemaining, isScheduledJobExpired } from '../utils/urgency';
import { 
  ChevronLeft,
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  Zap, 
  Play,
  Pause,
  Volume2,
  Star,
  ChevronRight,
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
    openCreateJobModal,
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

  // Voice note play state
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const togglePlayVoice = () => {
    if (!isPlayingVoice) {
      setIsPlayingVoice(true);
      setTimeout(() => setIsPlayingVoice(false), 5000);
    } else {
      setIsPlayingVoice(false);
    }
  };

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

  const todayStr = new Date().toISOString().split('T')[0];

  const isPastJob = job.status === 'completed' || job.status === 'cancelled' || job.status === 'unfilled' || isScheduledJobExpired(job);

  const handleBack = () => {
    if (isPastJob) {
      navigate('/past-jobs');
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex-1 flex flex-col px-4 sm:px-5 pt-0 pb-36 sm:pb-40 min-h-full relative">
      {/* Back button at the top - Navigates to Past Works for past jobs, or My Jobs for active jobs */}
      <button
        type="button"
        onClick={handleBack}
        className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-all cursor-pointer border border-white shadow-[0_2px_8px_rgba(16,60,38,0.06)] active:scale-95"
        title={isPastJob ? "Back to Past Works" : "Back to My Jobs"}
        aria-label={isPastJob ? "Back to Past Works" : "Back to My Jobs"}
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Top Centered Service Icon, Name & Live Status Badge */}
      <div className="mt-14 mb-4 flex flex-col items-center text-center select-none">
        {/* Centered Service Image */}
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-[#FEF6EE] border border-[#F3E5D8] p-2 flex items-center justify-center shadow-sm mb-2.5">
          <img 
            src={getServiceIllustration(job.category)} 
            alt={job.category} 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Centered Service Name */}
        <h1 className="font-display text-xl sm:text-2xl font-bold text-[#16261E] tracking-tight leading-tight">
          {job.category} Service
        </h1>

        {/* Real-time Status Badge Centered */}
        <div className="mt-2">
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
            <span className="px-3 py-1 rounded-full bg-[#E2F3DD] text-[#0C6B44] text-xs font-bold border border-[#3AAA48]/30 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0C6B44]" />
              <span>Worker Matched</span>
            </span>
          )}
          {isCompleted && (
            <span className="px-3 py-1 rounded-full bg-[#E2F3DD] text-[#0C6B44] text-xs font-bold border border-[#CBD8CA] flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0C6B44]" />
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

      {/* Uncluttered Job Details Card */}
      <div className="glass rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-white shadow-xs space-y-3 mb-3.5">
        <span className="text-[11px] font-bold text-[#76857D] uppercase tracking-wider block">
          Job Details
        </span>

        <div className="divide-y divide-[#E3ECE0]">
          {/* Service Date & Time */}
          <div className="py-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#4F6057] font-medium">
              <div className="w-8 h-8 rounded-full bg-[#E2F3DD] text-[#0C6B44] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] text-[#76857D] block font-medium">Service Date & Time</span>
                <span className="font-bold text-[#16261E] block text-xs mt-0.5">
                  {formatDate(job.date)} • {job.time}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F6FAF4] border border-[#CBD8CA] text-[10px] font-bold text-[#0C6B44]">
              {job.date === todayStr ? 'Today' : 'Scheduled'}
            </span>
          </div>

          {/* Service Location */}
          <div className="py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#4F6057] font-medium min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-[#E2F3DD] text-[#0C6B44] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-[#76857D] block font-medium">Service Location</span>
                <span className="font-bold text-[#16261E] block text-xs mt-0.5 truncate">
                  {job.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Requirement Text Notes */}
        {job.description && (
          <div className="p-3 rounded-2xl bg-[#F6FAF4] border border-[#E3ECE0]">
            <span className="text-[10px] text-[#76857D] block font-bold uppercase tracking-wider mb-1">
              Job Requirements
            </span>
            <p className="text-xs text-[#16261E] font-medium leading-relaxed italic">
              "{job.description}"
            </p>
          </div>
        )}

        {/* Voice Note Audio Preview (if present) */}
        {(job.hasVoiceNote || job.voiceNoteDuration) && (
          <div className="p-2.5 rounded-2xl bg-[#F6FAF4] border border-[#CBD8CA] flex items-center justify-between gap-2.5 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={togglePlayVoice}
                className="w-8 h-8 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-2xs transition-transform active:scale-95"
                title={isPlayingVoice ? 'Pause' : 'Play voice note'}
              >
                {isPlayingVoice ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#16261E] block truncate">
                  Voice Note Instruction
                </span>
                <span className="text-[10px] text-[#76857D] font-medium block">
                  Duration: {job.voiceNoteDuration || '0:12'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#0C6B44] text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E2F3DD]">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Attached</span>
            </div>
          </div>
        )}
      </div>

      {/* Requested Workers List */}
      <div className="glass rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-white shadow-xs space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#76857D] uppercase tracking-wider block">
            Requested Workers ({job.requests.length})
          </span>
        </div>

        <div className="divide-y divide-[#E3ECE0]">
          {job.requests.map((req) => {
            const worker = WORKERS_DATABASE.find(w => w.id === req.workerId);
            if (!worker) return null;

            const isWorkerMatched = req.status === 'accepted';
            const isWorkerWaiting = req.status === 'pending';
            const isWorkerRejected = req.status === 'rejected';
            const isWorkerCancelled = req.status === 'cancelled';

            const hourlyWage = worker.wage || '₹180/hr';
            const dailyWage = worker.dailyWage || '₹800/day';

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
                    {/* Replaced distance and review with Daily and Hourly Wage */}
                    <div className="flex items-center gap-1.5 text-xs text-[#0C6B44] font-semibold mt-0.5">
                      <span>{dailyWage}</span>
                      <span className="text-[#CBD8CA]">•</span>
                      <span>{hourlyWage}</span>
                    </div>
                  </div>
                </div>

                {/* Action & Status in a neat line: Call button first if matched, then status badge */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* ONLY show Phone Icon if worker is matched - placed BEFORE status */}
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

                  {/* Status Badge */}
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
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean solid card: Request Additional Worker with Plus button */}
        {!isUrgent && isActive && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                requestMoreWorkers(job.id);
                navigate(`/workers?jobId=${job.id}`);
              }}
              className="w-full p-3 rounded-2xl border border-[#E3ECE0] hover:border-[#3AAA48] bg-white hover:bg-[#F6FAF4] flex items-center gap-3 transition-all cursor-pointer group active:scale-[0.99] shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-[#E2F3DD] text-[#0C6B44] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <span className="font-display text-xs font-bold text-[#16261E] group-hover:text-[#0C6B44] transition-colors block">
                  Request Additional Worker
                </span>
              </div>
            </button>
          </div>
        )}
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

        {/* Book Again Action for Past Jobs (Completed or Cancelled) */}
        {(isCompleted || isCancelled) && (
          <button
            type="button"
            onClick={() => openCreateJobModal(job.category)}
            className="w-full h-12 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(10,90,57,0.25)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.2]" />
            <span>Book Again</span>
          </button>
        )}

        {/* Retry Urgent Request if Expired */}
        {isLooking && isUrgent && getUrgentJobTimeRemaining(job).isExpired && (
          <button
            type="button"
            onClick={() => retryUrgentJob(job.id)}
            className="w-full h-12 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(10,90,57,0.25)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.2]" />
            <span>Retry Request</span>
          </button>
        )}

        {/* Slide-to-Cancel slider for active requests (Compact ~260px) - hidden if expired */}
        {isActive && (!isUrgent || !getUrgentJobTimeRemaining(job).isExpired) && (
          <SlideToCancel onCancel={handleCancelJob} />
        )}

        {/* Generous empty space at the bottom so last element never touches the bottom window of phone */}
        <div className="h-16 sm:h-20 w-full shrink-0" aria-hidden="true" />
      </div>

    </div>
  );
};
