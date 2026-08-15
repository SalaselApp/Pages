"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Section 3's product screenshots.
 *
 * Two presentations of the same three real screenshots, chosen by width in CSS:
 *
 *   - `md` and up: the approved layered 3D stack. All of its visual structure —
 *     the locked perspective plane, per-layer offsets, teal frames, and shadows
 *     — lives in CSS (`.app-*` rules in `globals.css`). This island adds the
 *     entrance (rear → front slide-in on scroll) and desktop pointer parallax.
 *   - Below `md`: a horizontal scroll-snap slider. A leaning 3D stack does not
 *     read well on a narrow phone, so mobile gets one screenshot at a time,
 *     swipeable, with dot indicators — legible and touch-native.
 *
 * Every `<img>` is a plain image with reserved width/height, as the spec
 * requires: the files stay byte-identical and CSS `object-fit`/`object-position`
 * do the non-destructive cropping. With no JavaScript, no reveal attribute is
 * set, so the stack simply renders and the slider is a normal scroll container.
 */

/** Locked focal-cropped layers, ordered rear → front for the reveal stagger. */
type Screen = {
  key: "rear" | "middle" | "front";
  src: string;
  alt: string;
  /** Natural pixel size, reserved to prevent layout shift. */
  width: number;
  height: number;
  /** Entrance delay; rear starts first, front last (~140ms stagger). */
  delay: string;
};

export function AppScreens({
  homeAlt,
  seriesAlt,
  playerAlt,
}: {
  homeAlt: string;
  seriesAlt: string;
  playerAlt: string;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLUListElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Ordered rear → front so the desktop reveal builds the stack from the back.
  // The slider presents them front-first (home, then series, then player), so
  // it maps this array in reverse.
  const screens: Screen[] = [
    {
      key: "rear",
      src: "/images/landing/product-screenshots/player-notes.png",
      alt: playerAlt,
      width: 1887,
      height: 868,
      delay: "0s",
    },
    {
      key: "middle",
      src: "/images/landing/product-screenshots/series-detail.png",
      alt: seriesAlt,
      width: 1868,
      height: 866,
      delay: "0.14s",
    },
    {
      key: "front",
      src: "/images/landing/product-screenshots/home-catalog.png",
      alt: homeAlt,
      width: 1862,
      height: 867,
      delay: "0.28s",
    },
  ];

  // Slider order: front screenshot first, as a phone user expects to land on
  // the home/catalog view.
  const slides = [...screens].reverse();

  // Entrance trigger for the desktop stack. Written straight to the DOM node
  // like `RevealOnView`: the flags are one-way output to the CSS, so React
  // never needs to re-render.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    shell.dataset.screensReady = "true";

    const reveal = () => {
      shell.dataset.screensShown = "true";
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
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  // Track the active slide for the dot indicators. Reads scroll position rather
  // than binding per-slide observers: one cheap listener, and it stays correct
  // through momentum scrolling.
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = slider.clientWidth || 1;
        // `abs` so it works the same in RTL, where scrollLeft is negative.
        const index = Math.round(Math.abs(slider.scrollLeft) / width);
        setActiveSlide(index);
      });
    };

    slider.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      slider.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const goToSlide = (index: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const width = slider.clientWidth;
    // Sign follows the scroll direction so RTL scrolls the correct way.
    const direction = getComputedStyle(slider).direction === "rtl" ? -1 : 1;
    slider.scrollTo({ left: direction * index * width, behavior: "smooth" });
  };

  // Desktop pointer parallax. Fine-pointer + no reduced-motion only, so touch
  // devices and motion-sensitive users get a still composition. Only the deck's
  // CSS custom properties change, which the CSS adds to the locked base
  // rotation, leaving every layer's approved transform untouched.
  useEffect(() => {
    const deck = deckRef.current;
    const shell = shellRef.current;
    if (!deck || !shell) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wideEnough = window.matchMedia("(min-width: 1024px)");

    let frame = 0;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = shell.getBoundingClientRect();
      // -0.5..0.5 across the shell, clamped so the lean stays gentle.
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        deck.style.setProperty("--app-ry", `${(px * 6).toFixed(2)}deg`);
        deck.style.setProperty("--app-rx", `${(-py * 4).toFixed(2)}deg`);
      });
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      deck.style.setProperty("--app-ry", "0deg");
      deck.style.setProperty("--app-rx", "0deg");
    };

    const enabled = () =>
      finePointer.matches && wideEnough.matches && !reducedMotion.matches;

    const bind = () => {
      if (!enabled()) return;
      shell.addEventListener("pointermove", onMove);
      shell.addEventListener("pointerleave", reset);
    };

    const unbind = () => {
      shell.removeEventListener("pointermove", onMove);
      shell.removeEventListener("pointerleave", reset);
      reset();
    };

    const refresh = () => {
      unbind();
      bind();
    };

    bind();
    finePointer.addEventListener("change", refresh);
    reducedMotion.addEventListener("change", refresh);
    wideEnough.addEventListener("change", refresh);

    return () => {
      unbind();
      finePointer.removeEventListener("change", refresh);
      reducedMotion.removeEventListener("change", refresh);
      wideEnough.removeEventListener("change", refresh);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      {/* Desktop / tablet: the approved layered 3D stack. */}
      <div
        ref={shellRef}
        className="app-shell hidden md:block"
        aria-label="Three real Salasel app screenshots layered in perspective"
      >
        <div ref={deckRef} className="app-deck">
          {screens.map((screen) => (
            <figure key={screen.key} className={`app-screen app-screen-${screen.key}`}>
              {/* The whole container animates as one: this inner wrapper carries
                  the teal frame and rim (CSS pseudo-elements) plus the media, so
                  the frame, shadow, and image all slide in together. */}
              <span className="app-screen-inner" style={{ animationDelay: screen.delay }}>
                <span className="app-screen-media">
                  {/* Plain <img> per the spec: files stay byte-identical, CSS
                      crops non-destructively. Below-fold, so lazy-loaded. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screen.src}
                    alt={screen.alt}
                    width={screen.width}
                    height={screen.height}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              </span>
            </figure>
          ))}
        </div>
      </div>

      {/* Mobile: a swipeable scroll-snap slider, one screenshot at a time. */}
      <div className="app-slider-wrap md:hidden" role="group" aria-roledescription="carousel" aria-label="Salasel app screenshots">
        <ul ref={sliderRef} className="app-slider">
          {slides.map((screen, index) => (
            <li
              key={screen.key}
              className="app-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${slides.length}`}
            >
              <div className="app-slide-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screen.src}
                  alt={screen.alt}
                  width={screen.width}
                  height={screen.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </li>
          ))}
        </ul>

        {/* Dot indicators. Buttons so they are keyboard-operable and each jumps
            to its slide. */}
        <div className="app-dots" role="tablist" aria-label="Choose screenshot">
          {slides.map((screen, index) => (
            <button
              key={screen.key}
              type="button"
              role="tab"
              aria-selected={activeSlide === index}
              aria-label={`${index + 1} / ${slides.length}`}
              className="app-dot"
              data-active={activeSlide === index}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
