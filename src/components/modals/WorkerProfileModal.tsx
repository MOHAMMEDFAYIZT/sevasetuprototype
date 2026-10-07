import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkerBadge } from '../common/WorkerBadge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  MapPin, 
  Heart, 
  Check, 
  Plus, 
  Wrench,
  Briefcase,
  X
} from 'lucide-react';

export const WorkerProfileModal: React.FC = () => {
  const { 
    profileWorker, 
    profileWorkerSource,
    closeWorkerProfile, 
    selectedWorkerIds, 
    toggleWorkerSelection,
    favourites, 
    toggleFavourite,
    draftJob,
    requestFavouriteDirectly,
    showToast
  } = useApp();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isServiceChoiceModalOpen, setIsServiceChoiceModalOpen] = useState(false);

  // Available skills / services for worker
  const availableSkills = (profileWorker?.skills && profileWorker.skills.length > 0)
    ? profileWorker.skills 
    : [profileWorker?.category || 'General'];

  // Reset states when profileWorker changes
  useEffect(() => {
    if (profileWorker) {
      setActiveSlide(0);
      setIsServiceChoiceModalOpen(false);
    }
  }, [profileWorker]);

  if (!profileWorker) return null;

  const isSelected = selectedWorkerIds.includes(profileWorker.id);
  const isFav = favourites.includes(profileWorker.id);
  const neededCount = draftJob.workersNeeded || 1;
  const isFavouritesMode = profileWorkerSource === 'favourites';

  // Slides: 1: Worker Photo, 2 & 3: Work showcase photos
  const slides = [
    { type: 'avatar', title: 'Main Profile' },
    { type: 'work1', title: 'Recent Project' },
    { type: 'work2', title: 'Work Sample' }
  ];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleToggleSelect = () => {
    if (!isSelected && selectedWorkerIds.length >= neededCount) {
      showToast(
        neededCount === 1
          ? 'You requested 1 worker. Unselect to choose someone else.'
          : `You requested ${neededCount} workers. Unselect one to choose someone else.`
      );
      return;
    }
    toggleWorkerSelection(profileWorker.id);
  };

  // Favourites Request Handler
  const handleFavouritesRequestClick = () => {
    if (availableSkills.length > 1) {
      setIsServiceChoiceModalOpen(true);
    } else {
      closeWorkerProfile();
      requestFavouriteDirectly(profileWorker.id, availableSkills[0]);
    }
  };

  const handleSelectServiceAndProceed = (serviceName: string) => {
    setIsServiceChoiceModalOpen(false);
    closeWorkerProfile();
    requestFavouriteDirectly(profileWorker.id, serviceName);
  };

  const aboutText = profileWorker.about || 
    `Specialist ${profileWorker.category.toLowerCase()} available for household repairs, installations, and maintenance in Palakkad and surrounding rural areas. Punctual, reliable, and carries own professional tools.`;

  return (
    <>
      <div 
        className="absolute inset-0 z-50 flex items-end justify-center bg-[rgba(15,40,28,0.45)] backdrop-blur-[5px] animate-fade-in"
        onClick={closeWorkerProfile}
      >
        {/* Native Bottom Sheet */}
        <div 
          className="w-full bg-white rounded-t-[32px] sm:rounded-t-[36px] shadow-[0_-12px_40px_rgba(10,50,30,0.25)] border-t border-[#E3ECE0] flex flex-col max-h-[82%] overflow-hidden animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Drag Pill & Header */}
          <div className="pt-2 pb-2.5 px-4 bg-white border-b border-[#F0F5EE] shrink-0 select-none">
            <div className="w-11 h-1 bg-[#CBD8CA] rounded-full mx-auto mb-2" />
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={closeWorkerProfile}
                className="w-9 h-9 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] border border-[#E3ECE0] flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-colors shadow-2xs active:scale-95 cursor-pointer"
                title="Close profile"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <h2 className="font-display text-sm font-bold text-[#16261E]">
                Worker Profile
              </h2>

              <button
                type="button"
                onClick={() => toggleFavourite(profileWorker.id)}
                className="w-9 h-9 rounded-full bg-[#F6FAF4] hover:bg-rose-50 border border-[#E3ECE0] flex items-center justify-center text-[#76857D] hover:text-rose-500 transition-colors shadow-2xs active:scale-95 cursor-pointer"
                title={isFav ? "Saved in favourites" : "Add to favourites"}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'stroke-[2]'}`} />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            
            {/* Hero Image Banner Carousel */}
            <div className="relative w-full h-60 rounded-2xl overflow-hidden bg-[#F6FAF4] border border-[#E3ECE0] shadow-2xs select-none flex items-center justify-center shrink-0">
              {activeSlide === 0 ? (
                profileWorker.avatar ? (
                  <img 
                    src={profileWorker.avatar} 
                    alt={profileWorker.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#E2F3DD] to-[#c7e9bf] flex flex-col items-center justify-center text-[#0A5A39]">
                    <div className="w-18 h-18 rounded-full bg-white shadow-md flex items-center justify-center font-display font-black text-3xl mb-1.5">
                      {profileWorker.initial}
                    </div>
                    <span className="font-display font-bold text-xs tracking-wide uppercase">
                      {profileWorker.category}
                    </span>
                  </div>
                )
              ) : (
                /* Work Sample Showcase Slide */
                <div className="w-full h-full bg-gradient-to-br from-[#F6FAF4] to-[#E3ECE0] flex flex-col items-center justify-center p-5 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-[#0C6B44] mb-2">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-[#16261E]">
                    Completed {profileWorker.category} Work
                  </h4>
                  <p className="text-[11px] text-[#76857D] mt-0.5">
                    Verified job done in Palakkad rural zone
                  </p>
                </div>
              )}

              {/* Carousel Arrows */}
              <button 
                type="button" 
                onClick={handlePrevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#16261E] flex items-center justify-center shadow-md transition-all cursor-pointer"
                title="Previous image"
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <button 
                type="button" 
                onClick={handleNextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#16261E] flex items-center justify-center shadow-md transition-all cursor-pointer"
                title="Next image"
              >
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5">
                {slides.map((_, idx) => (
                  <span 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeSlide ? 'w-4 bg-[#0C6B44]' : 'w-1.5 bg-white/80 shadow-2xs'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Identity & Tier Badge */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-xl font-bold text-[#16261E] leading-snug">
                  {profileWorker.name}
                </h3>
                <WorkerBadge 
                  tier={profileWorker.badgeTier || 'Gold'} 
                  points={profileWorker.badgePoints || 500} 
                  size="sm" 
                />
              </div>

              {/* Metrics row */}
              <div className="flex items-center gap-2 text-xs text-[#4F6057] font-medium">
                <span className="flex items-center gap-1 text-[#16261E] font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#E0A800] text-[#E0A800] stroke-none shrink-0" />
                  <span>{profileWorker.rating}</span>
                </span>
                <span className="text-[#CBD8CA]">•</span>
                <span className="flex items-center gap-1 text-[#76857D]">
                  <MapPin className="w-3.5 h-3.5 text-[#0C6B44] shrink-0" />
                  <span>{profileWorker.distance} km away</span>
                </span>
                <span className="text-[#CBD8CA]">•</span>
                <span className="flex items-center gap-1 text-[#76857D]">
                  <Briefcase className="w-3.5 h-3.5 text-[#76857D] shrink-0" />
                  <span>{profileWorker.completedJobsCount || profileWorker.reviewsCount || 24} jobs done</span>
                </span>
              </div>
            </div>

            {/* MODE 1: WORKERS LIST PROFILE (Clean Reverted Original State) */}
            {!isFavouritesMode && (
              <>
                {/* Services Offered - Static Badges */}
                <div className="pt-3 border-t border-[#F0F5EE] space-y-1.5">
                  <span className="text-[11px] font-bold text-[#76857D] uppercase tracking-wider block">
                    Services Offered
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSkills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-3 py-1.5 rounded-xl bg-[#F6FAF4] text-[#16261E] border border-[#CBD8CA] text-xs font-bold select-none"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Wage Rates - Standard Hourly & Daily Cards */}
                <div className="pt-3 border-t border-[#F0F5EE] space-y-1.5">
                  <span className="text-[11px] font-bold text-[#76857D] uppercase tracking-wider block">
                    Wage Rates
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#E2F3DD] rounded-xl px-3 py-2 text-center">
                      <span className="text-[10px] text-[#4F6057] font-semibold block leading-tight">Hourly Rate</span>
                      <span className="font-display font-bold text-sm text-[#0C6B44] block mt-0.5">{profileWorker.wage}</span>
                    </div>
                    <div className="flex-1 bg-[#E2F3DD] rounded-xl px-3 py-2 text-center">
                      <span className="text-[10px] text-[#4F6057] font-semibold block leading-tight">Daily Wage</span>
                      <span className="font-display font-bold text-sm text-[#0C6B44] block mt-0.5">{profileWorker.dailyWage}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* MODE 2: FAVOURITES PROFILE (Services & Wages Listed Separately, NO redundant buttons) */}
            {isFavouritesMode && (
              <div className="pt-3 border-t border-[#F0F5EE] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#76857D] uppercase tracking-wider block">
                    Services & Wages
                  </span>
                  <span className="text-[10px] text-[#76857D] font-medium">
                    Separate rates per service
                  </span>
                </div>

                <div className="space-y-2">
                  {availableSkills.map((skill) => {
                    const rates = profileWorker.serviceWages?.[skill] || {
                      hourly: profileWorker.wage || '₹200/hr',
                      daily: profileWorker.dailyWage || '₹850/day'
                    };

                    return (
                      <div 
                        key={skill}
                        className="p-3.5 rounded-2xl border border-[#E3ECE0] bg-[#F6FAF4] select-none"
                      >
                        <span className="font-display font-bold text-sm text-[#16261E] block">
                          {skill}
                        </span>

                        {/* Separate rates clearly listed */}
                        <div className="flex items-center gap-2 mt-1.5 text-xs">
                          <span className="font-semibold text-[#0C6B44] bg-[#E2F3DD] px-2.5 py-0.5 rounded-md text-[11px]">
                            {rates.hourly}
                          </span>
                          <span className="text-[#CBD8CA]">•</span>
                          <span className="font-semibold text-[#0C6B44] bg-[#E2F3DD] px-2.5 py-0.5 rounded-md text-[11px]">
                            {rates.daily}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* About Section */}
            <div className="pt-3 border-t border-[#F0F5EE] space-y-1">
              <span className="text-[11px] font-bold text-[#76857D] uppercase tracking-wider block">
                About
              </span>
              <p className="text-xs text-[#4F6057] leading-relaxed font-normal">
                {aboutText}
              </p>
            </div>

          </div>

          {/* BOTTOM PINNED ACTION DOCK */}
          
          {/* Dock for Workers List: ONLY SELECT BUTTON */}
          {!isFavouritesMode && (
            <div className="p-3.5 bg-white border-t border-[#E3ECE0] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] shrink-0">
              <button
                type="button"
                onClick={handleToggleSelect}
                className={`w-full h-12 rounded-full font-display font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-md ${
                  isSelected
                    ? 'bg-[#E2F3DD] text-[#0C6B44] border-2 border-[#3AAA48]'
                    : 'bg-[#0C6B44] hover:bg-[#0A5A39] text-white shadow-[0_4px_14px_rgba(10,90,57,0.28)]'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Selected for Request (Tap to Remove)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Select {profileWorker.name.split(' ')[0]}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Dock for Favourites: ONLY SINGLE SIMPLE REQUEST BUTTON */}
          {isFavouritesMode && (
            <div className="p-3.5 bg-white border-t border-[#E3ECE0] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] shrink-0">
              <button
                type="button"
                onClick={handleFavouritesRequestClick}
                className="w-full h-12 rounded-full font-display font-bold text-sm bg-[#0C6B44] hover:bg-[#0A5A39] text-white flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(10,90,57,0.28)] transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Request {profileWorker.name}</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Centered Service Choice Modal for Multi-Trade Workers */}
      {isServiceChoiceModalOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setIsServiceChoiceModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E3ECE0] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E3ECE0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E2F3DD] text-[#0C6B44] flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-[#16261E]">
                    Select Service
                  </h3>
                  <p className="text-[11px] text-[#76857D]">
                    for {profileWorker.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsServiceChoiceModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] flex items-center justify-center text-[#76857D] hover:text-[#16261E] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Prompt description */}
            <p className="text-xs text-[#4F6057] mt-3 mb-2.5 font-normal">
              {profileWorker.name} offers multiple services. Which service do you need help with?
            </p>

            {/* Service Options List */}
            <div className="space-y-2 py-1">
              {availableSkills.map((skill) => {
                const wageInfo = profileWorker.serviceWages?.[skill] || {
                  hourly: profileWorker.wage,
                  daily: profileWorker.dailyWage || '₹850/day'
                };

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSelectServiceAndProceed(skill)}
                    className="w-full p-3 rounded-2xl border border-[#E3ECE0] hover:border-[#0C6B44] bg-[#F6FAF4] hover:bg-[#E2F3DD]/40 flex items-center justify-between transition-all cursor-pointer text-left group"
                  >
                    <div>
                      <span className="font-display text-sm font-bold text-[#16261E] group-hover:text-[#0C6B44] block">
                        {skill}
                      </span>
                      <span className="text-[11px] text-[#4F6057] mt-0.5 block font-medium">
                        {wageInfo.hourly} • {wageInfo.daily}
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-white group-hover:bg-[#0C6B44] text-[#76857D] group-hover:text-white border border-[#E3ECE0] flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
