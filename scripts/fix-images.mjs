import fs from 'node:fs';
const UA = 'FrameStudentProject/0.1 (class prototype)';
const credits = JSON.parse(fs.readFileSync('src/data/imageCredits.json','utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (h) => (h || '').replace(/<[^>]+>/g, '').trim();
// id -> [search queries, must-include words (lowercase)]
const fixes = {
  'canon-g7x3': [['G7 X Mark III','Canon G7X Mark III'], ['g7','mark iii'], ['g5x','sx740']],
  'dji-pocket3': [['DJI Osmo Pocket 3'], ['pocket 3'], ['actress','recording']],
  'nikon-zf': [['Nikon Zf camera','Nikon Zf'], ['zf'], ['man using','laowa']],
  'canon-m50ii': [['Canon EOS M50 Mark II','Canon M50 Mark II'], ['m50'], ['m6']],
  'om-5': [['OM System OM-5 camera','OM-5 OM System'], ['om-5','om 5'], ['macro','90 mm']],
  'sony-a7iv': [['Sony A7 IV','Sony ILCE-7M4','Sony Alpha 7 IV'], ['7 iv','a7 iv','a7iv','7m4'], ['7r']],
  'gopro-13': [['GoPro HERO13','GoPro Hero 13 Black','GoPro Hero'], ['gopro'], []],
  'sony-rx10-4': [['Sony RX10 IV','Sony Cyber-shot RX10 IV','Sony DSC-RX10M4'], ['rx10'], []],
  'lumix-lx100-2': [['Lumix LX100','Panasonic LX100'], ['lx100'], []],
  'sony-a6100': [['Sony A6100','Sony Alpha 6100','Sony ILCE-6100'], ['6100'], []],
  'sony-a7c2': [['Sony A7C II','Sony Alpha 7C II','Sony ILCE-7CM2'], ['7c'], []],
  'canon-sl3': [['Canon EOS 250D','Canon Rebel SL3','Canon EOS 200D'], ['250d','sl3','200d'], []],
  'sony-zve10-2': [['Sony ZV-E10 II','Sony ZV-E10M2'], ['e10 ii','e10ii','e10m2'], []],
  'fuji-xhalf': [['Fujifilm X-half','X-half Fujifilm'], ['half'], []],
};
for (const [id,[qs,must,bad]] of Object.entries(fixes)) {
  const had = fs.existsSync(`public/cameras/${id}.jpg`);
  let chosen=null;
  for (const q of qs) {
    const url='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=15&format=json&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=700&gsrsearch='+encodeURIComponent(q);
    let j; for (let i=0;i<5;i++){ const t=await (await fetch(url,{headers:{'User-Agent':UA}})).text(); try{j=JSON.parse(t);break;}catch{await sleep(8000*(i+1));} }
    const pages=Object.values(j?.query?.pages||{}).sort((a,b)=>a.index-b.index);
    chosen = pages.find(p=>{const ii=p.imageinfo?.[0]; if(!ii||!/image\/(jpeg|png)/.test(ii.mime))return false; const t=p.title.toLowerCase(); return must.some(m=>t.includes(m)) && !bad.some(b=>t.includes(b)) && !/(box|manual|logo|diagram|lens)/.test(t);});
    await sleep(2500);
    if (chosen) break;
  }
  if (!chosen) { if (had && bad.length) { fs.unlinkSync(`public/cameras/${id}.jpg`); delete credits[id]; } console.log('still none', id, had?'(removed bad)':''); continue; }
  const ii=chosen.imageinfo[0];
  const img=await fetch(ii.thumburl||ii.url,{headers:{'User-Agent':UA}});
  if(!img.ok){console.log('dl fail',id);continue;}
  fs.writeFileSync(`public/cameras/${id}.jpg`,Buffer.from(await img.arrayBuffer()));
  const m=ii.extmetadata||{};
  credits[id]={file:chosen.title,page:ii.descriptionurl,artist:strip(m.Artist?.value),license:strip(m.LicenseShortName?.value)};
  console.log('ok',id,'←',chosen.title);
  fs.writeFileSync('src/data/imageCredits.json',JSON.stringify(credits,null,1));
}
fs.writeFileSync('src/data/imageCredits.json',JSON.stringify(credits,null,1));
