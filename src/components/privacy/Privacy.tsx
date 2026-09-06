import { getLocale, getTranslations } from "next-intl/server";
import { RevealOnView } from "@/components/RevealOnView";
import { links } from "@/config/links";
import { localeDirection, type AppLocale } from "@/i18n/routing";

/**
 * Section 7 — Privacy and openness.
 *
 * Built to the comp (`07-privacy-openness.png`), which is the revised
 * typography-led version: no privacy illustration, everything is type on the
 * dark canvas. The composition is a two-column split:
 *
 *   - Header column (reading-start edge): the section eyebrow, a large two-line
 *     headline whose second line takes the teal accent, an intro paragraph, and
 *     the openness note carrying the real GitHub source link. A soft, controlled
 *     green glow sits behind its top, the page's restrained glow language.
 *   - Claims column (reading-end edge): a vertical stack of four verifiable
 *     privacy claims. Each claim is a small teal glyph, a bright title, and a
 *     couple of lines of dimmer body text, and each is separated from the next
 *     by a thin hairline rule that fades out along its length — matching the
 *     comp's gradient dividers.
 *
 * The four claims are copied straight from the spec's verifiable list and never
 * broadened: progress/preferences/notes stay in the browser, browser sync is
 * controlled by the user's browser account, and feedback leaves only on an
 * explicit submit. The absolute phrase "nothing ever leaves your device" is
 * deliberately avoided; "openness" (open source + GitHub) lives in the header.
 *
 * Layout is logical and mirrors per locale via the section's own direction:
 * header on the reading-start edge (physical right in Arabic RTL, left in
 * English LTR), claims on the reading-end edge, using logical `grid`,
 * `border-s`, `ps-*`, and a start-anchored glow rather than any physical
 * left/right. This differs from Section 4, which is pinned physically; here the
 * comp is symmetric typography, so per-locale mirroring is correct.
 *
 * Everything is server-rendered. The only client code is `RevealOnView` (copy
 * fade-up), which needs `IntersectionObserver`.
 */

/** Small decorative glyph per claim; the title carries the meaning for a11y. */
const CLAIM_ICONS: Record<string, React.ReactNode> = {
  // No account / no tracking — an eye with a slash through it.
  noTracking: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M3 3l18 18" />
    </>
  ),
  // Kept in your browser — a browser window.
  onDevice: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M7 6.5h.01M10 6.5h.01" />
    </>
  ),
  // Sync you control — circular arrows.
  sync: (
    <>
      <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-7.5-4" />
      <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 7.5 4" />
      <path d="M21 3v4h-4" />
      <path d="M3 21v-4h4" />
    </>
  ),
  // Only what you send — a paper plane.
  feedback: (
    <>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </>
  ),
};

export async function Privacy() {
  const t = await getTranslations("privacy");
  const locale = (await getLocale()) as AppLocale;
  const dir = localeDirection[locale];

  const claims = ["noTracking", "onDevice", "sync", "feedback"] as const;

  return (
    <section
      aria-labelledby="privacy-heading"
      /*
        `--canvas` base continues the dark palette. `isolate` keeps the glow's
        stacking local; `overflow-hidden` contains its bleed. Height follows
        content — this is a calm typographic band, not a full-viewport moment.
      */
      className="bg-canvas text-cream relative isolate w-full overflow-hidden"
    >
      {/*
        A single restrained emerald bloom anchored to the header (start) side's
        top, echoing the comp's soft green glow behind the headline without
        becoming an illustration. Off the interaction layer and hidden from a11y.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_var(--privacy-glow-x)_18%,rgba(48,143,107,0.14),transparent_60%)]"
        style={
          {
            "--privacy-glow-x": dir === "rtl" ? "80%" : "20%",
          } as React.CSSProperties
        }
      />

      {/*
        Two-column split at `lg`: header on the reading-start edge, claims on the
        reading-end edge. Logical grid, so it mirrors per locale automatically —
        header physical-right in Arabic, physical-left in English. Below `lg` the
        two stack in reading order: header first, then the claims.
      */}
      <div className="mx-auto grid w-full max-w-[86rem] grid-cols-1 gap-x-16 gap-y-14 px-6 py-24 sm:px-10 sm:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-x-24 lg:py-32">
        {/* Header column. */}
        <RevealOnView className="flex flex-col gap-5">
          {/* Eyebrow with the shared thin vertical rule; decorative, so it is a
              border on the text itself. `border-s`/`ps-` keep it on the reading
              side in both directions. */}
          <p className="reveal-rise border-teal-brand text-teal-brand border-s-2 ps-4 text-sm font-medium tracking-[0.02em]">
            {t("eyebrow")}
          </p>

          <h2
            id="privacy-heading"
            className="reveal-rise text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.1] font-semibold text-balance"
            style={{ animationDelay: "0.08s" }}
          >
            <span className="block">{t("headingLead")}</span>
            <span className="text-teal-brand block">{t("headingAccent")}</span>
          </h2>

          <p
            className="reveal-rise text-cream-dim max-w-[46ch] text-[clamp(1.0625rem,1.7vw,1.3125rem)] leading-relaxed"
            style={{ animationDelay: "0.16s" }}
          >
            {t("lead")}
          </p>

          {/*
            Openness note carrying the real GitHub link (from
            `NEXT_PUBLIC_SOURCE_URL`). Because it leaves the site, it is a proper
            external anchor. Kept restrained: a small title, a line, and a
            bordered pill link rather than a loud button.
          */}
          <div
            className="reveal-rise mt-4 flex flex-col gap-3"
            style={{ animationDelay: "0.24s" }}
          >
            <p className="text-cream text-[clamp(1rem,1.5vw,1.125rem)] font-semibold tracking-[-0.01em]">
              {t("openSource.title")}
            </p>
            <p className="text-cream-dim max-w-[42ch] text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-relaxed">
              {t("openSource.text")}
            </p>
            <a
              href={links.source.href}
              {...(links.source.external
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
              className="border-hairline-strong text-cream hover:bg-canvas-raised mt-1 inline-flex min-h-11 w-fit items-center gap-2.5 rounded-full border px-5 py-3 text-base font-semibold transition-colors duration-200"
            >
              {/* GitHub mark, decorative — the link's text carries the meaning. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.03 11.03 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.53 11.53 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" />
              </svg>
              {t("openSource.cta")}
              {/* Reading-forward chevron, direction-aware. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                {dir === "rtl" ? (
                  <path d="M15 6l-6 6 6 6" />
                ) : (
                  <path d="M9 6l6 6-6 6" />
                )}
              </svg>
            </a>
          </div>
        </RevealOnView>

        {/*
          Claims column — the four verifiable guarantees, stacked with a fading
          hairline rule between each, matching the comp's gradient dividers. Each
          claim is a small teal glyph on the reading side plus a bright title and
          dimmer body text. Typography-led, no cards.
        */}
        <RevealOnView>
          <ul className="flex flex-col">
            {claims.map((claim, index) => (
              <li
                key={claim}
                className={[
                  "reveal-rise relative flex items-start gap-4 py-7 first:pt-0 last:pb-0",
                  // Fading divider rule above every claim except the first, drawn
                  // as a pseudo-element so it can carry a gradient. It fades from
                  // the reading-start edge outward, matching the comp's rules.
                  index > 0
                    ? "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(to_var(--rule-dir),var(--color-hairline-strong),transparent)]"
                    : "",
                ].join(" ")}
                style={
                  {
                    // A pronounced per-claim stagger so the four guarantees read
                    // as arriving one after another — header first, then each
                    // claim in turn — rather than the whole column appearing as
                    // one block.
                    animationDelay: `${0.15 + index * 0.22}s`,
                    "--rule-dir": dir === "rtl" ? "left" : "right",
                  } as React.CSSProperties
                }
              >
                {/* Teal glyph on the reading side. Decorative; sized to sit on
                    the title's cap height. */}
                <span
                  aria-hidden="true"
                  className="text-teal-brand mt-1 shrink-0"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-7"
                  >
                    {CLAIM_ICONS[claim]}
                  </svg>
                </span>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[clamp(1.125rem,1.8vw,1.375rem)] font-semibold tracking-[-0.01em]">
                    {t(`points.${claim}.title`)}
                  </h3>
                  <p className="text-cream-dim max-w-[46ch] text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-relaxed">
                    {t(`points.${claim}.text`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </RevealOnView>
      </div>
    </section>
  );
}
