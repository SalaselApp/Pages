import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { AppIcon, ExtensionIcon } from "@/components/hero/ProductIcons";
import { RevealOnView } from "@/components/RevealOnView";
import { links } from "@/config/links";
import { localeDirection, type AppLocale } from "@/i18n/routing";

/**
 * Section 8 — Final action.
 *
 * The page's closing call, built to the comp (`08-final-action.png`): an
 * oversized dimensional Salasel mark bleeds in from the reading-end edge, and a
 * centred block restates the two product paths one last time with
 * outcome-focused labels — "Begin with a series" (app) and "Make YouTube
 * calmer" (extension) — over a short note that neither product needs the other.
 *
 * The two paths deliberately echo the hero's `ProductPath`, so the page opens
 * and closes on the same two-choice gesture. Here the comp gives the app path a
 * filled teal treatment and the extension path a quiet outline: both are equal
 * full-size targets, so neither reads as subordinate; only the fill differs, as
 * a final nudge toward the native learning home. Both links point at the same
 * destinations as the hero (`links.app` / `links.extension`), so the whole page
 * repoints from one place once the final extension listing URL lands.
 *
 * The oversized mark is the approved Section 8 background master
 * (`08-section-8-left-logo-background.png`), already an alpha-isolated
 * derivative. It is purely decorative: `pointer-events-none`, `aria-hidden`,
 * empty alt, and lazy-loaded (it sits well below the fold). It is anchored to
 * the reading-end edge and mirrored per locale so it always bleeds from the
 * side opposite the reading start — physical left in Arabic RTL, matching the
 * comp, and physical right in English LTR.
 *
 * Everything is server-rendered; the only client code is `RevealOnView` (the
 * copy fade-up), which needs `IntersectionObserver`.
 */

/** Approved Section 8 mark master. Kept byte-identical; CSS only scales it. */
const MARK = {
  src: "/images/landing/extracted/08-section-8-left-logo-background.webp",
  width: 1915,
  height: 821,
} as const;

export async function FinalAction() {
  const t = await getTranslations("finalAction");
  const locale = (await getLocale()) as AppLocale;
  const dir = localeDirection[locale];

  return (
    <section
      aria-labelledby="final-action-heading"
      /*
        Continues the dark palette. `isolate` keeps the mark's glow and stacking
        local; `overflow-hidden` contains its bleed past the section edges.
        Height follows content — a calm closing band, not a forced full screen.
      */
      className="bg-canvas text-cream relative isolate w-full overflow-hidden"
    >
      {/*
        Oversized decorative Salasel chain mark. The master is a full-canvas
        asset (1915x821, the comp's own dimensions): the dimensional chain already
        sits in its correct place — the reading-end third — with the rest
        transparent, so it is placed as a full-bleed layer that fills the section
        rather than cropped into a narrow box. `object-cover` keeps the chain's
        scale and position matching the comp across viewports; `object-position`
        anchors it to the reading-end edge so the transparent side never eats in.

        The chain is dark relief on the dark canvas, so it is lit the way the comp
        lights it — with a green edge glow — and given a little life: two extra
        layers sit over the artwork, each masked by the SAME PNG so their light is
        clipped to the chain's own silhouette (see `globals.css`):

          - `.final-mark-sheen` — a soft emerald wash that slowly breathes, so the
            relief reads as gently lit rather than flat.
          - `.final-mark-trace` — a brighter band of green that travels slowly down
            the chain, like light running through the links (the same "connection
            flowing" gesture as the hero network, on-metaphor for a chain).

        In English LTR the whole group is flipped with `scaleX(-1)` so the mark and
        its light bleed from the physical right (reading-end) instead of the comp's
        left. Off the interaction layer, hidden from a11y, and the artwork is
        lazy-loaded since it is far below the fold. Hidden below `sm`, where it
        would crowd the stacked paths. `mask-image` is set inline because it needs
        the asset URL; all other mask sizing lives in the shared CSS class.
      */}
      <div
        aria-hidden="true"
        className="final-mark pointer-events-none -z-10 hidden sm:block"
        style={{ transform: dir === "ltr" ? "scaleX(-1)" : undefined }}
      >
        <Image
          src={MARK.src}
          alt=""
          width={MARK.width}
          height={MARK.height}
          loading="lazy"
          decoding="async"
          sizes="100vw"
          className="final-mark-img"
        />
        <div
          className="final-mark-sheen"
          style={{
            maskImage: `url(${MARK.src})`,
            WebkitMaskImage: `url(${MARK.src})`,
          }}
        />
        <div
          className="final-mark-trace"
          style={{
            maskImage: `url(${MARK.src})`,
            WebkitMaskImage: `url(${MARK.src})`,
          }}
        />
      </div>

      {/*
        Mobile-only variant of the same Section 8 chain. On a phone the wide
        full-bleed mark above is hidden (it would sit sideways behind the copy),
        and echoing the hero's centred glow made the closing read as a rerun of
        the opener. Instead the chain is laid as a wide horizontal band pinned to
        the section's bottom, bleeding up from beneath the product paths and
        dissolving into the canvas through a top fade — the chain drawing the
        page to a close rather than restating the hero. Same lit-edge language as
        the desktop mark (sheen + travelling trace), clipped to the chain's own
        silhouette. Decorative: `aria-hidden`, empty alt, lazy-loaded. `sm:hidden`
        so it never doubles up with the wide mark.
      */}
      <div
        aria-hidden="true"
        className="final-mark-mobile pointer-events-none absolute inset-x-0 bottom-0 -z-10 sm:hidden"
      >
        <Image
          src={MARK.src}
          alt=""
          width={MARK.width}
          height={MARK.height}
          loading="lazy"
          decoding="async"
          sizes="100vw"
          className="final-mark-mobile-img"
        />
        <div
          className="final-mark-mobile-sheen"
          style={{
            maskImage: `url(${MARK.src})`,
            WebkitMaskImage: `url(${MARK.src})`,
          }}
        />
      </div>

      {/* Soft emerald bloom behind the mark, echoing the page's restrained glow
          language. Anchored to the same reading-end edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_55%_at_var(--final-glow-x)_50%,rgba(48,143,107,0.14),transparent_62%)]"
        style={
          {
            "--final-glow-x": dir === "rtl" ? "18%" : "82%",
          } as React.CSSProperties
        }
      />

      <RevealOnView className="relative mx-auto flex w-full max-w-[64rem] flex-col items-center gap-6 px-6 py-20 text-center sm:px-10 sm:py-28 lg:py-32">
        <p className="reveal-rise text-teal-brand text-sm font-medium tracking-[0.16em] uppercase">
          {t("eyebrow")}
        </p>

        <h2
          id="final-action-heading"
          className="reveal-rise text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance"
          style={{ animationDelay: "0.08s" }}
        >
          {t("heading")}
        </h2>

        <p
          className="reveal-rise text-cream-dim max-w-[42ch] text-[clamp(1.0625rem,1.7vw,1.3125rem)] leading-relaxed text-balance"
          style={{ animationDelay: "0.16s" }}
        >
          {t("lead")}
        </p>

        {/* The two paths, restated. Equal full-size targets; only the fill
            differs. Side by side from `sm` up, stacked full-width below. */}
        <div
          className="reveal-rise mt-4 w-full max-w-3xl"
          style={{ animationDelay: "0.24s" }}
        >
          <h3 className="sr-only">{t("choicesLabel")}</h3>
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5">
            <FinalPath
              variant="primary"
              eyebrow={t("app.eyebrow")}
              title={t("app.title")}
              destination={links.app}
              icon={<AppIcon className="size-10 sm:size-11" />}
            />
            <FinalPath
              variant="secondary"
              eyebrow={t("extension.eyebrow")}
              title={t("extension.title")}
              destination={links.extension}
              icon={<ExtensionIcon className="size-10 sm:size-11" />}
            />
          </div>
        </div>

        {/* Closing note: neither product needs the other. A small shield glyph
            sets the reassuring tone; the text carries the meaning, so the glyph
            is decorative. */}
        <p
          className="reveal-rise text-cream-faint mt-4 inline-flex items-center gap-2 text-sm"
          style={{ animationDelay: "0.32s" }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-teal-brand size-4 shrink-0"
          >
            <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          {t("note")}
        </p>
      </RevealOnView>
    </section>
  );
}

/**
 * One of the two closing product paths.
 *
 * Shares its structure with the hero's `ProductPath` so the page bookends on the
 * same gesture, but is a link-as-panel here: the whole tile is the action, in
 * line with the comp where each path is a single large button rather than a card
 * with a separate CTA. `primary` is the comp's filled teal app path; `secondary`
 * is its quiet outlined extension path. Both are the same size and weight, so
 * neither reads as subordinate.
 */
function FinalPath({
  eyebrow,
  title,
  destination,
  variant,
  icon,
}: {
  eyebrow: string;
  title: string;
  destination: import("@/config/links").Destination;
  variant: "primary" | "secondary";
  /** Decorative product symbol, not product UI. */
  icon: React.ReactNode;
}) {
  const surface =
    variant === "primary"
      ? "border-teal-brand/60 bg-teal-brand text-cream hover:bg-emerald-brand shadow-[0_18px_40px_-20px_rgba(48,143,107,0.75)]"
      : "border-hairline-strong bg-panel text-cream hover:bg-panel-hover hover:border-hairline-strong";

  const eyebrowTone =
    variant === "primary" ? "text-cream/80" : "text-cream-faint";

  return (
    <a
      href={destination.href}
      {...(destination.external
        ? { target: "_blank", rel: "noreferrer noopener" }
        : {})}
      className={`group flex h-full min-h-24 items-center gap-4 rounded-2xl border p-5 text-start transition-colors duration-200 sm:gap-5 sm:p-6 ${surface}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex min-w-0 flex-col gap-1">
        <span
          className={`text-[0.68rem] font-medium tracking-[0.16em] uppercase ${eyebrowTone}`}
        >
          {eyebrow}
        </span>
        <span className="text-lg font-semibold text-balance sm:text-xl">
          {title}
        </span>
      </span>
    </a>
  );
}
