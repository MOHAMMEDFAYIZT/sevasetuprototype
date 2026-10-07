import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  History, 
  CheckCircle2, 
  XCircle,
  Star, 
  ArrowRight,
  RotateCcw,
  ChevronRight
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

export const PastJobsPage: React.FC = () => {
  const { jobs, openCreateJobModal, openRateModal, openJobDetails } = useApp();
  const navigate = useNavigate();

  const pastJobs = jobs.filter(j => 
    j.status === 'completed' || j.status === 'cancelled' || j.status === 'unfilled'
  );

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleViewDetails = (jobId: number) => {
    openJobDetails(jobId);
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex-1 flex flex-col px-4 sm:px-5 pt-0 pb-36 sm:pb-40 min-h-full relative">
      {/* Back button at the top (exact match to WorkersListPage) */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-all cursor-pointer border border-white shadow-[0_2px_8px_rgba(16,60,38,0.06)] active:scale-95"
        title="Go back"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Header title at mt-22 starting at the same level as the cards */}
      <div className="mt-22 mb-3 select-none">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-[#16261E] tracking-tight leading-tight">
          Past Works
        </h1>
        <p className="text-xs text-[#4F6057] font-medium mt-0.5">
          Completed, cancelled and closed service requests
        </p>
      </div>

      {/* Content */}
      {pastJobs.length === 0 ? (
        <div className="p-8 text-center glass rounded-3xl border border-white my-4 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-[#E2F3DD] text-[#0C6B44] flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <History className="w-7 h-7" />
          </div>
          <h3 className="font-display text-base font-bold text-[#16261E] mb-1">
            No past works found
          </h3>
          <p className="text-xs text-[#4F6057] mb-5 leading-relaxed max-w-xs mx-auto">
            Your completed and closed jobs will appear here so you can re-book verified workers anytime.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Book a Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {pastJobs.map(job => {
            const isCompleted = job.status === 'completed';
            const isCancelled = job.status === 'cancelled';

            return (
              <div
                key={job.id}
                className="glass rounded-2xl sm:rounded-3xl border border-white shadow-[0_4px_16px_rgba(16,60,38,0.06)] overflow-hidden transition-all duration-200"
              >
                {/* Tier 1: Service Image, Title & Status (Exact match with My Jobs layout) */}
                <div 
                  className="p-4 sm:p-5 cursor-pointer"
                  onClick={() => handleViewDetails(job.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                      {/* Service Illustration from Homepage / My Jobs */}
                      <div className="w-[72px] h-[72px] sm:w-[78px] sm:h-[78px] rounded-[20px] overflow-hidden bg-[#FEF6EE] border border-[#F3E5D8] shrink-0 shadow-2xs">
                        <img 
                          src={getServiceIllustration(job.category)} 
                          alt={job.category} 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      {/* Title & Date/Time */}
                      <div className="min-w-0 flex-1">
                        <h2 className="font-display text-[18px] sm:text-[20px] font-bold text-[#16261E] leading-tight truncate">
                          {job.category}
                        </h2>
                        <p className="text-xs sm:text-[13px] text-[#76857D] font-medium mt-1.5">
                          {formatDate(job.date)} · {job.time}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill Badge */}
                    <div className="shrink-0 mt-0.5">
                      {isCompleted && (
                        <span className="px-2.5 py-1 rounded-full bg-[#E2F3DD] text-[#0C6B44] text-[11px] font-bold border border-[#3AAA48]/30 flex items-center gap-1 shadow-2xs">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completed</span>
                        </span>
                      )}
                      {isCancelled && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200 flex items-center gap-1 shadow-2xs">
                          <XCircle className="w-3 h-3" />
                          <span>Cancelled</span>
                        </span>
                      )}
                      {!isCompleted && !isCancelled && (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                          Closed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Clean Horizontal Divider */}
                <div className="border-t border-[#EEF4ED]" />

                {/* Tier 2: Bottom Floor: View Details on LEFT, Rating & Book Again on RIGHT */}
                <div className="px-4 py-3 bg-[#F6FAF4]/70 flex items-center justify-between gap-2 select-none">
                  {/* Left: View Details Button */}
                  <button
                    type="button"
                    onClick={() => handleViewDetails(job.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0C6B44] hover:text-[#0A5A39] transition-colors py-1 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>

                  {/* Right: Rating / Rate Work + Book Again */}
                  <div className="flex items-center gap-2">
                    {job.rating ? (
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold text-amber-800">
                        <Star className="w-3.5 h-3.5 fill-[#E0A800] text-[#E0A800]" />
                        <span>{job.rating}.0</span>
                      </div>
                    ) : isCompleted ? (
                      <button
                        type="button"
                        onClick={() => openRateModal(job.id)}
                        className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs active:scale-95"
                      >
                        <Star className="w-3 h-3" />
                        <span>Rate Work</span>
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => openCreateJobModal(job.category)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-[#E2F3DD] text-[#0C6B44] border border-[#CBD8CA] text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 stroke-[2.2]" />
                      <span>Book Again</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}

          {/* Generous empty space at the bottom so last card never touches the bottom window of phone */}
          <div className="h-16 sm:h-20 w-full shrink-0" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};
