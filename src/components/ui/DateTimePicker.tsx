import React, { useRef } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  type: 'date' | 'time';
  label: string;
  placeholder?: string;
  className?: string;
}

const DateTimePicker: React.FC<Props> = ({ value, onChange, type, label, placeholder, className = '' }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFieldClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
      inputRef.current.showPicker?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="mb-1.5 block text-xs font-medium text-slate-500">
        {label}
      </label>
      <div onClick={handleFieldClick} className="relative cursor-pointer">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base cursor-pointer focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition"
        />
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {type === 'date' ? '📅' : '🕐'}
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
