import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, ArrowUp, Delete } from 'lucide-react';

export const VirtualKeyboard: React.FC = () => {
  const { isKeyboardOpen, closeKeyboard } = useApp();
  const [isShift, setIsShift] = useState(false);
  const [isSymbols, setIsSymbols] = useState(false);
  const [fieldLabel, setFieldLabel] = useState('Keyboard Active');
  const targetElementRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Resolve the target input or textarea
  const getTargetElement = (): HTMLInputElement | HTMLTextAreaElement | null => {
    const globalEl = (window as unknown as { __sevaActiveInput?: HTMLInputElement | HTMLTextAreaElement }).__sevaActiveInput;
    if (globalEl && document.body.contains(globalEl)) {
      targetElementRef.current = globalEl;
      return globalEl;
    }
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
      targetElementRef.current = active as HTMLInputElement | HTMLTextAreaElement;
      return active as HTMLInputElement | HTMLTextAreaElement;
    }
    if (targetElementRef.current && document.body.contains(targetElementRef.current)) {
      return targetElementRef.current;
    }
    // Fallback: search for active or eligible input
    const anyInput = document.querySelector('input:focus, textarea:focus') as HTMLInputElement | HTMLTextAreaElement | null;
    if (anyInput) {
      targetElementRef.current = anyInput;
      return anyInput;
    }
    return null;
  };

  // Keep track of the active element even before keyboard is open
  useEffect(() => {
    const handleFocus = () => {
      const el = getTargetElement();
      if (el) {
        const placeholder = el.placeholder || '';
        const ariaLabel = el.getAttribute('aria-label') || '';
        const name = el.name || '';
        setFieldLabel(placeholder || ariaLabel || name || 'Typing...');
      }
    };

    handleFocus();
    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);

  if (!isKeyboardOpen) return null;

  // React 19-compatible value setter that triggers React synthetic onChange
  const setNativeValue = (element: HTMLInputElement | HTMLTextAreaElement, value: string) => {
    const previousValue = element.value;

    // 1. Call the browser prototype setter
    const proto = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
    if (descriptor && descriptor.set) {
      descriptor.set.call(element, value);
    } else {
      element.value = value;
    }

    // 2. Reset React's internal _valueTracker if present so React registers value difference
    const tracker = (element as unknown as { _valueTracker?: { setValue: (v: string) => void } })._valueTracker;
    if (tracker && typeof tracker.setValue === 'function') {
      tracker.setValue(previousValue !== value ? previousValue : previousValue + '__diff');
    }

    // 3. Dispatch both input and change events for complete React coverage
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const handleKeyPress = (char: string) => {
    const el = getTargetElement();
    if (!el) return;

    // Ensure element retains focus
    el.focus();

    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const val = el.value || '';

    if (char === 'BACKSPACE') {
      if (start > 0 || end > start) {
        const deleteFrom = start === end ? Math.max(0, start - 1) : start;
        const newVal = val.slice(0, deleteFrom) + val.slice(end);
        setNativeValue(el, newVal);
        el.setSelectionRange(deleteFrom, deleteFrom);
      }
    } else if (char === 'SPACE') {
      const newVal = val.slice(0, start) + ' ' + val.slice(end);
      setNativeValue(el, newVal);
      el.setSelectionRange(start + 1, start + 1);
    } else if (char === 'RETURN') {
      closeKeyboard();
      el.blur();
    } else {
      const insertChar = isShift ? char.toUpperCase() : char.toLowerCase();
      const newVal = val.slice(0, start) + insertChar + val.slice(end);
      setNativeValue(el, newVal);
      el.setSelectionRange(start + insertChar.length, start + insertChar.length);
    }
  };

  const letterRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const symbolRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', ':', ';', '(', ')', '₹', '&', '@', '"'],
    ['.', ',', '?', '!', "'", '#', '%']
  ];

  const activeRows = isSymbols ? symbolRows : letterRows;

  return (
    <div 
      className="absolute bottom-0 inset-x-0 z-[100] bg-[#D6DED8] border-t border-[#C0C4CC] shadow-[0_-12px_32px_rgba(0,0,0,0.22)] animate-slide-up select-none pb-5 pt-1.5 px-1.5 flex flex-col gap-1.5"
      onMouseDown={(e) => e.preventDefault()}
      onPointerDown={(e) => e.preventDefault()}
    >
      {/* Accessory Toolbar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#E8EFEA] rounded-lg border border-[#CBD8CA] text-xs">
        <span className="text-[11px] font-semibold text-[#4F6057] truncate max-w-[220px]">
          {fieldLabel}
        </span>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => {
            closeKeyboard();
            (document.activeElement as HTMLElement)?.blur();
          }}
          className="flex items-center gap-1 font-bold text-[#0C6B44] hover:text-[#0A5A39] text-xs cursor-pointer active:scale-95 px-2 py-0.5 rounded-md hover:bg-white/60 transition-colors"
        >
          <span>Done</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Row 1 */}
      <div className="flex justify-center gap-1">
        {activeRows[0].map((char) => (
          <button
            key={char}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => handleKeyPress(char)}
            className="flex-1 max-w-[34px] h-10 bg-white hover:bg-slate-50 rounded-[7px] shadow-xs flex items-center justify-center font-medium text-sm text-[#16261E] active:bg-[#B9C4BD] active:text-white transition-colors cursor-pointer"
          >
            {isShift ? char.toUpperCase() : char.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex justify-center gap-1 px-2.5">
        {activeRows[1].map((char) => (
          <button
            key={char}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => handleKeyPress(char)}
            className="flex-1 max-w-[34px] h-10 bg-white hover:bg-slate-50 rounded-[7px] shadow-xs flex items-center justify-center font-medium text-sm text-[#16261E] active:bg-[#B9C4BD] active:text-white transition-colors cursor-pointer"
          >
            {isShift ? char.toUpperCase() : char.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Row 3 */}
      <div className="flex justify-center gap-1">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => setIsShift(!isShift)}
          className={`w-10 h-10 rounded-[7px] shadow-xs flex items-center justify-center transition-colors cursor-pointer ${
            isShift ? 'bg-white text-[#0C6B44]' : 'bg-[#B9C4BD] text-white active:bg-white active:text-[#16261E]'
          }`}
          title="Shift"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        </button>
        {activeRows[2].map((char) => (
          <button
            key={char}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => handleKeyPress(char)}
            className="flex-1 max-w-[34px] h-10 bg-white hover:bg-slate-50 rounded-[7px] shadow-xs flex items-center justify-center font-medium text-sm text-[#16261E] active:bg-[#B9C4BD] active:text-white transition-colors cursor-pointer"
          >
            {isShift ? char.toUpperCase() : char.toLowerCase()}
          </button>
        ))}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => handleKeyPress('BACKSPACE')}
          className="w-10 h-10 bg-[#B9C4BD] text-white rounded-[7px] shadow-xs flex items-center justify-center active:bg-white active:text-[#16261E] transition-colors cursor-pointer"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {/* Row 4 (123 / Space / Return) */}
      <div className="flex justify-center gap-1.5 px-1 pt-0.5">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => setIsSymbols(!isSymbols)}
          className="px-3.5 h-10 bg-[#B9C4BD] text-white rounded-[7px] shadow-xs flex items-center justify-center font-bold text-xs active:bg-white active:text-[#16261E] cursor-pointer"
        >
          {isSymbols ? 'ABC' : '123'}
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => handleKeyPress('SPACE')}
          className="flex-1 h-10 bg-white hover:bg-slate-50 rounded-[7px] shadow-xs flex items-center justify-center text-xs font-semibold text-[#4F6057] active:bg-[#B9C4BD] active:text-white transition-colors cursor-pointer"
        >
          space
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => handleKeyPress('RETURN')}
          className="px-4.5 h-10 bg-[#0C6B44] text-white rounded-[7px] shadow-xs flex items-center justify-center font-bold text-xs hover:bg-[#0A5A39] active:scale-95 transition-all cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};

