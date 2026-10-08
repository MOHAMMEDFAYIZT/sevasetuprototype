import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WORKERS_DATABASE } from '../../data/mockData';
import { 
  X, 
  Calendar, 
  Clock,
  Mic, 
  Square, 
  Play, 
  Pause, 
  Edit3,
  UserCheck,
  MapPin,
  Users,
  Minus,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

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

export const JobDetailsModal: React.FC = () => {
  const {
    isCreateJobModalOpen,
    closeCreateJobModal,
    selectedCategory,
    draftJob,
    updateDraftJob,
    selectedWorkerIds,
    setSelectedWorkerIds,
    createJobForWorker,
    retryingJobId,
    user,
    isKeyboardOpen,
    openKeyboard,
    showToast
  } = useApp();

  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  // Auto scroll textarea into visible center when keyboard activates
  useEffect(() => {
    if (isKeyboardOpen) {
      setTimeout(() => {
        textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [isKeyboardOpen]);

  const targetWorker = selectedWorkerIds.length === 1
    ? WORKERS_DATABASE.find(w => w.id === selectedWorkerIds[0])
    : null;

  const handleClose = () => {
    setSelectedWorkerIds([]);
    closeCreateJobModal();
  };

  // 30-minute interval slots from 08:00 AM to 07:30 PM
  const TIME_SLOTS = [
    '08:00 AM', '08:30 AM',
    '09:00 AM', '09:30 AM',
    '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM'
  ];

  // Calendar month state for standard month calendar view
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const initialDate = draftJob.date ? new Date(draftJob.date) : new Date();
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });

  const nextMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCalendarMonth(prev => {
      const today = new Date();
      const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      if (newMonth < currentMonthStart) return prev;
      return newMonth;
    });
  };

  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    // Empty blank slots before 1st of the month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, dateStr: '', isPast: true, isToday: false });
    }

    // Days of the month
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      dateObj.setHours(0, 0, 0, 0);
      const dateStr = dateObj.toISOString().split('T')[0];
      const isPast = dateObj < today;
      const isToday = dateObj.getTime() === today.getTime();

      days.push({
        day: d,
        dateStr,
        isPast,
        isToday
      });
    }

    return days;
  };

  const workersNeeded = draftJob.workersNeeded || 1;
  const handleUpdateWorkers = (count: number) => {
    updateDraftJob({ workersNeeded: Math.max(1, Math.min(10, count)) });
  };

  // Voice recording simulation states
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [hasRecordedVoice, setHasRecordedVoice] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState('0:00');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isCreateJobModalOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  // Voice recording handlers
  const startRecording = () => {
    setIsRecording(true);
    setRecordSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordSeconds(prev => {
        if (prev >= 60) {
          stopRecording();
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    const secs = recordSeconds || 6;
    const durStr = `0:${secs < 10 ? '0' : ''}${secs}`;
    setVoiceDuration(durStr);
    setHasRecordedVoice(true);
    updateDraftJob({
      hasVoiceNote: true,
      voiceNoteDuration: durStr
    });
    showToast('Voice note attached!');
  };

  const deleteVoiceNote = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setHasRecordedVoice(false);
    setIsPlayingVoice(false);
    setRecordSeconds(0);
    updateDraftJob({
      hasVoiceNote: false,
      voiceNoteDuration: undefined
    });
    showToast('Voice note removed');
  };

  const togglePlayVoice = () => {
    if (!isPlayingVoice) {
      setIsPlayingVoice(true);
      setTimeout(() => {
        setIsPlayingVoice(false);
      }, (recordSeconds || 6) * 1000);
    } else {
      setIsPlayingVoice(false);
    }
  };

  const currentAddress = draftJob.location || user.location || 'Palakkad Town';

  const handleFindWorkers = () => {
    const finalDate = draftJob.date || todayStr;
    const finalLocation = currentAddress;

    if (targetWorker) {
      const newJobId = createJobForWorker(targetWorker.id, {
        category: selectedCategory || draftJob.category || targetWorker.category,
        date: finalDate,
        time: draftJob.time || '10:00 AM',
        location: finalLocation,
        description: draftJob.description?.trim() || `Direct request for ${targetWorker.name}`
      });
      handleClose();
      if (newJobId) {
        navigate(`/jobs/${newJobId}`);
      }
      return;
    }

    if (!draftJob.date) {
      updateDraftJob({ date: todayStr });
    }
    if (!draftJob.location) {
      updateDraftJob({
        location: finalLocation
      });
    }
    closeCreateJobModal();
    navigate('/workers');
  };

  const categoryKey = (selectedCategory || 'Electrician').toLowerCase().replace(/\s+/g, '-');
  const serviceImg = SERVICE_ILLUSTRATIONS[categoryKey] || SERVICE_ILLUSTRATIONS['electrician'];

  // Format today as '05 Oct 2026' or formatted date
  const formatDateDisplay = (dateString?: string) => {
    try {
      const d = dateString ? new Date(dateString) : new Date();
      if (isNaN(d.getTime())) return dateString || 'Today';
      const day = String(d.getDate()).padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return dateString || 'Today';
    }
  };

  return (
    <div 
      className={`absolute inset-0 z-50 flex items-end justify-center bg-[rgba(10,35,22,0.45)] backdrop-blur-[4px] animate-fade-in transition-all duration-200 ${
        isKeyboardOpen ? 'pb-[225px]' : 'pb-0'
      }`}
      onClick={handleClose}
    >
      {/* Native Bottom Sheet touching phone sides as normal mobile modals */}
      <div 
        ref={sheetContentRef}
        className="w-full bg-white rounded-t-[32px] sm:rounded-t-[36px] p-4 sm:p-5 shadow-[0_-12px_40px_rgba(10,50,30,0.25)] border-t border-[#E3ECE0] animate-slide-up flex flex-col max-h-[92%] overflow-y-auto scrollbar-none transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle pill */}
        <div className="w-12 h-1 bg-[#CBD8CA] rounded-full mx-auto mb-3 shrink-0" />

        {/* Top Header - Compact style matching image */}
        <div className="flex items-start justify-between gap-3 mb-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-[58px] h-[58px] sm:w-[64px] sm:h-[64px] rounded-[18px] overflow-hidden bg-[#FEF6EE] border border-[#F3E5D8] shrink-0 p-1 shadow-2xs flex items-center justify-center">
              <img 
                src={serviceImg} 
                alt={selectedCategory} 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-xl sm:text-[22px] font-bold text-[#16261E] tracking-tight leading-tight truncate">
                {selectedCategory || 'Painter'}
              </h2>
              <p className="text-xs text-[#76857D] font-normal leading-snug mt-0.5">
                Job details
              </p>
              {retryingJobId && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full mt-1 border border-amber-200">
                  <Zap className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                  <span>Retry Request #{retryingJobId}</span>
                </span>
              )}
              {targetWorker && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0C6B44] bg-[#E2F3DD] px-2 py-0.5 rounded-full mt-1 border border-[#3AAA48]/30">
                  <UserCheck className="w-2.5 h-2.5 text-[#0C6B44]" />
                  <span>{targetWorker.name}</span>
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#F6FAF4] flex items-center justify-center text-[#76857D] hover:text-[#16261E] transition-colors border border-[#E3ECE0] cursor-pointer shrink-0 shadow-2xs"
            title="Close"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Form Cards with spacious layout */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
          {/* 1. Service Location Card */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#F6FAF4] border border-[#E3ECE0] flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-white border border-[#CBD8CA] text-[#0C6B44] flex items-center justify-center shrink-0 shadow-2xs">
                <MapPin className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-[#76857D] font-bold uppercase tracking-wider block">
                  Service Location
                </span>
                <span className="font-semibold text-xs sm:text-[13px] text-[#16261E] truncate block mt-0.5">
                  {currentAddress}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                navigate('/addresses');
              }}
              className="text-[11px] font-bold text-[#0C6B44] bg-white hover:bg-[#E2F3DD] px-3 py-1 rounded-full border border-[#CBD8CA] cursor-pointer shrink-0 transition-colors shadow-2xs"
            >
              Change
            </button>
          </div>

          {/* 2. Schedule Grid: Date & Time in 2 clean cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Service Date Card */}
            <div 
              onClick={() => setIsDatePickerOpen(true)}
              className="p-3 rounded-2xl bg-white border border-[#E3ECE0] hover:border-[#3AAA48] transition-all shadow-2xs cursor-pointer select-none group"
            >
              <span className="text-[10px] text-[#76857D] font-bold uppercase tracking-wider block mb-1.5">
                Service Date
              </span>
              <div className="flex items-center justify-between gap-1.5">
                <span className="font-display text-xs sm:text-sm font-bold text-[#16261E] truncate group-hover:text-[#0C6B44] transition-colors">
                  {formatDateDisplay(draftJob.date || todayStr)}
                </span>
                <div className="w-6 h-6 rounded-full bg-[#E2F3DD] text-[#0C6B44] flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
              </div>
            </div>

            {/* Start Time Card */}
            <div 
              onClick={() => setIsTimePickerOpen(true)}
              className="p-3 rounded-2xl bg-white border border-[#E3ECE0] hover:border-[#3AAA48] transition-all shadow-2xs cursor-pointer select-none group"
            >
              <span className="text-[10px] text-[#76857D] font-bold uppercase tracking-wider block mb-1.5">
                Start Time
              </span>
              <div className="flex items-center justify-between gap-1.5">
                <span className="font-display text-xs sm:text-sm font-bold text-[#16261E] truncate group-hover:text-[#0C6B44] transition-colors">
                  {draftJob.time || '10:00 AM'}
                </span>
                <div className="w-6 h-6 rounded-full bg-[#E2F3DD] text-[#0C6B44] flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Workers Needed Stepper Card */}
          {!targetWorker && (
            <div className="p-3 sm:p-3.5 rounded-2xl bg-[#F6FAF4] border border-[#E3ECE0] flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-white border border-[#CBD8CA] text-[#0C6B44] flex items-center justify-center shrink-0 shadow-2xs">
                  <Users className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs sm:text-[13px] text-[#16261E] block truncate">
                    Workers Needed
                  </span>
                  <span className="text-[11px] text-[#76857D] block truncate mt-0.5">
                    Select number of helpers
                  </span>
                </div>
              </div>

              {/* Connected Stepper Pill */}
              <div className="flex items-center bg-white border border-[#CBD8CA] rounded-full p-1 shadow-2xs shrink-0">
                <button
                  type="button"
                  disabled={workersNeeded <= 1}
                  onClick={() => handleUpdateWorkers(workersNeeded - 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#16261E] hover:bg-[#E2F3DD] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Decrease workers"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-display text-xs sm:text-sm font-bold text-[#16261E]">
                  {workersNeeded}
                </span>
                <button
                  type="button"
                  disabled={workersNeeded >= 10}
                  onClick={() => handleUpdateWorkers(workersNeeded + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#16261E] hover:bg-[#E2F3DD] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Increase workers"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 4. Job Details (Optional Textarea + Voice Note) */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#E3ECE0] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#16261E] flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-[#0C6B44] stroke-[2.2]" />
                <span>Job Details</span>
                <span className="text-[11px] font-normal text-[#76857D]">(optional)</span>
              </label>
              <span className="text-[10px] text-[#76857D]">Type or voice record</span>
            </div>

            {/* Textarea Container with inside Mic button */}
            <div className="relative rounded-xl border border-[#E3ECE0] bg-[#F8FCF9] focus-within:bg-white focus-within:border-[#3AAA48] focus-within:ring-2 focus-within:ring-[#3AAA48]/20 transition-all p-2.5">
              <textarea
                ref={textareaRef}
                rows={3}
                value={draftJob.description}
                onChange={(e) => updateDraftJob({ description: e.target.value })}
                onClick={() => {
                  (window as unknown as { __sevaActiveInput?: HTMLElement | null }).__sevaActiveInput = textareaRef.current;
                  openKeyboard();
                  setTimeout(() => {
                    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 120);
                }}
                placeholder="Describe your work requirement, parts to repair, or instructions..."
                className="w-full pr-8 text-xs text-[#16261E] bg-transparent outline-none placeholder:text-[#94A3B8] resize-none leading-relaxed"
              />

              {/* Inside Mic Button on the right - Only shown when NOT attached with a voice note */}
              {!hasRecordedVoice && (
                <div className="absolute right-2.5 bottom-2.5">
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="h-7 px-2 rounded-full bg-[#D3362B] text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer animate-pulse"
                      title="Stop recording"
                    >
                      <Square className="w-2.5 h-2.5 fill-current" />
                      <span>0:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer bg-white hover:bg-[#E2F3DD] text-[#76857D] hover:text-[#0C6B44] border border-[#E3ECE0]"
                      title="Record voice note"
                    >
                      <Mic className="w-3.5 h-3.5 stroke-[2]" />
                    </button>
                  )}
                </div>
              )}

              {/* Attached Voice Note preview inside textarea container */}
              {hasRecordedVoice && !isRecording && (
                <div className="mt-2 pt-2 border-t border-[#E3ECE0] flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-[#E3ECE0]">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={togglePlayVoice}
                      className="w-6 h-6 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-2xs transition-transform active:scale-95"
                      title={isPlayingVoice ? 'Pause' : 'Play voice note'}
                    >
                      {isPlayingVoice ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
                    </button>
                    <span className="text-[11px] font-semibold text-[#16261E] truncate">
                      Voice Note ({voiceDuration})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={deleteVoiceNote}
                    className="w-6 h-6 rounded-full bg-rose-50 hover:bg-rose-100 text-[#D3362B] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="Remove voice note"
                    aria-label="Remove voice note"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Action CTA */}
        <div className="pt-3.5 mt-2 border-t border-[#F0F5EE] shrink-0">
          <button
            type="button"
            onClick={handleFindWorkers}
            className="w-full h-12 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white font-display font-semibold text-sm sm:text-base flex items-center justify-center shadow-[0_10px_20px_rgba(12,107,68,0.25)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>{targetWorker ? `Request ${targetWorker.name}` : 'Find Workers'}</span>
          </button>
        </div>
      </div>

      {/* In-App Standard Month Calendar Grid (Strictly inside mobile container) */}
      {isDatePickerOpen && (
        <div 
          className="absolute inset-0 z-60 flex items-center justify-center bg-[rgba(15,40,28,0.45)] backdrop-blur-[4px] p-4 animate-fade-in"
          onClick={() => setIsDatePickerOpen(false)}
        >
          <div 
            className="w-[calc(100%-40px)] max-w-[340px] bg-white rounded-[24px] p-4 shadow-[0_20px_50px_rgba(10,40,25,0.3)] border border-[#E3ECE0] animate-scale-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Month & Year with Navigation and Close */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E3ECE0]">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="w-7 h-7 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] flex items-center justify-center text-[#16261E] transition-colors cursor-pointer"
                  title="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-display text-sm font-bold text-[#16261E] min-w-[120px] text-center">
                  {calendarMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="w-7 h-7 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] flex items-center justify-center text-[#16261E] transition-colors cursor-pointer"
                  title="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsDatePickerOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] flex items-center justify-center text-[#76857D] hover:text-[#16261E] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Weekdays Row */}
            <div className="grid grid-cols-7 gap-1 pt-3 pb-1 text-center">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((w, idx) => (
                <span key={idx} className="text-[10px] font-bold text-[#76857D] uppercase">
                  {w}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 pb-2">
              {getCalendarDays().map((cell, idx) => {
                if (cell.day === null) {
                  return <div key={`empty-${idx}`} className="h-8" />;
                }

                const isSelected = (draftJob.date || todayStr) === cell.dateStr;

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    disabled={cell.isPast}
                    onClick={() => {
                      updateDraftJob({ date: cell.dateStr });
                      setIsDatePickerOpen(false);
                    }}
                    className={`h-8 w-8 mx-auto rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                      cell.isPast
                        ? 'text-[#CBD8CA] opacity-35 cursor-not-allowed'
                        : isSelected
                          ? 'bg-[#0C6B44] text-white font-bold shadow-2xs scale-105 cursor-pointer'
                          : cell.isToday
                            ? 'border-1.5 border-[#0C6B44] text-[#0C6B44] font-bold hover:bg-[#E2F3DD] cursor-pointer'
                            : 'text-[#16261E] hover:bg-[#E2F3DD] cursor-pointer'
                    }`}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* In-App Time Picker: 1-Tap Compact Scrollable 30-min Slot List */}
      {isTimePickerOpen && (
        <div 
          className="absolute inset-0 z-60 flex items-center justify-center bg-[rgba(15,40,28,0.45)] backdrop-blur-[4px] p-4 animate-fade-in"
          onClick={() => setIsTimePickerOpen(false)}
        >
          <div 
            className="w-[calc(100%-48px)] max-w-[290px] bg-white rounded-[22px] p-3.5 shadow-[0_20px_50px_rgba(10,40,25,0.3)] border border-[#E3ECE0] animate-scale-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Compact Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E3ECE0]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0C6B44]" />
                <span className="font-display text-[13px] font-bold text-[#16261E]">Select Start Time</span>
              </div>
              <button
                type="button"
                onClick={() => setIsTimePickerOpen(false)}
                className="w-6 h-6 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] flex items-center justify-center text-[#76857D] hover:text-[#16261E] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Compact Scrollable List (capped height ~190px for 4-5 visible slots) */}
            <div className="py-1.5 overflow-y-auto space-y-1 max-h-[190px] pr-1 scrollbar-thin">
              {TIME_SLOTS.map((slot) => {
                const isSelected = (draftJob.time || '10:00 AM') === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      updateDraftJob({ time: slot });
                      setIsTimePickerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0C6B44] text-white shadow-2xs font-bold'
                        : 'bg-[#F6FAF4] hover:bg-[#E2F3DD] text-[#16261E]'
                    }`}
                  >
                    <span>{slot}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
