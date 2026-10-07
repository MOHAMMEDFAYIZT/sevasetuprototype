import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RequestConfirmedModal: React.FC = () => {
  const { sentJobConfirmation, closeSentJobConfirmation } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (sentJobConfirmation) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback if canvas-confetti is unavailable
      }
    }
  }, [sentJobConfirmation]);

  if (!sentJobConfirmation) return null;

  const { jobId, workerCount, category } = sentJobConfirmation;

  const handleViewDetails = () => {
    closeSentJobConfirmation();
    navigate(`/jobs/${jobId}`);
  };

  const handleGoToJobs = () => {
    closeSentJobConfirmation();
    navigate('/jobs');
  };

  return (
    <div 
      className="absolute inset-0 z-50 flex items-end justify-center bg-[rgba(15,40,28,0.45)] backdrop-blur-[6px] animate-fade-in p-0"
      onClick={closeSentJobConfirmation}
    >
      <div 
        className="relative w-full bg-white rounded-t-[36px] p-6 sm:p-7 shadow-[0_-12px_40px_rgba(10,50,30,0.3)] border-t border-[#E3ECE0] animate-slide-up flex flex-col items-center text-center overflow-hidden max-h-[85%]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Festive Confetti Decorative Header (Matching Image 2) */}
        <div className="absolute top-2 inset-x-0 flex justify-center pointer-events-none select-none opacity-85">
          <svg className="w-56 h-12" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="15" r="4" fill="#9333EA" />
            <rect x="45" y="8" width="6" height="6" rx="2" fill="#F59E0B" transform="rotate(25 45 8)" />
            <path d="M75 12C78 6 84 8 86 14C88 20 83 24 78 22" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            <polygon points="105,8 112,5 110,14" fill="#EF4444" />
            <polygon points="135,16 138,9 143,14 140,20" fill="#EAB308" />
            <circle cx="165" cy="18" r="4" fill="#3B82F6" />
            <rect x="180" y="10" width="8" height="4" rx="2" fill="#F97316" transform="rotate(45 180 10)" />
          </svg>
        </div>

        {/* Big Circular Green Check Icon */}
        <div className="w-18 h-18 rounded-full bg-[#E2F3DD] text-[#0C6B44] border-4 border-white shadow-md flex items-center justify-center mt-4 mb-4">
          <Check className="w-9 h-9 stroke-[3]" />
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl font-bold text-[#16261E] tracking-tight mb-2">
          Request Sent!
        </h3>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#4F6057] leading-relaxed max-w-[310px] mb-7">
          We have sent your request to <strong className="text-[#0A5A39] font-bold">{workerCount} {category} worker{workerCount > 1 ? 's' : ''}</strong>. You will receive an update as soon as they accept.
        </p>

        {/* Action Buttons (Matching Image 2 layout) */}
        <div className="w-full space-y-3">
          {/* Outlined Button: View Job Details */}
          <button
            type="button"
            onClick={handleViewDetails}
            className="w-full h-12 rounded-full border-2 border-[#0C6B44] text-[#0C6B44] hover:bg-[#E2F3DD]/40 font-display font-semibold text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>View Job Details</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Filled Green Button: Go to My Jobs */}
          <button
            type="button"
            onClick={handleGoToJobs}
            className="w-full h-12 rounded-full bg-[#0C6B44] hover:bg-[#0A5A39] text-white font-display font-semibold text-sm shadow-[0_8px_20px_rgba(10,90,57,0.25)] transition-all active:scale-[0.98] cursor-pointer"
          >
            Go to My Jobs
          </button>
        </div>

      </div>
    </div>
  );
};
