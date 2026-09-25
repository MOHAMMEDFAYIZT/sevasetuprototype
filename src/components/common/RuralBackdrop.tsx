import React from 'react';

interface RuralBackdropProps {
  showPeople?: boolean;
  className?: string;
}

export const RuralBackdrop: React.FC<RuralBackdropProps> = ({ 
  showPeople = false, 
  className = '' 
}) => {
  return (
    <div className={`w-full mt-auto pointer-events-none select-none overflow-hidden relative ${className}`}>
      <img 
        src={showPeople ? '/images/splash_people.png' : '/images/rural_bg.png'} 
        alt="Rural Landscape" 
        className="w-full h-auto object-cover object-bottom block"
        loading="eager"
      />
    </div>
  );
};

