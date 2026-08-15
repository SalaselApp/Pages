import { getTranslations } from "next-intl/server";
import { MeaningChain } from "@/components/meaning/MeaningChain";
import { RevealOnView } from "@/components/RevealOnView";

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
 * Everything here is server-rendered. The only client code is `RevealOnView`'s
 * reveal island, used twice — once for the chain artwork, once for the copy
 * column — since both need `IntersectionObserver`.
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
          Column width is capped well clear of the artwork's own right edge
          (`min(60vw, ...)` in `MeaningChain`), so it holds at every desktop size
          instead of depending on how tall the column happens to grow at this
          larger type scale. `min-h-svh` on the section is only a floor, so a
          longer English paragraph — or the pair wrapping to two lines when a
          narrower desktop width can't hold them on one — simply grows the
          section rather than running under the chain.
        */}
        <RevealOnView className="flex flex-col gap-6 xl:ml-auto xl:w-[50%]">
          {/*
            Eyebrow with the comp's thin vertical rule. The rule is decorative, so
            it is a border on the text itself rather than an element a screen
            reader has to step over. `border-s` + `ps-` are logical, so it moves to
            the correct side of the label in each direction.

            `reveal-rise` fades each line up on scroll, staggered by
            `animationDelay`, the same treatment the hero uses for its own
            entrance. Direction is vertical only: the chain artwork already
            claims the horizontal reveal in this section, so the copy stays out
            of its way rather than sliding in from either side.
          */}
          <p className="reveal-rise border-teal-deep text-teal-deep border-s-2 ps-4 text-[clamp(0.95rem,2.1vw,1.375rem)] font-medium tracking-[0.02em]">
            {t("eyebrow")}
          </p>

          {/*
            One heading, split across two lines as in the comp. `block` spans
            rather than a `<br>`, so the break is a layout choice that collapses
            naturally when the column is narrow.

            Sized to match the comp's own scale: there, each heading line's ink
            runs about 7.2% of the canvas width tall, which is roughly 9-10vw of
            font size once cap-height is accounted for. The `rem` ceiling keeps
            it from ballooning further on very wide monitors than the section's
            own max-width would suggest. The wider column (50% vs. the previous
            38%) lets a lower vw-multiplier still fill the available width, which
            keeps total block height inside one `xl` viewport.
          */}
          <h2
            id="meaning-heading"
            className="reveal-rise text-[clamp(2.25rem,6.4vw,4.25rem)] leading-[1.16] font-semibold tracking-[-0.01em] text-balance"
            style={{ animationDelay: "0.08s" }}
          >
            <span className="block">{t("headingLead")}</span>
            <span className="block">{t("headingRest")}</span>
          </h2>

          {/*
            The comp's two numbered phrases sit side by side, not stacked, so this
            stays a row at every width the column supports. `flex-wrap` lets the
            pair drop to two lines instead of overflowing on a narrow phone.
          */}
          <ol
            className="reveal-rise flex flex-row flex-wrap items-baseline gap-x-8 gap-y-3"
            style={{ animationDelay: "0.16s" }}
          >
            {[
              { marker: t("first.marker"), text: t("first.text") },
              { marker: t("second.marker"), text: t("second.text") },
            ].map((item) => (
              <li key={item.marker} className="flex items-baseline gap-3">
                {/*
                  Markers are numerals in the comp, set in the teal accent. They
                  label rather than decorate, so they stay in the accessible text.
                */}
                <span className="text-teal-deep text-[clamp(1.25rem,2.2vw,1.625rem)] font-semibold tabular-nums">
                  {item.marker}
                </span>
                <span className="text-[clamp(1.0625rem,1.9vw,1.375rem)] font-medium">
                  {item.text}
                </span>
              </li>
            ))}
          </ol>

          {/*
            Body copy. Not in the comp, which shows only the heading and the two
            phrases, but the spec asks this section to actually introduce both
            meanings of the name. Sized up to match the new scale while staying
            clearly secondary to the heading, so the composition stays
            typography-led rather than becoming a wall of large type.
          */}
          <p
            className="reveal-rise max-w-[46ch] text-[clamp(1.0625rem,1.9vw,1.3125rem)] leading-relaxed opacity-80"
            style={{ animationDelay: "0.24s" }}
          >
            {t("lead")}
          </p>
        </RevealOnView>
      </div>

      <MeaningChain alt={t("artworkAlt")} />
    </section>
  );
}
