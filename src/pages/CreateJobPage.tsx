import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Navigation, 
  Check, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Edit3 
} from 'lucide-react';

const SERVICE_IMAGES: Record<string, string> = {
  'electrician': '/images/services/clean/electrician.jpg',
  'plumber': '/images/services/clean/plumber.jpg',
  'cleaning': '/images/services/clean/cleaning.jpg',
  'carpenter': '/images/services/clean/carpenter.jpg',
  'painter': '/images/services/clean/painter.jpg',
  'gardening': '/images/services/clean/gardening.jpg',
  'farm-work': '/images/services/clean/farm_work.jpg',
  'farm work': '/images/services/clean/farm_work.jpg',
  'mechanic': '/images/services/clean/mechanic.jpg',
  'cooking': '/images/services/clean/cooking.jpg',
  'transport': '/images/services/clean/transport.jpg',
  'animal-care': '/images/services/clean/animal_care.jpg',
  'animal care': '/images/services/clean/animal_care.jpg',
  'general-labour': '/images/services/clean/general_labour.jpg',
  'general labour': '/images/services/clean/general_labour.jpg',
  'tailor': '/images/services/clean/tailor.jpg',
};

export const CreateJobPage: React.FC = () => {
  const { 
    user, 
    selectedCategory, 
    draftJob, 
    updateDraftJob, 
    showToast 
  } = useApp();
  const navigate = useNavigate();

  const [detailMode, setDetailMode] = useState<'text' | 'voice'>('text');
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

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const categoryKey = (selectedCategory || 'Electrician').toLowerCase().replace(/\s+/g, '-');
  const serviceImg = SERVICE_IMAGES[categoryKey] || SERVICE_IMAGES['electrician'];

  const isCurrentGps = draftJob.location === 'Current Location (GPS Verified)';

  const handleUseCurrentLocation = () => {
    updateDraftJob({ 
      location: 'Current Location (GPS Verified)',
      locationMode: 'current'
    });
    showToast('Switched to GPS location');
  };

  const handleUseSavedLocation = () => {
    updateDraftJob({ 
      location: user.location || 'Palakkad Town',
      locationMode: 'saved'
    });
    showToast(`Location set to ${user.location || 'Palakkad Town'}`);
  };

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
    showToast('Voice note recorded! (Optional)');
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
    if (!draftJob.date) {
      updateDraftJob({ date: todayStr });
    }
    navigate('/workers');
  };

  return (
    <div className="w-full flex flex-col px-5 pt-4 pb-8 max-w-xl mx-auto">
      {/* Header: "Job Details" with Cross [✕] button instead of Back */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
            Job Details
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specify requirement & find nearby workers
          </p>
        </div>
        <Link
          to="/"
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          title="Close and return to services"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </Link>
      </div>

      {/* Form Content */}
      <div className="space-y-4">
        {/* Selected Service Hero Banner (Matching Home card & modal style) */}
        <div className="relative rounded-2xl overflow-hidden aspect-[2.1/1] sm:h-[150px] border border-slate-200/90 shadow-2xs group bg-slate-100 mb-4">
          <img
            src={serviceImg}
            alt={selectedCategory}
            className="w-full h-full object-cover object-[center_22%]"
            loading="lazy"
          />
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

        {/* Date Selection: Defaults to Today */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#185E3B]" />
            <span>When do you need the service?</span>
          </label>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              onClick={() => updateDraftJob({ date: todayStr })}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                (draftJob.date === todayStr || !draftJob.date)
                  ? 'bg-[#185E3B] text-white border-[#185E3B] shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {(draftJob.date === todayStr || !draftJob.date) && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>Today (Default)</span>
            </button>

            <button
              type="button"
              onClick={() => updateDraftJob({ date: tomorrowStr })}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                draftJob.date === tomorrowStr
                  ? 'bg-[#185E3B] text-white border-[#185E3B] shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {draftJob.date === tomorrowStr && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>Tomorrow</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="date"
              value={draftJob.date || todayStr}
              min={todayStr}
              onChange={(e) => updateDraftJob({ date: e.target.value })}
              className="w-full p-2.5 px-3 text-xs font-semibold text-slate-800 bg-[#FAFCFB] border border-slate-200 hover:border-slate-300 focus:border-[#185E3B] focus:bg-white rounded-xl outline-none transition-colors"
            />
          </div>
        </div>

        {/* Location Selector: Clean 2-Way Choice (Saved Address vs Current Location) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#185E3B]" />
            <span>Location</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleUseSavedLocation}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                !isCurrentGps
                  ? 'bg-[#185E3B] text-white border-[#185E3B] shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Saved Address</span>
              {!isCurrentGps && <Check className="w-3.5 h-3.5 stroke-[2.5] ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isCurrentGps
                  ? 'bg-[#185E3B] text-white border-[#185E3B] shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 shrink-0" />
              <span>Current Location</span>
              {isCurrentGps && <Check className="w-3.5 h-3.5 stroke-[2.5] ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Explanation Section (At Bottom, Completely Optional, Text or Voice) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Explain Need
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                (Optional)
              </span>
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setDetailMode('text')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  detailMode === 'text'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Type</span>
              </button>
              <button
                type="button"
                onClick={() => setDetailMode('voice')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  detailMode === 'voice'
                    ? 'bg-[#185E3B] text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Mic className="w-3 h-3" />
                <span>Voice Note</span>
              </button>
            </div>
          </div>

          {detailMode === 'text' && (
            <textarea
              rows={2}
              value={draftJob.description}
              onChange={(e) => updateDraftJob({ description: e.target.value })}
              placeholder="Optional: e.g. switchboard sparking, fan inspection..."
              className="w-full p-3 text-xs sm:text-sm text-slate-900 bg-[#FAFCFB] border border-[#CBD5E1] focus:border-[#185E3B] focus:bg-white rounded-xl outline-none placeholder:text-slate-400 resize-none transition-all"
            />
          )}

          {detailMode === 'voice' && (
            <div className="rounded-xl border border-slate-200 bg-[#FAFCFB] p-3">
              {!hasRecordedVoice && !isRecording && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 flex items-center justify-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#185E3B] text-white flex items-center justify-center shadow-xs">
                    <Mic className="w-4 h-4" />
                  </div>
                  <span>Tap to record voice message (Malayalam / English)</span>
                </button>
              )}

              {isRecording && (
                <div className="flex items-center justify-between p-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-sm font-mono font-bold text-rose-600">
                      0:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}
                    </span>
                    <div className="flex items-center gap-0.5 h-5 ml-2">
                      <span className="w-1 bg-rose-400 rounded-full animate-bounce h-3" />
                      <span className="w-1 bg-rose-500 rounded-full animate-bounce h-5 [animation-delay:0.1s]" />
                      <span className="w-1 bg-rose-400 rounded-full animate-bounce h-2 [animation-delay:0.2s]" />
                      <span className="w-1 bg-rose-500 rounded-full animate-bounce h-4 [animation-delay:0.15s]" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop</span>
                  </button>
                </div>
              )}

              {hasRecordedVoice && !isRecording && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={togglePlayVoice}
                      className="w-8 h-8 rounded-full bg-[#185E3B] hover:bg-[#144E31] text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
                      title={isPlayingVoice ? 'Pause' : 'Play voice note'}
                    >
                      {isPlayingVoice ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-800">Voice Note</span>
                        <span className="text-xs font-mono text-slate-500 font-semibold">({voiceDuration})</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-medium block truncate">
                        {isPlayingVoice ? 'Playing preview...' : 'Ready to send with request'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={deleteVoiceNote}
                    className="w-8 h-8 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="Delete voice note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleFindWorkers}
            className="w-full h-13 rounded-2xl bg-[#185E3B] hover:bg-[#144E31] text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer group"
          >
            <span>Find {selectedCategory || 'Worker'}s</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
