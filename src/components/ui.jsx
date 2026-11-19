import { useId, useState } from 'react';
import { Camera, Heart, User, ArrowLeft, HelpCircle, X, Columns, Check, Save as Bookmark, Search } from './Icon.jsx';
import { useApp } from '../lib/store.jsx';
import { LogoFull } from './Logo.jsx';
import { hasAnswers } from '../lib/match.js';
import { GLOSSARY } from '../lib/glossary.js';
import { HAS_IMAGE } from '../data/images.js';
import { CAMERAS } from '../data/cameras.js';

export function Tip({ term, children }) {
  const g = GLOSSARY[term];
  const id = useId();
  const [open, setOpen] = useState(false);
  const { answers } = useApp();
  if (!g) return children ?? null;
  return (
    <span className="tip" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children ?? g.label}
      <button
        type="button"
        className="tip-btn"
        aria-label={`What is ${g.label.toLowerCase()}?`}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      >
        <HelpCircle size={15} aria-hidden />
      </button>
      {open && (
        <span role="tooltip" id={id} className="tip-pop">
          <strong>{g.label}</strong>
          {g.plain}
          {answers.exp === 3 && g.more ? <em> {g.more}</em> : null}
        </span>
      )}
    </span>
  );
}

export function CameraImg({ cam, className = '' }) {
  if (HAS_IMAGE.has(cam.id)) {
    return <img className={`cam-img ${className}`} src={`${import.meta.env.BASE_URL}cameras/${cam.id}.jpg`} alt={`${cam.name} camera`} loading="lazy" />;
  }
  return (
    <div className={`cam-img cam-ph ${className}`} role="img" aria-label={`${cam.name} (photo not available)`}>
      <img className="ph-art" src={`${import.meta.env.BASE_URL}no-photo.webp`} alt="" />
      <small>Photo not available yet</small>
    </div>
  );
}

export function BackButton({ fallback = '#/', label = 'Back' }) {
  const { back } = useApp();
  return (
    <button className="back" onClick={() => back(fallback)}>
      <ArrowLeft size={20} aria-hidden /> {label}
    </button>
  );
}

export function Header() {
  const { go, saved, user, setAuthOpen, openAuth, signOut, route, setCompareList, saveProfile, profile, answers, filters, search, setSearch } = useApp();
  const [menu, setMenu] = useState(false);
  const home = route.path === '/';
  const quiz = route.path === '/survey';
  if (home) return null;
  const results = route.path === '/results';
  const hasFilters = filters && (filters.type !== 'All' || filters.brands?.length || filters.weather || filters.ibis || filters.evf);
  const profileSaved = !!profile && JSON.stringify(profile.answers) === JSON.stringify(answers) && JSON.stringify(profile.filters ?? {}) === JSON.stringify(filters);
  return (
    <header className={`topbar ${quiz ? 'quiz-bar' : ''}`}>
      <a className="logo" href="#/" aria-label="Camdex home">
        <LogoFull />
      </a>
      {results && (
        <div className="top-tools">
          <label className="search-bar">
            <Search size={22} aria-hidden />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cameras, brands or types" aria-label="Search cameras" />
          </label>
          <button className="btn compare-top" onClick={() => { setCompareList(saved.slice(0, 3)); go('#/compare'); }}>
            <Columns size={18} aria-hidden /> Compare{saved.length > 1 ? ` (${Math.min(saved.length, 3)})` : ''}
          </button>
        </div>
      )}
      {!quiz && !results && (
      <nav className="topnav" aria-label="Main">
        {home ? (
          <button className="btn sm" onClick={() => setAuthOpen(true)}>Log in</button>
        ) : (
          <>
        {!home && (
          <button className={`pill ${route.path === '/results' ? 'on' : ''}`} onClick={() => go('#/results')}>
            <Camera size={18} aria-hidden /> <span className="lbl">Browse</span>
          </button>
        )}
        <button
          className={`pill ${route.path === '/compare' ? 'on' : ''}`}
          onClick={() => {
            setCompareList(saved.slice(0, 3));
            go('#/compare');
          }}
        >
          <Columns size={18} aria-hidden /> <span className="lbl">Compare</span>
        </button>
        {user && <div className="acct">
          <button className="avatar" aria-label={user ? `Account menu for ${user.name}` : 'Sign in or create account'} aria-expanded={menu} onClick={() => (user ? setMenu(!menu) : setAuthOpen(true))}>
            {user ? user.name.slice(0, 2).toUpperCase() : 'G'}
          </button>
          {menu && user && (
            <div className="menu">
              <p>Signed in as <strong>{user.name}</strong></p>
              <button className="btn ghost sm" onClick={() => { signOut(); setMenu(false); }}>Sign out</button>
            </div>
          )}
        </div>}
          </>
        )}
      </nav>
      )}
      {!quiz && !user && (
        <div className="auth-btns">
          <button className="btn ghost sm" onClick={() => openAuth('in')}>Log in</button>
          <button className="btn primary sm" onClick={() => openAuth('create')}>Sign up</button>
        </div>
      )}
    </header>
  );
}

export function Toast() {
  const { toast, setAuthOpen, user } = useApp();
  if (!toast) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <Check size={18} aria-hidden /> <span>{toast}</span>
      {!user && toast.includes('account') && (
        <button className="toast-link" onClick={() => setAuthOpen(true)}>Create account</button>
      )}
    </div>
  );
}

export function AuthModal() {
  const { authOpen, setAuthOpen, authMode: mode, setAuthMode: setMode } = useApp();
  const [email, setEmail] = useState('');
  if (!authOpen) return null;
  // prototype: the form is display only, nothing is sent or signed in
  const submit = (e) => e.preventDefault();
  return (
    <div className="backdrop" onClick={() => setAuthOpen(false)}>
      <div className="modal auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-h" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn close" aria-label="Close" onClick={() => setAuthOpen(false)}><X size={20} /></button>
        <h2 id="auth-h">{mode === 'create' ? 'Create your account' : 'Welcome back'}</h2>
        <p className="auth-sub">{mode === 'create' ? 'Save cameras and keep your answers on every device.' : 'Log in to see your saved cameras.'}</p>
        <form onSubmit={submit}>
          <div className="auth-field">
            <label htmlFor="em">Email</label>
            <input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="auth-field">
            <label htmlFor="pw">Password</label>
            <input id="pw" type="password" required minLength={4} placeholder="Password" autoComplete={mode === 'create' ? 'new-password' : 'current-password'} />
          </div>
          <button className="btn primary block" type="submit">{mode === 'create' ? 'Create account' : 'Log in'}</button>
        </form>
        <p className="auth-switch">
          {mode === 'create' ? 'Already have an account?' : 'New to Camdex?'}{' '}
          <button type="button" onClick={() => setMode(mode === 'create' ? 'in' : 'create')}>{mode === 'create' ? 'Log in' : 'Create an account'}</button>
        </p>
      </div>
    </div>
  );
}

export const camById = (id) => CAMERAS.find((c) => c.id === id);

const BADGE_ICON = {
  'Great for video': 'videocam',
  'Pocket-sized': 'compress',
  'Easy to use': 'thumb_up',
  'Blurry backgrounds': 'blur_on',
  'Tracks moving subjects': 'center_focus_strong',
  'Weather-sealed': 'water_drop',
};

export function BadgeList({ items, ...rest }) {
  return (
    <ul className="chips" {...rest}>
      {items.map((b) => (
        <li key={b} data-b={b}><span className="mi" aria-hidden="true">{BADGE_ICON[b] ?? 'check'}</span>{b}</li>
      ))}
    </ul>
  );
}
