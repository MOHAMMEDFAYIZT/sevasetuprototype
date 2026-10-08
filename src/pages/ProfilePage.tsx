import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  MapPin, 
  LogOut, 
  ShieldCheck,
  History,
  Headphones,
  FileText,
  Globe,
  Pencil
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { 
    user, 
    updateUser, 
    jobs, 
    showToast, 
    language, 
    setLanguage 
  } = useApp();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || 'Citizen User');
  const [phone, setPhone] = useState(user.phone || '94471 23456');

  // Sub-view states for Help & Support / Terms & Conditions
  const [activeSubView, setActiveSubView] = useState<'help' | 'terms' | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const pastCount = jobs.filter(j => 
    j.status === 'completed' || j.status === 'cancelled' || j.status === 'unfilled'
  ).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty');
      return;
    }
    updateUser({ name: name.trim(), phone: phone.trim() });
    setIsEditing(false);
    showToast('Profile updated successfully');
  };

  const handleLogout = () => {
    updateUser({ isLoggedIn: false });
    navigate('/login');
  };

  // FAQ data from seva_setu_customer_FINAL_v6 1.html
  const FAQ_ITEMS = [
    {
      q: 'How does worker booking work?',
      a: 'Choose your craft service, set your preferred arrival time (defaults to next 30 mins for urgent needs), and explain your work. Your request is immediately broadcasted to verified local workers.'
    },
    {
      q: 'What if a worker does not respond in time?',
      a: 'Immediate requests auto-expire after 3 hours if no workers respond so you aren\'t left waiting. You can tap "+ Request More Workers" to reach additional specialists nearby.'
    },
    {
      q: 'Can I hire multiple workers for the same job?',
      a: 'Yes! For large tasks like harvesting, painting, or construction, you can select multiple workers. Every worker who accepts is assigned to your job.'
    },
    {
      q: 'How are wages paid?',
      a: 'Payment is made directly to the worker via UPI or Cash once the job is completed to your satisfaction, following the transparent rates on their profile.'
    },
    {
      q: 'What if the worker does not come?',
      a: 'Open the job in My Jobs and tap "Request More" to send it to other nearby workers. You can also call support and we will help you find someone.'
    },
    {
      q: 'How do I cancel a job?',
      a: 'Open the job from My Jobs and slide to "Cancel Job". There is no charge for cancelling before the worker starts.'
    }
  ];

  // Terms & Conditions data from seva_setu_customer_FINAL_v6 1.html
  const TERMS_ITEMS = [
    {
      title: 'Using Seva Setu',
      body: 'Seva Setu connects you with independent local workers. Workers are not employees of Seva Setu; you agree the work, time and price directly with them.'
    },
    {
      title: 'Requests & timing',
      body: 'Requests for today expire after 3 hours if no worker accepts. You can send the request to more workers at any time.'
    },
    {
      title: 'Payments',
      body: 'Pay the worker directly by cash or UPI after the work is done, at the rate shown on their profile unless you agree otherwise.'
    },
    {
      title: 'Your location & notes',
      body: 'Your location is used only to find nearby workers and to fill the job address. Voice notes and instructions are shared only with the workers you send the request to.'
    },
    {
      title: 'Safety',
      body: 'All workers are verified with Aadhaar and their Panchayat. Please report any problem to support on 1800-425-0001.'
    }
  ];

  // SUB-VIEW 1: HELP & SUPPORT PAGE (from reference HTML)
  if (activeSubView === 'help') {
    return (
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col px-4 sm:px-5 pt-0 pb-32 min-h-full relative">
        {/* Back button at the top (exact match to WorkersListPage) */}
        <button
          type="button"
          onClick={() => setActiveSubView(null)}
          className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-all cursor-pointer border border-white shadow-[0_2px_8px_rgba(16,60,38,0.06)] active:scale-95"
          title="Back to Profile"
          aria-label="Back to Profile"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Header title at mt-22 starting at the same level as the cards */}
        <div className="mt-22 mb-3 select-none">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#16261E] tracking-tight leading-tight">
            Support
          </h1>
          <p className="text-xs text-[#4F6057] font-medium mt-0.5">
            How can we help you?
          </p>
        </div>

        <div className="space-y-3">
          {/* Call Support Card */}
          <a
            href="tel:18004250001"
            onClick={() => showToast('Calling support: 1800-425-0001...')}
            className="glass rounded-2xl p-3.5 sm:p-4 border border-white flex items-center justify-between gap-3 shadow-2xs hover:border-[#0C6B44] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Exact worker phone spark icon */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E2F3DD] to-[#CDEBB9] text-[#0C6B44] flex items-center justify-center shrink-0 shadow-2xs border border-[#CBD8CA]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="font-display text-[15px] font-semibold text-[#16261E] group-hover:text-[#0C6B44] transition-colors leading-snug">
                  Call support
                </h4>
                <p className="text-xs text-[#76857D] font-normal mt-0.5 leading-snug">
                  Free call, every day 8 AM – 8 PM (1800-425-0001)
                </p>
              </div>
            </div>
            {/* Worker upright arrow icon */}
            <div className="w-8 h-8 rounded-full bg-[#F6FAF4] border border-[#CBD8CA] text-[#76857D] group-hover:text-[#0C6B44] group-hover:border-[#0C6B44] flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7"/><path d="M8 7h9v9"/>
              </svg>
            </div>
          </a>

          {/* Chat Support Card */}
          <button
            type="button"
            onClick={() => showToast('Opening Seva Setu chat support...')}
            className="w-full glass rounded-2xl p-3.5 sm:p-4 border border-white flex items-center justify-between gap-3 shadow-2xs hover:border-[#0C6B44] transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Exact worker message bubble spark icon */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E2F3DD] to-[#CDEBB9] text-[#0C6B44] flex items-center justify-center shrink-0 shadow-2xs border border-[#CBD8CA]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="font-display text-[15px] font-semibold text-[#16261E] group-hover:text-[#0C6B44] transition-colors leading-snug">
                  Chat with us
                </h4>
                <p className="text-xs text-[#76857D] font-normal mt-0.5 leading-snug">
                  Send a message, we reply fast
                </p>
              </div>
            </div>
            {/* Worker upright arrow icon */}
            <div className="w-8 h-8 rounded-full bg-[#F6FAF4] border border-[#CBD8CA] text-[#76857D] group-hover:text-[#0C6B44] group-hover:border-[#0C6B44] flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7"/><path d="M8 7h9v9"/>
              </svg>
            </div>
          </button>

          {/* Common Questions (Accordion) */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-semibold text-[#76857D] uppercase tracking-wider block px-1">
              Common questions
            </span>

            <div className="glass rounded-2xl border border-white overflow-hidden divide-y divide-[#F0F5EE] shadow-2xs">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="p-3.5">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left gap-2 cursor-pointer"
                    >
                      <span className="font-display text-xs sm:text-sm font-semibold text-[#16261E]">
                        {item.q}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#76857D] transition-transform shrink-0 ${isOpen ? 'rotate-180 text-[#0C6B44]' : ''}`} />
                    </button>
                    {isOpen && (
                      <p className="text-xs text-[#4F6057] font-normal leading-relaxed mt-2 pt-2 border-t border-[#F0F5EE] animate-fade-in">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generous empty space at the bottom so last item never touches the bottom window of phone */}
          <div className="h-16 sm:h-20 w-full shrink-0" aria-hidden="true" />
        </div>
      </div>
    );
  }

  // SUB-VIEW 2: TERMS & CONDITIONS PAGE (from reference HTML)
  if (activeSubView === 'terms') {
    return (
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col px-4 sm:px-5 pt-0 pb-32 min-h-full relative">
        {/* Back button at the top (exact match to WorkersListPage) */}
        <button
          type="button"
          onClick={() => setActiveSubView(null)}
          className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-all cursor-pointer border border-white shadow-[0_2px_8px_rgba(16,60,38,0.06)] active:scale-95"
          title="Back to Profile"
          aria-label="Back to Profile"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Header title at mt-22 starting at the same level as the cards */}
        <div className="mt-22 mb-3 select-none">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#16261E] tracking-tight leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-[#4F6057] font-medium mt-0.5">
            Platform terms and guidelines
          </p>
        </div>

        <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-white shadow-xs space-y-4">
          {TERMS_ITEMS.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="font-display text-xs sm:text-sm font-bold text-[#16261E]">
                {idx + 1}. {item.title}
              </h4>
              <p className="text-xs text-[#4F6057] font-normal leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}

          {/* Generous empty space at the bottom so last item never touches the bottom window of phone */}
          <div className="h-16 sm:h-20 w-full shrink-0" aria-hidden="true" />
        </div>
      </div>
    );
  }

  // MAIN PROFILE VIEW
  return (
    <div className="w-full max-w-xl mx-auto flex-1 flex flex-col px-3.5 sm:px-4 pt-3 pb-32">
      {/* Page Header (Starts mt-22 from top) */}
      <div className="mt-13 mb-3.5 select-none">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-[#16261E] tracking-tight leading-tight">
          Profile
        </h1>
        <p className="text-xs text-[#4F6057] font-medium mt-0.5">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-3.5">
        {/* 1. User Account Card (Edit Name & Phone only - NO Address field here) */}
        <div className="glass rounded-2xl sm:rounded-3xl p-4 border border-white shadow-[0_6px_20px_rgba(16,60,38,0.06)]">
          {!isEditing ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-13 h-13 rounded-2xl bg-[#E2F3DD] border border-[#CBD8CA] flex items-center justify-center text-[#0A5A39] font-display text-xl font-bold shrink-0 shadow-2xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-display text-base font-bold text-[#16261E] leading-tight truncate">
                      {user.name || 'Citizen User'}
                    </h2>
                    <ShieldCheck className="w-4 h-4 text-[#0C6B44] shrink-0" />
                  </div>
                  <p className="text-xs text-[#4F6057] font-medium mt-0.5">
                    +91 {user.phone || '94471 23456'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-9 h-9 rounded-full bg-white hover:bg-[#E2F3DD] border border-[#CBD8CA] flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-colors cursor-pointer shrink-0 shadow-2xs active:scale-95"
                title="Edit profile"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#16261E] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#CBD8CA] bg-white focus:border-[#0C6B44] text-xs font-semibold text-[#16261E] outline-none"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#16261E] uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#CBD8CA] bg-white focus:border-[#0C6B44] text-xs font-semibold text-[#16261E] outline-none"
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 h-9 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName(user.name || 'Citizen User');
                    setPhone(user.phone || '94471 23456');
                    setIsEditing(false);
                  }}
                  className="px-4 h-9 rounded-full bg-white hover:bg-[#F6FAF4] text-[#4F6057] border border-[#CBD8CA] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 2. Language Card (Matching User Reference Image) */}
        <div className="glass rounded-2xl sm:rounded-3xl p-4 border border-white shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F6FAF4] border border-[#E3ECE0] flex items-center justify-center text-[#0C6B44] shrink-0">
              <Globe className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h3 className="font-display text-sm font-bold text-[#16261E]">
              Language
            </h3>
          </div>

          {/* Pill segmented control matching reference image */}
          <div className="w-full h-11 p-1 rounded-full bg-white border border-[#CBD8CA] flex items-center gap-1 select-none">
            <button
              type="button"
              onClick={() => {
                setLanguage('en');
                showToast('Language changed to English');
              }}
              className={`flex-1 h-full rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                language === 'en'
                  ? 'bg-[#0C6B44] text-white shadow-2xs'
                  : 'text-[#4F6057] hover:text-[#16261E]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => {
                setLanguage('hi');
                showToast('भाषा बदलकर हिंदी कर दी गई');
              }}
              className={`flex-1 h-full rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                language === 'hi'
                  ? 'bg-[#0C6B44] text-white shadow-2xs'
                  : 'text-[#4F6057] hover:text-[#16261E]'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* 3. Action Menu List (Saved Addresses, Past Works, Support, Terms) */}
        <div className="glass rounded-2xl sm:rounded-3xl border border-white p-2 shadow-[0_4px_16px_rgba(16,60,38,0.06)] divide-y divide-[#F0F5EE]">
          
          {/* Saved Addresses (Opens the dedicated Zomato-style location page) */}
          <button
            type="button"
            onClick={() => navigate('/addresses')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F6FAF4] transition-colors rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#E2F3DD] text-[#0C6B44] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="font-display text-sm font-bold text-[#16261E]">
                <span>Saved Addresses</span>
                <span className="text-xs text-[#76857D] font-normal block mt-0.5">
                  Manage home, farm and delivery locations
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#76857D] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          {/* Past Works Button */}
          <button
            type="button"
            onClick={() => navigate('/past-jobs')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F6FAF4] transition-colors rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#E2F3DD] text-[#0C6B44] flex items-center justify-center shrink-0">
                <History className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="font-display text-sm font-bold text-[#16261E] flex items-center gap-2">
                <span>Past Works</span>
                <span className="text-[10px] bg-[#E2F3DD] text-[#0A5A39] font-bold px-2 py-0.5 rounded-full">
                  {pastCount}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#76857D] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          {/* Help & Support */}
          <button
            type="button"
            onClick={() => setActiveSubView('help')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F6FAF4] transition-colors rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#E2F3DD] text-[#0C6B44] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-display text-sm font-bold text-[#16261E]">
                Help & Support
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#76857D] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          {/* Terms & Conditions */}
          <button
            type="button"
            onClick={() => setActiveSubView('terms')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F6FAF4] transition-colors rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#E2F3DD] text-[#0C6B44] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-display text-sm font-bold text-[#16261E]">
                Terms & Conditions
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#76857D] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          {/* Log Out */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-rose-50 transition-colors rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-display text-sm font-bold text-rose-600">
                Log Out
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

        </div>
      </div>
    </div>
  );
};
