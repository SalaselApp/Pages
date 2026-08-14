<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Salasel landing-page agent guide

## Mission

Build a polished, minimal, bilingual Salasel marketing site. Salasel App and Salasel Chrome Extension are separate products that work together; neither is subordinate to the other. Match the approved visual direction while keeping text, controls, forms, and product panels as real accessible UI.

This repository uses Next.js 16, React 19, TypeScript, Tailwind CSS 4, and the App Router under `src/app`. Target a static export suitable for static hosting. Do not add server-only behaviour to this repository.

## Read before changing code

Read these local sources in order:

1. `docs/specs/2026-08-10-landing-page-design.md` — approved content, product model, sections, responsive behaviour, and privacy wording.
2. `docs/specs/2026-08-11-landing-page-asset-extraction-design.md` — accepted/deprecated assets and exact Section 3 composition.
3. `.design-reference/landing-page/sections/` — full-size section comps, used as visual targets only.
4. `.design-reference/landing-page/README.md` — asset manifest.
5. `public/images/landing/` — production image assets.

`.design-reference/` is intentionally Git-ignored. It is local design context, not production input. Never link to it from application code and never render an entire section comp as the website.

Some moved specs retain old `exports/salasel-homepage-designs/...` paths. Map them as follows:

- `extracted-assets/*.png` maps to `public/images/landing/extracted/*.png`.
- `prototype-section-3/assets/*.png` maps to `public/images/landing/product-screenshots/*.png`.
- `references/new-logo-*.png` maps to `public/images/landing/brand/*.png`.
- `sections/` and remaining reference files map to `.design-reference/landing-page/`.

Instruction precedence:

1. User's newest direct instruction.
2. Approved specs.
3. Approved section comps and asset manifest.
4. This file.
5. Starter-page conventions.

Do not invent product behaviour, URLs, privacy claims, analytics, or marketing facts. Report unresolved destinations and placeholders.

## Documentation and MCP use

- Use Context7 MCP when available before choosing or coding APIs for Next.js 16, React 19, the selected i18n library, and any animation library. Query the exact installed version where possible.
- For Next.js, also inspect the bundled current-version docs in `node_modules/next/dist/docs/`; these override stale model memory.
- If Context7 is unavailable, continue with bundled Next.js docs and official upstream documentation. Do not block the task merely because the MCP is absent.
- Record any compatibility decision that affects static export, routing, images, or locale generation.

## Architecture constraints

- Keep App Router source in `src/app`; reusable UI in `src/components`; locale/content helpers in focused modules under `src`.
- Configure Next.js for static export. Every route must be build-time renderable.
- No Server Actions, API routes, middleware-dependent locale negotiation, request-time cookies/headers, databases, authentication, or runtime image optimizer.
- Ensure image handling works in exported output; verify current Next.js requirements before configuring `next/image`.
- Default to Server Components. Add `"use client"` only around interactive controls or animation islands that require browser APIs.
- Keep sections independent and data-driven enough that final screenshots, copy, and CTA URLs can be swapped without layout rewrites.
- Do not edit `.next/`, `out/`, or other generated output.

## Internationalization

- Arabic and English are first-class and complete. Arabic is the primary visual language.
- Use an established Next-compatible i18n solution; prefer `next-intl` if its current Next.js 16 static-export path is compatible. Verify with Context7 and bundled docs before installing or configuring it.
- Generate locale routes statically. Do not depend on middleware for essential routing.
- Store copy outside JSX in locale message files. Do not duplicate page components per language.
- Set `lang` and `dir` correctly at document/layout level. Arabic uses RTL; English uses LTR.
- Use CSS logical properties. Mirror alignment, directional icons, navigation order, and motion where direction changes meaning.
- Write natural Arabic and equivalent English copy. Never force word-for-word translation.
- Language switching must preserve the equivalent page/section when practical and remain keyboard accessible.

## Visual implementation

- Treat `01-hero.png` as authoritative for desktop hero hierarchy, palette, scale, and atmosphere.
- Treat other comps as strong visual direction, not pixel coordinates to force onto every viewport.
- Use supplied production assets unchanged. Do not redraw, regenerate, translate, crop destructively, or bake UI text into them.
- Respect deprecated assets named in the extraction spec. Do not use them in production.
- Product UI must use real supplied screenshots. Never generate fake app or extension UI.
- Keep screenshot containers replaceable; final official screenshots will arrive later.
- Palette: deep navy/near-black, warm cream type, emerald/teal accents, restrained lime highlights, thin borders, quiet shadows, and controlled green glow.
- Preserve large visual moments and generous negative space. Avoid card-inside-card layouts, dashboard density, generic gradients, and excess copy.
- Privacy section stays restrained and typography-led. Do not reintroduce rejected privacy illustrations.
- Feedback/contact form gets its own spacious section near the bottom; do not squeeze it into privacy or another section.

### Hero decorative network

Build connected dots and thin edge lines as decorative HTML/CSS, not as the old connector bitmap. Use `public/images/landing/extracted/01-hero-connected-dots-background.png` only as a geometry and mood reference.

- Place sparse motifs at far left and right, behind content.
- Use small nodes, thin low-contrast lines, and only a few softly glowing active nodes.
- Add slow node pulses, subtle line shimmer, and tiny drift/parallax. Never move layout or compete with headline/CTAs.
- Prefer transform and opacity animation. Avoid continuous full-screen blur/filter work.
- Set `pointer-events: none` and `aria-hidden="true"`.
- Under `prefers-reduced-motion: reduce`, stop drift, shimmer, scroll parallax, and reveal choreography; retain a calm static composition.
- Simplify to one motif or hide it on mobile when readability or performance suffers.

## Animation system

Animation should make the page feel alive, not busy.

- Use CSS for ambient network motion, glows, hover/focus transitions, and small looping details.
- Use one animation library only if section reveals, coordinated timelines, or scroll-linked movement need it. Confirm current Next.js/React compatibility through Context7 first.
- Keep animation code inside small client components; page content must render without JavaScript.
- Favor restrained fades, masks, staggered text/media entrances, shallow depth shifts, and purposeful section transitions.
- Avoid scroll hijacking, long pinned sections, cursor-following gimmicks, autoplay audio, and motion that delays access to content.
- Animate `transform` and `opacity` where possible. Test low-end mobile behaviour and reduced-motion mode.

## Page structure

Keep this narrative unless user changes it:

1. Hero — one identity, two equal product choices.
2. What Salasel means.
3. Salasel App.
4. Chrome Extension.
5. One learning flow.
6. Product demonstration.
7. Privacy and openness.
8. Final action.
9. Feedback/contact form.
10. Footer.

Hero uses a lightweight top navigation, centered glowing Salasel mark, Arabic headline `اختر ما ينفعك، واثبت عليه.`, English equivalent `Learn with intention. Stay the course.`, and equal App/Extension paths.

## Product and content boundaries

- Salasel is a standalone learning platform, not merely a YouTube layer.
- Chrome extension is optional and hides only distractions explicitly selected by user.
- Do not shame YouTube use or imply extension is required.
- Do not add founder-story section or generic copyright line.
- Link Waqf Public License when final URL is known.
- Never broaden approved privacy copy to “nothing ever leaves your device.” Feedback is transmitted only after explicit submission, and browser sync is controlled by browser provider.
- Do not invent Chrome Web Store listing URL. Keep unpublished destination clearly marked.

## Responsive and accessible behaviour

- Desktop (`>=1024px`): preserve approved hero hierarchy; two product paths side by side; both edge motifs visible.
- Tablet (`768px–1023px`): reduce scale and motion; keep cards side by side only while copy and controls remain comfortable.
- Mobile (`<768px`): compact header, centered logo, readable two-to-three-line headline, stacked full-width product paths, reduced glow, no required hover, no attempt to compress whole desktop scene into one viewport.
- Test near `1440x900`, `1024x768`, `768x1024`, and `390x844`, in both Arabic and English.
- Use semantic landmarks and one meaningful `h1`; visible focus; logical keyboard order; minimum `44x44px` touch targets; WCAG AA contrast.
- Decorative images and networks get empty alt/assistive hiding. Product screenshots get useful alt text or adjacent explanation. Demo video requires captions and text summary.
- Reserve image/video dimensions, lazy-load below fold, and do not lazy-load primary hero mark.

## Working method and completion bar

1. Read both specs and inspect all ten comps at full size.
2. Inventory supplied assets; distinguish approved, provisional, and deprecated files.
3. Check relevant current docs through Context7 and bundled Next.js docs.
4. Plan semantic sections, locale routing, responsive changes, and animation boundaries before coding.
5. Implement section by section with content and decorative layers separated.
6. Verify Arabic RTL and English LTR independently in browser.
7. Compare desktop and mobile renders against comps.
8. Run `npm run lint` and `npm run build`; confirm static export output is produced and contains every locale route.
9. Report remaining placeholder URLs, screenshots, captions, or copy clearly.

Do not claim completion without fresh command output and visual browser checks. Do not commit, push, deploy, or alter another repository unless user explicitly requests it.
