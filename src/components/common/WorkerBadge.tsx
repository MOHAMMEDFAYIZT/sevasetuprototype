import React from 'react';

export type BadgeTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

interface WorkerBadgeProps {
  tier?: BadgeTier;
  points?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const TIER_CONFIG: Record<BadgeTier, {
  name: string;
  points: number;
  bg: string;
  border: string;
  text: string;
  iconBg: string;
  iconColor: string;
}> = {
  Bronze: {
    name: 'Bronze',
    points: 0,
    bg: 'bg-[#FDF5ED]',
    border: 'border-[#F1D5BD]',
    text: 'text-[#9A4F1D]',
    iconBg: '#C2733E',
    iconColor: '#FFFFFF'
  },
  Silver: {
    name: 'Silver',
    points: 200,
    bg: 'bg-[#F1F5F9]',
    border: 'border-[#CBD5E1]',
    text: 'text-[#334155]',
    iconBg: '#64748B',
    iconColor: '#FFFFFF'
  },
  Gold: {
    name: 'Gold',
    points: 500,
    bg: 'bg-[#FEF9E7]',
    border: 'border-[#FDE047]',
    text: 'text-[#B45309]',
    iconBg: '#D97706',
    iconColor: '#FFFFFF'
  },
  Platinum: {
    name: 'Platinum',
    points: 1000,
    bg: 'bg-[#E2F3DD]',
    border: 'border-[#A7D8A1]',
    text: 'text-[#0A5A39]',
    iconBg: '#0C6B44',
    iconColor: '#FFFFFF'
  },
  Diamond: {
    name: 'Diamond',
    points: 2000,
    bg: 'bg-[#E0F2FE]',
    border: 'border-[#BAE6FD]',
    text: 'text-[#0369A1]',
    iconBg: '#0284C7',
    iconColor: '#FFFFFF'
  }
};

export const HexagonStarIcon: React.FC<{ color: string; starColor?: string; className?: string }> = ({ 
  color, 
  starColor = '#FFFFFF',
  className = 'w-6 h-6' 
}) => {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hexagon shape matching user reference image */}
      <polygon 
        points="20,3 35,11 35,29 20,37 5,29 5,11" 
        fill={color} 
        stroke={color} 
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Centered star */}
      <path 
        d="M20 12.5L22.2 17.5L27.5 18.1L23.5 21.7L24.6 27L20 24.2L15.4 27L16.5 21.7L12.5 18.1L17.8 17.5L20 12.5Z" 
        fill={starColor} 
      />
    </svg>
  );
};

export const WorkerBadge: React.FC<WorkerBadgeProps> = ({ tier = 'Silver', points, size = 'md' }) => {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.Silver;
  const displayPoints = points !== undefined ? points : config.points;

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${config.bg} ${config.border} ${config.text} text-[11px] font-bold shadow-2xs`}>
        <HexagonStarIcon color={config.iconBg} starColor={config.iconColor} className="w-3.5 h-3.5 shrink-0" />
        <span>{config.name}</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border ${config.bg} ${config.border} shadow-2xs`}>
      <HexagonStarIcon color={config.iconBg} starColor={config.iconColor} className="w-7 h-7 shrink-0" />
      <div className="flex flex-col text-left leading-tight">
        <span className={`text-xs font-black uppercase tracking-wider ${config.text}`}>
          {config.name} Badge
        </span>
        <span className="text-[10px] text-[#76857D] font-medium">
          {displayPoints} Seva points
        </span>
      </div>
    </div>
  );
};

