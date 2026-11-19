import { useState } from 'react';
import { X, ExternalLink, Heart, Search, ArrowLeft, Columns } from '../components/Icon.jsx';
import { useApp } from '../lib/store.jsx';
import { CameraImg, BadgeList, Tip, camById } from '../components/ui.jsx';
import { FitBadge } from '../components/CameraCard.jsx';
import { scoreCamera, hasAnswers, anyAnswers, money, badges, tradeoff } from '../lib/match.js';
import Select from '../components/Select.jsx';
import { CAMERAS } from '../data/cameras.js';

const ROWS = [
  ['price', 'Price', (c) => money(c.price), (c) => -c.price],
  ['used', 'Used estimate', (c) => `${money(c.usedLo)} – ${money(c.usedHi)}`, null],
  ['type', 'Type', (c) => c.type, null],
  ['sensor', 'Sensor size', (c) => c.sensor, (c) => c.sensorQ],
  ['mp', 'Megapixels', (c) => `${c.mp} MP`, (c) => c.mp],
  ['weight', 'Weight', (c) => `${c.grams} g`, (c) => -c.grams],
  ['ease', 'Ease of use', (c) => `${c.ease} / 5`, (c) => c.ease],
  ['af', 'Autofocus', (c) => `${c.af} / 5`, (c) => c.af],
  ['video', 'Video', (c) => `${c.video} / 5`, (c) => c.video],
  ['ibis', 'Stabilization', (c) => (c.ibis ? 'In-body' : 'No in-body'), (c) => +c.ibis],
  ['weather', 'Weather sealing', (c) => (c.weather ? 'Yes' : 'No'), (c) => +c.weather],
  ['evf', 'Viewfinder', (c) => (c.evf ? 'Yes' : 'No'), (c) => +c.evf],
  ['mount', 'Lens mount', (c) => c.mount, null],
];

const SECTIONS = [
  { title: 'Price', rows: ['price', 'used'] },
  { title: 'Size and weight', rows: ['type', 'weight'] },
  { title: 'Image quality', rows: ['sensor', 'mp'] },
  { title: 'Ease and performance', rows: ['ease', 'af', 'video'] },
  { title: 'Build and lenses', rows: ['ibis', 'weather', 'evf', 'mount'] },
];

function Picker({ exclude, onPick }) {
  const { answers } = useApp();
  const [q, setQ] = useState('');
  const personal = hasAnswers(answers) || anyAnswers(answers);
  const list = CAMERAS.filter((c) => !exclude.includes(c.id) && c.name.toLowerCase().includes(q.trim().toLowerCase()))
    .map((c) => ({ c, fit: personal ? Math.min(99, Math.round(scoreCamera(c, answers).fit * 100)) : null }))
    .sort((a, b) => (personal ? b.fit - a.fit : a.c.price - b.c.price));
  return (
    <div className="picker-col">
      <div className="search-field picker-search">
        <Search size={20} aria-hidden />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search all cameras" aria-label="Search all cameras" />
      </div>
      <section className="picker" aria-label="Choose a camera to compare">
      <h2>{q.trim() ? 'Search results' : personal ? 'Top matches' : 'Cameras'}</h2>
      <ul className="picker-list">
        {list.length === 0 && <li className="note">No cameras match that search.</li>}
        {list.map(({ c, fit }) => (
          <li key={c.id}>
            <button className="picker-row" onClick={() => onPick(c.id)}>
              <span className="thumb"><CameraImg cam={c} /></span>
              <span className="p-text"><strong>{c.name}</strong><small>{c.type} · {money(c.price)}</small></span>
              {fit != null && <span className="p-fit">{fit}%</span>}
            </button>
          </li>
        ))}
      </ul>
      </section>
    </div>
  );
}

export default function Compare() {
  const { compare, toggleCompare, setCompareList, go, back, prevRoute, saved, answers, toggleSaved } = useApp();
  const cams = compare.map(camById).filter(Boolean);
  const personal = hasAnswers(answers);
  const addable = CAMERAS.filter((c) => !compare.includes(c.id));

  return (
    <main className="page compare">

      {(
        <div className="ac" style={{ '--cols': Math.max(2, cams.length) }}>
          <div className="ac-head">
            <div className="ac-spacer page-head">
              {prevRoute?.startsWith('#/camera/') && (
                <button className="back" onClick={() => back('#/results')}><ArrowLeft size={20} aria-hidden /> Back to camera</button>
              )}
              <h1><span className="pill-word"><Columns className="pill-icon" size={40} aria-hidden />Compare</span></h1>
            </div>
            {cams.map((c) => {
              const fit = personal ? Math.min(99, Math.round(scoreCamera(c, answers).fit * 100)) : null;
              return (
                <div key={c.id} className="ac-col">
                  <div className="ac-img"><CameraImg cam={c} /></div>
                  <div className="ac-title">
                    <h2><a href={`#/camera/${c.id}`}>{c.name}</a></h2>
                    <button className="icon-btn ac-x" aria-label={`Remove ${c.name} from comparison`} onClick={() => toggleCompare(c.id)}><X size={18} aria-hidden /></button>
                  </div>
                  <p className="ac-price">{money(c.price)} <small>CAD</small></p>
                  {fit != null && <p className="ac-fit">{fit}% match</p>}
                  <div className="ac-cta">
                    <a className="btn primary sm" href={`https://www.amazon.ca/s?k=${encodeURIComponent(c.name)}`} target="_blank" rel="noreferrer">Search Amazon.ca <ExternalLink size={14} aria-hidden /></a>
                    <button className={`icon-btn ${saved.includes(c.id) ? 'on' : ''}`} aria-pressed={saved.includes(c.id)} aria-label={`Save ${c.name}`} onClick={() => toggleSaved(c.id)}>
                      <Heart size={18} fill={saved.includes(c.id) ? 'currentColor' : 'none'} aria-hidden />
                    </button>
                  </div>
                </div>
              );
            })}
            {cams.length < 2 && Array.from({ length: 2 - cams.length }).map((_, i) => (
              <div key={`slot-${i}`} className="ac-col ac-empty">
                <div className="ac-img slot"><span className="mi" aria-hidden="true">add</span><strong>Choose a camera</strong></div>
                {cams.length === 0 && i === 0 && saved.length >= 2 && (
                  <button className="btn sm" onClick={() => setCompareList(saved.slice(0, 3))}>Use my saved cameras</button>
                )}
              </div>
            ))}
          </div>

          {cams.length < 2 && (
            <div className="ac-picker"><Picker exclude={compare} onPick={(id) => setCompareList([...compare, id])} /></div>
          )}

          {cams.length >= 2 && SECTIONS.map((sec) => (
            <section key={sec.title} className="ac-sec">
              <h3>{sec.title}</h3>
              {sec.rows.map((term) => {
                const [, label, fmt, score] = ROWS.find((r) => r[0] === term);
                const best = score ? Math.max(...cams.map(score)) : null;
                const allSame = score && cams.every((c) => score(c) === score(cams[0]));
                return (
                  <div className={`ac-row ${score && !allSame ? 'has-win' : ''}`} key={term}>
                    <div className="ac-label"><Tip term={term}>{label}</Tip></div>
                    {cams.map((c) => {
                      const win = score && !allSame && score(c) === best;
                      return (
                        <div key={c.id} className={`ac-val ${win ? 'win' : ''}`}>
                          {win && <span className="mi win-ico" aria-hidden="true">check_circle</span>}
                          <span>{fmt(c)}</span>
                          {win && <span className="sr-only">(best)</span>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </section>
          ))}

          {cams.length >= 2 && cams.length < 3 && (
            <div className="ac-add">
              <span id="add-l">Add another camera</span>
              <Select label="Add another camera" value="" onChange={(v) => v && toggleCompare(v)} placeholder="Choose a camera" options={addable.map((c) => ({ value: c.id, label: `${c.name} · ${money(c.price)}` }))} />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
