import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOST_SEARCHED_SERVICES, OTHER_SERVICES } from '../data/mockData';
import { Search, X, ArrowRight } from 'lucide-react';

const SEARCH_PLACEHOLDERS = [
  "Search 'Electrician'...",
  "Search 'Plumber'...",
  "Search 'Cleaning'...",
  "Search 'Carpenter'...",
  "Search 'Painter'...",
  "Search 'Mechanic'...",
  "Search any service..."
];

export const HomePage: React.FC = () => {
  const { openCreateJobModal } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

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

  // Curated bright, daylight, natural photography from verified web CDNs
  const serviceImageMap: Record<string, string> = {
    'electrician': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80',
    'plumber': 'https://images.unsplash.com/photo-1581244277943-fe4a9c77d32e?auto=format&fit=crop&w=500&q=80',
    'cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80',
    'carpenter': 'https://images.unsplash.com/photo-1502005229762-ee1b2da97ba4?auto=format&fit=crop&w=500&q=80',
    'painter': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=500&q=80',
    'gardening': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500&q=80',
    'farm-work': 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=500&q=80',
    'mechanic': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=500&q=80',
    'cooking': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80',
    'transport': 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=500&q=80',
    'animal-care': 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=500&q=80',
    'general-labour': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80',
    'tailor': 'https://images.unsplash.com/photo-1528458908906-5b48e35a0f5a?auto=format&fit=crop&w=500&q=80',
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
    <div className="w-full flex flex-col px-0 pt-0 pb-6">
      {/* Simple & Reduced Headline (Removed "Good morning" and big text per user instruction) */}
      <div className="px-5 mt-3 mb-2.5">
          <h1 className="text-[17px] font-bold text-slate-800 tracking-tight">
            What service do you need?
          </h1>
        </div>

        {/* Highly Interactive Search Bar */}
        <div className="px-5 mb-4">
          <div 
            className={`relative flex items-center bg-[#f8faf9] rounded-2xl border transition-all duration-200 ${
              isSearchFocused 
                ? 'border-[#185E3B] bg-white ring-3 ring-[#185E3B]/10 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <Search 
              className={`absolute left-3.5 w-5 h-5 transition-colors stroke-[2] pointer-events-none ${
                isSearchFocused || searchQuery ? 'text-[#185E3B]' : 'text-slate-400'
              }`} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-transparent text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:transition-opacity"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer active:scale-90"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Search Result Feedback Badge */}
          {searchQuery && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1 mt-1">
              <span>{totalResults} service{totalResults !== 1 ? 's' : ''} found</span>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[#185E3B] font-bold hover:underline"
              >
                Reset filter
              </button>
            </div>
          )}
        </div>

        {/* Section 1: "Most Searched" (Bright Daylight 2x2 Grid) */}
        {filteredMostSearched.length > 0 && (
          <div className="px-5 mb-5">
            <div className="mb-2.5">
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight leading-snug">
                Most Searched
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Common services people look for
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredMostSearched.map(service => {
                const imgPath = serviceImageMap[service.id];
                return (
                  <div
                    key={service.id}
                    onClick={() => handleSelectService(service.name)}
                    className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] group select-none border border-slate-200/90"
                    title={`Request ${service.name}`}
                  >
                    {/* Bright Daylight Photo Frame (No dark black scrims) */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img 
                        src={imgPath} 
                        alt={service.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = `/images/services/clean/${service.id.replace('-', '_')}.jpg`;
                        }}
                      />
                    </div>
                    {/* Solid White Content Base with High-Contrast Dark Text */}
                    <div className="p-3 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        <h3 className="text-slate-900 font-bold text-sm sm:text-base leading-snug group-hover:text-[#185E3B] transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-slate-500 text-[11px] font-medium line-clamp-1 mt-0.5">
                          {service.desc}
                        </p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#185E3B]">
                        <span>Book Service</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: "Other Services" (Spacious 3x3 Circular Avatar Grid - Bharat Pattern) */}
        {filteredOtherServices.length > 0 && (
          <div className="px-5 mb-6">
            <div className="mb-3.5">
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight leading-snug">
                Other Services
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                More ways to get things done
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {filteredOtherServices.map(service => {
                const imgPath = serviceImageMap[service.id];
                return (
                  <div
                    key={service.id}
                    onClick={() => handleSelectService(service.name)}
                    className="flex flex-col items-center justify-between bg-white rounded-2xl py-3.5 px-2.5 sm:py-4 sm:px-3 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.96] group select-none text-center"
                    title={`Request ${service.name}`}
                  >
                    {/* Circular Bright Daylight Photo Frame with Breathing Space */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200/80 shadow-2xs group-hover:ring-3 group-hover:ring-[#185E3B]/25 transition-all shrink-0">
                      <img 
                        src={imgPath} 
                        alt={service.name} 
                        className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = `/images/services/clean/${service.id.replace('-', '_')}.jpg`;
                        }}
                      />
                    </div>
                    {/* Clear Label & Category Underneath */}
                    <div className="mt-2.5 flex flex-col items-center w-full">
                      <h3 className="text-slate-900 font-bold text-xs sm:text-[13px] leading-tight group-hover:text-[#185E3B] transition-colors truncate max-w-full">
                        {service.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5">
                        {service.desc.split(',')[0]}
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
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No services found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              We couldn't find matching services for "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#185E3B] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Clear Search
            </button>
          </div>
        )}

      </div>
  );
};
