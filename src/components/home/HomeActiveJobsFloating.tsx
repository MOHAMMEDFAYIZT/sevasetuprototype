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
  const { jobs, openCreateJobModalFromJob } = useApp();
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

  const todayStr = new Date().toISOString().split('T')[0];

  // Active jobs: status is 'looking' or 'matched', and scheduled date is not in the past
  const validActiveJobs = jobs.filter(j => 
    (j.status === 'looking' || j.status === 'matched') &&
    (j.date ? j.date.split('T')[0] >= todayStr : true)
  );

  // 2-DAY RULE IMPLEMENTATION:
  // - Extract all distinct dates that have active jobs on or after today
  // - If today has active jobs: target dates are [Today, next 1 upcoming date]
  // - If today has NO active jobs: target dates are [1st upcoming date, 2nd upcoming date]
  const hasJobsToday = validActiveJobs.some(j => (j.date?.split('T')[0] || todayStr) === todayStr);

  const futureDistinctDates = Array.from(
    new Set(
      validActiveJobs
        .map(j => j.date?.split('T')[0] || todayStr)
        .filter(d => d > todayStr)
    )
  ).sort();

  let targetDates: string[] = [];
  if (hasJobsToday) {
    // Today + next 1 upcoming date
    targetDates = [todayStr];
    if (futureDistinctDates.length > 0) {
      targetDates.push(futureDistinctDates[0]);
    }
  } else {
    // 2 upcoming dates
    targetDates = futureDistinctDates.slice(0, 2);
  }

  // Filter jobs belonging ONLY to the target dates
  const activeJobs = validActiveJobs
    .filter(j => {
      const jobDate = j.date?.split('T')[0] || todayStr;
      return targetDates.includes(jobDate);
    })
    .sort((a, b) => {
      const aDate = a.date?.split('T')[0] || todayStr;
      const bDate = b.date?.split('T')[0] || todayStr;
      if (aDate !== bDate) return aDate.localeCompare(bDate);

      // Within the same day: urgent looking jobs first, then by time
      const aUrgent = isJobUrgent(a) && a.status === 'looking' ? 1 : 0;
      const bUrgent = isJobUrgent(b) && b.status === 'looking' ? 1 : 0;
      if (aUrgent !== bUrgent) return bUrgent - aUrgent;

      return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
    });

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
                          openCreateJobModalFromJob(job);
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
