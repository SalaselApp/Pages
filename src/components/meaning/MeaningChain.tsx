import Image from "next/image";
import { RevealOnView } from "@/components/RevealOnView";

/**
 * Section 2's chain artwork.
 *
 * The supplied master (`04-section-2-rising-chain.png`) is a 900x858 canvas
 * holding a tall, portrait chain that rises diagonally — dense at the bottom,
 * thinning as it climbs toward the top. The chain fills the canvas vertically
 * (it reaches the bottom edge and sits a few pixels below the top) while leaving
 * roughly symmetric transparent margins on the left and right. Rendering the
 * whole canvas would pad the box with that empty transparency, so the visible
 * window is cropped to the content box with CSS: an `overflow-hidden` frame at
 * the content's aspect ratio holding an oversized, offset image. The file itself
 * is untouched — no regeneration, no destructive crop, no mirroring.
 *
 * Placement is logical: the chain is pinned to the inline-end (trailing) edge,
 * landing on the physical left in Arabic RTL — as in the approved comp — and on
 * the physical right in English LTR. For LTR the artwork is mirrored so it still
 * bleeds off that trailing edge; the links are abstract and decorative, so the
 * flip changes nothing readable and the supplied file stays untouched. The copy
 * column always takes the opposite, leading edge.
 */

/** The master's own pixel dimensions. */
const ASSET = { width: 900, height: 858 } as const;
/**
 * Bounding box of the actual chain within that canvas, measured from the alpha
 * channel. It reaches the bottom edge and sits just below the top, which is why
 * the artwork reads as rising in from off-page top and bottom.
 */
const ART = { left: 139, top: 28, width: 622, height: 830 } as const;

export function MeaningChain({
  alt,
  dir = "rtl",
}: {
  alt: string;
  /**
   * Locale direction. The chain is pinned to the inline-end (trailing) edge in
   * both locales, so it lands on the physical left in Arabic RTL — matching the
   * approved comp — and mirrors to the physical right in English LTR. For LTR
   * the artwork is flipped horizontally so it still bleeds off that trailing
   * edge; the flip is a non-destructive render transform on abstract decorative
   * links, and the supplied file is untouched.
   */
  dir?: "ltr" | "rtl";
}) {
  return (
    /*
      The observed element is this outer box; the clipped one is the frame
      inside. They have to be separate elements, because a `clip-path` that
      hides an element also hides it from intersection geometry, and the
      observer would then never fire.

      Mobile / tablet (below `xl`): the section is a normal stacked block, so the
      chain is a centered supporting motif beneath the copy — capped so a portrait
      chain never runs taller than it should on a narrow phone.

      Desktop (`xl`+): the chain is a large motif anchored to the bottom, rising up
      the side and bleeding off the bottom (and, on a short screen, the top too).
      It sits a little in from the trailing edge (`end-[4vw]`) rather than flush
      against it, so it reads as more central and less tucked into the corner, and
      its width is `42vw` (capped at `40rem`) — large and present, but sized so the
      full portrait chain fits within the section's height rather than bleeding off
      the top, while its inner edge still stops clear of the copy column on the
      opposite side.

      The desktop `max-width` is written as an explicit arbitrary cap matching the
      width's own rem ceiling, rather than `max-w-none`: Tailwind sorts the static
      `max-w-none` utility ahead of the arbitrary `sm:max-w-[22rem]`, so `none`
      lost the cascade at `xl` and the chain stayed clamped to the small mobile
      cap. Two arbitrary caps of the same kind sort by breakpoint instead, so the
      `xl` one correctly wins. (Keep this cap's value in sync with the `xl:w-`
      rem ceiling above, and avoid writing other `max-w-[…]` literals in this
      comment — Tailwind scans comment text and would emit phantom rules.)
    */
    <RevealOnView
      className={`relative mx-auto w-[68%] max-w-[20rem] sm:w-[56%] sm:max-w-[22rem] xl:absolute xl:bottom-0 xl:end-[4vw] xl:mx-0 xl:w-[min(42vw,40rem)] xl:max-w-[40rem] ${
        /* English LTR: mirror the whole positioning box so the chain bleeds off
           its trailing (physical-right) edge, the same distance from that edge
           as it sits from the left in Arabic. The flip lives here, on the outer
           box, rather than on the frame below, whose `transform` the reveal
           animation owns and would overwrite. */
        dir === "ltr" ? " [transform:scaleX(-1)]" : ""
      }`}
    >
      {/*
        `aspect-ratio` reserves the full box before the image loads, so nothing
        below it shifts. The reveal animates only `clip-path`, `opacity`, and
        `transform`, never this box's dimensions.
      */}
      <div
        className="reveal-ltr relative w-full overflow-hidden"
        style={{ aspectRatio: `${ART.width} / ${ART.height}` }}
      >
        <Image
          src="/images/landing/extracted/04-section-2-rising-chain.png"
          alt={alt}
          width={ASSET.width}
          height={ASSET.height}
          /*
            The rendered image is `ASSET.width / ART.width` (≈1.45x) wider than
            its visible frame, so the useful download width is that multiple of
            the frame's share of the viewport: ~82vw below `xl`, ~64vw above.
          */
          sizes="(max-width: 1279px) 82vw, 82vw"
          className="absolute max-w-none"
          style={{
            width: `${(ASSET.width / ART.width) * 100}%`,
            height: `${(ASSET.height / ART.height) * 100}%`,
            left: `${(ART.left / ART.width) * -100}%`,
            top: `${(ART.top / ART.height) * -100}%`,
          }}
        />
      </div>
    </RevealOnView>
  );
}
