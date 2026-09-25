import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  customTagline?: string;
  variant?: 'standard' | 'leaf';
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showTagline = false,
  customTagline,
  variant = 'standard'
}) => {
  if (variant === 'leaf') {
    return (
      <div className="flex items-center gap-2 select-none">
        {/* Exact Double-leaf symbol */}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center">
          <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
            {/* Left large leaf */}
            <path 
              d="M6 22C6 14 12 7 22 6C22 14 16 21 6 22Z" 
              fill="#207348" 
            />
            {/* Right smaller leaf */}
            <path 
              d="M17 19C17 14 20 10 26 9C26 14 23 18 17 19Z" 
              fill="#34A853" 
            />
          </svg>
        </div>
        <div className="flex items-baseline">
          <span className="text-[22px] font-medium text-[#113B24] tracking-tight">
            Seva
          </span>
          <span className="text-[22px] font-black text-[#1B5E3C] tracking-tight ml-1">
            Sethu
          </span>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    sm: { svg: 'w-8 h-8', text: 'text-xl' },
    md: { svg: 'w-16 h-14', text: 'text-2xl' },
    lg: { svg: 'w-24 h-20', text: 'text-3xl' },
    xl: { svg: 'w-28 h-24', text: 'text-4xl' }
  };

  const tagline = customTagline || 'Skilled People. Stronger Communities.';

  return (
    <div className="flex flex-col items-center select-none text-center">
      <div className="relative">
        <svg 
          className={`${sizeClasses[size].svg} transition-transform duration-200`} 
          viewBox="0 0 120 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Person (Green) */}
          <circle cx="38" cy="22" r="10" fill="#185E3B" />
          <path d="M18 64C18 44 26 34 46 34C60 34 68 46 72 58C62 50 48 48 38 52C28 56 22 64 18 64Z" fill="#185E3B" />
          
          {/* Right Person (Warm Saffron / Orange) */}
          <circle cx="82" cy="22" r="10" fill="#E88A1A" />
          <path d="M102 64C102 44 94 34 74 34C60 34 52 46 48 58C58 50 72 48 82 52C92 56 98 64 102 64Z" fill="#E88A1A" />
          
          {/* House Roof Arch & 4 Window Tiles */}
          <path d="M30 62L60 38L90 62" stroke="#185E3B" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="52" y="52" width="6.5" height="6.5" rx="1" fill="#185E3B" />
          <rect x="62" y="52" width="6.5" height="6.5" rx="1" fill="#185E3B" />
          <rect x="52" y="62" width="6.5" height="6.5" rx="1" fill="#185E3B" />
          <rect x="62" y="62" width="6.5" height="6.5" rx="1" fill="#185E3B" />
        </svg>
      </div>

      <h1 className={`${sizeClasses[size].text} font-black text-[#1B5E3C] tracking-tight mt-1`}>
        Seva Sethu
      </h1>

      {showTagline && (
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 max-w-xs">
          {tagline}
        </p>
      )}
    </div>
  );
};
