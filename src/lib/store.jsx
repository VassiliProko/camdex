import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { DEFAULT_ANSWERS } from './match.js';

export const DEFAULT_FILTERS = { types: [], brands: [], weather: false, ibis: false, evf: false, lens: [], weights: [], sensors: [], easy: false, vid: false, af: false };

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

// ---- tiny hash router: #/path?query ----------------------------------------
function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  return { path, query: Object.fromEntries(new URLSearchParams(qs)) };
}

export function AppProvider({ children }) {
  const [route, setRoute] = useState(parseHash);
  const [answers, setAnswers] = useState(() => ({ ...DEFAULT_ANSWERS, ...load('frame.answers', {}) }));
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_FILTERS, ...load('frame.filters', {}) }));
  const [saved, setSaved] = useState(() => load('frame.saved', []));
  const [profile, setProfile] = useState(() => load('frame.profile', null));
  const [user, setUser] = useState(() => load('frame.user', null));
  const [compare, setCompare] = useState([]);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const on = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => localStorage.setItem('frame.answers', JSON.stringify(answers)), [answers]);
  useEffect(() => localStorage.setItem('frame.filters', JSON.stringify(filters)), [filters]);
  useEffect(() => localStorage.setItem('frame.saved', JSON.stringify(saved)), [saved]);
  useEffect(() => localStorage.setItem('frame.profile', JSON.stringify(profile)), [profile]);
  useEffect(() => localStorage.setItem('frame.user', JSON.stringify(user)), [user]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const go = useCallback((to) => {
    const from = window.location.hash || '#/';
    setHistory((h) => [...h, from]);
    window.location.hash = to;
  }, []);
  const back = useCallback((fallback = '#/') => {
    setHistory((h) => {
      const prev = h[h.length - 1];
      window.location.hash = prev ?? fallback;
      return h.slice(0, -1);
    });
  }, []);

  const value = useMemo(
    () => ({
      route, go, back, prevRoute: history[history.length - 1], search, setSearch, answers, setAnswers, filters, setFilters, saved, profile, user, compare, toast, authOpen, setAuthOpen,
      patch: (p) => setAnswers((a) => ({ ...a, skipped: false, ...p })),
      resetAnswers: () => { setAnswers({ ...DEFAULT_ANSWERS }); setFilters({ ...DEFAULT_FILTERS }); },
      skip: () => setAnswers((a) => ({ ...a, skipped: true })),
      notify: setToast,
      toggleSaved: (id) =>
        setSaved((s) => {
          const on = s.includes(id);
          setToast(on ? 'Removed from saved' : user ? 'Saved to your account' : 'Saved on this device. Create a free account to keep it everywhere.');
          return on ? s.filter((x) => x !== id) : [...s, id];
        }),
      toggleCompare: (id) =>
        setCompare((c) => {
          if (c.includes(id)) return c.filter((x) => x !== id);
          if (c.length >= 3) {
            setToast('You can compare up to 3 cameras. Remove one first.');
            return c;
          }
          return [...c, id];
        }),
      setCompareList: setCompare,
      saveProfile: () => {
        setProfile({ answers, filters, at: Date.now() });
        setToast(user ? 'Preferences saved to your account' : 'Preferences saved on this device. Create a free account to keep them everywhere.');
      },
      signIn: (u) => {
        setUser(u);
        setAuthOpen(false);
        setToast(`Welcome, ${u.name}!`);
      },
      signOut: () => {
        setUser(null);
        setToast('Signed out. Your saved items stay on this device.');
      },
    }),
    [route, go, back, history, search, answers, filters, saved, profile, user, compare, toast, authOpen]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
