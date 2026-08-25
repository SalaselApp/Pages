"use client";

import { useEffect, useRef } from "react";

/** The approved master's own pixel dimensions. */
const ASSET = { width: 1915, height: 821 } as const;
/**
 * First row of actual chain content in that canvas (measured from the alpha
 * channel: the links start at ~381px), with a small margin above so the top
 * links are not clipped. Everything above this is transparent, so cropping the
 * frame here lifts the chain up and removes the dead band that otherwise sits
 * it too low.
 */
const ART_TOP = 360;

/**
 * Section 5's connecting chain artwork.
 *
 * The approved master (`07-section-5-clean-chain-background.png`, hash-verified
 * in the extraction spec) is a 1915x821 canvas whose interlocked links occupy a
 * horizontal band across the lower two-thirds and are transparent everywhere
 * else. It is the section's literal "one learning flow" metaphor: the same
 * chain idea as Section 2, now running left-to-right to tie the three steps
 * together rather than bleeding in from a corner.
 *
 * This island only adds the entrance — a left-to-right clip-wipe that reads as
 * the chain "drawing" itself across the steps in the reading direction — so the
 * artwork still renders with no JavaScript. The wipe is physical
 * (`FlowChain`-owned) but mirrored per locale via a `scaleX(-1)` on the outer
 * box in LTR, so the chain always draws from the reading-start edge toward the
 * reading-end edge in both Arabic and English.
 *
 * The links are abstract and decorative, so the LTR flip changes nothing
 * readable and the supplied file stays byte-identical.
 */
export function FlowChain({
  alt,
  dir = "rtl",
}: {
  alt: string;
  dir?: "ltr" | "rtl";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    wrap.dataset.flowReady = "true";

    const reveal = () => {
      wrap.dataset.flowShown = "true";
    };

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    /*
      The observed element is this outer box; the clipped one is the frame
      inside. They must be separate, because a `clip-path` that hides an element
      also removes it from intersection geometry, and the observer would never
      fire. In LTR the whole box is mirrored so the reveal, which is physically
      left-to-right, still runs from the reading-start (physical right) edge.
    */
    <div
      ref={wrapRef}
      className={dir === "ltr" ? "flow-chain [transform:scaleX(-1)]" : "flow-chain"}
    >
      {/*
        The master's chain occupies only the lower band of its 1915x821 canvas;
        the top ~34% is transparent. Rendering the whole canvas would sit the
        chain too low and reserve dead space above it, so the frame's aspect
        ratio is cropped to the content band (from `ART.top` down) and the image
        is pulled up by the same offset. The file itself is untouched — no
        regeneration, no destructive crop.
      */}
      <div
        className="flow-chain-frame"
        style={{ aspectRatio: `${ASSET.width} / ${ASSET.height - ART_TOP}` }}
      >
        {/* Plain <img> per the spec: the approved master stays byte-identical.
            Below the fold, so lazy-loaded; its box is reserved by the frame's
            aspect-ratio so nothing shifts as it decodes. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/landing/extracted/07-section-5-clean-chain-background.webp"
          alt={alt}
          width={ASSET.width}
          height={ASSET.height}
          loading="lazy"
          decoding="async"
          style={{
            // Scale to the frame width, then lift so the transparent top band is
            // clipped away and the chain rides higher.
            height: `${(ASSET.height / (ASSET.height - ART_TOP)) * 100}%`,
            top: `${(-ART_TOP / (ASSET.height - ART_TOP)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
