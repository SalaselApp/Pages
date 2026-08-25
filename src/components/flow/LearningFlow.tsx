import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { FlowChain } from "@/components/flow/FlowChain";
import { RevealOnView } from "@/components/RevealOnView";
import { localeDirection, type AppLocale } from "@/i18n/routing";

/**
 * Real product screenshots for the two steps that show genuine Salasel UI:
 * step 1's series page with its episode list, and step 3's extension
 * continue-watching panel. Step 2 is not a screenshot — it is the watch-choice
 * control, rebuilt as real chips (see below), because it is the decision moment
 * between the two products rather than a single captured screen.
 *
 * The images are plain `<img>`s kept byte-identical; CSS crops non-destructively
 * via `object-fit`. They are never mirrored per locale — the UI is already in
 * the page's language and must read correctly — so only the card *order* follows
 * the reading direction, handled by the row.
 */
const SHOTS = {
  choose: {
    src: "/images/landing/product-screenshots/flow-extension-return.webp",
    width: 873,
    height: 489,
  },
  stay: {
    src: "/images/landing/product-screenshots/flow-extension-panel.webp",
    width: 1288,
    height: 531,
  },
} as const;

/**
 * Section 5 — One learning flow.
 *
 * This section is the join between the two products: it shows Salasel and the
 * extension as one continuous path rather than two separate tools. Rather than
 * restate what Sections 3 and 4 already sell, each step card carries a concrete
 * moment from the hand-off itself:
 *
 *   1. Choose  — a real Salasel series page with its episode list.
 *   2. Watch   — the decision moment, rebuilt as two real watch-choice chips
 *                (in Salasel / on YouTube) rather than a screenshot, since it is
 *                a fork between the products, not a single captured screen.
 *   3. Stay    — the extension's real continue-watching panel that keeps a route
 *                back to the series.
 *
 * The interlocked chain (the same motif as Section 2, hash-verified master)
 * runs full-bleed beneath the three cards, literally linking the three moments.
 * The cards are staggered in height along the row, echoing the comp's cards
 * riding at different points on the chain rather than sitting on one flat line.
 *
 * The base field is the dark `--canvas` the chain artwork is authored for, with
 * a warm cream-green wash on the reading-start edge bridging Section 2's cream
 * paper into this dark seam.
 *
 * Everything is server-rendered; the only client code is `FlowChain` (the chain
 * entrance) and `RevealOnView` (the copy fade-up), both of which need
 * `IntersectionObserver`.
 *
 * Placement is logical and mirrors per locale via the section's own direction:
 * the header and the three cards read from the reading-start edge — physical
 * right in Arabic RTL, left in English LTR. The product screenshots inside the
 * cards are never mirrored (the UI must stay readable); only the card order
 * follows the reading direction.
 */
export async function LearningFlow() {
  const t = await getTranslations("flow");
  const locale = (await getLocale()) as AppLocale;
  const dir = localeDirection[locale];

  const steps = ["choose", "watch", "stay"] as const;

  return (
    <section
      aria-labelledby="flow-heading"
      /*
        Height follows content rather than being forced to a full viewport: the
        chain sits directly below the header with measured spacing, so there is
        no large empty band between them. `--canvas` base continues the dark
        palette the chain artwork needs; `isolate` keeps the wash and chain
        stacking local, `overflow-hidden` contains the chain's bleed past the
        edges.
      */
      className="bg-canvas text-cream relative isolate w-full overflow-hidden"
    >
      {/*
        Warm wash: a soft cream-green bloom anchored to the leading edge, echoing
        the comp's lit corner. Logical inset (`start-0`) so it sits on the
        physical right in Arabic and the physical left in English, always behind
        the copy it warms. Off the interaction layer and hidden from a11y.

        A separate wide radial keeps the opposite edge in deep navy so the
        cream-to-night transition stays legible behind the trailing steps.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_var(--flow-warm-x)_38%,rgba(214,205,178,0.16),transparent_58%),radial-gradient(80%_70%_at_var(--flow-warm-x)_30%,rgba(48,143,107,0.12),transparent_60%)]"
        style={
          {
            // Anchor the wash to the leading edge per locale.
            "--flow-warm-x": dir === "rtl" ? "82%" : "18%",
          } as React.CSSProperties
        }
      />

      {/*
        Copy header in its own padded container, pinned to the leading edge with
        `me-auto` so it aligns to its own reading edge — right in Arabic, left in
        English — matching the comp's leading-edge title block. It stays inside
        the max-width column; only the chain below goes full-bleed. Bottom padding
        is small so the chain follows close beneath the header.
      */}
      <div className="mx-auto w-full max-w-[86rem] px-6 pt-20 pb-6 sm:px-10 sm:pt-24 lg:pt-28">
        <RevealOnView className="flex w-full max-w-[46rem] flex-col gap-5 me-auto">
          {/* Eyebrow with the shared thin vertical rule; decorative, so it is a
              border on the text itself. `border-s`/`ps-` keep it on the reading
              side in both directions. */}
          <p className="reveal-rise border-teal-brand text-teal-brand border-s-2 ps-4 text-sm font-medium tracking-[0.02em]">
            {t("eyebrow")}
          </p>

          <h2
            id="flow-heading"
            className="reveal-rise text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance"
            style={{ animationDelay: "0.08s" }}
          >
            <span className="block">{t("headingLead")}</span>
            <span className="text-teal-brand block">{t("headingAccent")}</span>
          </h2>

          {/* The spec's key line for this section, kept as supporting copy, not
              a second headline. */}
          <p
            className="reveal-rise text-cream-dim max-w-[44ch] text-[clamp(1.0625rem,1.7vw,1.3125rem)] leading-relaxed"
            style={{ animationDelay: "0.16s" }}
          >
            {t("keyline")}
          </p>
        </RevealOnView>
      </div>

      {/*
        The flow band: the connecting chain is a full-bleed layer BEHIND the
        cards, and the three cards ride on top of it, so each screenshot appears
        to sit in front of the chain while the links thread through the gaps
        between them.

        `relative` scopes the absolute chain to this band; the section's own
        `isolate` contains the stacking.
      */}
      <div className="relative w-full">
        {/*
          Green bloom behind the chain, so the links read as lit and present
          rather than a flat strip on the dark canvas. Anchored to the lower band
          where the chain sits. Off the interaction layer and hidden from a11y.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[70%] bg-[radial-gradient(60%_80%_at_50%_100%,rgba(48,143,107,0.28),transparent_70%),radial-gradient(90%_60%_at_50%_90%,rgba(35,120,102,0.16),transparent_72%)]"
        />

        {/*
          Desktop/tablet chain (`sm+`), behind the cards (`z-0`). Anchored to the
          bottom but scaled beyond the section edges (`-inset-x`) and enlarged so
          the links are bold and confident — the spine of the section — and
          clearly pass through the gaps between the cards riding on it.
          `pointer-events-none` + purely decorative.
        */}
        <div className="pointer-events-none absolute -inset-x-[6%] bottom-[8%] z-0 hidden sm:block">
          <FlowChain alt={t("chainAlt")} dir={dir} />
        </div>



        {/*
          Cards on top (`z-10`). Each is a solid panel holding its number, title,
          copy, and the concrete moment (a real screenshot for steps 1 and 3, the
          watch-choice chips for step 2). The card is opaque so its text is always
          readable over the chain behind it — earlier the copy floated directly on
          the chain and washed out over the light links. `sm:items-end` sits the
          cards low in the band over the chain; the per-card offset staggers their
          heights so they ride the chain's arc rather than one flat line.
        */}
        <div className="relative z-10 mx-auto w-full max-w-[92rem] px-6 pt-10 pb-16 sm:px-10 sm:pt-20 sm:pb-28 lg:pb-32">
          <RevealOnView>
            {/* Wider gaps than the default so more of the chain shows through
                between the cards, reinforcing the connected-path read. */}
            <ol
              className="flex flex-col gap-8 sm:flex-row sm:items-end sm:gap-10 lg:gap-14"
              style={
                {
                  // The chain draws from the reading-start edge; the cards slide
                  // in from that same physical side so both read as entering
                  // from one direction. RTL: from the physical left; LTR: from
                  // the physical right (the chain box is mirrored in LTR).
                  "--flow-card-from": dir === "rtl" ? "-2.5rem" : "2.5rem",
                } as React.CSSProperties
              }
            >
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flow-card-rise flex flex-1"
                  style={{
                    animationDelay: `${0.12 + index * 0.12}s`,
                    // Creative stagger: the middle card sits lower, the outer two
                    // higher, so the row rides the chain's arc instead of a flat
                    // line. Only applied once the cards are in a row (sm+).
                    ...(step === "watch"
                      ? { ["--flow-offset" as string]: "2.5rem" }
                      : step === "stay"
                        ? { ["--flow-offset" as string]: "1rem" }
                        : { ["--flow-offset" as string]: "0rem" }),
                  }}
                >
                  {/*
                    Frosted card. `bg-panel/72` lets the lit chain read faintly
                    through the panel, and `backdrop-blur-xl` frosts whatever
                    passes behind so the links stay a soft presence rather than a
                    sharp distraction competing with the copy. A hairline border
                    and strong shadow keep the card edge defined against the busy
                    chain. `w-full` + `flex-1` makes the three cards share the
                    row; the middle card gets extra width so its two watch chips
                    sit comfortably.
                  */}
                  <div
                    className="border-hairline-strong bg-panel/72 flex w-full flex-col gap-4 rounded-3xl border p-6 shadow-[0_28px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-7 sm:[transform:translateY(calc(-1*var(--flow-offset)))]"
                  >
                    {/* Number and title on one row, sharing a baseline. The
                        marker keeps its teal accent and the title its cream, so
                        only the layout changes, not the colour language. The
                        marker labels the step, so it stays in the accessible
                        text. */}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-teal-brand text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold tabular-nums">
                        {t(`steps.${step}.marker`)}
                      </span>
                      <h3 className="text-[clamp(1.25rem,1.9vw,1.625rem)] font-semibold tracking-[-0.01em]">
                        {t(`steps.${step}.title`)}
                      </h3>
                    </div>

                    <p className="text-cream-dim text-[clamp(0.9375rem,1.3vw,1.0625rem)] leading-relaxed">
                      {t(`steps.${step}.text`)}
                    </p>

                    {/* The concrete moment, pinned to the bottom of the card so
                        all three cards' media align even when copy length
                        differs. */}
                    <div className="mt-auto pt-1">
                      {step === "watch" ? (
                        <WatchChoice
                          label={t("watchChoice.label")}
                          inApp={t("watchChoice.inApp")}
                          onYouTube={t("watchChoice.onYouTube")}
                        />
                      ) : (
                        <figure
                          className="border-hairline bg-canvas/60 relative m-0 w-full overflow-hidden rounded-xl border"
                          /* Frame takes the image's own aspect ratio so the whole
                             screenshot is shown, uncropped. */
                          style={{
                            aspectRatio: `${SHOTS[step].width} / ${SHOTS[step].height}`,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={SHOTS[step].src}
                            alt={t(`shots.${step}`)}
                            width={SHOTS[step].width}
                            height={SHOTS[step].height}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 size-full object-contain"
                          />
                        </figure>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </RevealOnView>
        </div>
      </div>
    </section>
  );
}

/**
 * Step 2's watch-choice control.
 *
 * Not a screenshot: this is the fork between the two products, so it is built as
 * two real full-width buttons — "In Salasel" and "On YouTube" — with an "or"
 * divider between them, sitting on the inner plate that matches the screenshot
 * cards' frame language so the three cards read as one row. It is illustrative
 * product UI, not a live control, so the buttons are static and the whole plate
 * is labelled for assistive tech via `aria-label`; the brand glyphs inside are
 * decorative.
 *
 * The "In Salasel" button uses the real Salasel app logo, the "On YouTube"
 * button a simple rounded-rectangle play glyph in YouTube red. Neither is a
 * screenshot of real UI text baked into an image, so both labels stay real,
 * translatable text.
 */
function WatchChoice({
  label,
  inApp,
  onYouTube,
}: {
  label: string;
  inApp: string;
  onYouTube: string;
}) {
  return (
    <figure
      role="img"
      aria-label={label}
      className="border-hairline bg-canvas/60 relative m-0 flex w-full flex-col items-stretch gap-3 rounded-xl border p-5"
    >
      {/* In Salasel: emerald-tinted button with the real Salasel app logo. */}
      <span className="border-teal-brand/40 bg-teal-brand/15 text-cream inline-flex w-full items-center justify-center gap-2.5 rounded-full border px-5 py-3 text-[0.9375rem] font-medium">
        <Image
          src="/images/landing/brand/logo.png"
          alt=""
          aria-hidden="true"
          width={1200}
          height={1200}
          className="size-5 object-contain"
        />
        {inApp}
      </span>

      {/* "or" divider: a hairline rule on each side of a small label, making the
          fork between the two products explicit. */}
      <span
        aria-hidden="true"
        className="text-cream-faint flex items-center gap-3 text-xs"
      >
        <span className="bg-hairline-strong h-px flex-1" />
        {/* A neutral separator glyph, direction-agnostic. */}
        <span className="opacity-70">•</span>
        <span className="bg-hairline-strong h-px flex-1" />
      </span>

      {/* On YouTube: neutral button with the YouTube red play glyph. */}
      <span className="border-hairline-strong bg-canvas text-cream inline-flex w-full items-center justify-center gap-2.5 rounded-full border px-5 py-3 text-[0.9375rem] font-medium">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
          <rect x="2" y="5" width="20" height="14" rx="4" fill="#ff0000" />
          <path d="M10 8.5v7l6-3.5z" fill="#fff" />
        </svg>
        {onYouTube}
      </span>
    </figure>
  );
}
