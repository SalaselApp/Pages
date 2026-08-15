import { getTranslations } from "next-intl/server";
import { MeaningChain } from "@/components/meaning/MeaningChain";

/**
 * Section 2 — What Salasel means.
 *
 * The comp inverts the page: a flat warm-cream paper field with near-black green
 * ink, no glow and no gradient anywhere. That contrast against the dark hero is
 * the section's whole visual idea, so the palette shift is deliberate.
 *
 * Desktop follows the comp and fits one screen: the chain artwork bleeds off the
 * section's bottom-left corner while the copy holds a column on the right, its
 * eyebrow set against a thin vertical rule.
 *
 * The overlapping composition is gated at `xl` (1280px), not `lg`. At 1024x768
 * the copy alone needs about two-thirds of the viewport height, so the two halves
 * cannot sit side by side without the artwork running under the paragraph. Those
 * widths get the stacked order instead — heading first, artwork below it, still
 * bleeding off the left edge — which is an intentional adaptation rather than a
 * compressed copy of the desktop scene.
 *
 * The artwork is a direct child of the section rather than of the padded content
 * container, precisely so it can reach the page edge at every width. Putting it
 * inside the container left a hard clipped edge floating 72px into the paper.
 *
 * Everything here is server-rendered. The only client code is the reveal island
 * inside `MeaningChain`, which needs `IntersectionObserver`.
 */
export async function Meaning() {
  const t = await getTranslations("meaning");

  return (
    <section
      aria-labelledby="meaning-heading"
      /*
        `isolate` keeps the artwork's stacking context local; `overflow-hidden`
        contains the chain's bleed. The paper field is opaque, so it also ends the
        hero's dark canvas cleanly.

        `min-h-svh` at `xl` makes the desktop composition one screen, as in the
        comp, rather than a width-derived height that overflows the viewport and
        pushes the chain below the fold. Below `xl` the section is a normal block
        whose height follows its content: a short viewport there should scroll,
        not compress.
      */
      className="bg-paper text-ink relative isolate flex w-full flex-col overflow-hidden xl:min-h-svh"
    >
      {/*
        Copy column. `ml-auto` rather than the logical `ms-auto`: the chain is
        pinned to the physical left edge in both locales, so the copy sits on the
        physical right in both. Text alignment inside still follows writing
        direction, since it is left to the default.

        Below `xl` the artwork follows in normal flow, so the container only needs
        a gap beneath the copy; the section's own padding handles the rest.

        Vertical padding is `vh`-proportional at `xl` so the copy block breathes on
        a tall screen and tightens on a short one instead of overflowing it.
      */}
      <div className="relative z-10 mx-auto w-full max-w-[86rem] px-6 pt-20 pb-12 sm:px-10 sm:pt-24 xl:ml-auto xl:pt-[12vh] xl:pb-[6vh]">
        {/*
          The comp's copy block spans about 0.43 of the canvas width, which is also
          about what the two heading lines need before English wraps to three.
        */}
        <div className="flex flex-col gap-10 xl:ml-auto xl:w-[46%]">
          {/*
            Eyebrow with the comp's thin vertical rule. The rule is decorative, so
            it is a border on the text itself rather than an element a screen
            reader has to step over. `border-s` + `ps-` are logical, so it moves to
            the correct side of the label in each direction.
          */}
          <p className="border-teal-deep text-teal-deep border-s-2 ps-4 text-sm font-medium tracking-[0.02em]">
            {t("eyebrow")}
          </p>

          {/*
            One heading, split across two lines as in the comp. `block` spans
            rather than a `<br>`, so the break is a layout choice that collapses
            naturally when the column is narrow.
          */}
          <h2
            id="meaning-heading"
            className="text-[clamp(1.75rem,4vw,2.875rem)] leading-[1.3] font-semibold tracking-[-0.01em] text-balance"
          >
            <span className="block">{t("headingLead")}</span>
            <span className="block">{t("headingRest")}</span>
          </h2>

          {/*
            The comp's two numbered phrases. A real list, so the pairing is
            conveyed structurally and not only by the markers.
          */}
          <ol className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-10 sm:gap-y-4 xl:flex-col xl:gap-4">
            {[
              { marker: t("first.marker"), text: t("first.text") },
              { marker: t("second.marker"), text: t("second.text") },
            ].map((item) => (
              <li key={item.marker} className="flex items-baseline gap-3">
                {/*
                  Markers are numerals in the comp, set in the teal accent. They
                  label rather than decorate, so they stay in the accessible text.
                */}
                <span className="text-teal-deep text-lg font-semibold tabular-nums">
                  {item.marker}
                </span>
                <span className="text-[clamp(1rem,1.6vw,1.125rem)] font-medium">
                  {item.text}
                </span>
              </li>
            ))}
          </ol>

          {/*
            Body copy. Not in the comp, which shows only the heading and the two
            phrases, but the spec asks this section to actually introduce both
            meanings of the name. Kept to one restrained paragraph so the
            composition stays typography-led.
          */}
          <p className="max-w-[46ch] text-[clamp(0.95rem,1.5vw,1.0625rem)] leading-relaxed opacity-80">
            {t("lead")}
          </p>
        </div>
      </div>

      <MeaningChain alt={t("artworkAlt")} />
    </section>
  );
}
