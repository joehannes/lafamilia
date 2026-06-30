import React, { useState } from 'react';

interface Props {
  value: number | null | undefined;
  onChange: (v: number | null) => void;
  step?: number;
  min?: number;
  max?: number;
  label: string;
  className?: string;
  ariaLabel?: string;
}

const MobileNumberPicker: React.FC<Props> = ({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 100,
  label,
  className = '',
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const current = value ?? 0;

  const handleChange = (newValue: number) => {
    const clamped = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, newValue));
    onChange(clamped);
  };

  const increment = () => handleChange(current + (step ?? 1));
  const decrement = () => handleChange(current - (step ?? 1));

  return (
    <div className={`w-full ${className}`}>
      <label className="mb-1.5 block text-xs font-medium text-slate-500">
        {label}
      </label>

      <div
        onClick={() => setIsOpen(true)}
        className="relative w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base transition focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200"
      >
        <div className="flex items-center justify-between">
          <span className="text-slate-700 font-semibold text-xl">{current}</span>
          <span className="text-slate-400">⬍</span>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 md:items-center md:justify-center" onClick={() => setIsOpen(false)}>
          <div className="w-full rounded-t-3xl bg-white px-6 py-8 md:max-w-sm md:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-6 text-lg font-semibold text-slate-800">{label}</h3>

            <div className="mb-8 flex items-center justify-center gap-6">
              <button
                onClick={decrement}
                className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 text-4xl font-bold text-slate-700 active:bg-slate-200 transition hover:bg-slate-200"
                aria-label={`${ariaLabel} decrease`}
              >
                −
              </button>

              <div className="flex flex-col items-center gap-2">
                <div className="text-6xl font-bold text-teal-600">{current}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>

              <button
                onClick={increment}
                className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 text-4xl font-bold text-slate-700 active:bg-slate-200 transition hover:bg-slate-200"
                aria-label={`${ariaLabel} increase`}
              >
                +
              </button>
            </div>

            {max !== undefined && max <= 10 && (
              <div className="mb-6 grid grid-cols-5 gap-2">
                {Array.from({ length: Math.min(10, (max ?? 10) + 1) }, (_, i) => i).map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      handleChange(num);
                      setIsOpen(false);
                    }}
                    className={`rounded-lg px-3 py-3 font-semibold text-sm transition ${
                      current === num ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}

            <div className="mb-6">
              <input
                type="number"
                value={current}
                onChange={(e) => {
                  const num = parseInt(e.target.value, 10);
                  if (!isNaN(num)) handleChange(num);
                }}
                min={min}
                max={max}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-center text-lg font-semibold focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                inputMode="numeric"
              />
              {min !== undefined && max !== undefined && (
                <p className="mt-2 text-xs text-slate-500 text-center">
                  Range: {min}–{max}
                </p>
              )}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full rounded-xl bg-teal-600 px-4 py-4 font-bold text-white hover:bg-teal-700 transition active:scale-[0.98]"
            >
              ✓ Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNumberPicker;
