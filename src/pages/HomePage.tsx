import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOST_SEARCHED_SERVICES, OTHER_SERVICES } from '../data/mockData';
import { 
  Search, 
  X, 
  ChevronRight, 
  Languages, 
  Bell, 
  Check, 
  Mic
} from 'lucide-react';

const SEARCH_PLACEHOLDERS = [
  "Search 'Electrician'...",
  "Search 'Plumber'...",
  "Search 'Cleaning'...",
  "Search 'Carpenter'...",
  "Search 'Painter'...",
  "Search 'Mechanic'...",
  "Search any service..."
];
// Service Icons extracted from user uploads with distinct hues & ultra-light pastel card backgrounds
const OTHER_SERVICE_CONFIG: Record<
  string, 
  { 
    iconSrc: string; 
    bg: string;          // Ultra-light pastel background matching reference
    border: string;      // 1.5px solid border matching reference (0.3 opacity)
  }
> = {
  'painter': { 
    iconSrc: '/images/service-icons/painter.png', 
    bg: 'linear-gradient(rgba(247, 86, 68, 0.09), rgba(247, 86, 68, 0.09)), #ffffff', 
    border: 'rgba(247, 86, 68, 0.3)' 
  },
  'gardening': { 
    iconSrc: '/images/service-icons/gardening.png', 
    bg: 'linear-gradient(rgba(53, 162, 57, 0.09), rgba(53, 162, 57, 0.09)), #ffffff', 
    border: 'rgba(53, 162, 57, 0.3)' 
  },
  'farm-work': { 
    iconSrc: '/images/service-icons/farm-work.png', 
    bg: 'linear-gradient(rgba(120, 170, 59, 0.09), rgba(120, 170, 59, 0.09)), #ffffff', 
    border: 'rgba(120, 170, 59, 0.3)' 
  },
  'mechanic': { 
    iconSrc: '/images/service-icons/mechanic.png', 
    bg: 'linear-gradient(rgba(39, 91, 134, 0.09), rgba(39, 91, 134, 0.09)), #ffffff', 
    border: 'rgba(39, 91, 134, 0.3)' 
  },
  'cooking': { 
    iconSrc: '/images/service-icons/cooking.png', 
    bg: 'linear-gradient(rgba(249, 123, 28, 0.09), rgba(249, 123, 28, 0.09)), #ffffff', 
    border: 'rgba(249, 123, 28, 0.3)' 
  },
  'transport': { 
    iconSrc: '/images/service-icons/transport.png', 
    bg: 'linear-gradient(rgba(1, 159, 179, 0.09), rgba(1, 159, 179, 0.09)), #ffffff', 
    border: 'rgba(1, 159, 179, 0.3)' 
  },
  'animal-care': { 
    iconSrc: '/images/service-icons/animal-care.png', 
    bg: 'linear-gradient(rgba(243, 78, 145, 0.09), rgba(243, 78, 145, 0.09)), #ffffff', 
    border: 'rgba(243, 78, 145, 0.3)' 
  },
  'general-labour': { 
    iconSrc: '/images/service-icons/general-labour.png', 
    bg: 'linear-gradient(rgba(114, 65, 215, 0.09), rgba(114, 65, 215, 0.09)), #ffffff', 
    border: 'rgba(114, 65, 215, 0.3)' 
  },
  'tailor': { 
    iconSrc: '/images/service-icons/tailor.png', 
    bg: 'linear-gradient(rgba(218, 74, 77, 0.09), rgba(218, 74, 77, 0.09)), #ffffff', 
    border: 'rgba(218, 74, 77, 0.3)' 
  },
};

export const HomePage: React.FC = () => {
  const { 
    openCreateJobModal, 
    user, 
    showToast,
    language,
    setLanguage
  } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Language state for top bar
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  // Voice Search states
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const handleStartVoiceSearch = () => {
    setIsVoiceModalOpen(true);
    setIsVoiceListening(true);

    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition 
      || (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const spokenText = event.results[0][0]?.transcript;
          if (spokenText) {
            setSearchQuery(spokenText);
            showToast(`Voice Search: "${spokenText}"`);
          }
          setIsVoiceListening(false);
          setIsVoiceModalOpen(false);
        };

        recognition.onerror = () => {
          setIsVoiceListening(false);
        };

        recognition.onend = () => {
          setIsVoiceListening(false);
        };

        recognition.start();
      } catch {
        setIsVoiceListening(false);
      }
    }
  };

  const handleSelectVoiceQuery = (query: string) => {
    setSearchQuery(query);
    setIsVoiceListening(false);
    setIsVoiceModalOpen(false);
    showToast(`Searching for "${query}"`);
  };

  // Show splash intro once per browser session
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('seen_seva_setu_splash');
    if (!hasSeenSplash) {
      sessionStorage.setItem('seen_seva_setu_splash', 'true');
      navigate('/splash', { replace: true });
    }
  }, [navigate]);

  // Dynamic rotating placeholder animation
  useEffect(() => {
    if (searchQuery) return;
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [searchQuery]);

  // High-fidelity illustrations uploaded by user for most searched services
  const serviceImageMap: Record<string, string> = {
    'electrician': '/images/services/most-searched/electrician.png',
    'plumber': '/images/services/most-searched/plumber.png',
    'cleaning': '/images/services/most-searched/cleaning.png',
    'carpenter': '/images/services/most-searched/carpenter.png',
  };



  // When user taps a service, open the Job Details Bottom Sheet Modal directly
  const handleSelectService = (categoryName: string) => {
    openCreateJobModal(categoryName);
  };

  // Filter service categories by search
  const filteredMostSearched = MOST_SEARCHED_SERVICES.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOtherServices = OTHER_SERVICES.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalResults = filteredMostSearched.length + filteredOtherServices.length;

  return (
    <div className="w-full flex flex-col px-0 pt-2 pb-8">
      {/* Swiggy-Style Top Navigation Header */}
      <div className="px-5 pt-[max(12px,calc(env(safe-area-inset-top,0px)+8px))] pb-2 flex items-center justify-between select-none">
        {/* Left: Swiggy-Style Address Block */}
        <button
          type="button"
          onClick={() => navigate('/addresses')}
          className="flex flex-col items-start text-left group cursor-pointer max-w-[210px] sm:max-w-[240px] focus:outline-none"
          title="Change Service Location"
        >
          <div className="flex items-center gap-1 leading-none">
            <span className="font-display font-bold text-[17px] sm:text-[18px] text-[#16261E] tracking-tight group-hover:text-[#0C6B44] transition-colors truncate">
              {user.location || 'Palakkad Town'}
            </span>
            <ChevronRight className="w-4 h-4 text-[#16261E] stroke-[2.8] group-hover:translate-x-0.5 group-hover:text-[#0C6B44] transition-all shrink-0" />
          </div>
          <span className="text-[11px] sm:text-xs text-[#4F6057] font-medium truncate w-full mt-1">
            {user.location ? `${user.location}, Palakkad, Kerala` : 'Palakkad District, Kerala • Tap to change'}
          </span>
        </button>

        {/* Right: Language changing button first, then notification icon */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 1. Language Changing Button */}
          <button
            type="button"
            onClick={() => setIsLangModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 border border-[#E3ECE0] shadow-[0_2px_8px_rgba(16,60,38,0.06)] hover:bg-[#F6FAF4] hover:border-[#3AAA48]/50 text-[#16261E] active:scale-95 transition-all cursor-pointer"
            title="Change language / भाषा चुनें"
          >
            <Languages className="w-3.5 h-3.5 text-[#0C6B44] stroke-[2.2]" />
            <span className="text-[11px] font-bold text-[#0A5A39]">
              {language === 'hi' ? 'हिन्दी' : 'EN'}
            </span>
          </button>

          {/* 2. Notification Icon Button */}
          <button
            type="button"
            onClick={() => {
              setUnreadCount(0);
              navigate('/notifications');
            }}
            className="relative w-9 h-9 rounded-full bg-white/90 border border-[#E3ECE0] shadow-[0_2px_8px_rgba(16,60,38,0.06)] hover:bg-[#F6FAF4] hover:border-[#3AAA48]/50 flex items-center justify-center text-[#16261E] active:scale-95 transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#16261E] stroke-[2]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0C6B44] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>
        </div>
      </div>


      {/* Modern Search Bar with Voice Search */}
      <div className="px-5 mt-7 mb-6">
        <div 
          className={`relative flex items-center bg-white/95 rounded-[20px] border transition-all duration-200 shadow-[0_4px_16px_rgba(16,60,38,0.05)] ${
            isSearchFocused 
              ? 'border-[#3AAA48] ring-3 ring-[#3AAA48]/15 bg-white shadow-sm' 
              : 'border-[#E3ECE0] hover:border-[#3AAA48]/50'
          }`}
        >
          <Search 
            className={`absolute left-3.5 w-5 h-5 transition-colors stroke-[2] pointer-events-none ${
              isSearchFocused || searchQuery ? 'text-[#0C6B44]' : 'text-[#76857D]'
            }`} 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
            className="w-full pl-11 pr-20 py-3.5 rounded-[20px] bg-transparent text-sm font-medium text-[#16261E] outline-none transition-all placeholder:text-[#76857D]"
          />
          
          <div className="absolute right-2.5 flex items-center gap-1.5">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-6 h-6 rounded-full bg-[#EEF2EC] hover:bg-[#E3ECE0] flex items-center justify-center text-[#4F6057] transition-colors cursor-pointer active:scale-90"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}

            {/* Voice Search Button (Swiggy / Zomato style) */}
            <button
              type="button"
              onClick={handleStartVoiceSearch}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                isVoiceListening 
                  ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200' 
                  : 'bg-[#F1F6F3] hover:bg-[#E2F3DD] text-[#0C6B44]'
              }`}
              title="Voice Search / ശബ്ദ തിരയൽ"
            >
              <Mic className="w-4 h-4 stroke-[2.3]" />
            </button>
          </div>
        </div>

        {/* Search Result Feedback Badge */}
        {searchQuery && (
          <div className="flex items-center justify-between text-[11px] text-[#4F6057] font-medium px-1 mt-1.5">
            <span>{totalResults} service{totalResults !== 1 ? 's' : ''} found</span>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[#0C6B44] font-bold hover:underline"
            >
              Reset filter
            </button>
          </div>
        )}
      </div>

      {/* Section 1: "Most Searched" (RailOne Journey Planner Style - 2 per line, 4 cards total) */}
      {filteredMostSearched.length > 0 && (
        <div className="px-5 mb-7">
          <div className="mb-3">
            <h2 className="font-display text-[18px] font-bold text-[#16261E] tracking-tight leading-snug">
              Most Searched
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            {filteredMostSearched.slice(0, 4).map(service => {
              const imgPath = serviceImageMap[service.id];
              return (
                <div
                  key={service.id}
                  onClick={() => handleSelectService(service.name)}
                  className="group flex flex-col cursor-pointer active:scale-[0.98] transition-transform select-none"
                  title={`Request ${service.name}`}
                >
                  {/* Journey Planner Illustration Card Tile (Clean subtle border for background separation, static on hover) */}
                  <div className="w-full aspect-[16/11] rounded-[20px] sm:rounded-[22px] overflow-hidden bg-white border-[1.5px] border-[#E3ECE0] shadow-[0_3px_12px_rgba(16,60,38,0.06)] transition-all">
                    <img 
                      src={imgPath} 
                      alt={service.name} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                  </div>

                  {/* Separated Label Below Card (RailOne Style) */}
                  <div className="mt-2.5 px-1 flex flex-col items-center text-center">
                    <h3 className="font-display text-[#16261E] font-bold text-sm sm:text-base leading-tight group-hover:text-[#0C6B44] transition-colors">
                      {service.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 2: "Other Services" (3 in a line, RailOne Pastel Rectangles, Direct Visual Icons) */}
      {filteredOtherServices.length > 0 && (
        <div className="px-5 mb-7">
          <div className="mb-3">
            <h2 className="font-display text-[18px] font-bold text-[#16261E] tracking-tight leading-snug">
              Other Services
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {filteredOtherServices.map(service => {
              const config = OTHER_SERVICE_CONFIG[service.id] || {
                iconSrc: `/images/service-icons/${service.id}.png`,
                bg: 'linear-gradient(rgba(58,170,72,0.09), rgba(58,170,72,0.09)), #ffffff',
                border: 'rgba(58,170,72,0.3)'
              };
              return (
                <div
                  key={service.id}
                  onClick={() => handleSelectService(service.name)}
                  className="group flex flex-col items-center cursor-pointer active:scale-[0.96] transition-transform select-none"
                  title={`Request ${service.name}`}
                >
                  {/* Reference Style Pastel Tile with 1.5px border and tinted background from reference HTML */}
                  <div 
                    style={{ background: config.bg, borderColor: config.border }}
                    className="w-full aspect-[4/3] rounded-[20px] sm:rounded-[22px] flex items-center justify-center p-2.5 sm:p-3.5 border-[1.5px] shadow-[0_3px_12px_rgba(16,60,38,0.04)] transition-all"
                  >
                    <img 
                      src={config.iconSrc} 
                      alt={service.name} 
                      className="w-13 h-13 sm:w-16 sm:h-16 object-contain" 
                      loading="lazy"
                    />
                  </div>

                  {/* Separated Label Underneath - Clean Name Only (No Sub-description) */}
                  <div className="mt-2 px-1 flex flex-col items-center text-center w-full">
                    <span className="font-display text-[#16261E] font-semibold text-xs sm:text-sm leading-tight group-hover:text-[#0C6B44] transition-colors truncate max-w-full">
                      {service.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

        {/* Empty Search State */}
        {filteredMostSearched.length === 0 && filteredOtherServices.length === 0 && (
          <div className="px-5 py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-white border border-[#E3ECE0] flex items-center justify-center mx-auto mb-3 text-[#4F6057] shadow-xs">
              <Search className="w-7 h-7 stroke-[1.8]" />
            </div>
            <h3 className="font-display text-base font-semibold text-[#16261E]">No services found</h3>
            <p className="text-xs text-[#4F6057] mt-1 max-w-xs mx-auto">
              We couldn't find matching services for "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#0C6B44] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_8px_16px_rgba(10,90,57,0.2)] active:scale-95"
            >
              Clear Search
            </button>
          </div>
        )}

      {/* Language Switcher Modal */}
      {isLangModalOpen && (
        <div 
          className="absolute inset-0 z-50 flex items-end justify-center bg-[rgba(15,40,28,0.4)] backdrop-blur-[4px] animate-fade-in p-0"
          onClick={() => setIsLangModalOpen(false)}
        >
          <div 
            className="w-full bg-white rounded-t-[32px] sm:rounded-t-[36px] p-5 sm:p-6 shadow-[0_-12px_40px_rgba(10,50,30,0.25)] border-t border-[#E3ECE0] animate-slide-up max-h-[85%]"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-11 h-1.5 bg-[#CBD8CA] rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-[#16261E]">Select Language</h3>
                <p className="text-xs text-[#4F6057]">भाषा का चयन करें</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsLangModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] border border-[#E3ECE0] flex items-center justify-center text-[#76857D] hover:text-[#16261E] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            <div className="space-y-2.5 my-4">
              {/* English Option */}
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setIsLangModalOpen(false);
                  showToast('Language updated to English');
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  language === 'en'
                    ? 'border-[#0C6B44] bg-[#E2F3DD] text-[#0A5A39] shadow-2xs'
                    : 'border-[#E3ECE0] hover:bg-[#F6FAF4] text-[#16261E] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                    language === 'en' ? 'bg-[#0C6B44] text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    EN
                  </div>
                  <div>
                    <span className="font-bold text-sm block">English</span>
                    <span className="text-[11px] text-[#4F6057]">Standard app language</span>
                  </div>
                </div>
                {language === 'en' && <Check className="w-4 h-4 text-[#0C6B44] stroke-[2.5]" />}
              </button>

              {/* Hindi Option */}
              <button
                type="button"
                onClick={() => {
                  setLanguage('hi');
                  setIsLangModalOpen(false);
                  showToast('भाषा हिन्दी में बदल दी गई है');
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'border-[#0C6B44] bg-[#E2F3DD] text-[#0A5A39] shadow-2xs'
                    : 'border-[#E3ECE0] hover:bg-[#F6FAF4] text-[#16261E] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                    language === 'hi' ? 'bg-[#0C6B44] text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    हि
                  </div>
                  <div>
                    <span className="font-bold text-sm block">हिन्दी (Hindi)</span>
                    <span className="text-[11px] text-[#4F6057]">सभी ग्रामीण सेवाओं के लिए</span>
                  </div>
                </div>
                {language === 'hi' && <Check className="w-4 h-4 text-[#0C6B44] stroke-[2.5]" />}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Voice Search Listening Modal (Swiggy / Zomato style) */}
      {isVoiceModalOpen && (
        <div 
          className="absolute inset-0 z-50 flex items-end justify-center bg-[rgba(15,40,28,0.45)] backdrop-blur-[5px] animate-fade-in p-0"
          onClick={() => {
            setIsVoiceListening(false);
            setIsVoiceModalOpen(false);
          }}
        >
          <div 
            className="w-full bg-white rounded-t-[32px] sm:rounded-t-[36px] p-6 shadow-[0_-12px_40px_rgba(10,50,30,0.25)] border-t border-[#E3ECE0] animate-slide-up flex flex-col items-center text-center max-h-[85%]"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-11 h-1.5 bg-[#CBD8CA] rounded-full mx-auto mb-4" />
            
            {/* Animated Pulsing Voice Rings */}
            <div className="relative my-4 flex items-center justify-center">
              <span className="absolute w-24 h-24 rounded-full bg-[#3AAA48]/20 animate-ping" />
              <span className="absolute w-20 h-20 rounded-full bg-[#E2F3DD] animate-pulse" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-[#0C6B44] text-white flex items-center justify-center shadow-md">
                <Mic className="w-8 h-8 stroke-[2.2]" />
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-[#16261E] mt-2">
              Listening...
            </h3>
            <p className="text-xs text-[#4F6057] mt-1 max-w-xs font-medium">
              Say the service you need, or choose from suggestions below:
            </p>

            {/* Quick Voice Suggestion Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5 mb-2 w-full">
              {[
                'Electrician',
                'Plumber',
                'Cleaning',
                'Carpenter',
                'Painter',
                'Farm Work',
                'Gardening',
                'Mechanic'
              ].map(query => (
                <button
                  key={query}
                  type="button"
                  onClick={() => handleSelectVoiceQuery(query)}
                  className="px-3.5 py-1.5 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] border border-[#E3ECE0] hover:border-[#0C6B44] text-xs font-semibold text-[#16261E] hover:text-[#0A5A39] transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  {query}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsVoiceListening(false);
                setIsVoiceModalOpen(false);
              }}
              className="mt-4 w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      </div>
  );
};
