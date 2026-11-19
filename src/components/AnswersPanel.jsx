import { useState } from 'react';
import { useApp } from '../lib/store.jsx';
import { ChevronDown, Check } from './Icon.jsx';
import { RangeSlider, AmountField } from './RangeSlider.jsx';
import { OPTS, mustsSummary } from '../pages/Survey.jsx';
import { GOALS, MUSTS, money } from '../lib/match.js';

const budgetText = (a) => (a.budgetMin > 0 ? `${money(a.budgetMin)} \u2013 ${money(a.budget)}` : `Up to ${money(a.budget)}`);

const ICON = {
  exp: { img: 'hero-camera.webp' },
  budget: { img: 'hero-dollar.webp' },
  goals: { img: 'hero-mountains.webp' },
  weight: { img: 'hero-bag.webp' },
  video: { img: 'hero-video.webp' },
  musts: { img: 'hero-checklist.webp' },
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
    { id: 'weight', title: 'Carry', value: label('weight') },
    { id: 'video', title: 'Video', value: label('video') },
    { id: 'musts', title: 'Must-haves', value: mustsSummary(answers.musts) },
  ];
  const toggleGoal = (id) => {
    const cur = answers.goals;
    patch({ goals: cur.includes(id) ? cur.filter((g) => g !== id) : cur.length >= 2 ? [cur[1], id] : [...cur, id] });
  };
  const toggleMust = (id) => {
    const cur = answers.musts || [];
    if (cur.includes(id)) { const rest = cur.filter((m) => m !== id); return patch({ musts: rest.length ? rest : null }); }
    patch({ musts: cur.length >= 2 ? [cur[1], id] : [...cur, id] });
  };
  return (
    <ul className="acc">
      {rows.map((r) => {
        const isOpen = open === r.id;
        return (
          <li key={r.id} className={isOpen ? 'open' : ''}>
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
                {r.id === 'musts' && (
                  <>
                    <p className="hint sm">Pick up to two.</p>
                    <div className="mini-opts">
                      {MUSTS.map((m) => {
                        const on = (answers.musts || []).includes(m.id);
                        return (
                          <button key={m.id} className={`mini-opt ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggleMust(m.id)}>
                            {m.label}{on && <Check size={16} />}
                          </button>
                        );
                      })}
                      <button className={`mini-opt ${answers.musts?.length === 0 ? 'on' : ''}`} aria-pressed={answers.musts?.length === 0} onClick={() => patch({ musts: [] })}>
                        Not sure{answers.musts?.length === 0 && <Check size={16} />}
                      </button>
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
