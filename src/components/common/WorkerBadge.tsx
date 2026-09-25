import React from 'react';

export type BadgeType = 'gold-crown' | 'gold-star' | 'silver-star' | 'bronze-star';

export interface BadgeInfo {
  type: BadgeType;
  name: string;
  label: string;
  tooltip: string;
}

export function getWorkerBadge(rating: number): BadgeInfo {
  if (rating >= 4.9) {
    return {
      type: 'gold-crown',
      name: 'Gold Crown',
      label: 'Top Tier',
      tooltip: 'Gold Crown Worker • 4.9+ Outstanding Rating'
    };
  } else if (rating >= 4.8) {
    return {
      type: 'gold-star',
      name: 'Gold Star',
      label: 'Gold',
      tooltip: 'Gold Star Worker • 4.8+ Top Rated'
    };
  } else if (rating >= 4.6) {
    return {
      type: 'silver-star',
      name: 'Silver Star',
      label: 'Silver',
      tooltip: 'Silver Star Worker • 4.6+ Highly Rated'
    };
  } else {
    return {
      type: 'bronze-star',
      name: 'Bronze Star',
      label: 'Bronze',
      tooltip: 'Bronze Star Worker • 4.4+ Verified Service'
    };
  }
}

interface WorkerBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

export const WorkerBadge: React.FC<WorkerBadgeProps> = ({
  rating,
  size = 'md',
  className = '',
  showTooltip = true
}) => {
  const badge = getWorkerBadge(rating);

  // Size configurations
  const dimensions = {
    sm: { width: 18, height: 21 },
    md: { width: 22, height: 25 },
    lg: { width: 28, height: 32 }
  }[size];

  return (
    <div 
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      title={showTooltip ? badge.tooltip : undefined}
    >
      <svg 
        width={dimensions.width} 
        height={dimensions.height} 
        viewBox="0 0 24 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
      >
        <defs>
          {/* Gold Star Gradient */}
          <linearGradient id="goldHexGrad" x1="4" y1="2" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Silver Star Gradient */}
          <linearGradient id="silverHexGrad" x1="4" y1="2" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Bronze Star Gradient */}
          <linearGradient id="bronzeHexGrad" x1="4" y1="2" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Crown Hex Gradient */}
          <linearGradient id="crownHexGrad" x1="4" y1="2" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Red Ribbon Gradient */}
          <linearGradient id="ribbonRedGrad" x1="6" y1="16" x2="18" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          {/* Pink Ribbon for Crown */}
          <linearGradient id="ribbonPinkGrad" x1="6" y1="16" x2="18" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>
        </defs>

        {/* Ribbon Tails at the bottom */}
        {badge.type === 'gold-crown' ? (
          <g fill="url(#ribbonPinkGrad)">
            {/* Left Ribbon Tail with swallowtail notch */}
            <path d="M7 16L5 26.5L8.5 24.5L11.5 26.5L10.5 17Z" />
            {/* Right Ribbon Tail */}
            <path d="M13.5 17L12.5 26.5L15.5 24.5L19 26.5L17 16Z" />
          </g>
        ) : (
          <g fill="url(#ribbonRedGrad)">
            {/* Left Ribbon Tail */}
            <path d="M7 16L5 26.5L8.5 24.5L11.5 26.5L10.5 17Z" />
            {/* Right Ribbon Tail */}
            <path d="M13.5 17L12.5 26.5L15.5 24.5L19 26.5L17 16Z" />
          </g>
        )}

        {/* Hexagonal Medal Body */}
        {badge.type === 'gold-crown' && (
          <polygon
            points="12,1.5 20,6 20,15 12,19.5 4,15 4,6"
            fill="url(#crownHexGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
        )}
        {badge.type === 'gold-star' && (
          <polygon
            points="12,1.5 20,6 20,15 12,19.5 4,15 4,6"
            fill="url(#goldHexGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
        )}
        {badge.type === 'silver-star' && (
          <polygon
            points="12,1.5 20,6 20,15 12,19.5 4,15 4,6"
            fill="url(#silverHexGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
        )}
        {badge.type === 'bronze-star' && (
          <polygon
            points="12,1.5 20,6 20,15 12,19.5 4,15 4,6"
            fill="url(#bronzeHexGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
        )}

        {/* Inner Symbol */}
        {badge.type === 'gold-crown' ? (
          /* Royal Crown */
          <path
            d="M8 14H16L17 9.5L14 11.5L12 8L10 11.5L7 9.5L8 14Z"
            fill="#FEF9C3"
            stroke="#78350F"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        ) : (
          /* Star Symbol */
          <polygon
            points="12,5.2 13.5,8.8 17.2,9.2 14.5,11.8 15.2,15.5 12,13.6 8.8,15.5 9.5,11.8 6.8,9.2 10.5,8.8"
            fill="#FEF08A"
            stroke={badge.type === 'silver-star' ? '#64748B' : '#92400E'}
            strokeWidth="0.7"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </div>
  );
};
