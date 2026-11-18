import { useState } from 'react';
import { useApp } from '../lib/store.jsx';
import { ChevronDown, Check } from './Icon.jsx';
import { RangeSlider, AmountField } from './RangeSlider.jsx';
import { OPTS, QUESTIONS } from '../pages/Survey.jsx';
import { GOALS, money } from '../lib/match.js';

const budgetText = (a) => (a.budgetMin > 0 ? `${money(a.budgetMin)} \u2013 ${money(a.budget)}` : `Up to ${money(a.budget)}`);

const ICON = {
  exp: { img: 'hero-camera.webp' },
  budget: { img: 'hero-dollar.webp' },
  goals: { glyph: 'landscape' },
  weight: { glyph: 'scale' },
  video: { glyph: 'videocam' },
  blur: { glyph: 'blur_on' },
};

/** Accordion of the six quiz answers. Each row expands to change its answer in place. */
export default function AnswersPanel() {
  const { answers, patch } = useApp();
  const [open, setOpen] = useState(null);
  const label = (id) => OPTS[id]?.find((o) => o[0] === answers[id])?.[1];
  const rows = [
    { id: 'exp', title: 'Experience', value: label('exp') },
    { id: 'goals', title: 'Subjects', value: answers.goals.length ? answers.goals.map((g) => GOALS.find((x) => x.id === g).label.split(' & ')[0]).join(', ') : null },
    { id: 'budget', title: 'Budget', value: budgetText(answers) },
    { id: 'weight', title: 'Weight', value: label('weight') },
    { id: 'video', title: 'Photo / video', value: label('video') },
    { id: 'blur', title: 'Blurry background', value: label('blur') },
  ];
  const toggleGoal = (id) => {
    const cur = answers.goals;
    patch({ goals: cur.includes(id) ? cur.filter((g) => g !== id) : cur.length >= 2 ? [cur[1], id] : [...cur, id] });
  };
  return (
    <ul className="acc">
      {rows.map((r) => {
        const isOpen = open === r.id;
        return (
          <li key={r.id} className={isOpen ? 'open' : ''} style={{ '--p-bright': QUESTIONS.find((q) => q.id === r.id)?.c[1], '--p-deep': QUESTIONS.find((q) => q.id === r.id)?.c[0] }}>
            <button className="acc-head" aria-expanded={isOpen} aria-controls={`acc-${r.id}`} onClick={() => setOpen(isOpen ? null : r.id)}>
              <span className="acc-text">
                <span className="a-label">
                  {ICON[r.id].img ? <img src={`${import.meta.env.BASE_URL}${ICON[r.id].img}`} alt="" /> : <span className="mi" aria-hidden="true">{ICON[r.id].glyph}</span>}
                  {r.title}
                </span>
                <span className={`a-val ${r.value ? '' : 'empty'}`}>{r.value ?? 'Not answered'}</span>
              </span>
              <ChevronDown size={20} className="acc-chev" />
            </button>
            <div className="acc-collapse" {...(isOpen ? {} : { inert: '' })}>
              <div className="acc-body" id={`acc-${r.id}`}>
                {r.id === 'goals' && (
                  <>
                    <p className="hint sm">Pick up to two.</p>
                    <div className="mini-opts">
                      {GOALS.map((g) => {
                        const on = answers.goals.includes(g.id);
                        return (
                          <button key={g.id} className={`mini-opt ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggleGoal(g.id)}>
                            {g.label}{on && <Check size={16} />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
                {r.id === 'budget' && (
                  <div className="acc-budget">
                    <RangeSlider min={0} max={Math.max(4000, answers.budget)} step={50} lo={answers.budgetMin || 0} hi={answers.budget} onChange={(lo, hi) => patch({ budgetMin: lo, budget: hi })} label="Budget" />
                    <div className="rail-amounts">
                      <AmountField id="rail-min" label="Min" value={answers.budgetMin || 0} min={0} max={answers.budget} onCommit={(v) => patch({ budgetMin: v })} />
                      <AmountField id="rail-max" label="Max" value={answers.budget} min={answers.budgetMin || 0} max={10000} onCommit={(v) => patch({ budget: Math.max(v, answers.budgetMin || 0) })} />
                    </div>
                  </div>
                )}
                {OPTS[r.id] && (
                  <div className="mini-opts">
                    {OPTS[r.id].map(([v, name]) => {
                      const on = answers[r.id] === v;
                      return (
                        <button key={v} className={`mini-opt ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => patch({ [r.id]: v })}>
                          {name}{on && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
