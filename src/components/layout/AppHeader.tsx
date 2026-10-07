import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Languages, Bell, Check, X } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { user, showToast, language, setLanguage } = useApp();
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  return (
    <header className="sticky top-0 z-30 bg-[#F1F7F3]/95 backdrop-blur-md border-b border-[#E2EFE6] px-4 sm:px-5 py-2.5 flex items-center justify-between select-none shadow-[0_2px_12px_rgba(24,94,59,0.04)] w-full transition-colors">
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
          onClick={() => setIsLangOpen(true)}
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

      {/* Language Switcher Modal */}
      {isLangOpen && (
        <div 
          className="absolute inset-0 z-50 flex items-end justify-center bg-[rgba(15,40,28,0.4)] backdrop-blur-[4px] animate-fade-in p-0"
          onClick={() => setIsLangOpen(false)}
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
                onClick={() => setIsLangOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] border border-[#E3ECE0] flex items-center justify-center text-[#76857D] hover:text-[#16261E] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            <div className="space-y-2.5 my-4">
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setIsLangOpen(false);
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

              <button
                type="button"
                onClick={() => {
                  setLanguage('hi');
                  setIsLangOpen(false);
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


    </header>
  );
};
