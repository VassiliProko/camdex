import { useEffect, useState } from 'react';
import { ArrowRight, Check, ArrowLeft } from '../components/Icon.jsx';
import { useApp } from '../lib/store.jsx';
import { GOALS, money } from '../lib/match.js';
import { RangeSlider, AmountField } from '../components/RangeSlider.jsx';

// colours: deep (text/buttons on white), bright (fills with dark text), tint (panel background)
export const QUESTIONS = [
  { id: 'exp', strip: 'Experience', c: ['#1D5FD1', '#5DAEFF', '#E8F2FF'] },
  { id: 'goals', strip: 'Subjects', c: ['#4338CA', '#9A92FF', '#EEEDFF'] },
  { id: 'budget', strip: 'Budget', c: ['#7B3FD1', '#BE9BFF', '#F4ECFF'] },
  { id: 'weight', strip: 'Weight', c: ['#0B7A75', '#4FD8CB', '#E1F8F6'] },
  { id: 'video', strip: 'Video', c: ['#0A6C8C', '#58CDF0', '#E1F6FD'] },
  { id: 'blur', strip: 'Blur', c: ['#0E7753', '#5BDBAA', '#E2F8EF'] },
];

export const OPTS = {
  exp: [
    [1, 'Brand new', 'I have never used a real camera'],
    [2, 'I know the basics', 'I have used one a few times'],
    [3, 'Comfortable with settings', 'I can use manual mode'],
  ],
  weight: [
    ['pocket', 'Pocket-sized', 'Under 350 g, about 2 apples'],
    ['bag', 'Small bag', 'Up to 700 g, about 4 apples'],
    ['any', 'Heavier is fine', 'I will carry what it takes'],
  ],
  video: [
    ['photo', 'Mostly photos', 'Video is a rare extra'],
    ['mix', 'A mix of both', 'Photos and clips'],
    ['video', 'Mostly video', 'Vlogs, events, content'],
  ],
  blur: [
    ['yes', 'Absolutely', 'That soft, blurry background look'],
    ['plus', 'It is a plus', 'Nice to have'],
    ['no', 'Does not matter', 'Sharp everywhere is fine'],
  ],
};

const TITLE = {
  exp: ['How comfortable are you with ', 'cameras', '?'],
  goals: ['What do you most want to ', 'photograph', '?'],
  budget: ['What is your maximum ', 'budget', '?'],
  weight: ['How much ', 'weight', ' can you carry?'],
  video: ['Do you shoot ', 'photos or video', '?'],
  blur: ['Do you want photos with a ', 'blurry background', '?'],
};

const STICKER = { exp: 'hero-camera.webp', budget: 'hero-dollar.webp' };

const answered = (id, a) =>
  id === 'goals' ? a.goals.length > 0 : id === 'budget' ? a.budgetSet : a[id] != null;

function summary(id, a) {
  if (id === 'goals') return a.goals.map((g) => GOALS.find((x) => x.id === g)?.label.split(' ')[0]).join(', ');
  if (id === 'budget') return money(a.budget);
  const o = OPTS[id]?.find((x) => x[0] === a[id]);
  return o ? o[1] : '';
}

export default function Survey() {
  const { route, answers, patch, go, skip, back } = useApp();
  const from = route.query.from;
  const [active, setActive] = useState(Math.max(0, Math.min(5, Number(route.query.q ?? 0))));
  const [budgetSet, setBudgetSet] = useState(from === 'results' || answers.budget !== 1000);
  useEffect(() => setActive(Math.max(0, Math.min(5, Number(route.query.q ?? 0)))), [route.query.q]);
  const [maxReached, setMaxReached] = useState(from === 'results' ? 5 : active);
  useEffect(() => setMaxReached((m) => Math.max(m, active)), [active]);
  const a = { ...answers, budgetSet };
  const q = QUESTIONS[active];
  const [deep, bright, tint] = q.c;
  const t = TITLE[q.id];

  const next = () => {
    if (active === 5) return go('#/results');
    setActive(active + 1);
  };
  const choose = (key, v) => patch({ [key]: v });
  const toggleGoal = (id) => {
    const cur = answers.goals;
    if (cur.includes(id)) return patch({ goals: cur.filter((g) => g !== id) });
    patch({ goals: cur.length >= 2 ? [cur[1], id] : [...cur, id] });
  };

  return (
    <main className="page survey" style={{ '--q-deep': deep, '--q-bright': bright, '--q-tint': tint }}>
      <div className="survey-head">
        <div className="nav-arrows">
          <button className="arrow" aria-label="Previous question" onClick={() => (active > 0 ? setActive(active - 1) : back('#/'))}>
            <ArrowLeft size={20} aria-hidden />
          </button>
          <button className="arrow" aria-label="Next question" disabled={active >= maxReached} onClick={() => setActive(active + 1)}>
            <ArrowRight size={20} aria-hidden />
          </button>
        </div>
        <div className="ring" role="progressbar" aria-valuemin={1} aria-valuemax={6} aria-valuenow={active + 1} aria-label={`Question ${active + 1} of 6`}>
          <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
            <circle cx="28" cy="28" r="24" fill="none" stroke="#dde1e8" strokeWidth="4" />
            <circle cx="28" cy="28" r="24" fill="none" stroke="#2570ec" strokeWidth="4" strokeDasharray={`${((active + 1) / 6) * 150.8} 150.8`} transform="rotate(-90 28 28)" style={{ transition: 'stroke-dasharray 0.4s ease' }} />
          </svg>
          <span>{active + 1}/6</span>
        </div>
      </div>

      <div className="deck" role="group" aria-label="Quiz questions">
        {QUESTIONS.map((x, i) => {
          const isActive = i === active;
          if (!isActive) return null;
          return (
            <section
              key={x.id}
              className={`panel ${isActive ? 'active' : 'strip'} ${i < active ? 'before' : ''}`}
              style={{ '--p-deep': x.c[0], '--p-bright': x.c[1], '--p-tint': x.c[2] }}
              aria-label={isActive ? undefined : undefined}
            >
              {isActive ? (
                <div className="panel-inner">
                  <p className="q-count">Question {i + 1}</p>
                  <h1 className="q-title">{t[0]}<strong>{STICKER[q.id] && <img className="sticker" src={`${import.meta.env.BASE_URL}${STICKER[q.id]}`} alt="" />}{t[1]}</strong>{t[2]}</h1>

                  {q.id === 'goals' && (
                    <>
                      <p className="hint">Pick up to two.</p>
                      <div className="opts grid2">
                        {GOALS.map((g) => {
                          const on = answers.goals.includes(g.id);
                          return (
                            <button key={g.id} className={`opt ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggleGoal(g.id)}>
                              <span className="opt-main">{g.label}</span>
                              <span className="opt-sub">{g.hint}</span>
                              {on && <Check size={18} className="opt-check" aria-hidden />}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {q.id === 'budget' && (
                    <div className="budget">
                      <output className="big-num">
                        {answers.budgetMin > 0 ? `${money(answers.budgetMin)} – ${money(answers.budget)}` : `Up to ${money(answers.budget)}`} <small>CAD</small>
                      </output>
                      <RangeSlider min={0} max={4000} step={50} lo={answers.budgetMin || 0} hi={answers.budget}
                        onChange={(lo, hi) => { setBudgetSet(true); patch({ budgetMin: lo, budget: hi }); }} label="Budget" />
                      <div className="range-ends"><span>$0</span><span>$4,000+</span></div>
                      <div className="amount-row">
                        <AmountField id="budget-min" label="Minimum" value={answers.budgetMin || 0} min={0} max={answers.budget}
                          onCommit={(v) => { setBudgetSet(true); patch({ budgetMin: v }); }} />
                        <span className="dash" aria-hidden>to</span>
                        <AmountField id="budget-max" label="Maximum" value={answers.budget} min={Math.max(answers.budgetMin || 0, 0)} max={10000}
                          onCommit={(v, done) => { setBudgetSet(true); patch({ budget: Math.max(v, answers.budgetMin || 0) }); }} />
                      </div>
                      <p id="budget-help" className="hint">Set a minimum too if you only want cameras above a price. Approximate retail price with a basic lens, before tax. We never show anything outside your range.</p>
                    </div>
                  )}

                  {OPTS[q.id] && (
                    <div className="opts">
                      {OPTS[q.id].map(([v, label, sub]) => {
                        const on = answers[q.id] === v;
                        return (
                          <button key={v} className={`opt ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => choose(q.id, v)}>
                            <span className="opt-main">{label}</span>
                            <span className="opt-sub">{sub}</span>
                            {on && <Check size={18} className="opt-check" aria-hidden />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <button
                    className="btn primary next"
                    disabled={q.id === 'goals' ? !answers.goals.length : q.id === 'budget' ? false : answers[q.id] == null}
                    onClick={() => { if (q.id === 'budget') setBudgetSet(true); next(); }}
                  >
                    {active === 5 ? 'See my matches' : 'Continue'} <ArrowRight size={18} aria-hidden />
                  </button>
                  {from === 'results' && (
                    <button className="btn ghost sm" onClick={() => go('#/results')}>Done, back to my matches</button>
                  )}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <button className="skip" onClick={() => { skip(); go('#/results'); }}>
        Skip: let me build my own filter
      </button>
    </main>
  );
}
