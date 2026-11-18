import { HAS_IMAGE } from './images.js';
// 50 real cameras. Prices are APPROXIMATE Canadian retail prices (rounded, body or common kit),
// NOT live. Used ranges are rough estimates. Scores (ease/af/video, 1–5) are team judgement
// calls for a prototype, not lab measurements.
// columns: id, brand, model, search (image search text), type, sensor, mp, grams, price, usedLo, usedHi,
//          ease, af, video, ibis, weather, evf, year, mount, story
const rows = [
  ['canon-g7x3','Canon','PowerShot G7 X Mark III','Canon PowerShot G7 X Mark III','Compact','1-inch',20,304,1000,650,800,4,3,4.5,0,0,0,2019,'Fixed lens','A pocket camera that became a vlogging favourite. It can live stream straight to YouTube, which was unusual when it launched.'],
  ['sony-zv1','Sony','ZV-1','Sony ZV-1','Compact','1-inch',20,294,850,550,700,4.5,4,5,0,0,0,2020,'Fixed lens','Built for vloggers: a windscreen for the mic and a button that blurs the background instantly.'],
  ['sony-zv1m2','Sony','ZV-1 II','Sony ZV-1 II','Compact','1-inch',20,292,1100,800,950,4.5,4,4.5,0,0,0,2023,'Fixed lens','Swapped the zoom for a wider lens so you can film yourself at arm\'s length.'],
  ['sony-rx100-7','Sony','RX100 VII','Sony RX100 VII','Compact','1-inch',20,302,1700,1100,1400,3,5,4,0,0,1,2019,'Fixed lens','Packs a 24–200mm zoom and fast tracking autofocus into a camera that fits in a jacket pocket.'],
  ['ricoh-gr3x','Ricoh','GR IIIx','Ricoh GR IIIx','Compact','APS-C',24,262,1300,1000,1200,3,3,2,1,0,0,2021,'Fixed lens','A street photographer\'s favourite: small enough to carry everywhere and quiet enough not to be noticed.'],
  ['fuji-x100vi','Fujifilm','X100VI','Fujifilm X100VI','Compact','APS-C',40,521,2500,2200,2500,3.5,4,4,1,1,1,2024,'Fixed lens','Demand after launch was so high that stores kept long waiting lists for months.'],
  ['lumix-lx100-2','Panasonic','Lumix LX100 II','Panasonic Lumix LX100 II','Compact','Micro Four Thirds',17,392,1300,800,1000,3,3,3.5,0,0,1,2018,'Fixed lens','A physical aperture ring on the lens and a shutter dial on top make settings feel hands-on.'],
  ['canon-v10','Canon','PowerShot V10','Canon PowerShot V10','Compact','1-inch',20,211,550,400,500,5,3,4,0,0,0,2020,'Fixed lens','A tiny vlogging camera with a built-in stand so it can sit on a table by itself.'],
  ['fuji-xhalf','Fujifilm','X-half','Fujifilm X-half','Compact','1-inch',18,240,1000,850,950,4.5,2.5,2.5,0,0,0,2025,'Fixed lens','Styled after half-frame film cameras, with a vertical-first design made for sharing.'],
  ['fuji-xt50','Fujifilm','X-T50','Fujifilm X-T50','Mirrorless','APS-C',40,438,2100,1700,1900,3.5,4,4.5,1,0,1,2024,'Fuji X','A 40-megapixel sensor in a small body with a dial for choosing film-style colour looks.'],
  ['nikon-p950','Nikon','Coolpix P950','Nikon Coolpix P950','Compact','Small (1/2.3-inch)',16,1005,1000,600,800,3,2.5,3,1,0,1,2019,'Fixed lens','Its 83× zoom reaches roughly 2000mm equivalent, enough to photograph the craters on the moon.'],
  ['sony-rx10-4','Sony','RX10 IV','Sony RX10 IV','Compact','1-inch',20,1095,2300,1500,1900,3,5,4.5,1,1,1,2017,'Fixed lens','A do-everything camera: a 24–600mm lens and very fast autofocus, so one camera handles travel and wildlife.'],
  ['canon-sx740','Canon','PowerShot SX740 HS','Canon PowerShot SX740 HS','Compact','Small (1/2.3-inch)',20,299,480,250,350,5,2,3.5,0,0,0,2019,'Fixed lens','A 40× zoom in a body that fits in a coat pocket: a classic travel zoom.'],
  ['gopro-13','GoPro','HERO13 Black','GoPro HERO13 Black','Action','Small (1/1.9-inch)',27,154,550,300,420,5,3,4,1,1,0,2024,'Fixed lens','GoPro\'s founder started it to film his own surfing. The very first model strapped a film camera to your wrist.'],
  ['dji-pocket3','DJI','Osmo Pocket 3','DJI Osmo Pocket 3','Action','1-inch',9,179,700,500,600,5,4,4.5,1,0,0,2023,'Fixed lens','A tiny three-axis gimbal is built into the camera so handheld video stays smooth.'],
  ['sony-zve10','Sony','ZV-E10','Sony ZV-E10','Mirrorless','APS-C',24,343,900,600,750,4.5,4,4.5,0,0,0,2021,'Sony E','Sony\'s first interchangeable-lens camera designed for vloggers, with a mode that switches focus to products you hold up.'],
  ['sony-zve10-2','Sony','ZV-E10 II','Sony ZV-E10 II','Mirrorless','APS-C',26,377,1300,1000,1150,4.5,4.5,5,0,0,0,2024,'Sony E','Adds sharper 4K video and better autofocus tracking to the vlogger formula.'],
  ['sony-a6100','Sony','a6100','Sony a6100','Mirrorless','APS-C',24,396,900,650,800,3.5,4,3,0,0,1,2019,'Sony E','Brings the fast autofocus of Sony\'s pricier cameras into a beginner-priced body.'],
  ['sony-a6400','Sony','a6400','Sony a6400','Mirrorless','APS-C',24,403,1200,800,1000,3.5,4.5,3.5,0,1,1,2019,'Sony E','Famous for "Real-time Tracking" autofocus that sticks to a moving subject.'],
  ['sony-a6700','Sony','a6700','Sony a6700','Mirrorless','APS-C',26,493,1900,1600,1800,3.5,5,4.5,1,1,1,2023,'Sony E','Brought AI-based subject recognition to Sony\'s APS-C line: it can spot people, animals, birds and vehicles.'],
  ['canon-r50','Canon','EOS R50','Canon EOS R50','Mirrorless','APS-C',24,375,950,650,800,4.5,4,4,0,0,1,2023,'Canon RF','Has a beginner-friendly Creative Assist mode that lets you preview effects like blur and brightness.'],
  ['canon-r100','Canon','EOS R100','Canon EOS R100','Mirrorless','APS-C',24,356,650,450,550,5,3,3,0,0,1,2023,'Canon RF','Canon\'s lowest-priced mirrorless: a light, simple step up from a phone.'],
  ['canon-r10','Canon','EOS R10','Canon EOS R10','Mirrorless','APS-C',24,429,1100,850,1000,4,4.5,4,0,0,1,2022,'Canon RF','Shoots up to 15 frames per second with its mechanical shutter, which is rare at this price.'],
  ['canon-r7','Canon','EOS R7','Canon EOS R7','Mirrorless','APS-C',33,612,2000,1500,1750,3,5,4.5,1,1,1,2022,'Canon RF','Canon\'s flagship APS-C camera, with stabilization in the body and tracking that can lock onto birds and animals.'],
  ['fuji-xt30-2','Fujifilm','X-T30 II','Fujifilm X-T30 II','Mirrorless','APS-C',26,378,1200,850,1050,3.5,3.5,4,0,0,1,2021,'Fuji X','Retro dials and Fujifilm\'s film-simulation colours give JPEGs a finished look straight from the camera.'],
  ['fuji-xs20','Fujifilm','X-S20','Fujifilm X-S20','Mirrorless','APS-C',26,491,1700,1300,1500,4,4,5,1,0,1,2023,'Fuji X','A vlogging-friendly Fujifilm with a dedicated vlog mode and a large battery.'],
  ['fuji-xt5','Fujifilm','X-T5','Fujifilm X-T5','Mirrorless','APS-C',40,557,2300,1900,2100,3,4,4,1,1,1,2022,'Fuji X','A 40-megapixel sensor in a classic dial-based body: lots of detail for big prints and tight crops.'],
  ['fuji-xe4','Fujifilm','X-E4','Fujifilm X-E4','Mirrorless','APS-C',26,364,1000,700,850,4,3.5,3.5,0,0,1,2021,'Fuji X','A slim rangefinder-style body with a screen that flips up so you can frame selfies.'],
  ['nikon-z50ii','Nikon','Z50 II','Nikon Z50 II','Mirrorless','APS-C',21,550,1300,1100,1250,4,4.5,4.5,0,0,1,2024,'Nikon Z','Adds film-inspired picture presets Nikon calls "Imaging Recipes" and flagship-grade autofocus.'],
  ['nikon-zfc','Nikon','Z fc','Nikon Z fc','Mirrorless','APS-C',21,445,1100,750,900,4,3.5,3,0,0,1,2021,'Nikon Z','Dials and styling borrowed from a film-era Nikon SLR.'],
  ['nikon-z30','Nikon','Z30','Nikon Z30','Mirrorless','APS-C',21,405,900,600,750,4.5,3.5,4.5,0,0,0,2022,'Nikon Z','Nikon left out the viewfinder on this one: it\'s aimed squarely at vloggers and creators.'],
  ['lumix-g100','Panasonic','Lumix G100','Panasonic Lumix G100','Mirrorless','Micro Four Thirds',20,412,800,500,650,4.5,2.5,4,0,0,1,2020,'Micro Four Thirds','Includes a three-microphone system that tracks your face to focus the sound on you.'],
  ['om-5','OM System','OM-5','OM System OM-5','Mirrorless','Micro Four Thirds',20,414,1800,1300,1500,3,4,3.5,1,1,1,2022,'Micro Four Thirds','Weather-sealed, with stabilization powerful enough to shoot handheld at very slow shutter speeds.'],
  ['om-em10-4','OM System','OM-D E-M10 Mark IV','Olympus OM-D E-M10 Mark IV','Mirrorless','Micro Four Thirds',20,383,900,550,700,4,3,3,1,0,1,2020,'Micro Four Thirds','A compact retro-styled starter body with an in-body stabilizer, unusual at this price.'],
  ['sony-a7iv','Sony','a7 IV','Sony Alpha 7 IV','Mirrorless','Full frame',33,658,3300,2500,2800,3,5,4.5,1,1,1,2021,'Sony E','The all-rounder that many photo-and-video shooters pick as their first full-frame camera.'],
  ['sony-a7c2','Sony','a7C II','Sony Alpha 7C II','Mirrorless','Full frame',33,514,3100,2700,2900,3.5,5,4.5,1,1,1,2023,'Sony E','Full-frame power in a body close to the size of cameras with smaller sensors.'],
  ['sony-a7iii','Sony','a7 III','Sony Alpha 7 III','Mirrorless','Full frame',24,650,2000,1500,1800,3,4.5,4,1,1,1,2018,'Sony E','Launched in 2018 and still a popular good-value full-frame choice on the used market.'],
  ['canon-r8','Canon','EOS R8','Canon EOS R8','Mirrorless','Full frame',24,461,2000,1600,1800,3.5,4.5,4.5,0,0,1,2023,'Canon RF','Canon\'s lightest full-frame body, with autofocus borrowed from higher-end models.'],
  ['canon-rp','Canon','EOS RP','Canon EOS RP','Mirrorless','Full frame',26,485,1300,800,1000,4,3,3,0,0,1,2019,'Canon RF','One of the most affordable full-frame mirrorless cameras ever made.'],
  ['nikon-z5ii','Nikon','Z5 II','Nikon Z5II','Mirrorless','Full frame',24,700,2300,2000,2200,3.5,4.5,4.5,1,1,1,2025,'Nikon Z','A mid-range full-frame Nikon with autofocus from its higher-end line.'],
  ['lumix-s5ii','Panasonic','Lumix S5 II','Panasonic Lumix S5 II','Mirrorless','Full frame',24,740,2400,1900,2100,3,4,5,1,1,1,2023,'L-mount','Panasonic\'s first camera with phase-detect autofocus, long a weakness in its video-first line.'],
  ['canon-r6ii','Canon','EOS R6 Mark II','Canon EOS R6 Mark II','Mirrorless','Full frame',24,670,3000,2400,2700,3,5,5,1,1,1,2022,'Canon RF','Known for tracking the eyes of people and animals, and for shooting up to 40 frames per second electronically.'],
  ['nikon-zf','Nikon','Zf','Nikon Zf','Mirrorless','Full frame',25,710,2900,2300,2600,3,4.5,4,1,1,1,2023,'Nikon Z','Classic styling from film-era Nikon SLRs, with modern autofocus underneath.'],
  ['sony-zve1','Sony','ZV-E1','Sony ZV-E1','Mirrorless','Full frame',12,483,2800,2200,2500,4,4.5,5,1,0,0,2023,'Sony E','A 12-megapixel full-frame sensor chosen for low-light video rather than huge prints.'],
  ['canon-t7','Canon','EOS Rebel T7','Canon EOS Rebel T7','DSLR','APS-C',24,475,550,300,400,4,2,2.5,0,0,1,2018,'Canon EF','A classic entry-level DSLR: a bright optical viewfinder and access to decades of affordable lenses.'],
  ['canon-sl3','Canon','EOS Rebel SL3','Canon EOS Rebel SL3','DSLR','APS-C',24,449,800,450,600,4.5,3,3.5,0,0,1,2019,'Canon EF','Among the lightest DSLRs ever made, with a flip-out screen.'],
  ['nikon-d3500','Nikon','D3500','Nikon D3500','DSLR','APS-C',24,365,700,350,500,4.5,2.5,2.5,0,0,1,2018,'Nikon F','Known for very long battery life, around 1,500 shots per charge.'],
  ['nikon-d7500','Nikon','D7500','Nikon D7500','DSLR','APS-C',21,720,1400,900,1100,3,3.5,3.5,0,1,1,2017,'Nikon F','A tough, weather-sealed DSLR popular for sports and wildlife on a budget.'],
  ['pentax-kf','Pentax','KF','Pentax KF','DSLR','APS-C',24,710,1000,750,900,3.5,2.5,2.5,1,1,1,2021,'Pentax K','Weather-sealed with in-body stabilization, among the more affordable cameras that offer both.'],
  ['canon-m50ii','Canon','EOS M50 Mark II','Canon EOS M50 Mark II','Mirrorless','APS-C',24,387,800,500,650,4.5,3.5,3.5,0,0,1,2020,'Canon EF-M','Popular with first-time vloggers thanks to a flip-out screen and live-streaming support.'],
];

const sensorScore = { 'Full frame': 5, 'APS-C': 4, 'Micro Four Thirds': 3, '1-inch': 2.5 };

export const ALL_CAMERAS = rows.map(
  ([id, brand, model, search, type, sensor, mp, grams, price, usedLo, usedHi, ease, af, video, ibis, weather, evf, year, mount, story]) => {
    const sensorQ = sensorScore[sensor] ?? 1;
    const interchangeable = mount !== 'Fixed lens';
    return {
      id, brand, model, name: `${brand} ${model}`, search, type, sensor, mp, grams, price,
      usedLo, usedHi, ease, af, video, ibis: !!ibis, weather: !!weather, evf: !!evf, year, mount, story,
      sensorQ,
      bokeh: Math.min(5, sensorQ + (interchangeable ? 0.5 : 0)),
      lowLight: sensorQ,
    };
  }
);

// Only cameras with a real photo are shown in the app. Once a photo is added (HAS_IMAGE in images.js is regenerated
// by scripts/fetch-images.mjs), the camera appears automatically.
export const CAMERAS = ALL_CAMERAS.filter((c) => HAS_IMAGE.has(c.id));

export const BY_ID = Object.fromEntries(CAMERAS.map((c) => [c.id, c]));
export const BRANDS = [...new Set(CAMERAS.map((c) => c.brand))].sort();
export const TYPES = ['Compact', 'Mirrorless', 'DSLR', 'Action'];
