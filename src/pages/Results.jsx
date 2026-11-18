import { useMemo, useState } from 'react';
import { Edit2, Plus, Minus, Save, RefreshCw, Columns } from '../components/Icon.jsx';
import { useApp } from '../lib/store.jsx';
import CameraCard from '../components/CameraCard.jsx';
import { RangeSlider } from '../components/RangeSlider.jsx';
import Select from '../components/Select.jsx';
import AnswersPanel from '../components/AnswersPanel.jsx';
import { rank, hasAnswers, money, GOALS } from '../lib/match.js';
import { DEFAULT_FILTERS } from '../lib/store.jsx';
import { TYPES, BRANDS } from '../data/cameras.js';

const LABELS = {
  exp: { 1: 'Brand new', 2: 'Knows the basics', 3: 'Comfortable with settings' },
  weight: { pocket: 'Pocket-sized', bag: 'Small bag', any: 'Heavier is fine' },
  video: { photo: 'Mostly photos', mix: 'Photos and video', video: 'Mostly video' },
  blur: { yes: 'Wants blurry background', plus: 'Blur is a plus', no: 'Blur does not matter' },
};

export default function Results() {
  const { answers, patch, go, resetAnswers, filters, setFilters, search: q } = useApp();
  const { types, brands } = filters;
  const flags = { weather: filters.weather, ibis: filters.ibis, evf: filters.evf, lens: filters.lens, weights: filters.weights, sensors: filters.sensors, easy: filters.easy, vid: filters.vid, af: filters.af };
    const setBrands = (v) => setFilters({ ...filters, brands: v });
  const setFlags = (f) => setFilters({ ...filters, ...f });
  const [sort, setSort] = useState('match');
  const [shown, setShown] = useState(6);
  const [railOpen, setRailOpen] = useState(false);

  const personal = hasAnswers(answers);
  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    const r = rank(answers, { types, brands, ...flags }).filter((it) => !term || `${it.c.name} ${it.c.brand} ${it.c.type} ${it.c.sensor}`.toLowerCase().includes(term));
    if (sort === 'low') return [...r].sort((a, b) => a.c.price - b.c.price);
    if (sort === 'high') return [...r].sort((a, b) => b.c.price - a.c.price);
    if (sort === 'light') return [...r].sort((a, b) => a.c.grams - b.c.grams);
    return r;
  }, [answers, types, brands, flags, sort, q]);


  return (
    <main className="results-shell">
      <div className="layout">
        <aside className={`rail ${railOpen ? 'open' : ''}`} aria-label="Filters and your answers">
          <div className="rail-mobile-bar">
            <strong>Answers &amp; filters</strong>
            <button className="btn primary sm" onClick={() => setRailOpen(false)}>Show {items.length} results</button>
          </div>
          <div className="rail-scroll">
            <section className="rail-sec">
              <div className="rail-title">
                <h2>Your answers</h2>
                <button className="icon-btn tip-icon" data-tip="Start quiz over" aria-label="Start quiz over" onClick={() => { resetAnswers(); go('#/survey'); }}>
                  <RefreshCw size={20} aria-hidden />
                </button>
              </div>
              <AnswersPanel />
            </section>

            <section className="rail-sec">
              <h2>Filters</h2>
              <div className="more">
                <fieldset>
                  <legend>Type</legend>
                  {TYPES.map((t) => (
                    <label key={t} className="check"><input type="checkbox" checked={types.includes(t)} onChange={(e) => { setFilters({ ...filters, types: e.target.checked ? [...types, t] : types.filter((x) => x !== t) }); setShown(6); }} /> {t}</label>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Lens</legend>
                  {[['fixed', 'Built-in lens (simple)'], ['swap', 'Swappable lenses']].map(([k, l]) => (
                    <label key={k} className="check"><input type="checkbox" checked={flags.lens.includes(k)} onChange={(e) => setFlags({ lens: e.target.checked ? [...flags.lens, k] : flags.lens.filter((x) => x !== k) })} /> {l}</label>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Weight</legend>
                  {[[350, 'Pocket-sized (under 350 g)'], [700, 'Small bag (under 700 g)']].map(([k, l]) => (
                    <label key={k} className="check"><input type="checkbox" checked={flags.weights.includes(k)} onChange={(e) => setFlags({ weights: e.target.checked ? [...flags.weights, k] : flags.weights.filter((x) => x !== k) })} /> {l}</label>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Great at</legend>
                  {[['easy', 'Easy to use'], ['vid', 'Video'], ['af', 'Fast autofocus']].map(([k, l]) => (
                    <label key={k} className="check"><input type="checkbox" checked={flags[k]} onChange={(e) => setFlags({ [k]: e.target.checked })} /> {l}</label>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Must have</legend>
                  {[['weather', 'Weather-sealed'], ['ibis', 'Image stabilization'], ['evf', 'Viewfinder']].map(([k, l]) => (
                    <label key={k} className="check"><input type="checkbox" checked={flags[k]} onChange={(e) => setFlags({ [k]: e.target.checked })} /> {l}</label>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Sensor size</legend>
                  {[['Small', 'Small (phone-like)'], ['1-inch', '1-inch'], ['Micro Four Thirds', 'Micro Four Thirds'], ['APS-C', 'APS-C'], ['Full frame', 'Full frame']].map(([k, l]) => (
                    <label key={k} className="check"><input type="checkbox" checked={flags.sensors.includes(k)} onChange={(e) => setFlags({ sensors: e.target.checked ? [...flags.sensors, k] : flags.sensors.filter((x) => x !== k) })} /> {l}</label>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Brand</legend>
                  <div className="brand-list">
                    {BRANDS.map((b) => (
                      <label key={b} className="check"><input type="checkbox" checked={brands.includes(b)} onChange={(e) => setBrands(e.target.checked ? [...brands, b] : brands.filter((x) => x !== b))} /> {b}</label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </section>
          </div>

        </aside>

        <div className="results-main">
        <section className="grid-wrap" aria-label="Camera results">
          <div className="grid-head">
            <button className="filters-toggle btn sm" onClick={() => setRailOpen(true)}><span className="mi" aria-hidden="true">tune</span> Filters</button>
            <p className="result-count" aria-live="polite"><strong>{Math.min(shown, items.length)}</strong> out of <strong>{items.length}</strong> results</p>
            <div className="sort"><span id="sort-l">Sort by</span>
              <Select label="Sort by" value={sort} onChange={setSort} menuAlign="right" options={[{ value: 'match', label: 'Best match' }, { value: 'low', label: 'Price: low to high' }, { value: 'high', label: 'Price: high to low' }, { value: 'light', label: 'Lightest first' }]} />
            </div>
          </div>
          {items.length === 0 ? (
            <div className="empty">
              <img className="sticker-lg" src={`${import.meta.env.BASE_URL}hero-rabbit.webp`} alt="" />
              <h2>Nothing fits these filters</h2>
              <p>Try a higher budget or clear a filter. We never show cameras above your budget.</p>
              <button className="btn primary" onClick={() => { setFilters({ ...DEFAULT_FILTERS }); patch({ budget: Math.min(4000, answers.budget + 500) }); }}>Raise budget by $500 and clear filters</button>
            </div>
          ) : (
            <div className="grid">
              {items.slice(0, shown).map((it, i) => <CameraCard key={it.c.id} item={it} rank={sort === 'match' ? i : -1} />)}
            </div>
          )}
          {shown < items.length && (
            <div className="more-row"><button className="btn secondary" onClick={() => setShown(shown + 6)}>Show more</button></div>
          )}
        </section>
        </div>
      </div>

    </main>
  );
}
