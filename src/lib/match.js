import { CAMERAS } from '../data/cameras.js';

export const DEFAULT_ANSWERS = { exp: null, goals: [], budget: 1000, budgetMin: 0, weight: null, video: null, musts: null, skipped: false };

/** Upgrades answers saved by the older quiz (photo/mix/video and the blur question). */
export function migrateAnswers(a) {
  const out = { ...a };
  const oldVideo = { photo: 'none', mix: 'clips', video: 'serious' };
  if (oldVideo[out.video]) out.video = oldVideo[out.video];
  if ('blur' in out) {
    if (out.musts == null && out.blur) out.musts = out.blur === 'yes' ? ['blur'] : [];
    delete out.blur;
  }
  return out;
}

/** Question 6: things the user does not want to give up (up to two). */
export const MUSTS = [
  { id: 'easy', short: 'Simple controls', label: 'Simple controls', hint: 'Beginner-friendly menus and modes' },
  { id: 'blur', short: 'Blurry backgrounds', label: 'Soft, blurry backgrounds', hint: 'Sharp subject, dreamy background' },
  { id: 'ibis', short: 'Stabilization', label: 'Steady shots without a tripod', hint: 'Built-in stabilization' },
  { id: 'weather', short: 'Weather sealing', label: 'Survives rain and dust', hint: 'Weather-sealed body' },
  { id: 'evf', short: 'Viewfinder', label: 'A viewfinder', hint: 'Frame shots in bright sun' },
  { id: 'lenses', short: 'Swappable lenses', label: 'Swap lenses as I grow', hint: 'Interchangeable lenses' },
];

function mustScore(c, m) {
  switch (m) {
    case 'easy': return (c.ease - 1) / 4;
    case 'blur': return c.bokeh / 5;
    case 'ibis': return c.ibis ? 1 : 0;
    case 'weather': return c.weather ? 1 : 0;
    case 'evf': return c.evf ? 1 : 0;
    case 'lenses': return c.mount !== 'Fixed lens' ? 1 : 0;
    default: return 0.5;
  }
}

const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const port = (g) => clamp(1 - (g - 200) / 1000);

export const GOALS = [
  { id: 'travel', label: 'Travel & everyday', hint: 'Light, versatile, easy' },
  { id: 'portrait', label: 'People & portraits', hint: 'Faces, friends, soft backgrounds' },
  { id: 'landscape', label: 'Landscapes & nature', hint: 'Detail and tough bodies' },
  { id: 'action', label: 'Sports & wildlife', hint: 'Fast-moving subjects' },
  { id: 'street', label: 'Street & low light', hint: 'Night, cafés, city life' },
  { id: 'video', label: 'Videos & vlogs', hint: 'Filming yourself or events' },
];

function goalScore(c, g) {
  switch (g) {
    case 'travel': return 0.5 * port(c.grams) + 0.3 * (c.af / 5) + 0.2 * (c.ease / 5);
    case 'portrait': return 0.5 * (c.bokeh / 5) + 0.3 * (c.af / 5) + 0.2 * clamp(c.mp / 40);
    case 'landscape': return 0.4 * (c.sensorQ / 5) + 0.3 * clamp(c.mp / 40) + 0.3 * (c.weather ? 1 : 0);
    case 'action': return 0.8 * (c.af / 5) + 0.2 * (c.evf ? 1 : 0);
    case 'street': return 0.4 * port(c.grams) + 0.4 * (c.lowLight / 5) + 0.2 * (c.af / 5);
    case 'video': return c.video / 5;
    default: return 0.5;
  }
}

const photoScore = (c) => 0.5 * (c.sensorQ / 5) + 0.5 * clamp(c.mp / 40);

export function weightScore(c, w) {
  if (w === 'pocket') return c.grams <= 350 ? 1 : clamp(1 - (c.grams - 350) / 200);
  if (w === 'bag') return c.grams <= 700 ? 1 : clamp(1 - (c.grams - 700) / 300);
  return 1;
}

/** Returns { fit (0-1), parts } for a camera and a set of answers. */
export function scoreCamera(c, a) {
  const parts = [];
  const add = (key, weight, score) => weight > 0 && parts.push({ key, w: weight, s: clamp(score) });
  add('ease', { 1: 2.5, 2: 1.5, 3: 0.5 }[a.exp] ?? 0, (c.ease - 1) / 4);
  if (a.goals.length) add('goals', 3, a.goals.reduce((t, g) => t + goalScore(c, g), 0) / a.goals.length);
  add('budget', 1, c.price <= a.budget ? 0.7 + 0.3 * (c.price / a.budget) : 0);
  if (a.weight && a.weight !== 'any') add('weight', 2, weightScore(c, a.weight));
  if (a.video === 'none') add('video', 1.5, photoScore(c));
  if (a.video === 'clips') add('video', 1, 0.4 * (c.video / 5) + 0.6 * photoScore(c));
  if (a.video === 'self') add('video', 3, 0.6 * (c.video / 5) + 0.4 * (c.selfie ? 1 : 0));
  if (a.video === 'serious') add('video', 2.5, 0.75 * (c.video / 5) + 0.25 * (c.ibis ? 1 : 0));
  (a.musts || []).forEach((m) => add(`must:${m}`, 2.5, mustScore(c, m)));
  const tw = parts.reduce((t, p) => t + p.w, 0) || 1;
  const fit = parts.reduce((t, p) => t + p.w * p.s, 0) / tw;
  return { fit, parts };
}

export const answeredCount = (a) =>
  [a.exp, a.goals.length, a.weight, a.video, a.musts != null].filter(Boolean).length + 1; // budget always has a value

/** True once at least one quiz question has been answered (even if the quiz was skipped later). */
export const anyAnswers = (a) => !!(a.exp || a.goals.length || a.weight || a.video || a.musts != null);

export const hasAnswers = (a) => !a.skipped && !!(a.exp || a.goals.length || a.weight || a.video || a.musts?.length);

export function rank(a, filters = {}) {
  const personal = hasAnswers(a);
  return CAMERAS.filter((c) => {
    if (c.price > a.budget || c.price < (a.budgetMin || 0)) return false;
    if (filters.types?.length && !filters.types.includes(c.type)) return false;
    if (filters.brands?.length && !filters.brands.includes(c.brand)) return false;
    if (filters.weather && !c.weather) return false;
    if (filters.ibis && !c.ibis) return false;
    if (filters.evf && !c.evf) return false;
    if (filters.lens?.length === 1 && (filters.lens[0] === 'fixed') !== (c.mount === 'Fixed lens')) return false;
    if (filters.weights?.length && c.grams > Math.max(...filters.weights)) return false;
    if (filters.sensors?.length && !filters.sensors.includes(c.sensor.startsWith('Small') ? 'Small' : c.sensor)) return false;
    if (filters.easy && c.ease < 4) return false;
    if (filters.vid && c.video < 4.5) return false;
    if (filters.af && c.af < 4.5) return false;
    return true;
  })
    .map((c) => {
      const { fit, parts } = scoreCamera(c, a);
      return { c, fit: personal ? Math.min(99, Math.round(fit * 100)) : null, raw: fit, parts };
    })
    .sort((x, y) => y.raw - x.raw || x.c.price - y.c.price);
}

// ---- Plain-language helpers -------------------------------------------------
export const APPLE_G = 180;
export const IPHONE_G = 171;
export function apples(g) {
  const n = Math.round((g / APPLE_G) * 2) / 2;
  return n <= 1 ? 'about 1 apple' : `about ${n} apples`;
}
export function weightLike(g) {
  return `${apples(g)} · ${(g / IPHONE_G).toFixed(1)}× an iPhone`;
}

export const money = (n) => `$${n.toLocaleString('en-CA')}`;

export function badges(c) {
  const b = [];
  if (c.video >= 4.5) b.push('Great for video');
  if (c.grams <= 350) b.push('Pocket-sized');
  if (c.ease >= 4.5) b.push('Easy to use');
  if (c.bokeh >= 4.5) b.push('Blurry backgrounds');
  if (c.af >= 4.5) b.push('Tracks moving subjects');
  if (c.weather) b.push('Weather-sealed');
  return b.slice(0, 3);
}

export function tradeoff(c) {
  if (c.grams > 700) return `Heavier to carry (${apples(c.grams)})`;
  if (c.ease <= 3) return 'Takes more learning than simpler cameras';
  if (!c.evf && c.type !== 'Action') return 'No viewfinder, you frame shots on the screen';
  if (c.af <= 2.5) return 'Slower autofocus for moving subjects';
  if (c.sensorQ < 2.5) return 'Smaller sensor: less blur and weaker in dim light';
  if (c.video <= 2.5) return 'Basic video features';
  return 'Fewer lens choices than larger systems';
}

const REASONS = {
  ease: { n: 'Easy to pick up and start shooting', e: 'Streamlined controls and automatic modes when you want them' },
  goals: { n: 'Good at the things you want to photograph', e: 'Strong match for your selected subjects' },
  weight: { n: 'Easy to carry the way you plan to', e: 'Fits your size and weight limit' },
  video: { n: 'Handles the kind of video you want', e: 'Video specs suit how you plan to film' },
  'must:easy': { n: 'Simple to use from day one', e: 'Approachable controls and guided modes' },
  'must:blur': { n: 'Makes that blurry-background look', e: 'Large sensor for shallow depth of field' },
  'must:ibis': { n: 'Keeps handheld shots steady', e: 'In-body image stabilization' },
  'must:weather': { n: 'Handles rain and dust', e: 'Weather-sealed body' },
  'must:evf': { n: 'Has a viewfinder for bright days', e: 'Built-in electronic viewfinder' },
  'must:lenses': { n: 'Lets you add lenses later', e: 'Interchangeable-lens mount' },
  budget: { n: 'Fits your budget', e: 'Within your budget' },
};
export function reasons(parts, a, n = 2) {
  const tone = a.exp === 3 ? 'e' : 'n';
  return parts
    .filter((p) => p.s >= 0.7 && p.key !== 'budget')
    .sort((x, y) => y.w * y.s - x.w * x.s)
    .slice(0, n)
    .map((p) => REASONS[p.key]?.[tone])
    .filter(Boolean);
}

export function fitLabel(pct) {
  if (pct == null) return '';
  if (pct >= 85) return 'Great match';
  if (pct >= 70) return 'Good match';
  return 'Possible match';
}

export function betterFor(c) {
  const opts = [
    ['video', c.video, 'video'],
    ['autofocus', c.af, 'moving subjects'],
    ['ease', c.ease, 'beginners'],
    ['portable', port(c.grams) * 5, 'travel and carrying all day'],
    ['blur', c.bokeh, 'blurry-background portraits'],
  ];
  return opts.sort((x, y) => y[1] - x[1])[0][2];
}
