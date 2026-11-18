# Camdex: camera finder (first-pass prototype)

Desktop web app for INSY 334 Team 8. See `../PRD - Camera Discovery App.md` for the product spec and `../TABLET SKETCHPADs.pdf` for the sketches this follows.

```bash
cd frame-app
npm install
npm run dev      # http://localhost:5173
```

## Screens
Landing → 6-question diagonal survey → results dashboard (fit %, editable answers, filters, save) → compare (2–3) → camera detail (story, tooltips, sample photos) → saved.

## Data and limits
- `src/data/cameras.js`: 50 real cameras. **Prices are approximate CAD retail, not live. Used ranges are rough estimates. Ease/autofocus/video scores are team judgement, not measurements.** Verify specs and prices before presenting them as fact.
- Photos: 36 from Wikimedia Commons (`scripts/fetch-images.mjs`, credits in `src/data/imageCredits.json`, shown on each camera page). 14 cameras show a placeholder. Add a licensed photo as `public/cameras/<id>.jpg` and add the id to `src/data/images.js`.
- Matching is a transparent weighted score in `src/lib/match.js`. Budget is a hard filter.
- Sign-in is a mock: nothing is sent or stored. Saved cameras and answers live in `localStorage`.
- Not built yet: AI photo identification, 3D/360° camera view, real sample-photo gallery and raffle.

See `DESIGN.md` for the visual style guide.

`node scripts/contrast.mjs` checks WCAG contrast of the main colour pairs. Run WebAIM on the final Figma palette too.
