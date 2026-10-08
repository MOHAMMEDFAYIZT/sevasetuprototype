import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import { isJobUrgent, getUrgentJobTimeRemaining } from '../utils/urgency';
import { 
  CheckCircle2, 
  Clock,
  ChevronRight, 
  ArrowRight,
  Zap,
  RotateCcw
} from 'lucide-react';

// Exact service illustrations from HomePage & JobDetailsModal
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

const DEFAULT_AVATARS = [
  '/images/workers/rajesh.jpg',
  '/images/workers/gopalan.jpg',
  '/images/workers/parvathy.jpg'
];

export const MyJobsPage: React.FC = () => {
  const { 
    jobs, 
    openJobDetails,
    retryUrgentJob
  } = useApp();
  const navigate = useNavigate();

  // Matched is primary tab (first), Pending is secondary
  const [activeTab, setActiveTab] = useState<'matched' | 'pending'>('matched');

  // Live ticker for urgent job countdown timers
  const [, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingJobs = jobs.filter(j => j.status === 'looking');
  const matchedJobs = jobs.filter(j => j.status === 'matched');

  const displayedJobs = activeTab === 'matched' ? matchedJobs : pendingJobs;

  const handleJobCardClick = (jobId: number) => {
    openJobDetails(jobId);
    navigate(`/jobs/${jobId}`);
  };

  const formatJobDateTime = (dateStr: string, timeStr?: string) => {
    try {
      const d = new Date(dateStr);
      let datePart = dateStr;
      if (!isNaN(d.getTime())) {
        datePart = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      return timeStr ? `${datePart} · ${timeStr}` : datePart;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex-1 flex flex-col px-3.5 sm:px-4 pt-3 pb-32">
      {/* Page Header (mt-13 from top) */}
      <div className="mt-13 mb-3.5 select-none">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-[#16261E] tracking-tight leading-tight">
          My Jobs
        </h1>
        <p className="text-xs text-[#4F6057] font-medium mt-0.5">
          Track active requests and confirmed workers
        </p>
      </div>

      {/* Fully Rounded Continuous Segmented Tab: Matched first, Pending second */}
      <div className="flex w-full h-8 sm:h-8.5 p-0.5 rounded-full bg-white border border-[#CBD8CA] mb-4 select-none">
        {/* Matched Tab (First) */}
        <button
          type="button"
          onClick={() => setActiveTab('matched')}
          className={`flex-1 h-full rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'matched'
              ? 'bg-[#0C6B44] text-white font-bold shadow-2xs'
              : 'text-[#16261E] hover:text-[#0C6B44]'
          }`}
        >
          <span>Matched</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'matched'
              ? 'bg-white/20 text-white'
              : 'bg-[#E2F3DD] text-[#0C6B44]'
          }`}>
            {matchedJobs.length}
          </span>
        </button>

        {/* Pending Tab (Second) */}
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex-1 h-full rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-[#0C6B44] text-white font-bold shadow-2xs'
              : 'text-[#16261E] hover:text-[#0C6B44]'
          }`}
        >
          <span>Pending</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'pending'
              ? 'bg-white/20 text-white'
              : 'bg-[#E2F3DD] text-[#0C6B44]'
          }`}>
            {pendingJobs.length}
          </span>
        </button>
      </div>

      {/* Jobs List */}
      {displayedJobs.length === 0 ? (
        <div className="p-8 text-center glass rounded-[28px] border border-white my-2 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-[#E2F3DD] border border-[#E3ECE0] flex items-center justify-center mx-auto mb-3 shadow-2xs text-[#0C6B44]">
            {activeTab === 'matched' ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : (
              <Clock className="w-7 h-7" />
            )}
          </div>
          <h3 className="font-display text-base font-bold text-[#16261E] mb-1">
            {activeTab === 'matched' ? 'No matched workers yet' : 'No pending requests'}
          </h3>
          <p className="text-xs text-[#4F6057] mb-5 leading-relaxed max-w-xs mx-auto font-medium">
            {activeTab === 'matched'
              ? 'When workers accept and confirm your request, they will appear here.'
              : 'Requests waiting for workers will show here. You can send new requests anytime.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <span>Request a Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedJobs.map(job => {
            const acceptedReqs = job.requests.filter(r => r.status === 'accepted');
            const matchedWorkers = acceptedReqs
              .map(r => WORKERS_DATABASE.find(w => w.id === r.workerId))
              .filter((w): w is NonNullable<typeof w> => Boolean(w));
            
            const serviceImg = getServiceIllustration(job.category);
            const isMultipleWorkers = matchedWorkers.length > 1;

            // Urgent styling ONLY applies when actively searching (pending)
            const isUrgentSearching = activeTab === 'pending' && isJobUrgent(job);
            const urgentInfo = isUrgentSearching ? getUrgentJobTimeRemaining(job) : null;

            return (
              <div
                key={job.id}
                onClick={() => handleJobCardClick(job.id)}
                className={`w-full bg-white rounded-[24px] sm:rounded-[26px] p-4 sm:p-5 transition-all cursor-pointer shadow-[0_4px_16px_rgba(16,60,38,0.06)] hover:shadow-[0_8px_24px_rgba(16,60,38,0.1)] active:scale-[0.99] select-none flex flex-col group ${
                  isUrgentSearching 
                    ? 'border-2 border-amber-400 bg-gradient-to-b from-amber-50/25 to-white ring-1 ring-amber-300/30' 
                    : 'border border-[#E3ECE0]'
                }`}
              >
                {/* Urgent top banner badge if searching for today's work */}
                {isUrgentSearching && urgentInfo && (
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-amber-100">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
                      <Zap className="w-3 h-3 fill-white" />
                      <span>Today's Work</span>
                    </span>

                    {urgentInfo.isExpired ? (
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Time ended
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                        <span>Finding worker • {urgentInfo.formatted}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Tier 1: Service Image & Core Job Details */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  {/* Service Illustration from Homepage / JobDetailsModal */}
                  <div className="w-[72px] h-[72px] sm:w-[78px] sm:h-[78px] rounded-[20px] overflow-hidden bg-[#FEF6EE] border border-[#F3E5D8] shrink-0 shadow-2xs">
                    <img 
                      src={serviceImg} 
                      alt={job.category} 
                      className="w-full h-full object-cover" 
                      loading="lazy" 
                    />
                  </div>

                  {/* Core Details with full breathing space (Only Name & Date/Time) */}
                  <div className="min-w-0 flex-1">
                    {/* Service Name (Full width, bold, never truncated) */}
                    <h2 className="font-display text-[18px] sm:text-[20px] font-bold text-[#16261E] leading-tight">
                      {job.category}
                    </h2>

                    {/* Date & Time */}
                    <p className="text-xs sm:text-[13px] text-[#76857D] font-medium mt-1.5">
                      {formatJobDateTime(job.date, job.time)}
                    </p>
                  </div>
                </div>

                {/* Clean Horizontal Divider with generous vertical margins */}
                <div className="border-t border-[#EEF4ED] my-3.5 sm:my-4" />

                {/* Tier 2: Bottom Status Row */}
                {activeTab === 'matched' ? (
                  isMultipleWorkers ? (
                    /* 2+ Workers: Deeply layered avatars within slot + Text + Chevron */
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Avatar Slot: Centered 62px baseline */}
                        <div className="w-[62px] shrink-0 flex items-center justify-center">
                          <div className={`flex ${matchedWorkers.length > 3 ? '-space-x-[24px]' : matchedWorkers.length === 3 ? '-space-x-[20px]' : '-space-x-[12px]'} overflow-hidden shrink-0`}>
                            {matchedWorkers.slice(0, 3).map((w, idx) => (
                              <img
                                key={w.id}
                                src={w.avatar || DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length]}
                                alt={w.name}
                                className="inline-block w-[34px] h-[34px] rounded-full ring-2 ring-white object-cover shadow-2xs"
                              />
                            ))}
                            {matchedWorkers.length > 3 && (
                              <div className="w-[34px] h-[34px] rounded-full bg-[#EAF6ED] text-[#0C6B44] ring-2 ring-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs">
                                +{matchedWorkers.length - 3}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Text Details: Starts at the exact same column */}
                        <div className="min-w-0 flex-1">
                          <p className="font-display font-semibold text-[14px] sm:text-[15px] text-[#16261E] leading-tight truncate">
                            {matchedWorkers.length} of {Math.max(job.requests.length, matchedWorkers.length)} workers accepted
                          </p>
                          <p className="text-[12px] sm:text-[13px] text-[#76857D] font-normal leading-tight mt-1 truncate">
                            Tap to view details & contact
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-[#8BA093] group-hover:text-[#0C6B44] transition-colors shrink-0 stroke-[2.2]" />
                    </div>
                  ) : matchedWorkers.length === 1 ? (
                    /* Exactly 1 Worker: Centered 34px avatar in 62px slot + Text + Chevron */
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Avatar Slot: Centered 62px baseline */}
                        <div className="w-[62px] shrink-0 flex items-center justify-center">
                          <img
                            src={matchedWorkers[0].avatar || DEFAULT_AVATARS[0]}
                            alt={matchedWorkers[0].name}
                            className="w-[34px] h-[34px] rounded-full ring-2 ring-white object-cover shadow-2xs shrink-0"
                          />
                        </div>

                        {/* Text Details: Starts at the exact same column */}
                        <div className="min-w-0 flex-1">
                          <p className="font-display font-semibold text-[14px] sm:text-[15px] text-[#16261E] leading-tight truncate">
                            {job.requests.length > 1 
                              ? `1 of ${job.requests.length} workers accepted` 
                              : '1 of 1 worker accepted'}
                          </p>
                          <p className="text-[12px] sm:text-[13px] text-[#76857D] font-normal leading-tight mt-1 truncate">
                            Tap to view details & contact
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-[#8BA093] group-hover:text-[#0C6B44] transition-colors shrink-0 stroke-[2.2]" />
                    </div>
                  ) : (
                    /* Fallback */
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-[62px] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-display font-semibold text-[14px] sm:text-[15px] text-[#16261E]">
                          0 of {job.requests.length || 1} workers accepted
                        </p>
                        <p className="text-[12px] sm:text-[13px] text-[#76857D] mt-0.5">
                          Waiting for workers to accept
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#8BA093] group-hover:text-[#0C6B44] transition-colors shrink-0 stroke-[2.2]" />
                    </div>
                  )
                ) : (
                  /* Pending Tab: Centered Clock in 62px slot + Text + Action/Chevron */
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Icon Slot: Centered 62px baseline */}
                      <div className="w-[62px] shrink-0 flex items-center justify-center">
                        <div className={`w-[34px] h-[34px] rounded-full border flex items-center justify-center shrink-0 ${
                          isUrgentSearching && urgentInfo?.isExpired
                            ? 'bg-amber-100 border-amber-300 text-amber-800'
                            : 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]'
                        }`}>
                          {isUrgentSearching && urgentInfo?.isExpired ? (
                            <RotateCcw className="w-4 h-4 text-amber-800" />
                          ) : (
                            <Clock className="w-4 h-4 text-[#B45309]" />
                          )}
                        </div>
                      </div>

                      {/* Text Details: Starts at the exact same column */}
                      <div className="min-w-0 flex-1">
                        <p className="font-display font-semibold text-[14px] sm:text-[15px] text-[#16261E] leading-tight truncate">
                          {isUrgentSearching && urgentInfo?.isExpired 
                            ? 'No worker available right now' 
                            : `0 of ${job.requests.length || 1} workers accepted`}
                        </p>
                        <p className="text-[12px] sm:text-[13px] text-[#76857D] font-normal leading-tight mt-1 truncate">
                          {isUrgentSearching && urgentInfo?.isExpired 
                            ? 'Tap Request Again to retry' 
                            : 'Waiting for workers to accept'}
                        </p>
                      </div>
                    </div>

                    {isUrgentSearching && urgentInfo?.isExpired ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          retryUrgentJob(job.id);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <RotateCcw className="w-3 h-3 stroke-[2.2]" />
                        <span>Request Again</span>
                      </button>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#8BA093] group-hover:text-[#0C6B44] transition-colors shrink-0 stroke-[2.2]" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
