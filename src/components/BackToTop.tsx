"use client";

import { useEffect, useRef } from "react";

/**
 * A floating "back to top" control that appears only once the reader reaches
 * the very bottom of the page, then smoothly returns them to the hero.
 *
 * It exists as a client island only because it needs two browser APIs:
 * `IntersectionObserver` (to know when the footer is on screen) and
 * `window.scrollTo` (to run the scroll). It renders a single fixed button and
 * touches nothing else, so the rest of the page stays server-rendered and the
 * button is simply absent when JavaScript never runs — there is no scroll it
 * could perform without JS anyway.
 *
 * Visibility is driven by a `data-shown` attribute written straight to the DOM
 * node, matching the project's other islands (`RevealOnView`, `ExtensionScreen`):
 * the CSS in `globals.css` (`.back-to-top`) owns the fade/scale transition, and
 * React never re-renders. The button watches the footer rather than a scroll
 * offset so it tracks the actual "end of page" the reader asked for, at any
 * viewport height.
 *
 * The return scroll honours `prefers-reduced-motion`: motion-sensitive readers
 * jump instantly instead of gliding, consistent with the reduced-motion block
 * that already sets `scroll-behavior: auto` globally.
 */
export function BackToTop({ label }: { label: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = ref.current;
    if (!button) return;

    // The band whose visibility toggles the button. Falls back to the footer's
    // element; if it is somehow absent the button just stays hidden.
    const footer = document.getElementById("site-footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          button.dataset.shown = entry.isIntersecting ? "true" : "false";
        }
      },
      // Reveal as soon as any sliver of the footer enters the viewport.
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    // Return focus to the top of the document so keyboard users land back at
    // the start. `preventScroll` is essential: a plain focus() scrolls the
    // element into view and would interrupt the smooth scroll partway, leaving
    // the reader short of the very top.
    document.getElementById("main")?.focus?.({ preventScroll: true });
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={scrollToTop}
      className="back-to-top"
      data-shown="false"
      aria-label={label}
      title={label}
    >
      {/* Upward chevron. Decorative: the accessible name comes from aria-label. */}
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
