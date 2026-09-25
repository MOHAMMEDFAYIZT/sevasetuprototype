import React from 'react';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import { ChevronLeft, Phone, CheckCircle2, XCircle, Clock, Star, MapPin, Calendar } from 'lucide-react';

export const JobDetailView: React.FC = () => {
  const {
    jobs,
    currentJobId,
    navigateTo,
    callWorker,
    completeJob,
    openCancelModal,
    openRateModal,
    requestMoreWorkers
  } = useApp();

  const job = jobs.find(j => j.id === currentJobId);

  if (!job) {
    return (
      <div className="flex-1 px-4 py-12 text-center bg-[#f8faf9]">
        <p className="text-slate-500 mb-4 text-sm font-semibold">Job details not found.</p>
        <button
          onClick={() => navigateTo('jobs')}
          className="px-5 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-sm cursor-pointer shadow-xs"
        >
          Back to My Jobs
        </button>
      </div>
    );
  }

  const acceptedRequest = job.requests.find(r => r.status === 'accepted');
  const matchedWorker = acceptedRequest 
    ? WORKERS_DATABASE.find(w => w.id === acceptedRequest.workerId)
    : null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 px-4 py-4 pb-28 bg-[#f8faf9]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('jobs')}
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-white bg-white/80 flex items-center justify-center text-slate-700 transition-colors shadow-xs cursor-pointer"
            title="Back to My Jobs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Job #{job.id}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Created {formatDate(job.date)}
            </p>
          </div>
        </div>

        {/* Top Status Pill */}
        <div>
          {job.status === 'looking' && (
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black flex items-center gap-1.5 shadow-xs animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              Looking...
            </span>
          )}
          {job.status === 'matched' && (
            <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200 text-xs font-black flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
              Matched
            </span>
          )}
          {job.status === 'completed' && (
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-black flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
              Completed
            </span>
          )}
          {job.status === 'cancelled' && (
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black flex items-center gap-1.5 shadow-xs">
              <XCircle className="w-3.5 h-3.5" />
              Cancelled
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        
        {/* Hero Lifecycle Banner */}
        {job.status === 'looking' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-950 shadow-xs flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 animate-spin" />
            <div>
              <h3 className="text-sm font-black text-amber-950 mb-0.5">
                Waiting for worker response...
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                Your request has been broadcasted to {job.requests.length} worker{job.requests.length > 1 ? 's' : ''}. The first to accept will be matched.
              </p>
            </div>
          </div>
        )}

        {job.status === 'matched' && matchedWorker && (
          <div className="p-4 rounded-2xl bg-brand-900 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-saffron-300">
                🎉 Worker Accepted & Assigned
              </span>
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full text-white">
                Direct Contact
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-brand-900 font-black text-xl flex items-center justify-center shadow-xs">
                {matchedWorker.initial}
              </div>
              <div>
                <h3 className="text-base font-black text-white">{matchedWorker.name}</h3>
                <p className="text-xs text-slate-300 font-medium">
                  ⭐ {matchedWorker.rating} · 📍 {matchedWorker.distance} km away · {matchedWorker.wage}
                </p>
              </div>
            </div>

            <button
              onClick={() => callWorker(matchedWorker)}
              className="w-full py-3 rounded-xl bg-white text-brand-950 hover:bg-brand-50 font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Phone className="w-4 h-4 text-brand-700" />
              <span>Call {matchedWorker.name}</span>
            </button>
          </div>
        )}

        {/* Job Summary Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Category
              </span>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                {job.category}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Expected Wage
              </span>
              <div className="text-sm font-black text-brand-800">
                {job.wage}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold">{formatDate(job.date)} · {job.time}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold truncate">{job.location}</span>
            </div>
          </div>

          {job.description && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                Notes / Requirement
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {job.description}
              </p>
            </div>
          )}
        </div>

        {/* Worker Requests Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Sent Worker Requests ({job.requests.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">
              First to accept gets connected
            </span>
          </div>

          <div className="space-y-2">
            {job.requests.map((req, idx) => {
              const worker = WORKERS_DATABASE.find(w => w.id === req.workerId) || {
                name: 'Worker',
                initial: 'W',
                rating: 4.7,
                distance: 3.5,
                wage: job.wage
              };

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-brand-800 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                      {worker.initial}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-slate-900 truncate">
                        {worker.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold">
                        ⭐ {worker.rating} · 📍 {worker.distance} km
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {req.status === 'accepted' && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-900 border border-brand-300 text-[10px] font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-brand-700" />
                        Accepted
                      </span>
                    )}
                    {req.status === 'pending' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Waiting
                      </span>
                    )}
                    {req.status === 'inactive' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-semibold">
                        Inactive
                      </span>
                    )}
                    {req.status === 'cancelled' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2 pt-1">
          {job.status === 'looking' && (
            <>
              <button
                onClick={() => requestMoreWorkers(job.id)}
                className="w-full py-3.5 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-xs transition-all active:scale-[0.99] cursor-pointer"
              >
                + Request more workers
              </button>
              <button
                onClick={() => openCancelModal(job.id)}
                className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
              >
                Cancel job
              </button>
            </>
          )}

          {job.status === 'matched' && (
            <>
              <button
                onClick={() => completeJob(job.id)}
                className="w-full py-3.5 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                ✓ Mark as completed
              </button>
              <button
                onClick={() => openCancelModal(job.id)}
                className="w-full py-2.5 rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                Cancel job
              </button>
            </>
          )}

          {job.status === 'completed' && (
            <div>
              {job.rating ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center text-amber-950 font-bold text-xs shadow-xs space-y-1">
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= (job.rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <p>You rated this worker {job.rating} out of 5 stars</p>
                </div>
              ) : (
                <button
                  onClick={() => openRateModal(job.id)}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>Rate worker</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
