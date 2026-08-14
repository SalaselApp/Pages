# Salasel landing-page asset finalization spec

## Status

Extraction and composition work is approved. Decorative background removal remains a manual post-processing prerequisite before production integration.

This document supersedes the earlier eight-PNG extraction spec. It records the final accepted assets, the CSS solution for Section 3, intentionally omitted work, and the remaining background-removal step.

## Goal

Preserve the approved landing-page artwork while using exact Salasel product screenshots wherever real UI appears. Keep opaque extracted masters unchanged, derive transparent decorative assets separately, and implement Section 3 as a live HTML/CSS screenshot stack instead of an AI-generated composite.

## Final source files

Generated section references:

- `exports/salasel-homepage-designs/sections/01-hero.png`
- `exports/salasel-homepage-designs/sections/02-meaning.png`
- `exports/salasel-homepage-designs/sections/03-salasel-app.png`
- `exports/salasel-homepage-designs/sections/05-learning-flow.png`
- `exports/salasel-homepage-designs/sections/08-final-action.png`

Real product screenshots used by the accepted work:

- Home/catalog: `/tmp/codex-clipboard-845344b9-f4d5-4ed2-9d61-5e08c881a3dd.png`
- Series detail: `/tmp/codex-clipboard-6f02f4b0-516b-4dc1-816b-944add35b180.png`
- Focused player and notes: `/tmp/codex-clipboard-59824fb7-a4c1-4781-8629-cec2aa5994d5.png`
- Real extension-open screenshot: `/home/amjad/Pictures/salasel-extension.png`

Project-bound copies of the three app screenshots live under:

- `exports/salasel-homepage-designs/prototype-section-3/assets/home-catalog.png`
- `exports/salasel-homepage-designs/prototype-section-3/assets/series-detail.png`
- `exports/salasel-homepage-designs/prototype-section-3/assets/player-notes.png`

## Accepted opaque masters

Keep these files unchanged as recoverable source masters:

1. `exports/salasel-homepage-designs/extracted-assets/01-hero-logo-glow.png`
   - Central Salasel logo with its glow.
   - Separate from the connectors.

2. `exports/salasel-homepage-designs/extracted-assets/01-hero-connectors.png`
   - Both green connector lines.
   - Separate from the logo.

3. `exports/salasel-homepage-designs/extracted-assets/02-hero-extension-real.png`
   - Privacy-safe crop of the real open Salasel extension.

4. `exports/salasel-homepage-designs/extracted-assets/03-hero-app-real.png`
   - Exact real Salasel home/catalog screenshot.

5. `exports/salasel-homepage-designs/extracted-assets/04-section-2-left-chain.png`
   - Section 2 chain composition entering from the left.

6. `exports/salasel-homepage-designs/extracted-assets/07-section-5-clean-chain-background.png`
   - Approved full chain background with widgets removed and malformed links repaired.
   - Its approved SHA-256 is `3fefc7b3feb91495c23e2821ebdd7b073966921026e4884ebe15b135d6f11fa2`.

7. `exports/salasel-homepage-designs/extracted-assets/08-section-8-left-logo-background.png`
   - Approved oversized left-side Salasel logo artwork.
   - Its approved SHA-256 is `0dda2206c2b20664a85b6fab10daa52854d9357b26663dbed1c7e64ed334a751`.

## Section 3: accepted live composition

Do not use an AI-generated screenshot composite for Section 3. Use the three exact screenshot PNGs as `<img>` elements and create the visual with CSS.

Accepted prototype:

- Source: `exports/salasel-homepage-designs/prototype-section-3/index.html`
- Preview: `exports/salasel-homepage-designs/prototype-section-3/preview.png`

Locked visual values for the perspective variant:

- Parent plane: `rotateX(3deg) rotateY(18deg) rotateZ(1.6deg)`
- Front frame width: `92%`
- Middle frame width: `86%`
- Rear frame width: `74%`
- Middle placement: `translate3d(-145px, 110px, -70px) scale(.97)`
- Rear placement: `translate3d(-240px, 205px, -140px) scale(.92)`
- Middle opacity: `.94`
- Rear opacity: `.82`
- Middle screenshot focal point: `58% center`
- Rear screenshot focal point: `62% center`
- Screens use `object-fit: cover` for non-destructive center cropping.
- Rounded frames, restrained teal edges, shadows, and simulated thickness remain CSS effects.

The screenshot files must remain byte-identical. CSS may crop their visible viewport but must not redraw, rewrite, translate, or regenerate their UI.

## Pending background removal

Background removal is not complete. Preserve every opaque master listed above and create transparent derivatives beside them under:

`exports/salasel-homepage-designs/extracted-assets/transparent/`

Required transparent derivatives:

1. `01-hero-logo-glow-transparent.png`
   - Remove only the surrounding background.
   - Preserve soft glow falloff and antialiased logo edges.

2. `01-hero-connectors-transparent.png`
   - Remove the background while preserving both complete green lines and their soft illumination.

3. `04-section-2-left-chain-transparent.png`
   - Isolate the full chain without clipping links, highlights, or natural contact shadows needed by the design.

4. `08-section-8-left-logo-transparent.png`
   - Isolate the dimensional logo while preserving edge lighting and internal shadows.

Do not remove backgrounds from:

- Real app or extension screenshots.
- Section 3 screenshot-stack source images.
- `07-section-5-clean-chain-background.png`, because it is intentionally a full-canvas background.

Transparent derivatives must never overwrite their opaque masters.

## Privacy treatment

- Do not expose personal subscriptions, account names, avatars, browser tabs, or unrelated account identity.
- The accepted extension crop omits the personal top-tab area and unrelated right-side account controls.
- Public Salasel titles, thumbnails, playlists, and application UI may remain.

## Intentionally omitted or deprecated work

- Section 4 requires no extracted composite; production may place a real screenshot directly.
- Sections 6 and 7 require no extracted image assets.
- `exports/salasel-homepage-designs/extracted-assets/05-section-3-app-real.png` is a deprecated generated draft. Do not use it in production.
- `exports/salasel-homepage-designs/extracted-assets/06-section-4-extension-real.png` is a deprecated draft. Do not use it in production.
- Do not delete deprecated files unless separately authorized; the spec only excludes them from production use.

## Final workflow

1. Keep all accepted opaque masters unchanged.
2. Produce the four transparent derivatives listed above.
3. Inspect transparent edges against both light and dark test backgrounds.
4. Verify approved Section 5 and Section 8 master hashes remain unchanged.
5. Use exact app screenshots plus the locked CSS values for Section 3.
6. Integrate only accepted masters or their transparent derivatives into the landing page.
7. Run desktop and responsive visual QA against the generated section references.

## Acceptance checks

- Four transparent derivative PNGs exist under `extracted-assets/transparent/`.
- Each derivative contains a real alpha channel and has no background halo, clipped glow, or missing chain/logo geometry.
- Opaque masters remain byte-identical.
- Section 3 uses all three exact screenshots in the accepted front/middle/rear order.
- Section 3 retains the locked 18-degree Y rotation and rear-layer exposure.
- No AI-generated UI composite is used for Section 3.
- Section 4 draft is not used.
- Section 5 and Section 8 approved hashes still match this spec.
- No personal identity-bearing browser or YouTube data appears in production assets.

## Non-goals

- No further image generation.
- No redesign of Salasel or YouTube UI.
- No destructive modification of opaque masters.
- No background removal from screenshots or the Section 5 full-canvas background.
- No new extraction work for Sections 4, 6, or 7.
