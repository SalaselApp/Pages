import { getLocale, getTranslations } from "next-intl/server";
import { ExtensionScreen } from "@/components/extension/ExtensionScreen";
import { RevealOnView } from "@/components/RevealOnView";
import { links } from "@/config/links";
import { localeDirection, type AppLocale } from "@/i18n/routing";

/**
 * Section 4 — Chrome Extension.
 *
 * The comp (`04-chrome-extension.png`) is a hard vertical split: a full-height
 * warm-cream copy panel on the physical LEFT and a dark screenshot panel on the
 * physical RIGHT, with a teal seam between them. That paper panel is the
 * section's big visual moment and echoes Section 2's cream interlude, so the
 * palette split is deliberate. The copy leads with control — users keep watching
 * on YouTube and the extension hides only what they choose — never shame.
 *
 * Unlike Sections 2 and 3 this layout is NOT mirrored per locale: the comp fixes
 * copy-left / screenshot-right, so the section pins those sides physically
 * (`dir="ltr"` on the grid) in both Arabic and English. Only the copy's own text
 * runs in the locale direction, so Arabic still reads RTL and aligns to its own
 * reading edge inside the left panel.
 *
 * Only `ExtensionScreen` is a client island (viewport entrance); everything else
 * is server-rendered.
 */
export async function ChromeExtension() {
  const t = await getTranslations("extension");
  const locale = (await getLocale()) as AppLocale;
  const dir = localeDirection[locale];

  const toggles = [
    "recommendations",
    "autoplay",
    "endCards",
    "shorts",
    "comments",
    "feed",
  ] as const;

  return (
    <section
      aria-labelledby="extension-heading"
      /*
        `dir="ltr"` pins the two columns physically (copy left, screenshot right)
        in both locales, matching the comp. A full-viewport-tall floor with the
        panels filling it; `svh` so mobile chrome does not clip it, and a floor
        (not fixed height) so the stacked mobile layout can grow and scroll.

        `border-t-2 border-teal-brand/50` is the seam from the previous section:
        the screenshot panel here is the same dark canvas as Section 3, so the
        two would otherwise blend on that side. A teal top rule marks the change
        cleanly across the full width.
      */
      dir="ltr"
      className="relative isolate grid min-h-svh w-full grid-cols-1 overflow-hidden lg:grid-cols-[0.85fr_1.15fr]"
    >
      {/*
        Copy panel — the cream paper field, pinned to the physical left. First in
        the stacked mobile flow. Its inner content runs in the locale direction,
        so Arabic reads RTL and aligns right within the panel as in the comp.
      */}
      <div className="bg-paper text-ink flex items-center px-6 py-16 sm:px-10 sm:py-20 lg:py-28">
        <RevealOnView
          dir={dir}
          className="mx-auto flex w-full max-w-[34rem] flex-col gap-6"
        >
          {/* Eyebrow with Section 2's thin vertical rule; decorative rule is a
              border on the text itself, so assistive tech does not step over it. */}
          <p className="reveal-rise border-teal-deep text-teal-deep border-s-2 ps-4 text-sm font-medium tracking-[0.02em]">
            {t("eyebrow")}
          </p>

          <h2
            id="extension-heading"
            className="reveal-rise text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance"
            style={{ animationDelay: "0.08s" }}
          >
            <span className="block">{t("headingLead")}</span>
            <span className="text-teal-deep block">{t("headingAccent")}</span>
          </h2>

          <p
            className="reveal-rise max-w-[42ch] text-[clamp(1.0625rem,1.6vw,1.1875rem)] leading-relaxed opacity-80"
            style={{ animationDelay: "0.16s" }}
          >
            {t("lead")}
          </p>

          {/* Distraction toggles as a plain chip list, naming what the extension
              can hide. Illustrative labels, not live controls, styled for paper
              with an ink hairline and teal marker. */}
          <div
            className="reveal-rise flex flex-col gap-3"
            style={{ animationDelay: "0.24s" }}
          >
            <p className="text-[0.8125rem] font-medium tracking-[0.02em] opacity-60">
              {t("togglesLabel")}
            </p>
            <ul className="flex flex-wrap gap-2.5" aria-label={t("togglesLabel")}>
              {toggles.map((toggle) => (
                <li
                  key={toggle}
                  className="border-ink/15 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm"
                >
                  <span
                    aria-hidden="true"
                    className="bg-teal-deep size-1.5 shrink-0 rounded-full"
                  />
                  {t(`toggles.${toggle}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Capabilities. Minimal node-marked list, tinted for paper. */}
          <ul
            className="reveal-rise flex flex-col gap-3"
            style={{ animationDelay: "0.32s" }}
          >
            {["choose", "notes", "resume"].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="bg-teal-deep mt-2.5 size-1.5 shrink-0 rounded-full"
                />
                <span className="text-[clamp(1rem,1.5vw,1.0625rem)] leading-relaxed">
                  {t(`points.${point}`)}
                </span>
              </li>
            ))}
          </ul>

          {/* Optionality is a product boundary from the spec: state it plainly
              so the extension never reads as required. */}
          <p
            className="reveal-rise max-w-[42ch] text-sm leading-relaxed opacity-55"
            style={{ animationDelay: "0.4s" }}
          >
            {t("note")}
          </p>

          <div className="reveal-rise mt-1" style={{ animationDelay: "0.48s" }}>
            <a
              href={links.extension.href}
              className="bg-teal-deep text-paper hover:bg-teal-deep/90 inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors duration-200"
            >
              {t("cta")}
              {/* SVG chevron rather than a glyph: angle quotes bidi-mirror inside
                  an RTL row. The path points reading-forward per locale. */}
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
      </div>

      {/*
        Screenshot panel — the dark field holding the real extension screenshot,
        pinned to the physical right. The teal border on its start edge is the
        seam between the two panels, matching the comp's coloured divider (a top
        border when the panels stack on mobile).
      */}
      <div className="text-cream border-teal-brand relative flex items-center overflow-hidden bg-[#141b21] px-6 py-16 sm:px-10 sm:py-20 lg:border-s-[6px] lg:py-28">
        {/* Warm slate wash sampled from the comp: the screenshot panel is a
            lifted charcoal, not the near-black canvas, so the framed screenshot
            reads against a distinct field rather than blending into the page.
            Off the interaction layer and hidden from a11y. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_65%_at_50%_42%,rgba(37,52,58,0.9),transparent_65%),radial-gradient(70%_55%_at_50%_45%,rgba(35,120,102,0.18),transparent_62%)]"
        />
        <ExtensionScreen alt={t("screenAlt")} />
      </div>
    </section>
  );
}
