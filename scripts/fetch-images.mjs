// Downloads one freely-licensed product photo per camera from Wikimedia Commons.
import { ALL_CAMERAS as CAMERAS } from '../src/data/cameras.js';
import fs from 'node:fs';
const UA = 'FrameStudentProject/0.1 (class prototype)';
const credits = fs.existsSync('src/data/imageCredits.json') ? JSON.parse(fs.readFileSync('src/data/imageCredits.json','utf8')) : {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJson(u){ for (let i=0;i<5;i++){ const r = await fetch(u,{headers:{'User-Agent':UA}}); const t = await r.text(); try { return JSON.parse(t);} catch { await sleep(8000*(i+1)); } } throw new Error('rate limited'); }
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const strip = (h) => (h || '').replace(/<[^>]+>/g, '').trim();
for (const c of CAMERAS) {
  if (fs.existsSync(`public/cameras/${c.id}.jpg`)) continue;
  const q = `${c.search}`;
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=15&format=json&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=700&gsrsearch=' + encodeURIComponent(q);
  try {
    const j = await getJson(url);
    const pages = Object.values(j.query?.pages || {}).sort((a, b) => a.index - b.index);
    const want = norm(c.search).split(' ').filter((w) => w.length > 1);
    const good = pages.filter((p) => {
      const ii = p.imageinfo?.[0]; if (!ii) return false;
      if (!/image\/(jpeg|png)/.test(ii.mime)) return false;
      const t = norm(p.title);
      return want.every((w) => t.includes(w)) && !/(box|manual|logo|diagram|lens only|sample|taken with)/.test(t);
    });
    const p = good[0];
    if (!p) { console.log('NO IMAGE', c.id); continue; }
    const ii = p.imageinfo[0];
    const img = await fetch(ii.thumburl || ii.url, { headers: { 'User-Agent': UA } });
    if (!img.ok) { console.log('DL FAIL', c.id, img.status); continue; }
    fs.writeFileSync(`public/cameras/${c.id}.jpg`, Buffer.from(await img.arrayBuffer()));
    const m = ii.extmetadata || {};
    credits[c.id] = { file: p.title, page: ii.descriptionurl, artist: strip(m.Artist?.value), license: strip(m.LicenseShortName?.value) };
    console.log('ok', c.id, '←', p.title);
  } catch (e) { console.log('ERR', c.id, e.message); }
  await sleep(2500); fs.writeFileSync('src/data/imageCredits.json', JSON.stringify(credits, null, 1));
}
fs.writeFileSync('src/data/imageCredits.json', JSON.stringify(credits, null, 1));
console.log(Object.keys(credits).length, 'of', CAMERAS.length);
