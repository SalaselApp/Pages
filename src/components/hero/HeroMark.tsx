import Image from "next/image";

/**
 * The glowing Salasel mark, centered above the headline as in the comp.
 *
 * `01-hero-logo-glow.png` is a 1672x941 canvas whose artwork occupies only
 * x 566-1042, y 170-729, leaving wide transparent margins. Rendering it whole
 * would spend a large share of the hero's vertical budget on empty pixels, so
 * the asset is used unchanged and cropped purely with CSS: the wrapper takes the
 * artwork's own aspect ratio and the image is scaled and offset inside it.
 * Values are the measured alpha bounds, not a redraw.
 *
 * The asset already carries its own baked-in glow, so the only additions here
 * are two soft radial halos that breathe out of phase with each other. There is
 * deliberately no oversized watermark of the mark behind the headline.
 */

const ASSET = { width: 1672, height: 941 } as const;
const ART = { left: 566, top: 170, width: 476, height: 559 } as const;

export function HeroMark() {
  return (
    <div className="relative flex w-full justify-center">
      {/* Wide ambient halo. */}
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute top-1/2 left-1/2 h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(47,143,107,0.26),transparent_62%)]"
      />
      {/* Tighter core glow, breathing out of phase with the halo. */}
      <div
        aria-hidden="true"
        className="hero-sheen pointer-events-none absolute top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(67,160,138,0.30),transparent_58%)]"
      />
      {/*
        In the comp the mark stands about a third of the canvas tall. Sizing it
        against `vh` as well as `vw` keeps that presence on a roomy screen while
        letting it shrink on short viewports, so it can never be the reason the
        product paths fall below the fold.
      */}
      <div
        className="relative w-[min(34vw,17vh)] max-w-60 overflow-hidden sm:w-[min(44vw,22vh)]"
        style={{ aspectRatio: `${ART.width} / ${ART.height}` }}
      >
        <Image
          src="/images/landing/extracted/01-hero-logo-glow.png"
          alt=""
          aria-hidden="true"
          width={ASSET.width}
          height={ASSET.height}
          priority
          sizes="(max-width: 639px) 34vw, 22vh"
          className="absolute max-w-none"
          style={{
            width: `${(ASSET.width / ART.width) * 100}%`,
            height: `${(ASSET.height / ART.height) * 100}%`,
            left: `${(ART.left / ART.width) * -100}%`,
            top: `${(ART.top / ART.height) * -100}%`,
          }}
        />
      </div>
    </div>
  );
}


