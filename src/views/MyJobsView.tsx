import React from 'react';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import { Clock, CheckCircle2, ChevronRight, Phone, Star, Plus } from 'lucide-react';

export const MyJobsView: React.FC = () => {
  const {
    jobs,
    activeJobsTab,
    setActiveJobsTab,
    openJobDetails,
    navigateTo,
    callWorker,
    openRateModal
  } = useApp();

  const filteredJobs = jobs.filter(j => {
    if (activeJobsTab === 'active') {
      return j.status === 'looking' || j.status === 'matched';
    }
    return j.status === 'completed' || j.status === 'cancelled' || j.status === 'unfilled';
  });

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 px-4 py-4 pb-24 bg-[#f8faf9]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Jobs
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Active requests & history
          </p>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Request</span>
        </button>
      </div>

      {/* Segmented Toggle Tabs */}
      <div className="grid grid-cols-2 bg-slate-200/70 p-1 rounded-2xl mb-4">
        <button
          onClick={() => setActiveJobsTab('active')}
          className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeJobsTab === 'active'
              ? 'bg-white text-brand-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 font-bold'
          }`}
        >
          Active Requests ({jobs.filter(j => j.status === 'looking' || j.status === 'matched').length})
        </button>
        <button
          onClick={() => setActiveJobsTab('past')}
          className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeJobsTab === 'past'
              ? 'bg-white text-brand-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 font-bold'
          }`}
        >
          Past & History
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.map(job => {
          const acceptedReq = job.requests.find(r => r.status === 'accepted');
          const matchedWorker = acceptedReq 
            ? WORKERS_DATABASE.find(w => w.id === acceptedReq.workerId)
            : null;
          const pendingCount = job.requests.filter(r => r.status === 'pending').length;

          return (
            <div
              key={job.id}
              onClick={() => openJobDetails(job.id)}
              className="bg-white border border-slate-200 hover:border-brand-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              {/* Card Top */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {job.category}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    📅 {formatDate(job.date)} · {job.time} · 📍 {job.location}
                  </div>
                </div>

                {/* Status Badge */}
                {job.status === 'looking' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    Looking...
                  </span>
                )}
                {job.status === 'matched' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200 text-[10px] font-black flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-brand-700" />
                    Matched
                  </span>
                )}
                {job.status === 'completed' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black shrink-0">
                    Completed
                  </span>
                )}
                {job.status === 'cancelled' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black shrink-0">
                    Cancelled
                  </span>
                )}
              </div>

              {/* Summary line */}
              <div className="text-xs font-semibold text-slate-700 mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                {job.status === 'looking' && (
                  <span className="text-amber-900 font-bold">
                    ⏳ Broadcasted to {pendingCount} worker{pendingCount === 1 ? '' : 's'} · Waiting
                  </span>
                )}
                {job.status === 'matched' && (
                  <span className="text-brand-900 font-bold">
                    ✓ Matched with {matchedWorker?.name || 'Worker'}
                  </span>
                )}
                {job.status === 'completed' && (
                  <span>
                    {job.rating 
                      ? `★ ${job.rating}.0 Rated for ${matchedWorker?.name || 'Worker'}` 
                      : `Work done · Tap to submit rating`}
                  </span>
                )}
                {job.status === 'cancelled' && (
                  <span className="text-rose-600">Job request was cancelled</span>
                )}
              </div>

              {/* Card Footer Actions */}
              <div 
                className="pt-2 border-t border-slate-100 flex items-center justify-between"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => openJobDetails(job.id)}
                  className="text-xs font-extrabold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {job.status === 'matched' && matchedWorker && (
                    <button
                      onClick={() => callWorker(matchedWorker)}
                      className="px-3 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {matchedWorker.name.split(' ')[0]}</span>
                    </button>
                  )}

                  {job.status === 'completed' && !job.rating && (
                    <button
                      onClick={() => openRateModal(job.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Rate</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <span className="text-3xl block mb-2">{activeJobsTab === 'active' ? '🌿' : '📂'}</span>
            <h3 className="text-sm font-extrabold text-slate-900">No {activeJobsTab} jobs</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {activeJobsTab === 'active' 
                ? 'Your active and broadcasted requests will appear here.' 
                : 'Completed and cancelled job history appears here.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
