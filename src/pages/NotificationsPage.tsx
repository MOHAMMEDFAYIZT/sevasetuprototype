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
  const { showToast, openJobDetails, openRateModal } = useApp();

  // Direct, realistic notification items linking directly to existing jobs
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Worker Confirmed!',
      message: 'Murugan & Ramesh confirmed your Electrician job in Kalpathy. Tap to call workers or view schedule.',
      time: '12m ago',
      type: 'match',
      jobId: 101,
      read: false,
      actionText: 'View Job'
    },
    {
      id: '2',
      title: 'Searching Nearby Workers',
      message: 'Urgent plumbing request sent to 3 local verified plumbers. Awaiting response (3-min window).',
      time: '1m ago',
      type: 'request',
      jobId: 105,
      read: false,
      actionText: 'Track Status'
    },
    {
      id: '3',
      title: 'Urgent Request Expired',
      message: 'No mechanics were available nearby for your two-wheeler repair. Tap to retry with prefilled details.',
      time: '4m ago',
      type: 'request',
      jobId: 108,
      read: false,
      actionText: 'View & Retry'
    },
    {
      id: '4',
      title: 'Service Completed',
      message: 'Teak wood door lock repair marked as done by Suresh M. Please submit your rating.',
      time: 'Yesterday',
      type: 'completed',
      jobId: 106,
      read: true,
      actionText: 'Rate Service'
    },
    {
      id: '5',
      title: 'Tomorrow\'s Scheduled Work',
      message: 'Reminder: Coconut harvesting & farm irrigation helper booked for tomorrow, 8:30 AM.',
      time: '2h ago',
      type: 'system',
      jobId: 102,
      read: true,
      actionText: 'View Details'
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
    <div className="w-full max-w-xl mx-auto flex-1 flex flex-col px-4 sm:px-5 pt-0 pb-36 sm:pb-40 min-h-full relative">
      {/* Back button at the top - Navigates to Home */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-all cursor-pointer border border-white shadow-[0_2px_8px_rgba(16,60,38,0.06)] active:scale-95"
        title="Back to Home"
        aria-label="Back to Home"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Header title at mt-22 starting at the same level as the cards */}
      <div className="mt-22 mb-3 select-none flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#16261E] tracking-tight leading-tight">
            Notifications
          </h1>
          <p className="text-xs text-[#4F6057] font-medium mt-0.5">
            Live updates on worker replies and bookings
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#E2F3DD] text-[#0C6B44] border border-[#CBD8CA] text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Mark all read</span>
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

        {/* Generous empty space at the bottom so last notification never touches the bottom window of phone */}
        <div className="h-16 sm:h-20 w-full shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
};
