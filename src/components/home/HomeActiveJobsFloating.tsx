import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WORKERS_DATABASE } from '../../data/mockData';
import { isJobUrgent, getUrgentJobTimeRemaining } from '../../utils/urgency';
import { CheckCircle2, Clock, Zap, RotateCcw } from 'lucide-react';

interface HomeActiveJobsFloatingProps {
  isNavVisible?: boolean;
}

export const HomeActiveJobsFloating: React.FC<HomeActiveJobsFloatingProps> = ({ isNavVisible = true }) => {
  const { jobs, retryUrgentJob } = useApp();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live timer for urgent job countdowns
  const [, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper to parse "04:00 PM" into minutes for chronological sorting
  const parseTimeToMinutes = (timeStr?: string) => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridian = match[3].toUpperCase();
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // 1. Pending requests (Urgent jobs prioritized first, then other pending jobs)
  const pendingJobs = jobs
    .filter(j => j.status === 'looking')
    .sort((a, b) => {
      const aUrgent = isJobUrgent(a) ? 1 : 0;
      const bUrgent = isJobUrgent(b) ? 1 : 0;
      if (aUrgent !== bUrgent) return bUrgent - aUrgent;
      return (b.id || 0) - (a.id || 0);
    });

  // 2. Nearest upcoming service day's matched jobs
  const todayStr = new Date().toISOString().split('T')[0];
  const matchedJobs = jobs.filter(j => j.status === 'matched');

  // Find all matched jobs for today
  const matchedToday = matchedJobs.filter(j => j.date === todayStr);

  let targetDayMatchedJobs: typeof matchedJobs = [];

  if (matchedToday.length > 0) {
    // If there are confirmed jobs scheduled for today, show all of today's jobs (chronologically)
    targetDayMatchedJobs = matchedToday.sort(
      (a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
    );
  } else if (matchedJobs.length > 0) {
    // Otherwise, find the next earliest service date among confirmed jobs
    const upcomingDates = Array.from(new Set(matchedJobs.map(j => j.date))).sort();
    const nearestDate = upcomingDates.find(d => d >= todayStr) || upcomingDates[0];
    targetDayMatchedJobs = matchedJobs
      .filter(j => j.date === nearestDate)
      .sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
  }

  // Combine: Pending first, followed by confirmed upcoming jobs, limited strictly to the first 2 jobs
  const combinedJobs = [...pendingJobs, ...targetDayMatchedJobs];
  // Deduplicate and take first 2 jobs
  const uniqueJobMap = new Map<number, typeof combinedJobs[0]>();
  combinedJobs.forEach(j => {
    if (!uniqueJobMap.has(j.id)) uniqueJobMap.set(j.id, j);
  });
  const activeJobs = Array.from(uniqueJobMap.values()).slice(0, 2);

  if (activeJobs.length === 0) return null;

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (offsetWidth * 0.9));
      setCurrentIndex(Math.min(Math.max(0, index), activeJobs.length - 1));
    }
  };

  const formatScheduleTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr && !timeStr) return 'Today';
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    let dayLabel = 'Today';
    if (dateStr === today) {
      dayLabel = 'Today';
    } else if (dateStr === tomorrow) {
      dayLabel = 'Tomorrow';
    } else if (dateStr) {
      try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          dayLabel = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        } else {
          dayLabel = dateStr;
        }
      } catch {
        dayLabel = dateStr;
      }
    }

    return timeStr ? `${dayLabel}, ${timeStr}` : dayLabel;
  };

  return (
    <div 
      className={`absolute left-0 right-0 z-30 pointer-events-none px-3.5 transition-transform duration-300 ease-out bottom-[calc(104px+env(safe-area-inset-bottom,0px))] ${
        isNavVisible ? 'translate-y-0' : 'translate-y-[80px]'
      }`}
    >
      <div className="w-full max-w-[390px] mx-auto pointer-events-auto">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={`flex gap-2.5 ${activeJobs.length > 1 ? 'overflow-x-auto snap-x snap-mandatory scrollbar-none pb-0.5' : ''}`}
        >
          {activeJobs.map((job) => {
            const acceptedReqs = job.requests.filter(r => r.status === 'accepted');
            const worker = acceptedReqs.length > 0
              ? WORKERS_DATABASE.find(w => w.id === acceptedReqs[0].workerId)
              : null;
            const isMatched = job.status === 'matched';

            // Urgent is ONLY when looking for today's work
            const isUrgentSearching = !isMatched && isJobUrgent(job);
            const urgentInfo = isUrgentSearching ? getUrgentJobTimeRemaining(job) : null;

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className={`relative w-full shrink-0 ${activeJobs.length > 1 ? 'min-w-[92%] snap-center' : ''} rounded-[20px] backdrop-blur-md p-2.5 sm:p-3 border shadow-[0_8px_24px_rgba(12,65,40,0.12)] cursor-pointer transition-all active:scale-[0.99] select-none flex flex-col gap-1 ${
                  isUrgentSearching
                    ? 'bg-[#FFFBEB]/95 border-amber-300 ring-1 ring-amber-400/30'
                    : 'bg-[#EAF6ED]/95 border-[#BDDEC4]'
                }`}
              >
                {/* Main Content Row */}
                <div className="flex items-center justify-between gap-2.5">
                  {/* Left: Animated Status Indicator */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                      isMatched 
                        ? 'bg-[#D2ECD6] text-[#0C6B44]' 
                        : isUrgentSearching
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}>
                      <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${
                        isMatched ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      {isMatched ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0C6B44] relative z-10" />
                      ) : isUrgentSearching ? (
                        <Zap className="w-4 h-4 text-amber-700 relative z-10 fill-amber-700" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#D97706] relative z-10 animate-spin" />
                      )}
                    </div>

                    {/* Clean Direct Information with System Typography */}
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-xs sm:text-[13px] font-bold text-[#16261E] truncate leading-tight flex items-center gap-1.5">
                        <span className="truncate">
                          {isMatched
                            ? (acceptedReqs.length > 1
                                ? `${acceptedReqs.length} Workers • ${job.category}`
                                : worker
                                  ? `${worker.name} • ${job.category}`
                                  : `${job.category} Confirmed`)
                            : isUrgentSearching
                              ? `Today's ${job.category}`
                              : `Finding ${job.category}...`}
                        </span>
                        {isUrgentSearching && (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-extrabold uppercase shrink-0 flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5 fill-white" />
                            <span>Urgent</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-medium truncate mt-0.5 leading-tight flex items-center gap-1.5">
                        {isMatched ? (
                          <span className="text-[#0C6B44] font-semibold">
                            Scheduled for {formatScheduleTime(job.date, job.time)}
                          </span>
                        ) : isUrgentSearching && urgentInfo ? (
                          urgentInfo.isExpired ? (
                            <span className="text-amber-800 font-bold">
                              No worker available right now
                            </span>
                          ) : (
                            <span className="text-amber-700 font-bold">
                              Finding worker nearby • {urgentInfo.formatted}
                            </span>
                          )
                        ) : (
                          <span className="text-[#B45309]">
                            Sent to {job.requests.length} worker{job.requests.length > 1 ? 's' : ''} • Waiting for reply
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center shrink-0">
                    {isUrgentSearching && urgentInfo?.isExpired ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          retryUrgentJob(job.id);
                        }}
                        className="px-2.5 py-1 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white text-[11px] font-bold shadow-2xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3 stroke-[2.2]" />
                        <span>Retry</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white text-[11px] font-bold shadow-2xs transition-all active:scale-95">
                        {isMatched ? 'View' : 'Track'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom-right dots indicating multiple cards */}
                {activeJobs.length > 1 && (
                  <div className="flex items-center justify-end gap-1 pr-1 select-none">
                    {activeJobs.map((_, i) => (
                      <span
                        key={i}
                        className={`transition-all rounded-full ${
                          i === currentIndex
                            ? 'w-2.5 h-1 bg-[#0C6B44]'
                            : 'w-1 h-1 bg-[#8FB497]'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
