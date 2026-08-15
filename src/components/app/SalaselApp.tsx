import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { AppScreens } from "@/components/app/AppScreens";
import { RevealOnView } from "@/components/RevealOnView";
import { links } from "@/config/links";
import { localeDirection, type AppLocale } from "@/i18n/routing";

/**
 * Section 3 — Salasel App.
 *
 * Salasel presented as a complete focused-learning platform in its own right,
 * not a companion to YouTube. The layout follows the approved comp
 * (`03-salasel-app.png`) and prototype: a copy column beside a layered stack of
 * three real product screenshots leaning back in perspective.
 *
 * The dark palette continues the hero after Section 2's cream interlude, with a
 * quiet emerald/teal wash and the same restrained glow. Everything here is
 * server-rendered; the only client code is `AppScreens`, which adds the
 * viewport entrance and desktop pointer parallax.
 *
 * Placement is physical, not logical, matching the approved comp and prototype
 * in both locales: the leaning screenshot plane always sits on the left and the
 * copy on the right. Left to the locale's own direction the grid would flip in
 * Arabic RTL and put the screenshots on the right, which reverses the composition.
 * So the grid container is forced to `ltr` and the copy column restores its own
 * `dir` internally, so the text still reads and aligns correctly per language.
 * The screenshot plane's own lean is already physical inside `AppScreens`.
 */
export async function SalaselApp() {
  const t = await getTranslations("app");
  const locale = (await getLocale()) as AppLocale;

  return (
    <section
      aria-labelledby="app-heading"
      /*
        `min-h-svh` makes the section a full viewport tall as its floor, with the
        content vertically centered. `svh` rather than `vh` so mobile browser
        chrome does not clip it, and it stays a floor (not a fixed height) so a
        tall stacked mobile layout can still grow and scroll instead of clipping.
      */
      className="bg-canvas text-cream relative isolate flex min-h-svh w-full items-center overflow-hidden"
    >
      {/* Decorative wash: a soft teal bloom behind the screenshots, matching the
          comp's quiet glow. Off the interaction layer and hidden from a11y. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_72%_44%,rgba(35,120,102,0.20),transparent_58%),radial-gradient(60%_50%_at_20%_40%,rgba(25,98,81,0.12),transparent_60%)]"
      />

      {/*
        Forced physical `ltr` so the two columns keep the comp's order in both
        locales: screenshots left, copy right. Order utilities then place the
        screenshots first visually on desktop while the copy stays first in the
        stacked mobile flow (heading before artwork).
      */}
      <div className="mx-auto grid w-full max-w-[86rem] grid-cols-1 items-center gap-10 px-6 py-20 [direction:ltr] sm:px-10 sm:py-24 lg:grid-cols-[1.35fr_1fr] lg:gap-6 lg:py-28">
        {/* Screenshot composition holds the left column on large screens. */}
        <div className="order-2 min-w-0 lg:order-1">
          <AppScreens
            homeAlt={t("screens.home")}
            seriesAlt={t("screens.series")}
            playerAlt={t("screens.player")}
          />
        </div>

        {/*
          Copy column, right on desktop, first in the stacked mobile flow.
          `dir` is restored to the locale here so the text reads and aligns
          correctly even though the grid itself is pinned to `ltr`.
        */}
        <RevealOnView
          dir={localeDirection[locale]}
          /* Nudged up on desktop so the copy sits above dead-centre rather than
             low in the tall full-height section. */
          className="order-1 flex flex-col gap-6 lg:order-2 lg:-translate-y-10"
        >
          <p className="reveal-rise text-teal-brand inline-flex items-center gap-2.5 text-sm font-medium tracking-[0.02em]">
            <Image
              src="/images/landing/brand/logo.png"
              alt=""
              aria-hidden="true"
              width={1200}
              height={1200}
              className="size-7 object-contain"
            />
            {t("eyebrow")}
          </p>

          <h2
            id="app-heading"
            className="reveal-rise text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] font-semibold tracking-[-0.02em] text-balance"
            style={{ animationDelay: "0.08s" }}
          >
            <span className="block">{t("headingLead")}</span>
            <span className="text-teal-brand block">{t("headingAccent")}</span>
          </h2>

          <p
            className="reveal-rise text-cream-dim max-w-[42ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-relaxed"
            style={{ animationDelay: "0.16s" }}
          >
            {t("lead")}
          </p>

          {/* Product outcomes. A plain list, kept minimal: each line is one
              capability, marked with a small teal node rather than a nested
              card. */}
          <ul
            className="reveal-rise flex flex-col gap-3"
            style={{ animationDelay: "0.24s" }}
          >
            {["discover", "focus", "keep", "return"].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="bg-teal-brand/80 mt-2.5 size-1.5 shrink-0 rounded-full"
                />
                <span className="text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed">
                  {t(`points.${point}`)}
                </span>
              </li>
            ))}
          </ul>

          <div
            className="reveal-rise mt-1"
            style={{ animationDelay: "0.32s" }}
          >
            <a
              href={links.app.href}
              className="bg-teal-brand text-canvas hover:bg-teal-brand/90 inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors duration-200"
            >
              {t("cta")}
              {/*
                SVG chevron rather than a text glyph: angle-quote characters are
                bidi-mirrored inside an RTL row, which flips them unpredictably.
                The SVG points in the reading-forward direction — left in Arabic
                RTL, right in English LTR — chosen explicitly by locale.
              */}
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
                {localeDirection[locale] === "rtl" ? (
                  <path d="M15 6l-6 6 6 6" />
                ) : (
                  <path d="M9 6l6 6-6 6" />
                )}
              </svg>
            </a>
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}
