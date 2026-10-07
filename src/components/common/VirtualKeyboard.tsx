import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, ArrowUp, Delete } from 'lucide-react';

export const VirtualKeyboard: React.FC = () => {
  const { isKeyboardOpen, closeKeyboard } = useApp();

  if (!isKeyboardOpen) return null;

  const handleKeyPress = (char: string) => {
    // If an active input or textarea exists, simulate typing into it
    const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      const start = activeEl.selectionStart || activeEl.value.length;
      const end = activeEl.selectionEnd || activeEl.value.length;
      const val = activeEl.value;

      if (char === 'BACKSPACE') {
        if (start > 0 || end > start) {
          const deleteFrom = start === end ? start - 1 : start;
          const newVal = val.slice(0, deleteFrom) + val.slice(end);
          activeEl.value = newVal;
          activeEl.setSelectionRange(deleteFrom, deleteFrom);
          activeEl.dispatchEvent(new Event('input', { bubbles: true }));
        }
      } else if (char === 'SPACE') {
        const newVal = val.slice(0, start) + ' ' + val.slice(end);
        activeEl.value = newVal;
        activeEl.setSelectionRange(start + 1, start + 1);
        activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (char === 'RETURN') {
        closeKeyboard();
      } else {
        const newVal = val.slice(0, start) + char.toLowerCase() + val.slice(end);
        activeEl.value = newVal;
        activeEl.setSelectionRange(start + 1, start + 1);
        activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  return (
    <div 
      className="absolute bottom-0 inset-x-0 z-[100] bg-[#D1D5DB] border-t border-[#C0C4CC] shadow-[0_-12px_32px_rgba(0,0,0,0.3)] animate-slide-up select-none pb-4 pt-1.5 px-1.5 flex flex-col gap-1.5"
      onMouseDown={(e) => {
        // Prevent stealing focus from textarea or input
        e.preventDefault();
      }}
    >
      {/* Accessory Toolbar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#E5E7EB] rounded-lg border border-[#D1D5DB]/80 text-xs">
        <span className="text-[11px] font-semibold text-[#4B5563]">
          Keyboard Active
        </span>
        <button
          type="button"
          onClick={() => {
            closeKeyboard();
            (document.activeElement as HTMLElement)?.blur();
          }}
          className="flex items-center gap-1 font-bold text-[#0C6B44] hover:text-[#0A5A39] text-xs cursor-pointer active:scale-95"
        >
          <span>Done</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Row 1 */}
      <div className="flex justify-center gap-1">
        {row1.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => handleKeyPress(char)}
            className="flex-1 max-w-[34px] h-10 bg-white hover:bg-slate-100 rounded-[6px] shadow-sm flex items-center justify-center font-medium text-sm text-[#111827] active:bg-[#9CA3AF] active:text-white transition-colors cursor-pointer"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex justify-center gap-1 px-3">
        {row2.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => handleKeyPress(char)}
            className="flex-1 max-w-[34px] h-10 bg-white hover:bg-slate-100 rounded-[6px] shadow-sm flex items-center justify-center font-medium text-sm text-[#111827] active:bg-[#9CA3AF] active:text-white transition-colors cursor-pointer"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 3 */}
      <div className="flex justify-center gap-1">
        <button
          type="button"
          className="w-9 h-10 bg-[#9CA3AF] text-white rounded-[6px] shadow-sm flex items-center justify-center active:bg-white active:text-[#111827] transition-colors cursor-pointer"
          title="Shift"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        </button>
        {row3.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => handleKeyPress(char)}
            className="flex-1 max-w-[34px] h-10 bg-white hover:bg-slate-100 rounded-[6px] shadow-sm flex items-center justify-center font-medium text-sm text-[#111827] active:bg-[#9CA3AF] active:text-white transition-colors cursor-pointer"
          >
            {char}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleKeyPress('BACKSPACE')}
          className="w-9 h-10 bg-[#9CA3AF] text-white rounded-[6px] shadow-sm flex items-center justify-center active:bg-white active:text-[#111827] transition-colors cursor-pointer"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {/* Row 4 (Space & Actions) */}
      <div className="flex justify-center gap-1.5 px-1 pt-0.5">
        <button
          type="button"
          onClick={() => handleKeyPress('123')}
          className="px-3 h-10 bg-[#9CA3AF] text-white rounded-[6px] shadow-sm flex items-center justify-center font-semibold text-xs active:bg-white active:text-[#111827] cursor-pointer"
        >
          123
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('SPACE')}
          className="flex-1 h-10 bg-white hover:bg-slate-100 rounded-[6px] shadow-sm flex items-center justify-center text-xs font-medium text-[#6B7280] active:bg-[#9CA3AF] active:text-white transition-colors cursor-pointer"
        >
          space
        </button>
        <button
          type="button"
          onClick={() => {
            closeKeyboard();
            (document.activeElement as HTMLElement)?.blur();
          }}
          className="px-4 h-10 bg-[#0C6B44] text-white rounded-[6px] shadow-sm flex items-center justify-center font-bold text-xs hover:bg-[#0A5A39] active:scale-95 transition-all cursor-pointer"
        >
          return
        </button>
      </div>
    </div>
  );
};

