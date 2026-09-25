import React from 'react';
import { Wifi } from 'lucide-react';

interface StatusBarProps {
  time?: string;
  showBatteryPercentage?: boolean;
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  time = '9:41', 
  showBatteryPercentage = false,
  className = '' 
}) => {
  return (
    <div className={`w-full flex items-center justify-between px-6 pt-3 pb-2 select-none text-slate-900 ${className}`}>
      {/* Time */}
      <span className="text-sm font-semibold tracking-tight">{time}</span>

      {/* Signal, Wifi, Battery */}
      <div className="flex items-center gap-1.5">
        {/* Cellular signal bars */}
        <div className="flex items-end gap-[2px] h-3">
          <div className="w-[3px] h-1.5 bg-slate-900 rounded-[0.5px]"></div>
          <div className="w-[3px] h-2 bg-slate-900 rounded-[0.5px]"></div>
          <div className="w-[3px] h-2.5 bg-slate-900 rounded-[0.5px]"></div>
          <div className="w-[3px] h-3 bg-slate-900 rounded-[0.5px]"></div>
        </div>

        {/* Wifi icon */}
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />

        {/* Battery */}
        <div className="flex items-center gap-1">
          {showBatteryPercentage && (
            <span className="text-[11px] font-bold tracking-tighter">100</span>
          )}
          <div className="w-5 h-2.5 rounded-[3px] border border-slate-900 p-[1px] flex items-center">
            <div className="h-full w-full bg-slate-900 rounded-[1.5px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

