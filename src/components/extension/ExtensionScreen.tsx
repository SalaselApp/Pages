"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Section 4's extension screenshots.
 *
 * A small swipeable slider inside the framed plate, so the section can show
 * more than one facet of the extension — the distraction toggles view and the
 * note-taking panel — one at a time. Same framing language as before (thin
 * teal border, rounded corners, quiet shadow, all `.ext-*` in `globals.css`)
 * and the same one-shot viewport entrance; the slider itself is a native
 * horizontal scroll-snap container with keyboard-operable dot indicators.
 *
 * The page still renders every screenshot with no JavaScript: the slides are a
 * plain scroll container and the island only adds the entrance flag and tracks
 * the active dot. Each image is a plain `<img>` with reserved width/height per
 * the spec, so the files stay byte-identical and CSS crops non-destructively.
 */
type Shot = { src: string; alt: string };

export function ExtensionScreen({
  alt,
  notesAlt,
}: {
  alt: string;
  notesAlt: string;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLUListElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const shots: Shot[] = [
    { src: "/images/landing/extracted/02-hero-extension-real.webp", alt },
    { src: "/images/landing/extracted/03-hero-extension-notes.webp", alt: notesAlt },
  ];

  // Entrance trigger, written straight to the DOM like `RevealOnView`.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    shell.dataset.extReady = "true";

    const reveal = () => {
      shell.dataset.extShown = "true";
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
  // than binding per-slide observers: one cheap listener, correct through
  // momentum scrolling and RTL (where scrollLeft is negative).
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = slider.clientWidth || 1;
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
    const direction = getComputedStyle(slider).direction === "rtl" ? -1 : 1;
    slider.scrollTo({ left: direction * index * width, behavior: "smooth" });
  };

  // Auto-advance on a short cooldown, looping through the shots. Paused while
  // the user hovers, focuses, or touches the slider so it never fights a manual
  // read, and disabled entirely under reduced-motion. The current index is read
  // straight off scroll position at advance time, so the interval never needs
  // to re-bind or track React state.
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || shots.length < 2) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let timer = 0;
    let paused = false;

    const advance = () => {
      if (paused) return;
      const width = slider.clientWidth || 1;
      const current = Math.round(Math.abs(slider.scrollLeft) / width);
      const next = (current + 1) % shots.length;
      goToSlide(next);
    };

    const start = () => {
      if (reducedMotion.matches) return;
      stop();
      timer = window.setInterval(advance, 4000);
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = 0;
    };

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };

    slider.addEventListener("pointerenter", pause);
    slider.addEventListener("pointerleave", resume);
    slider.addEventListener("focusin", pause);
    slider.addEventListener("focusout", resume);
    slider.addEventListener("touchstart", pause, { passive: true });

    start();
    reducedMotion.addEventListener("change", start);

    return () => {
      stop();
      slider.removeEventListener("pointerenter", pause);
      slider.removeEventListener("pointerleave", resume);
      slider.removeEventListener("focusin", pause);
      slider.removeEventListener("focusout", resume);
      slider.removeEventListener("touchstart", pause);
      reducedMotion.removeEventListener("change", start);
    };
  }, [shots.length]);

  return (
    <div
      ref={shellRef}
      className="ext-shell"
      role="group"
      aria-roledescription="carousel"
      aria-label="Salasel extension screenshots"
    >
      <figure className="ext-frame">
        <ul ref={sliderRef} className="ext-slider">
          {shots.map((shot, index) => (
            <li
              key={shot.src}
              className="ext-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${shots.length}`}
            >
              <span className="ext-media">
                {/* Plain <img> per the spec: byte-identical file. Below-fold, lazy. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.src}
                  alt={shot.alt}
                  width={1620}
                  height={960}
                  loading="lazy"
                  decoding="async"
                />
              </span>
            </li>
          ))}
        </ul>
      </figure>

      {/* Dot indicators. Buttons so they are keyboard-operable and each jumps
          to its slide. */}
      <div className="ext-dots" role="tablist" aria-label="Choose screenshot">
        {shots.map((shot, index) => (
          <button
            key={shot.src}
            type="button"
            role="tab"
            aria-selected={activeSlide === index}
            aria-label={`${index + 1} / ${shots.length}`}
            className="ext-dot"
            data-active={activeSlide === index}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
