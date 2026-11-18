import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Check } from './Icon.jsx';

/** Custom dropdown: tonal button + popover list. Keyboard: Enter/Space/Arrows to open and move, Esc to close. */
export default function Select({ label, value, onChange, options, placeholder = 'Choose…', className = '', menuAlign = 'left' }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const root = useRef(null);
  const id = useId();
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const off = (e) => { if (!root.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', off);
    return () => document.removeEventListener('mousedown', off);
  }, [open]);

  const openMenu = () => { setIdx(Math.max(0, options.findIndex((o) => o.value === value))); setOpen(true); };
  const pick = (o) => { onChange(o.value); setOpen(false); root.current?.querySelector('button')?.focus(); };
  const onKey = (e) => {
    if (!open) { if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); openMenu(); } return; }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(options.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(options[idx]); }
    else if (e.key === 'Tab') setOpen(false);
  };

  return (
    <div className={`select ${className}`} ref={root} onKeyDown={onKey}>
      <button type="button" className="select-btn" aria-haspopup="listbox" aria-expanded={open} aria-label={label ? `${label}: ${current?.label ?? placeholder}` : undefined} onClick={() => (open ? setOpen(false) : openMenu())}>
        <span>{current?.label ?? placeholder}</span>
        <ChevronDown size={20} className="select-chev" />
      </button>
      {open && (
        <ul className={`select-menu ${menuAlign}`} role="listbox" id={id} aria-label={label}>
          {options.map((o, i) => (
            <li key={o.value} role="option" aria-selected={o.value === value} className={`${i === idx ? 'hl' : ''} ${o.value === value ? 'sel' : ''}`} onMouseEnter={() => setIdx(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)}>
              <span>{o.label}</span>
              {o.value === value && <Check size={18} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
