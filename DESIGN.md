# Camdex design language

Reference for building every screen. The landing page is the source of truth; the rest of the site follows it.
Code lives in `src/styles.css` (tokens in `:root`, the "homepage style" layer at the bottom of the file).

## Feel

Playful but calm. A quiet cool-grey canvas, big confident sans-serif type, soft pill shapes, and one or two cute
sticker illustrations as punctuation. Friendly like a sticker sheet, never noisy. Everything is rounded; nothing is
sharp, boxed, textured or shadowed.

## Colour

| Role | Token | Value | Use |
|---|---|---|---|
| Canvas | `--bg` | `#f6f7f9` | Page background (cool off-white) |
| Surface | `--card` | `#ffffff` | Cards, panels, modals |
| Ink | `--ink` | `#0b0f1a` | Headlines, body, key words |
| Soft ink | `--soft` | `#4a5670` | De-emphasised words in a headline ("without", "the"), secondary headings |
| Muted | `--muted` | `#5a6272` | Sub-copy, hints, captions |
| Primary | `--primary` | `#2570ec` | The one main action per view (white text, passes AA) |
| Primary hover | `--primary-hover` | `#1b61d6` | |
| Pill grey | `--pill-bg` | `#e8e9ec` | Secondary buttons, chips, highlight pills behind words |
| Pill grey hover | `--pill-bg-hover` | `#dcdde1` | |
| Hairline | `--line` | `#e3e6ec` | Dividers, card outlines |
| Good | `--good` | `#0a6b43` | Fit / "why it matches" |

Rules
- Greys are neutral. Hover states shift to a slightly darker grey, never a blue tint.
- Blue is reserved for the primary action, links, focus and selected progress. Do not use it for decoration.
- Quiz questions keep their per-question accent (`--p-deep` / `--p-bright`), used only for the selected answer, the
  progress ring and the primary button on that screen.
- Yellow (`#ffdf66`) is only for the "Keep your picks" save card. Flat fill, no texture.

## Type

- One family: **Geist Variable** (sans). The old Instrument Serif / DM Serif headlines are retired.
- Headlines: weight **600**, tracking **-0.035em**, line-height about 1.15 to 1.3, `text-wrap: balance`.
  Landing h1 `clamp(26px, 5vw, 62px)`; page titles 44 to 56px; section titles 20 to 28px; card titles 18px.
- Body 16px / 1.5. Lead copy 17 to 20px in `--muted`.
- Small labels: sentence case, 13 to 15px, weight 500 to 600. No all-caps, no italics.
- Numbers use tabular figures (prices, fit %, counts).

### The two-tone headline
Key words are ink; connective words are `--soft`. Important nouns sit in a **word pill** (see below).
> Find your **[camera]**, <soft>without</soft> <soft>the</soft> **[research rabbit hole]**.

## Shape

- Buttons, chips, tags, fit badges, tabs, avatar, icon buttons: fully round (`999px`).
- Cards, panels, answer options, menus, inputs: `--r` 16px (`--r-s` 12px for small items). Modals 24px.
- Hairline `1px solid var(--line)` on white cards over the grey canvas. No drop shadows (menus and popovers excepted,
  one soft shadow only).
- No checkerboard / pixel textures anywhere.

## Signature elements

**Word pill** (`.pill-word`): a grey (`--pill-bg`) full-round capsule behind one key word, optionally with a sticker
at its left that overlaps the edge and is tilted -8deg with a thin white outline. Use at most two per screen, in the
main title only.

**Stickers**: flat cartoon illustrations with a white outline (`hero-camera.webp`, `hero-rabbit.webp`). Use for the
page title pill and for empty or friendly states. Never as repeating decoration.

**Wordmark**: the pill `camdex` logo image (`LogoFull`). Centered and large on the landing page, top-left in the
header elsewhere.

## Buttons

- Primary: blue `--primary`, white text, 48px tall, pill, weight 600. One per view.
- Secondary (default `.btn`): `--pill-bg` fill, ink text, no border.
- Ghost: transparent, muted text, grey pill on hover. Used for "Log in", "Skip", "Back".
- Paired buttons are the same size. Hover changes only the background colour (no lift, scale or shadow).
- Min touch target 44px.

## Layout and spacing

- Content is centered on the grey canvas, max width about 1200px; generous vertical space (48 to 72px between blocks).
- Headings sit directly on the canvas; content sits in white rounded cards.
- Header: sticky, 64px, translucent canvas colour with a hairline bottom border, logo left, text pills right.
- Footer: small grey print under a hairline, left aligned.

## Motion

Subtle. Colour fades of 150ms on hover. The quiz progress ring animates. Respect `prefers-reduced-motion`.

## Accessibility

Visible focus ring (2px `--focus`, 2px offset). Body text 4.5:1 or better; `node scripts/contrast.mjs` checks the main
pairs. Never rely on colour alone for selected state (selected options also show a check).

## Do / Don't

- Do: sans headlines, soft-grey connective words, one pill highlight, round buttons, white rounded cards.
- Do: keep copy short, friendly and first-person-plural ("we'll rank the best cameras for you").
- Don't: serif type, italics for emphasis, uppercase tracking, checker patterns, sharp 4px corners, coloured shadows,
  extra accent colours beyond the quiz palette.
