import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import { 
  Phone, 
  CheckCircle2, 
  Star, 
  ChevronRight, 
  Calendar,
  Zap,
  ClipboardList
} from 'lucide-react';
import { WorkerBadge } from '../components/common/WorkerBadge';

export const MyJobsPage: React.FC = () => {
  const { 
    jobs, 
    activeJobsTab, 
    setActiveJobsTab, 
    openJobDetails,
    callWorker,
    openCompleteConfirmModal,
    openRateModal
  } = useApp();
  const navigate = useNavigate();

  // Two simple tabs: Active and Past
  const activeJobs = jobs.filter(j => j.status === 'looking' || j.status === 'matched');
  const pastJobs = jobs.filter(j => j.status === 'completed' || j.status === 'cancelled' || j.status === 'unfilled');

  const displayedJobs = activeJobsTab === 'active' ? activeJobs : pastJobs;

  const matchedJobs = activeJobs.filter(j => j.status === 'matched');
  const lookingJobs = activeJobs.filter(j => j.status === 'looking');

  const handleJobCardClick = (jobId: number) => {
    openJobDetails(jobId);
    navigate(`/jobs/${jobId}`);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const renderJobCard = (job: typeof jobs[0]) => {
    const acceptedReq = job.requests.find(r => r.status === 'accepted');
    const matchedWorker = acceptedReq 
      ? WORKERS_DATABASE.find(w => w.id === acceptedReq.workerId) 
      : null;

    const isMatched = job.status === 'matched' && matchedWorker;
    const isLooking = job.status === 'looking';
    const isCompleted = job.status === 'completed';
    const isCancelled = job.status === 'cancelled';

    return (
      <div
        key={job.id}
        onClick={() => handleJobCardClick(job.id)}
        className="rounded-[22px] bg-white border border-slate-200/90 p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(20,80,50,0.09)] transition-all cursor-pointer space-y-3 select-none"
      >
        {/* Top Row: Category, Date & Status Badge */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {job.category}
              </h2>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{formatDate(job.date)}</span>
            </div>
          </div>

          {/* Clean Status Badge */}
          {isMatched && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#144c31] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/90 shadow-2xs shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Matched</span>
            </span>
          )}
          {isLooking && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Looking</span>
            </span>
          )}
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
              <span>Completed</span>
            </span>
          )}
          {isCancelled && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 shrink-0">
              <span>Cancelled</span>
            </span>
          )}
        </div>

        {/* Brief Description if present */}
        {job.description && (
          <p className="text-xs text-slate-500 font-normal line-clamp-1">
            {job.description}
          </p>
        )}

        {/* State Specific Clean Content */}
        {isMatched && matchedWorker && (
          <div className="pt-1 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 font-medium">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-[#185E3B] text-xs">
                    {matchedWorker.avatar ? (
                      <img src={matchedWorker.avatar} alt={matchedWorker.name} className="w-8 h-8 rounded-xl object-cover" />
                    ) : (
                      matchedWorker.initial
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 z-10">
                    <WorkerBadge rating={matchedWorker.rating} size="sm" />
                  </div>
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 block leading-tight truncate">{matchedWorker.name}</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                    <span>{matchedWorker.rating}</span>
                  </div>
                </div>
              </div>
              <span className="font-bold text-[#185E3B] shrink-0">{matchedWorker.wage}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  callWorker(matchedWorker);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#185E3B] hover:bg-[#144E31] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {matchedWorker.name.split(' ')[0]}</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openCompleteConfirmModal(job.id);
                }}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {isLooking && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-xs font-medium">
              {job.requests.length === 1
                ? `Waiting for ${WORKERS_DATABASE.find(w => w.id === job.requests[0].workerId)?.name || 'worker'} to accept`
                : `Waiting for ${job.requests.length} requested workers`}
            </span>
            <span className="text-[#185E3B] font-bold text-xs flex items-center gap-0.5">
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        )}

        {isCompleted && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-xs font-medium">
              {matchedWorker ? `Carried out by ${matchedWorker.name}` : 'Finished'}
            </span>
            {job.rating ? (
              <span className="flex items-center gap-1 text-amber-700 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{job.rating} / 5</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openRateModal(job.id);
                }}
                className="text-amber-800 font-bold text-xs bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 cursor-pointer"
              >
                Rate Worker
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#F4F7F5] px-4 sm:px-5 pt-3.5 pb-32 min-h-[calc(100vh-64px)]">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-3.5 select-none">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            My Jobs
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Service requests, matched workers & history
          </p>
        </div>
      </div>

      {/* Segmented Tab Toggle: Active / Past */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-200/80 mb-4 shadow-2xs select-none">
        <button
          type="button"
          onClick={() => setActiveJobsTab('active')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeJobsTab === 'active'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Active</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeJobsTab === 'active' ? 'bg-[#185E3B] text-white' : 'bg-slate-300 text-slate-700'
          }`}>
            {activeJobs.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveJobsTab('past')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeJobsTab === 'past'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Past</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeJobsTab === 'past' ? 'bg-slate-800 text-white' : 'bg-slate-300 text-slate-700'
          }`}>
            {pastJobs.length}
          </span>
        </button>
      </div>

      {/* Jobs List */}
      {displayedJobs.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-[24px] border border-slate-200/90 shadow-2xs my-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F4F7F5] border border-slate-200/80 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            {activeJobsTab === 'active' ? (
              <Zap className="w-7 h-7 text-emerald-600" />
            ) : (
              <ClipboardList className="w-7 h-7 text-slate-500" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {activeJobsTab === 'active' ? 'No active jobs' : 'No past jobs yet'}
          </h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed max-w-xs mx-auto">
            {activeJobsTab === 'active'
              ? 'When you request a service, you can track worker responses, call them, or complete the job here.'
              : 'Your completed or cancelled job history will appear here once finished.'}
          </p>
          {activeJobsTab === 'active' && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#185E3B] hover:bg-[#144E31] text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>Find Services Near You</span>
            </Link>
          )}
        </div>
      ) : activeJobsTab === 'active' ? (
        <div className="space-y-6">
          {/* Section 1: Matched */}
          {matchedJobs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Matched
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/90">
                  {matchedJobs.length} Worker{matchedJobs.length > 1 ? 's' : ''} Confirmed
                </span>
              </div>
              <div className="space-y-3.5">
                {matchedJobs.map(renderJobCard)}
              </div>
            </div>
          )}

          {/* Section 2: Looking */}
          {lookingJobs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Looking
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/90">
                  {lookingJobs.length} Request{lookingJobs.length > 1 ? 's' : ''} Pending
                </span>
              </div>
              <div className="space-y-3.5">
                {lookingJobs.map(renderJobCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Past History: Single clean list, unsectioned */
        <div className="space-y-3.5">
          {pastJobs.map(renderJobCard)}
        </div>
      )}
    </div>
  );
};
