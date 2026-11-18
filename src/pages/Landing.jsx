import { ArrowRight } from '../components/Icon.jsx';
import { useApp } from '../lib/store.jsx';
import { LogoFull } from '../components/Logo.jsx';

// a row of photo frames in the style of design-tool selections: outline, corner handles and a name label
const FRAMES = [
  { id: 'canon-r10', r: -6, dy: 6, k: 1 },
  { id: 'sony-zv1m2', r: 4, dy: -4, k: 0.9 },
  { id: 'canon-r100', r: -3, dy: 8, k: 1.05 },
  { id: 'sony-zve10', r: 5, dy: 0, k: 1 },
  { id: 'fuji-x100vi', r: -5, dy: 6, k: 0.92 },
  { id: 'canon-r50', r: 6, dy: -2, k: 1.05 },
  { id: 'sony-zv1', r: -4, dy: 4, k: 1 },
  { id: 'nikon-z50ii', r: 3, dy: -6, k: 0.95 },
  { id: 'dji-pocket3', r: -6, dy: 8, k: 1.05 },
  { id: 'fuji-xt50', r: 5, dy: 0, k: 0.9 },
  { id: 'nikon-z30', r: -3, dy: 6, k: 1 },
  { id: 'canon-r7', r: 4, dy: -4, k: 1.05 },
  { id: 'canon-g7x3', r: -5, dy: 2, k: 0.92 },
  { id: 'fuji-xs20', r: 6, dy: 6, k: 1 },
];

function PhotoFrames() {
  return (
    <div className="frames-row" aria-hidden="true">
      {FRAMES.map((f) => (
        <div key={f.id} className="pframe" style={{ '--k': f.k, transform: `translateY(${f.dy}px) rotate(${f.r}deg)` }}>
          <span className="pframe-label">photo-{f.id}</span>
          <img src={`${import.meta.env.BASE_URL}cameras/${f.id}.jpg`} alt="" />
          <i className="h tl" /><i className="h tr" /><i className="h bl" /><i className="h br" />
        </div>
      ))}
    </div>
  );
}

export default function Landing() {
  const { go, skip, resetAnswers, setAuthOpen } = useApp();
  return (
    <main className="page landing">
      <button className="btn ghost sm login-float" onClick={() => setAuthOpen(true)}>Log in</button>
      <section className="hero-center">
        <div className="hero-content">
          <p className="wordmark"><LogoFull /></p>
          <h1>
            <span className="line">
              Find your{' '}
              <span className="pill-word">
                <img className="sticker" src={`${import.meta.env.BASE_URL}hero-camera.webp`} alt="" />
                camera
              </span>
              ,{' '}
              <span className="soft">without</span>
            </span>
            <span className="line">
              <span className="soft">the</span>{' '}
              <span className="pill-word">
                <img className="sticker" src={`${import.meta.env.BASE_URL}hero-rabbit.webp`} alt="" />
                research rabbit hole
              </span>
              .
            </span>
          </h1>
          <p className="lead">Answer 6 quick questions and we'll rank the best cameras for you</p>
          <div className="cta-row">
            <button className="btn primary lg" onClick={() => { resetAnswers(); go('#/survey'); }}>
              Start quiz <ArrowRight size={20} aria-hidden />
            </button>
            <button className="btn ghost lg" onClick={() => { skip(); go('#/results'); }}>Just let me browse</button>
          </div>
        </div>
        <PhotoFrames />
      </section>
      <footer className="site-foot">
        <div className="foot-inner">
          <LogoFull className="on-dark" />
          <hr />
          <p>Fall 2026</p>
          <p>Camdex is a camera discovery app prototype created for INSY 334, Design Thinking for User Experience.</p>
          <p>Created by Amandine, Ryan, Vassili, Tian, Jennifer and Megan.</p>
        </div>
      </footer>
    </main>
  );
}
