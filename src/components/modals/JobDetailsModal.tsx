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
  Trash2, 
  Edit3,
  UserCheck,
  MapPin,
  Users,
  Minus,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight
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
    user,
    openLocationModal,
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
        className="w-full bg-white rounded-t-[32px] sm:rounded-t-[36px] p-4 sm:p-5 shadow-[0_-12px_40px_rgba(10,50,30,0.25)] border-t border-[#E3ECE0] animate-slide-up flex flex-col max-h-[88%] overflow-y-auto scrollbar-none transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle pill */}
        <div className="w-11 h-1 bg-[#CBD8CA] rounded-full mx-auto mb-3 shrink-0" />

        {/* Compact Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Service Illustration Card */}
            <div className="w-[68px] h-[68px] rounded-[18px] overflow-hidden bg-[#FEF6EE] border border-[#F3E5D8] shrink-0 shadow-2xs">
              <img 
                src={serviceImg} 
                alt={selectedCategory} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name + Subtitle */}
            <div className="min-w-0">
              <h2 className="font-display text-xl sm:text-[21px] font-bold text-[#16261E] tracking-tight leading-tight truncate">
                {selectedCategory || 'Electrician'}
              </h2>
              <p className="text-xs text-[#76857D] font-normal leading-snug mt-0.5">
                Job details
              </p>
              {targetWorker && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0C6B44] bg-[#E2F3DD] px-2 py-0.5 rounded-full mt-1">
                  <UserCheck className="w-2.5 h-2.5 text-[#0C6B44]" />
                  <span>{targetWorker.name}</span>
                </span>
              )}
            </div>
          </div>

          {/* Clean Circular Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-white hover:bg-[#F6FAF4] flex items-center justify-center text-[#76857D] hover:text-[#16261E] transition-colors border border-[#E3ECE0] cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>

        {/* Content Fields with compact spacing */}
        <div className="space-y-2.5">
          {/* 1. Service Location - Slim Card */}
          <div>
            <label className="block text-[11px] font-bold text-[#16261E] mb-1 flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#0C6B44] stroke-[2.2]" />
              <span>Service Location</span>
            </label>
            <div className="flex items-center justify-between gap-2 bg-[#F6FAF4] border border-[#E3ECE0] rounded-xl py-1.5 px-3 shadow-2xs">
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-xs text-[#16261E] truncate block">
                  {currentAddress}
                </span>
              </div>
              <button
                type="button"
                onClick={openLocationModal}
                className="text-[10px] font-bold text-[#0C6B44] bg-white hover:bg-[#E2F3DD] px-2.5 py-0.5 rounded-full border border-[#CBD8CA] cursor-pointer shrink-0 transition-colors shadow-2xs"
              >
                Change
              </button>
            </div>
          </div>

          {/* 2. Service Date - Slim Card with In-App Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#16261E] mb-1 flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#0C6B44] stroke-[2.2]" />
              <span>Service Date</span>
            </label>

            <div 
              onClick={() => setIsDatePickerOpen(true)}
              className="relative flex items-center justify-between bg-white border border-[#E3ECE0] hover:border-[#3AAA48] rounded-xl py-1.5 px-3 transition-all shadow-2xs cursor-pointer select-none"
            >
              <span className="font-display text-xs font-bold text-[#16261E] flex-1">
                {formatDateDisplay(draftJob.date || todayStr)}
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold py-0.5 px-2 rounded-full bg-[#E2F3DD] text-[#0C6B44]">
                  {(draftJob.date === todayStr || !draftJob.date) ? 'Today' : 'Scheduled'}
                </span>
                <div className="w-6 h-6 rounded-full bg-[#F6FAF4] border border-[#E3ECE0] flex items-center justify-center text-[#0C6B44]">
                  <Calendar className="w-3 h-3 stroke-[2.2]" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Preferred Start Time - Slim Card */}
          <div>
            <label className="block text-[11px] font-bold text-[#16261E] mb-1 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-[#0C6B44] stroke-[2.2]" />
              <span>Preferred Start Time</span>
            </label>

            <div 
              onClick={() => setIsTimePickerOpen(true)}
              className="relative flex items-center justify-between bg-white border border-[#E3ECE0] hover:border-[#3AAA48] rounded-xl py-1.5 px-3 transition-all shadow-2xs cursor-pointer select-none"
            >
              <span className="font-display text-xs font-bold text-[#16261E]">
                {draftJob.time || '10:00 AM'}
              </span>

              <div className="w-6 h-6 rounded-full bg-[#F6FAF4] border border-[#E3ECE0] flex items-center justify-center text-[#0C6B44]">
                <Clock className="w-3 h-3 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* 4. Workers Needed - 1 Single Compact Line */}
          {!targetWorker && (
            <div className="flex items-center justify-between gap-2.5 bg-[#F6FAF4] border border-[#E3ECE0] rounded-xl py-1.5 px-3 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-white border border-[#CBD8CA] flex items-center justify-center text-[#0C6B44] shrink-0">
                  <Users className="w-3.5 h-3.5 stroke-[2]" />
                </div>
                <span className="text-xs font-bold text-[#16261E] truncate">
                  Workers needed
                </span>
              </div>

              {/* Connected Stepper Pill */}
              <div className="flex items-center bg-white border border-[#CBD8CA] rounded-full p-0.5 shadow-2xs shrink-0">
                <button
                  type="button"
                  disabled={workersNeeded <= 1}
                  onClick={() => handleUpdateWorkers(workersNeeded - 1)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#16261E] hover:bg-[#E2F3DD] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Decrease workers"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-display text-xs font-bold text-[#16261E]">
                  {workersNeeded}
                </span>
                <button
                  type="button"
                  disabled={workersNeeded >= 10}
                  onClick={() => handleUpdateWorkers(workersNeeded + 1)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#16261E] hover:bg-[#E2F3DD] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Increase workers"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* 5. Job details (optional) */}
          <div>
            <label className="block text-xs font-semibold text-[#16261E] mb-1.5 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-[#0C6B44] stroke-[2]" />
              <span>Job details</span>
              <span className="text-[11px] font-normal text-[#76857D]">
                (optional)
              </span>
            </label>

            {/* Textarea Container with inside Mic button */}
            <div className="relative rounded-2xl border border-[#E3ECE0] bg-white focus-within:border-[#3AAA48] focus-within:ring-2 focus-within:ring-[#3AAA48]/20 transition-all shadow-2xs p-2.5">
              <textarea
                ref={textareaRef}
                rows={2}
                value={draftJob.description}
                onChange={(e) => updateDraftJob({ description: e.target.value })}
                onFocus={() => {
                  (window as unknown as { __sevaActiveInput?: HTMLElement | null }).__sevaActiveInput = textareaRef.current;
                  openKeyboard();
                  setTimeout(() => {
                    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 120);
                }}
                placeholder="Tell us what needs to be done..."
                className="w-full pr-8 text-xs text-[#16261E] bg-transparent outline-none placeholder:text-[#94A3B8] resize-none leading-relaxed"
              />

              {/* Inside Mic Button on the right */}
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
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      hasRecordedVoice
                        ? 'bg-[#E2F3DD] text-[#0C6B44]'
                        : 'bg-[#F6FAF4] hover:bg-[#E2F3DD] text-[#76857D] hover:text-[#0C6B44] border border-[#E3ECE0]'
                    }`}
                    title={hasRecordedVoice ? 'Re-record voice note' : 'Record voice note'}
                  >
                    <Mic className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                )}
              </div>

              {/* Attached Voice Note preview inside textarea container */}
              {hasRecordedVoice && !isRecording && (
                <div className="mt-2 pt-2 border-t border-[#E3ECE0]/80 flex items-center justify-between gap-2 bg-[#F6FAF4] px-2.5 py-1 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={togglePlayVoice}
                      className="w-5 h-5 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white flex items-center justify-center shrink-0 cursor-pointer"
                      title={isPlayingVoice ? 'Pause' : 'Play voice note'}
                    >
                      {isPlayingVoice ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
                    </button>
                    <span className="text-[10px] font-semibold text-[#16261E] truncate">
                      Voice Note ({voiceDuration})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={deleteVoiceNote}
                    className="p-0.5 text-[#76857D] hover:text-[#D3362B] transition-colors cursor-pointer"
                    title="Remove voice note"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Action CTA */}
        <div className="pt-3.5 mt-1 shrink-0">
          <button
            type="button"
            onClick={handleFindWorkers}
            className="w-full h-11 sm:h-12 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white font-display font-semibold text-sm sm:text-[15px] flex items-center justify-center shadow-[0_10px_20px_rgba(12,107,68,0.25)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Find Workers</span>
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
