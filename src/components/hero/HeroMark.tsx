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
 * The asset's own baked-in glow is much weaker than the comp's, where the mark
 * sits in a warm green bloom. Measured off the comp along a horizontal line
 * through the mark's centre, in units of the artwork's half-width: the glow is
 * ~+53 luminance over page background at the artwork edge, ~+12 at 1.3x, and
 * back to background by ~1.6x. So it is bright and tight, not a broad wash — an
 * earlier wider version read as fog across the whole upper page.
 *
 * Three stacked layers reproduce that curve, since one radial gradient cannot be
 * both intense at the artwork edge and fully gone shortly after. Each is sized
 * as a percentage of the artwork's *width* and forced square, so the falloff is
 * radially even rather than stretched by the artwork's taller box. A layer of
 * width `k%` has radius `k/100` in half-width units, and its gradient fades out
 * by ~70% of that, which is what keeps the outer layer inside the comp's ~1.6x.
 *
 * They breathe on different durations so the glow never pulses as one flat unit.
 *
 * There is deliberately no oversized watermark of the mark behind the headline.
 */

const ASSET = { width: 1672, height: 941 } as const;
const ART = { left: 566, top: 170, width: 476, height: 559 } as const;

export function HeroMark() {
  return (
    <div className="relative flex w-full justify-center">
      {/* Outer falloff: reaches ~1.6x the artwork half-width, as in the comp. */}
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[225%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(47,143,107,0.34)_0%,rgba(47,143,107,0.13)_34%,transparent_66%)]"
      />
      {/* Mid bloom: carries most of the visible glow just past the artwork. */}
      <div
        aria-hidden="true"
        className="hero-sheen pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(72,168,140,0.44)_0%,rgba(58,145,116,0.22)_42%,transparent_70%)]"
      />
      {/* Tight core: the bright halo hugging the artwork itself. */}
      <div
        aria-hidden="true"
        className="hero-core pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[105%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(132,214,176,0.40)_0%,rgba(72,168,140,0.24)_46%,transparent_72%)]"
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


