import { useRef, useState } from 'react';
import { Heart, Columns, ExternalLink, Upload, Check } from '../components/Icon.jsx';
import { useApp } from '../lib/store.jsx';
import { BackButton, CameraImg, Tip, camById } from '../components/ui.jsx';
import CameraCard, { FitBadge } from '../components/CameraCard.jsx';
import { scoreCamera, hasAnswers, reasons, money, apples, badges, tradeoff, betterFor, fitLabel } from '../lib/match.js';
import { CAMERAS } from '../data/cameras.js';
import { CREDITS } from '../data/images.js';

export default function Detail({ id }) {
  const { saved, toggleSaved, setCompareList, answers, go } = useApp();
  const c = camById(id);
  const [photos, setPhotos] = useState([]);
  const file = useRef(null);
  if (!c) {
    return (
      <main className="page"><BackButton /><div className="empty"><h2>We could not find that camera</h2><button className="btn primary" onClick={() => go('#/results')}>Back to matches</button></div></main>
    );
  }
  const personal = hasAnswers(answers);
  const { fit: raw, parts } = scoreCamera(c, answers);
  const fit = personal ? Math.min(99, Math.round(raw * 100)) : null;
  const why = personal ? reasons(parts, answers, 3) : [];
  const credit = CREDITS[c.id];
  const isSaved = saved.includes(c.id);

  // "More of this": similar price/type, and a better-for-video pick if this one is weaker at it
  const similar = CAMERAS.filter((x) => x.id !== c.id && x.type === c.type && Math.abs(x.price - c.price) <= 500)
    .sort((a, b) => Math.abs(a.price - c.price) - Math.abs(b.price - c.price)).slice(0, 2);
  const videoPick = c.video < 4.5 ? CAMERAS.filter((x) => x.video >= 4.5 && x.price <= Math.max(answers.budget, c.price) && x.id !== c.id).sort((a, b) => a.price - b.price)[0] : null;
  const wrap = (x) => ({ c: x, fit: personal ? Math.min(99, Math.round(scoreCamera(x, answers).fit * 100)) : null, parts: scoreCamera(x, answers).parts });

  const specs = [
    ['type', 'Camera type', c.type], ['sensor', 'Sensor size', c.sensor], ['mp', 'Megapixels', `${c.mp} MP`],
    ['weight', 'Weight', `${c.grams} g`], ['ibis', 'Stabilization', c.ibis ? 'In-body' : 'Not in body'],
    ['weather', 'Weather sealing', c.weather ? 'Yes' : 'No'], ['evf', 'Viewfinder', c.evf ? 'Yes' : 'No'],
    ['mount', 'Lens mount', c.mount], ['year', 'Released', c.year],
  ];

  return (
    <main className="page detail">
      <div className="page-head"><BackButton fallback="#/results" /></div>

      <section className="d-hero">
        <div className="d-media">
          <div className="stage-img"><CameraImg cam={c} /></div>
          {false && credit && <p className="credit">Photo: {credit.artist || 'Wikimedia Commons contributor'} · {credit.license} · <a href={credit.page} target="_blank" rel="noreferrer">source</a></p>}
        </div>
        <div className="d-info">
          <FitBadge pct={fit} />
          <h1>{c.name}</h1>
          <p className="d-story">{c.story}</p>
          <div className="d-price">
            <p className="new-line"><span className="amt">{money(c.price)}</span> <small>CAD</small></p>
            <p className="used-line"><Tip term="used">Used</Tip> about {money(c.usedLo)} – {money(c.usedHi)}</p>
          </div>
          <div className="d-actions">
            <div className="card-actions">
              <button className="btn compare-cta" onClick={() => { setCompareList([c.id]); go('#/compare'); }}><Columns size={18} aria-hidden /> Compare</button>
              <button className={`heart inline ${isSaved ? 'on' : ''}`} aria-pressed={isSaved} aria-label={isSaved ? `Remove ${c.name} from saved` : `Save ${c.name}`} onClick={() => toggleSaved(c.id)}>
                <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} aria-hidden />
              </button>
            </div>
            <a className="btn" href={`https://www.amazon.ca/s?k=${encodeURIComponent(c.name)}`} target="_blank" rel="noreferrer">Search Amazon.ca <ExternalLink size={16} aria-hidden /></a>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2>{personal ? 'Why it fits you' : 'Good for'}</h2>
        <div className="d-body">
          {why.length > 0 && (
            <ul className="why big">
              {why.map((w) => <li key={w}><Check size={18} aria-hidden /> {w}</li>)}
            </ul>
          )}
          <p className="d-line"><strong>Best for</strong> {betterFor(c)}</p>
          <p className="d-line"><strong>Trade-off</strong> {tradeoff(c)}</p>
          {videoPick && <p className="d-line"><strong>Filming more?</strong> <a href={`#/camera/${videoPick.id}`}>{videoPick.name}</a> is stronger for video.</p>}
        </div>
      </section>

      <section className="d-section">
        <h2>Specs</h2>
        <dl className="d-specs">
          {specs.map(([t, l, v]) => (
            <div key={t}>
              <dt><Tip term={t}>{l}</Tip></dt>
              <dd>{v}{t === 'weight' && <small> · {apples(c.grams)}</small>}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="d-section">
        <h2>Real photos</h2>
        <div className="d-body">
          <input ref={file} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) setPhotos((p) => [...p, URL.createObjectURL(f)]); e.target.value = ''; }} />
          <div className="thumbs">
            {photos.map((u, i) => <img key={u} src={u} alt={`Your sample photo ${i + 1} (shown on this device only)`} />)}
            <button className="btn" onClick={() => file.current?.click()}><Upload size={18} aria-hidden /> Upload a photo</button>
          </div>
        </div>
      </section>

      {(similar.length > 0 || videoPick) && (
        <section className="more-like" aria-label="More like this">
          <h2>More like this</h2>
          <div className="grid">
            {[...similar, ...(videoPick ? [videoPick] : [])].slice(0, 3).map((x) => <CameraCard key={x.id} item={wrap(x)} rank={-1} />)}
          </div>
        </section>
      )}
    </main>
  );
}
