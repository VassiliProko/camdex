import { useMemo, useState } from 'react';
import { Edit2, Plus, Minus, Save, RefreshCw, Columns } from '../components/Icon.jsx';
import { useApp } from '../lib/store.jsx';
import CameraCard from '../components/CameraCard.jsx';
import { RangeSlider } from '../components/RangeSlider.jsx';
import Select from '../components/Select.jsx';
import AnswersPanel from '../components/AnswersPanel.jsx';
import { Tip } from '../components/ui.jsx';
import { rank, hasAnswers, anyAnswers, money, GOALS } from '../lib/match.js';
import { DEFAULT_FILTERS } from '../lib/store.jsx';
import { TYPES, BRANDS } from '../data/cameras.js';

export default function Results() {
  const { answers, patch, go, resetAnswers, filters, setFilters, search: q, setSearch } = useApp();
  const { types, brands } = filters;
  const flags = { weather: filters.weather, ibis: filters.ibis, evf: filters.evf, lens: filters.lens, sensors: filters.sensors, easy: filters.easy, af: filters.af };
    const setBrands = (v) => setFilters({ ...filters, brands: v });
  const setFlags = (f) => setFilters({ ...filters, ...f });
  const [sort, setSort] = useState('match');
  const [shown, setShown] = useState(6);
  const [railOpen, setRailOpen] = useState(false);

  const personal = hasAnswers(answers);
  const showKey = anyAnswers(answers);
  const filtersActive = types.length > 0 || brands.length > 0 || flags.weather || flags.ibis || flags.evf || flags.easy || flags.af || flags.sensors.length > 0 || flags.lens.length > 0;
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
                  <legend>Great at</legend>
                  {[['easy', 'Easy to use'], ['af', 'Fast autofocus']].map(([k, l]) => (
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
            {showKey && (
              <div className="score-key" aria-label="Match score key">
                <Tip term="match">Match score</Tip>
                <span className="k great">85%+</span>
                <span className="k good">75–84%</span>
                <span className="k ok">65–74%</span>
                <span className="k low">Under 65%</span>
              </div>
            )}
            <div className="sort"><span id="sort-l">Sort by</span>
              <Select label="Sort by" value={sort} onChange={setSort} menuAlign="right" options={[{ value: 'match', label: 'Best match' }, { value: 'low', label: 'Price: low to high' }, { value: 'high', label: 'Price: high to low' }, { value: 'light', label: 'Lightest first' }]} />
            </div>
          </div>
          {items.length === 0 ? (
            <div className="empty">
              <img className="sticker-lg" src={`${import.meta.env.BASE_URL}hero-rabbit.webp`} alt="" />
              {q.trim() ? (
                <>
                  <h2>No cameras match “{q.trim()}”</h2>
                  <p>Check the spelling, or try a brand or type like Canon or mirrorless.</p>
                  <button className="btn primary" onClick={() => setSearch('')}>Clear search</button>
                </>
              ) : filtersActive ? (
                <>
                  <h2>Nothing fits these filters</h2>
                  <p>Remove a filter or two to see more cameras.</p>
                  <button className="btn primary" onClick={() => setFilters({ ...DEFAULT_FILTERS })}>Clear filters</button>
                </>
              ) : (
                <>
                  <h2>No cameras to show</h2>
                  <p>Your answers are narrowing things too far. Start the quiz over to see everything again.</p>
                  <button className="btn primary" onClick={() => { resetAnswers(); go('#/survey'); }}>Start over</button>
                </>
              )}
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
