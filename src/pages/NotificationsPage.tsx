import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight,
  Check
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'match' | 'request' | 'completed' | 'system';
  jobId?: number;
  read: boolean;
  actionText?: string;
}

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, showToast, openJobDetails, openRateModal } = useApp();

  const activeJobs = jobs.filter(j => j.status === 'looking' || j.status === 'matched');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  // Direct, concise, uncrowded notification items
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Worker Accepted Request',
      message: 'Murugan confirmed your Electrician job! Tap to view details and call directly.',
      time: '12m ago',
      type: 'match',
      jobId: activeJobs[0]?.id || 101,
      read: false,
      actionText: 'View Job'
    },
    {
      id: '2',
      title: 'Request Sent to Workers',
      message: 'Your plumbing request was broadcasted to 3 local verified workers.',
      time: '1h ago',
      type: 'request',
      jobId: activeJobs[0]?.id || 101,
      read: false,
      actionText: 'Track Status'
    },
    {
      id: '3',
      title: 'Work Completed',
      message: 'Carpentry repair completed successfully. Please leave your rating.',
      time: 'Yesterday',
      type: 'completed',
      jobId: completedJobs[0]?.id || 102,
      read: true,
      actionText: 'Rate Service'
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const handleActionClick = (item: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    if (item.type === 'completed' && item.jobId) {
      openRateModal(item.jobId);
      return;
    }
    if (item.jobId) {
      openJobDetails(item.jobId);
      navigate(`/jobs/${item.jobId}`);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex-1 flex flex-col px-3.5 sm:px-4 pt-3 pb-32">
      {/* Top Header mt-22 */}
      <div className="flex items-center justify-between mt-22 mb-3.5 select-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#E2F3DD] border border-[#CBD8CA] flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-colors shadow-2xs cursor-pointer active:scale-95 shrink-0"
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#16261E] tracking-tight leading-tight">
              Notifications
            </h1>
            <p className="text-xs text-[#4F6057] font-medium mt-0.5">
              Live updates on worker replies and bookings
            </p>
          </div>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-[#0C6B44] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`glass rounded-2xl sm:rounded-3xl p-4 border transition-all shadow-2xs flex flex-col gap-2.5 ${
              !item.read 
                ? 'border-[#0C6B44]/40 bg-white/90 ring-1 ring-[#0C6B44]/15' 
                : 'border-white bg-white/60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                {/* Clean Type Icon */}
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  item.type === 'match' 
                    ? 'bg-[#E2F3DD] text-[#0C6B44]' 
                    : item.type === 'completed'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-[#F6FAF4] text-[#4F6057]'
                }`}>
                  {item.type === 'match' && <CheckCircle2 className="w-4 h-4" />}
                  {item.type === 'completed' && <Sparkles className="w-4 h-4" />}
                  {item.type === 'request' && <Clock className="w-4 h-4" />}
                </div>

                {/* Title & Message */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-bold text-[#16261E]">
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#0C6B44] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#4F6057] font-normal leading-relaxed mt-0.5">
                    {item.message}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-[#76857D] font-medium shrink-0 pt-0.5">
                {item.time}
              </span>
            </div>

            {/* Quick Action Button */}
            {item.actionText && (
              <div className="flex justify-end pt-1 border-t border-[#F0F5EE]">
                <button
                  type="button"
                  onClick={() => handleActionClick(item)}
                  className="px-3.5 py-1.5 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white font-display font-bold text-xs flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  <span>{item.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
