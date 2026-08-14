# Salasel landing page — content and identity design

## Status

Approved content direction and approved hero visual direction. The remaining section references guide implementation without requiring pixel-for-pixel reproduction on every viewport.

## Purpose

Introduce Salasel to new visitors. Make three facts immediately clear:

1. Salasel is a focused learning platform with curated series.
2. Salasel also has an optional Chrome extension.
3. The app and extension work together, while each remains useful on its own.

Primary audience: people discovering Salasel for first time.

## Brand idea

`Salasel` carries two related meanings: series/playlists and chains. The page should use this as a gentle metaphor: meaningful learning can be connected into a steady practice. It must not imply restriction or force. Users choose their own learning path and choose whether to use YouTube or extension.

Primary headline:

- Arabic: **اختر ما ينفعك، واثبت عليه.**
- English: **Learn with intention. Stay the course.**

The English line is an equivalent idea, not a literal translation. Arabic copy should always be written naturally, never translated word-for-word from English.

## Approved visual direction

The authoritative desktop hero reference is:

- `exports/salasel-homepage-designs/sections/01-hero.png`

It replaces the previous hero design. Preserve its overall hierarchy and mood:

- Full-width deep navy canvas with restrained emerald illumination.
- Spacious navigation across the top rather than a heavy boxed header.
- Existing Salasel wordmark at the top right.
- Large glowing 3D Salasel mark centered above the headline.
- Arabic headline as the dominant type, followed by the short English equivalent.
- Two equal product-choice panels along the bottom: Salasel app and Chrome extension.
- Minimal information density, generous negative space, thin borders, and quiet shadows.

The reference is authoritative for desktop composition, hierarchy, palette, and atmosphere. It is not a bitmap to place behind the whole page. Text, navigation, buttons, and product panels must remain real accessible interface elements.

## Product model

### Salasel app

Salasel is native place for intentional learning. It lets people discover curated educational, awareness, and personal-growth series; watch in a focused environment; follow progress; bookmark content; and keep notes.

Users can watch within Salasel. They can also choose YouTube for any series available there.

### Chrome extension

The Chrome extension is optional focus companion for YouTube. It lets users decide which distractions to hide, including recommendations, autoplay, end-screen cards, Shorts, comments, and homepage feed. It also provides per-video notes and can surface a continue-watching card for last Salasel series.

Nothing is hidden until user enables its toggle. The extension does not replace app; it helps users remain on their chosen learning path when they watch on YouTube.

## Page narrative and sections

### 1. Hero — one identity, two products

Use primary headline and short supporting copy around intention, discipline, and choosing useful learning over endless feeds.

Present two visually distinct, equally prominent product paths:

- **Salasel App** — explore curated learning series.
- **Chrome Extension** — make YouTube calmer and stay on track.

Hero actions:

- `Explore Salasel` / Arabic equivalent, linking to app.
- `Add to Chrome` / Arabic equivalent, linking to Chrome Web Store after publication. Until then, use a clearly marked temporary destination only if needed.

The first viewport must make app-versus-extension distinction obvious without needing to play media or scroll.

#### Hero implementation notes

- Use the approved hero reference named above as the desktop target.
- Use the existing extracted logo artwork from `exports/salasel-homepage-designs/extracted-assets/01-hero-logo-glow.png`. Do not regenerate the logo.
- Build the two decorative edge-network motifs with regular CSS rather than extracting or using a raster image. The old `01-hero-connectors.png` asset is not part of the revised hero implementation.
- The CSS motifs should use thin low-contrast green lines, small nodes, and a few softly glowing active nodes. They belong at the far left and right edges and must never reduce headline or CTA readability.
- Animation may add slow node pulses, slight line shimmer, and very small drifting/parallax movement. Motion must remain ambient, not attention-seeking, and must not alter layout.
- Decorative lines must use `pointer-events: none`, remain behind interactive content, and avoid expensive continuous filters over the full viewport.
- Respect `prefers-reduced-motion`: stop drift and shimmer, leaving a static low-contrast motif.
- Product screenshots/widgets are implementation content and should use the real assets supplied later or the current files in `extracted-assets/`; do not generate replacement product UI.

### 2. What Salasel means

Briefly introduce name’s two meanings: series organize knowledge; chains connect intention, focus, and practice. Keep tone broad and welcoming: education, awareness, and personal growth. Do not position page with exclusively religious wording.

### 3. Salasel app — native learning home

Show app as complete product, not a companion to YouTube. Explain discovery, focused watching, progress, bookmarks, and notes.

Suggested outcome framing: users have a clear place to return to, rather than an endless feed deciding what comes next.

### 4. Chrome extension — YouTube on user’s terms

Explain that users remain free to watch on YouTube. Extension removes only distractions they choose, supports notes, and helps resume selected Salasel series. Lead with control and focus, never shame or coercion.

### 5. One learning flow

Show connection between products:

1. Choose a meaningful series in Salasel.
2. Watch in Salasel or choose YouTube.
3. On YouTube, extension can reduce distractions and preserve route back to series.

Key line: **Learn where you prefer. Stay connected to what matters.** This is supporting copy, not hero headline.

### 6. Product demonstration

Use one short, real product demo video (about 30–45 seconds), not stock or decorative footage. It should demonstrate distinction and connection:

1. Discover and start a series in Salasel app.
2. Show user choosing to continue on YouTube.
3. Show extension toggles, distraction-free view, and notes panel.
4. End with continue-watching flow returning user to chosen series.

Demo should be captioned and have Arabic and English caption tracks or language-specific versions. It supplements two visible product cards; it must not be sole explanation of products.

### 7. Privacy and openness

Use direct, verifiable claims:

- No account, tracking, analytics, or sale of user data.
- Learning progress, preferences, and notes stay in user’s browser.
- Extension preferences may use browser sync controlled by user’s browser account; developer cannot access that sync data.
- Feedback is transmitted only if user explicitly submits it.
- Project source is open and linked from GitHub.

Avoid absolute phrase “nothing ever leaves your device,” because voluntarily submitted feedback is sent by user action and browser sync is handled by browser provider.

### 8. Final action

Repeat both product actions with outcome-focused labels:

- `Begin with a series`.
- `Make YouTube calmer`.

### 9. Footer

Include:

- Salasel mark and one-sentence mission.
- GitHub/source link.
- App Privacy Policy.
- Extension Privacy Policy (required stable URL for Chrome Web Store submission; intended path: `/extension/privacy`).
- Feedback.
- Licence link.

Do not add generic copyright notice. Project uses Waqf Public License, so licence link communicates project terms more truthfully.

## Languages and accessibility

Arabic and English are first-class landing-page languages. Both require complete, native marketing copy and correct RTL/LTR layout. Japanese remains available through existing site language support but is not a primary landing-page marketing promise.

All video content needs captions. Media must have a text summary or surrounding copy so product explanation does not rely on video alone. CTA labels must name destination clearly: app versus Chrome extension.

## Responsive hero behaviour

Mobile is an intentional adaptation, not a compressed copy of the desktop reference.

### Desktop (`>= 1024px`)

- Follow the approved hero composition closely.
- Keep the large centered logo, headline, subtitle, and two side-by-side product panels visible as one coherent opening scene.
- Show both CSS edge-network motifs with subtle animation.

### Tablet (`768px–1023px`)

- Reduce logo and headline scale while preserving the same order.
- Keep product choices side by side only when their copy and buttons remain comfortable; otherwise stack them.
- Reduce network density and movement.

### Mobile (`< 768px`)

- Use a compact header with only essential navigation and language control; a menu may hold secondary links.
- Center the logo and keep the headline readable in roughly two to three lines.
- Stack the Salasel app and Chrome extension choices vertically as full-width blocks.
- Prefer one simplified network motif, or hide both when they compete with content or performance.
- Reduce or disable parallax and glow intensity. Never require hover to reveal information.
- Do not force the entire desktop scene into one viewport. Clear hierarchy and usable CTAs matter more than matching desktop coordinates.

## Asset handoff

Claude or another implementation model should treat these paths as the source of truth:

- Hero and section references: `exports/salasel-homepage-designs/sections/`
- Current extracted implementation assets: `exports/salasel-homepage-designs/extracted-assets/`
- Logo and approved-image references: `exports/salasel-homepage-designs/references/`

Use the user-replaced files in `extracted-assets/` as-is. Do not regenerate, reinterpret, crop, or replace them unless the user explicitly supplies a newer asset. Product screenshots may be swapped for final official screenshots later without changing section structure.

## Content boundaries

- No founder story or “why we made Salasel” section at this stage.
- No generic copyright line.
- Do not describe Salasel merely as a YouTube layer; it is a standalone learning platform.
- Do not claim extension is needed to use Salasel or YouTube.
- Do not make privacy claims broader than behaviour described above.

## Decisions deferred to implementation design

- Fine visual details outside the approved hero direction.
- Exact CSS construction of the edge-network motifs and their ambient animation timings.
- Final official app and extension screenshots.
- Exact destination and timing for Chrome Web Store CTA before listing is live.
- Full Arabic and English body copy.
- App privacy-policy content and permanent routes.
- Demo recording, captions, and hosting.
