import Image from "next/image";
import { RevealOnView } from "@/components/RevealOnView";

/**
 * Section 2's chain artwork.
 *
 * The supplied master (`04-section-2-left-chain.png`) is a full 1672x941 canvas
 * whose chain occupies only the lower-left corner and runs off both the left and
 * bottom edges. Rendering the whole canvas would waste most of the box on empty
 * transparency, so the visible window is cropped down to the content box with
 * CSS: an `overflow-hidden` frame at the content's aspect ratio holding an
 * oversized, offset image. The file itself is untouched — no regeneration, no
 * destructive crop, no mirroring.
 *
 * Placement is physical (`left`), not logical, in both locales. The chain is
 * drawn bleeding off the left edge, so mirroring it for English would mean
 * flipping the supplied artwork, and it would also put the reveal's specified
 * left-to-right direction at odds with the composition. The copy column moves to
 * the opposite side instead.
 */

/** The master's own pixel dimensions. */
const ASSET = { width: 1672, height: 941 } as const;
/**
 * Bounding box of the actual chain within that canvas, measured from the alpha
 * channel. It reaches the left and bottom edges, which is why the artwork reads
 * as entering from off-page.
 */
const ART = { left: 0, top: 265, width: 1007, height: 676 } as const;

export function MeaningChain({ alt }: { alt: string }) {
  return (
    /*
      The observed element is this outer box; the clipped one is the frame
      inside. They have to be separate elements, because a `clip-path` that
      hides an element also hides it from intersection geometry, and the
      observer would then never fire.
    */
    /*
      Desktop size is whichever of two limits binds first:

        60vw  — the comp's proportion (chain box = 0.602 of canvas width). Past
                this the artwork grows into the copy column.
        95svh — the same box measured against height. The comp's 0.72-of-height
                would be ~107svh, but the artwork is bottom-anchored, so a larger
                box also pushes its top edge higher; capping it keeps that edge
                clear of the copy on a short screen, where the copy takes a much
                greater share of the viewport than it does in the comp.

      Taking the `min()` means a tall screen is limited by width and a short, wide
      one by height, so the chain always sits fully on screen and always clear of
      the text. Height then follows from the frame's own aspect ratio.

      Below `xl` the section is a normal stacked block, so plain width sizing is
      correct and the artwork is scaled back to stay a supporting motif.
    */
    <RevealOnView className="relative w-[86%] max-w-[46rem] sm:w-[70%] xl:absolute xl:bottom-0 xl:left-0 xl:w-[min(60vw,95svh)] xl:max-w-none">
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
          src="/images/landing/extracted/04-section-2-left-chain.png"
          alt={alt}
          width={ASSET.width}
          height={ASSET.height}
          /*
            The rendered image is `ASSET.width / ART.width` (≈1.66x) wider than
            its visible frame, so the useful download width is that multiple of
            the frame's share of the viewport: ~86vw below `lg`, 60vw above.
          */
          sizes="(max-width: 1023px) 143vw, 100vw"
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
