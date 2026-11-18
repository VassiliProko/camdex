import { Heart, Columns, Check } from './Icon.jsx';
import { useApp } from '../lib/store.jsx';
import { CameraImg } from './ui.jsx';
import { tradeoff, reasons, money, fitLabel } from '../lib/match.js';

export function FitBadge({ pct }) {
  if (pct == null) return null;
  return (
    <span className={`fit ${pct >= 85 ? 'hi' : pct >= 70 ? 'mid' : 'lo'}`}>
      <b>{pct}%</b> {fitLabel(pct)}
    </span>
  );
}

export default function CameraCard({ item, rank }) {
  const { c, fit, parts } = item;
  const { go, saved, toggleSaved, setCompareList, answers } = useApp();
  const isSaved = saved.includes(c.id);
  const why = fit == null ? [] : reasons(parts, answers, 2);
  return (
    <article className="card cam-card">
      <div className="card-media">
        <button className="media-btn" onClick={() => go(`#/camera/${c.id}`)} aria-label={`View ${c.name}`}>
          <CameraImg cam={c} />
        </button>
        {rank === 0 && fit != null && <span className="ribbon">Top match</span>}
      </div>
      <div className="card-body">
        <div className="card-title">
          <h3><a href={`#/camera/${c.id}`}>{c.name}</a></h3>
          <FitBadge pct={fit} />
        </div>
        <p className="price">{money(c.price)} <small>CAD</small></p>
        <p className="meta">{c.type} · {c.sensor} · {c.grams} g</p>
        <p className="desc">{c.story}</p>
        {why.length > 0 && (
          <ul className="why">
            {why.map((w) => <li key={w}><Check size={15} aria-hidden /> {w}</li>)}
          </ul>
        )}
        <p className="trade"><strong>Trade-off:</strong> {tradeoff(c)}</p>
        <div className="card-actions">
          <button className="btn compare-cta" onClick={() => { setCompareList([c.id]); go('#/compare'); }}>
            <Columns size={18} aria-hidden /> Compare
          </button>
          <button className={`heart inline ${isSaved ? 'on' : ''}`} aria-pressed={isSaved} aria-label={isSaved ? `Remove ${c.name} from saved` : `Save ${c.name}`} onClick={() => toggleSaved(c.id)}>
            <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
