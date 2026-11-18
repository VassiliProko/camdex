import { useState } from 'react';

/** Two-handle range slider. lo/hi are the chosen values; min/max are the slider bounds. */
export function RangeSlider({ min = 0, max = 4000, step = 50, lo, hi, onChange, label = 'Price range' }) {
  const clamp = (v) => Math.max(min, Math.min(max, v));
  const a = clamp(lo), b = clamp(hi);
  const pct = (v) => ((v - min) / (max - min)) * 100;
  return (
    <div className="dual" role="group" aria-label={label}>
      <div className="dual-track" />
      <div className="dual-fill" style={{ left: `${pct(a)}%`, right: `${100 - pct(b)}%` }} />
      <input type="range" min={min} max={max} step={step} value={a} aria-label={`${label}: minimum`}
        onChange={(e) => onChange(Math.min(Number(e.target.value), b), hi)} />
      <input type="range" min={min} max={max} step={step} value={b} aria-label={`${label}: maximum`}
        onChange={(e) => onChange(lo, Math.max(Number(e.target.value), a))} />
    </div>
  );
}

/** Numeric text field that lets people type freely and commits a clamped value. */
export function AmountField({ id, label, value, onCommit, min = 0, max = 10000 }) {
  const [typed, setTyped] = useState(null);
  return (
    <div className="type-amount">
      <label htmlFor={id}>{label}</label>
      <div className="amount-field">
        <span aria-hidden>$</span>
        <input
          id={id} type="text" inputMode="numeric" autoComplete="off"
          value={typed ?? String(value)}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
            setTyped(raw);
            if (raw !== '') onCommit(Math.max(min, Math.min(max, Number(raw))), false);
          }}
          onBlur={() => { onCommit(Math.max(min, Math.min(max, Number(typed === '' ? value : typed ?? value))), true); setTyped(null); }}
        />
      </div>
    </div>
  );
}
