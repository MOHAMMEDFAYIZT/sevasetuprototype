import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WORKERS_DATABASE } from '../../data/mockData';
import { 
  X, 
  Calendar, 
  MapPin, 
  Navigation, 
  ArrowRight, 
  Check, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Edit3,
  Sparkles,
  UserCheck
} from 'lucide-react';

const SERVICE_IMAGES: Record<string, string> = {
  'electrician': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80',
  'plumber': 'https://images.unsplash.com/photo-1581244277943-fe4a9c77d32e?auto=format&fit=crop&w=500&q=80',
  'cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80',
  'carpenter': 'https://images.unsplash.com/photo-1502005229762-ee1b2da97ba4?auto=format&fit=crop&w=500&q=80',
  'painter': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=500&q=80',
  'gardening': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=500&q=80',
  'farm-work': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&q=80',
  'farm work': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&q=80',
  'mechanic': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=500&q=80',
  'cooking': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80',
  'transport': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=500&q=80',
  'animal-care': 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=500&q=80',
  'animal care': 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=500&q=80',
  'general-labour': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80',
  'general labour': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80',
  'tailor': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=80',
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
    showToast
  } = useApp();

  const navigate = useNavigate();

  const targetWorker = selectedWorkerIds.length === 1
    ? WORKERS_DATABASE.find(w => w.id === selectedWorkerIds[0])
    : null;

  const handleClose = () => {
    setSelectedWorkerIds([]);
    closeCreateJobModal();
  };

  // Location mode: 'saved' (Saved Address) or 'current' (Current Location)
  const locationMode = draftJob.locationMode || 'saved';

  // Mode for optional explanation: 'text' or 'voice'
  const [detailMode, setDetailMode] = useState<'text' | 'voice'>('text');
  
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

  const categoryKey = (selectedCategory || 'Electrician').toLowerCase().replace(/\s+/g, '-');
  const serviceImg = SERVICE_IMAGES[categoryKey] || SERVICE_IMAGES['electrician'];

  const handleSelectLocationMode = (mode: 'saved' | 'current') => {
    if (mode === 'saved') {
      updateDraftJob({
        locationMode: 'saved',
        location: user.location || 'Saved Address'
      });
      showToast('Set to Saved Address');
    } else {
      updateDraftJob({
        locationMode: 'current',
        location: 'Current Location'
      });
      showToast('Set to Current Location (GPS)');
    }
  };

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
    const secs = recordSeconds || 5;
    const durStr = `0:${secs < 10 ? '0' : ''}${secs}`;
    setVoiceDuration(durStr);
    setHasRecordedVoice(true);
    updateDraftJob({
      hasVoiceNote: true,
      voiceNoteDuration: durStr
    });
    showToast('Voice note attached! (Optional)');
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
      }, (recordSeconds || 5) * 1000);
    } else {
      setIsPlayingVoice(false);
    }
  };

  const handleFindWorkers = () => {
    const finalDate = draftJob.date || todayStr;
    const finalLocation = draftJob.location || (locationMode === 'current' ? 'Current Location' : (user.location || 'Saved Address'));

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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 sm:p-6 animate-fade-in"
      onClick={handleClose}
    >
      {/* Centered Floating Card with soft ambient sage glow in harmony with Home Page */}
      <div
        className="w-full max-w-[420px] bg-gradient-to-b from-[#F1F7F3] via-white to-white rounded-[32px] p-5 sm:p-6 shadow-[0_24px_60px_rgba(20,80,50,0.22)] border border-[#b4ddc5]/60 animate-scale-in flex flex-col max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title + Close [✕] Button */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-900/10 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[19px] font-black text-slate-900 tracking-tight leading-none">
              Job Details
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-[#144c31] border border-emerald-300/60">
              {targetWorker ? (
                <>
                  <UserCheck className="w-2.5 h-2.5 text-[#185E3B]" />
                  <span>Requesting {targetWorker.name}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-2.5 h-2.5 text-[#185E3B]" />
                  <span>Instant Request</span>
                </>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-2xs border border-slate-200/80 cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-3.5">
          {/* Hero Craft Spotlight (Taller breathing room, natural framing & Home card synergy) */}
          <div className="relative rounded-2xl overflow-hidden aspect-[2.1/1] sm:h-[145px] border border-slate-200/90 shadow-2xs group bg-slate-100">
            <img
              src={serviceImg}
              alt={selectedCategory}
              className="w-full h-full object-cover object-[center_22%]"
              loading="lazy"
            />
            {/* Gradient Scrim & Typography at bottom matching Home cards */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-3.5 pointer-events-none">
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/35 text-emerald-200 uppercase tracking-wider w-fit mb-1 border border-emerald-400/30 backdrop-blur-xs">
                Verified Craft
              </span>
              <h3 className="text-white font-black text-[18px] leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {selectedCategory || 'Electrician'}
              </h3>
              <p className="text-white/85 text-[11px] font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
                Independent local workers available now
              </p>
            </div>
          </div>

          {/* Service Date: Pre-filled Current Day + Calendar Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#185E3B]" />
              <span>When do you need the service?</span>
            </label>

            <div className="relative flex items-center">
              <input
                type="date"
                min={todayStr}
                value={draftJob.date || todayStr}
                onChange={(e) => updateDraftJob({ date: e.target.value })}
                className="w-full py-2.5 pl-3.5 pr-24 rounded-xl border border-slate-200 bg-[#F8FAF9] hover:bg-white focus:bg-white focus:border-[#185E3B] focus:ring-2 focus:ring-[#185E3B]/20 text-xs sm:text-sm font-bold text-slate-900 transition-all cursor-pointer outline-none shadow-2xs"
              />
              <span className="absolute right-3 pointer-events-none text-[10px] font-bold text-[#185E3B] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/90 shadow-2xs">
                {(draftJob.date === todayStr || !draftJob.date) ? 'Today' : 'Scheduled'}
              </span>
            </div>
          </div>

          {/* Location Selector: Clean 2-Way Choice (Saved Address vs Current Location) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#185E3B]" />
              <span>Location</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectLocationMode('saved')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  locationMode === 'saved'
                    ? 'bg-[#185E3B] text-white border-[#185E3B] shadow-[0_2px_8px_rgba(24,94,59,0.25)]'
                    : 'bg-[#F8FAF9] hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Saved Address</span>
                {locationMode === 'saved' && <Check className="w-3.5 h-3.5 stroke-[2.5] ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => handleSelectLocationMode('current')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  locationMode === 'current'
                    ? 'bg-[#185E3B] text-white border-[#185E3B] shadow-[0_2px_8px_rgba(24,94,59,0.25)]'
                    : 'bg-[#F8FAF9] hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Navigation className="w-3.5 h-3.5 shrink-0" />
                <span>Current Location</span>
                {locationMode === 'current' && <Check className="w-3.5 h-3.5 stroke-[2.5] ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Optional Explanation with Lively Voice / Text Switch */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Explain Need
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  (Optional)
                </span>
              </div>

              {/* Lively Mode Switch */}
              <div className="flex items-center bg-[#F1F7F3] border border-[#b4ddc5]/60 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDetailMode('text')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    detailMode === 'text'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Type</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDetailMode('voice')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    detailMode === 'voice'
                      ? 'bg-[#185E3B] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mic className="w-2.5 h-2.5" />
                  <span>Voice Note</span>
                </button>
              </div>
            </div>

            {/* Type Mode */}
            {detailMode === 'text' && (
              <textarea
                rows={2}
                value={draftJob.description}
                onChange={(e) => updateDraftJob({ description: e.target.value })}
                placeholder="Optional: e.g. switchboard sparking, fan inspection..."
                className="w-full p-2.5 text-xs text-slate-900 bg-[#FAFCFB] border border-[#CBD5E1] focus:border-[#185E3B] focus:bg-white focus:ring-2 focus:ring-[#185E3B]/10 rounded-xl outline-none placeholder:text-slate-400 resize-none transition-all"
              />
            )}

            {/* Voice Mode */}
            {detailMode === 'voice' && (
              <div className="rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/70 via-[#F1F7F3] to-emerald-50/70 p-2.5 transition-all">
                {!hasRecordedVoice && !isRecording && (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="w-full py-2.5 px-3 rounded-lg bg-white hover:bg-emerald-50/50 border border-emerald-300/80 flex items-center justify-center gap-2 text-[#185E3B] font-bold text-xs transition-all shadow-2xs cursor-pointer group"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#185E3B] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Mic className="w-3.5 h-3.5" />
                    </div>
                    <span>Tap to record in Malayalam or English</span>
                  </button>
                )}

                {/* Actively Recording State */}
                {isRecording && (
                  <div className="flex items-center justify-between p-1 bg-white rounded-lg border border-rose-200 px-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-xs font-mono font-bold text-rose-600">
                        0:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}
                      </span>
                      {/* Animated sound wave bars */}
                      <div className="flex items-center gap-0.5 h-4 ml-1">
                        <span className="w-1 bg-rose-400 rounded-full animate-bounce h-3" />
                        <span className="w-1 bg-rose-500 rounded-full animate-bounce h-4 [animation-delay:0.1s]" />
                        <span className="w-1 bg-rose-400 rounded-full animate-bounce h-2 [animation-delay:0.2s]" />
                        <span className="w-1 bg-rose-500 rounded-full animate-bounce h-4 [animation-delay:0.15s]" />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Square className="w-3 h-3 fill-current" />
                      <span>Stop</span>
                    </button>
                  </div>
                )}

                {/* Recorded Voice Note Preview */}
                {hasRecordedVoice && !isRecording && (
                  <div className="flex items-center justify-between gap-2 bg-white p-1.5 px-2.5 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={togglePlayVoice}
                        className="w-7 h-7 rounded-full bg-[#185E3B] hover:bg-[#144E31] text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
                        title={isPlayingVoice ? 'Pause' : 'Play voice note'}
                      >
                        {isPlayingVoice ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-800">Voice Note</span>
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">({voiceDuration})</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-medium block truncate">
                          {isPlayingVoice ? 'Playing preview...' : 'Attached to request'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={deleteVoiceNote}
                      className="w-7 h-7 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete voice note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Action CTA */}
        <div className="pt-3.5 mt-1 shrink-0">
          <button
            type="button"
            onClick={handleFindWorkers}
            className="w-full h-12 sm:h-13 rounded-2xl bg-[#185E3B] hover:bg-[#144E31] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(24,94,59,0.28)] transition-all active:scale-[0.99] cursor-pointer group"
          >
            <span>{targetWorker ? `Book ${targetWorker.name.split(' ')[0]}` : `Find ${selectedCategory || 'Worker'}s`}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
