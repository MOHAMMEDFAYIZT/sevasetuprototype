import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const sizeClasses = {
    sm: { svg: 'w-7 h-7', text: 'text-xl' },
    md: { svg: 'w-16 h-14', text: 'text-2xl' },
    lg: { svg: 'w-20 h-16', text: 'text-3xl' }
  };

  return (
    <div className="flex flex-col items-center select-none">
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
        <path d="M30 62L60 38L90 62" stroke="#185E3B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="52" y="52" width="6" height="6" rx="1" fill="#185E3B" />
        <rect x="62" y="52" width="6" height="6" rx="1" fill="#185E3B" />
        <rect x="52" y="62" width="6" height="6" rx="1" fill="#185E3B" />
        <rect x="62" y="62" width="6" height="6" rx="1" fill="#185E3B" />
      </svg>

      <h1 className={`${sizeClasses[size].text} font-extrabold text-brand-700 tracking-tight mt-1`}>
        Seva Setu
      </h1>

      {showTagline && (
        <p className="text-sm font-medium text-slate-500 mt-1">
          Skilled People. Stronger Communities.
        </p>
      )}
    </div>
  );
};
