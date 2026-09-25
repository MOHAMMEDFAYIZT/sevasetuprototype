import React from 'react';

export const RuralBackdrop: React.FC = () => {
  return (
    <div className="w-full mt-auto pointer-events-none select-none overflow-hidden">
      <svg 
        className="w-full h-auto block" 
        viewBox="0 0 400 135" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Glowing Sun */}
        <circle cx="340" cy="55" r="28" fill="#FDF3DE" />
        
        {/* Distant Rolling Hills */}
        <path d="M-20 100C40 70 120 75 190 90C260 105 340 70 420 85V140H-20V100Z" fill="#E4EFE8" />
        
        {/* Middle Hills & Temple Gopuram & Cottages */}
        <path d="M-20 115C60 95 150 105 230 110C310 115 370 100 420 108V140H-20V115Z" fill="#D3E5DB" />
        
        {/* Temple Gopuram Outline on right */}
        <path d="M330 112L333 88L337 88L339 74L342 74L344 65L346 65L347 58L349 58L350 65L352 65L354 74L357 74L359 88L363 88L366 112Z" fill="#C2D8CD" />
        
        {/* Village Cottage */}
        <path d="M60 118L74 106L88 118H60Z" fill="#B5CEBF" />
        <rect x="63" y="118" width="22" height="14" fill="#C7DDD1" />
        <rect x="71" y="122" width="6" height="10" fill="#9FBCA9" />
        
        {/* Coconut Palm Trees */}
        <path d="M35 125C38 105 36 90 32 75" stroke="#9FBCA9" strokeWidth="3" strokeLinecap="round" />
        <path d="M32 75C22 68 10 70 4 78" stroke="#9FBCA9" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 75C28 62 18 55 10 58" stroke="#9FBCA9" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 75C34 60 42 54 52 56" stroke="#9FBCA9" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 75C42 66 52 70 58 80" stroke="#9FBCA9" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Foreground Ground Wave */}
        <path d="M-20 126C80 120 180 124 280 122C340 120 390 124 420 122V140H-20V126Z" fill="#C5DDD0" />
      </svg>
    </div>
  );
};
