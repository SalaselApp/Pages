import Image from "next/image";


const ASSET = { width: 1672, height: 941 } as const;
// The mark's opaque pixels occupy x:566–1043, y:170–731 in the source. But its
// visual mass is not centred in that box — the alpha-weighted centroid sits at
// ~x857, about 52px right of the box centre, so cropping tight to the alpha
// box makes the mark read as pushed to the right (and the glow, which is
// centred on this box, ends up left of the mark's optical centre).
//
// To centre the mark's mass, the crop is widened on the trailing (right) side
// with transparent padding so the centroid (x857) lands at the box centre:
// width = 2 * (857 - 566) = 582. The mark then sits optically centred inside
// its box, under the centred glow, without cropping any of the artwork.
const ART = { left: 566, top: 170, width: 582, height: 561 } as const;

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
      {/*
        The box is ~22% wider than the mark's own artwork now (transparent
        trailing padding centres the mark's mass), so the width tokens are
        scaled up by the same factor to keep the glyph itself at its original
        on-screen size rather than shrinking it.
      */}
      <div
        className="relative w-[min(42vw,21vh)] max-w-72 overflow-hidden sm:w-[min(54vw,27vh)]"
        style={{ aspectRatio: `${ART.width} / ${ART.height}` }}
      >
        <Image
          src="/images/landing/extracted/01-hero-logo-glow.webp"
          alt=""
          aria-hidden="true"
          width={ASSET.width}
          height={ASSET.height}
          priority
          sizes="(max-width: 639px) 42vw, 27vh"
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


