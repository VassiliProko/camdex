import { useApp } from '../lib/store.jsx';
import CameraCard from '../components/CameraCard.jsx';
import { BackButton, camById } from '../components/ui.jsx';
import { scoreCamera, hasAnswers, GOALS, money } from '../lib/match.js';

export default function Saved() {
  const { saved, answers, profile, go, user, setAuthOpen, setCompareList } = useApp();
  const personal = hasAnswers(answers);
  const items = saved.map(camById).filter(Boolean).map((c) => {
    const s = scoreCamera(c, answers);
    return { c, fit: personal ? Math.min(99, Math.round(s.fit * 100)) : null, parts: s.parts };
  });
  const pa = profile?.answers;
  return (
    <main className="page saved">
      <div className="page-head">
        <BackButton fallback="#/results" />
        <h1><span className="pill-word"><img className="sticker" src={`${import.meta.env.BASE_URL}hero-camera.webp`} alt="" />Saved</span></h1>
      </div>

      {!user && (
        <div className="banner">
          <div><strong>Saved on this device only.</strong> Create a free account to keep your cameras and answers everywhere. Totally optional.</div>
          <button className="btn primary sm" onClick={() => setAuthOpen(true)}>Create account</button>
        </div>
      )}

      <section className="rail-card">
        <h2>Saved preferences</h2>
        {pa ? (
          <p>
            {pa.goals.map((g) => GOALS.find((x) => x.id === g)?.label).filter(Boolean).join(' + ') || 'No subjects chosen'} · up to {money(pa.budget)}
            {' '}<small className="muted">Saved {new Date(profile.at).toLocaleDateString('en-CA')}</small>
          </p>
        ) : (
          <p className="muted">You have not saved any preferences yet. Use "Save my preferences" on your matches page.</p>
        )}
        <button className="btn secondary sm" onClick={() => go('#/results')}>Open my matches</button>
      </section>

      <h2 className="sec">Saved cameras</h2>
      {items.length === 0 ? (
        <div className="empty"><img className="sticker-lg" src={`${import.meta.env.BASE_URL}hero-rabbit.webp`} alt="" /><h2>No saved cameras yet</h2><p>Tap the heart on any camera to keep it here.</p><button className="btn primary" onClick={() => go('#/results')}>Find cameras</button></div>
      ) : (
        <>
          <div className="btn-row"><button className="btn primary" disabled={items.length < 2} onClick={() => { setCompareList(saved.slice(0, 3)); go('#/compare'); }}>Compare saved (up to 3)</button></div>
          <div className="grid g3">{items.map((it) => <CameraCard key={it.c.id} item={it} rank={-1} />)}</div>
        </>
      )}
    </main>
  );
}
