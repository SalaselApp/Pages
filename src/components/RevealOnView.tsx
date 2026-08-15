"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Triggers a one-shot entrance animation when its content first scrolls into
 * view.
 *
 * This exists as a client component only because `IntersectionObserver` is a
 * browser API. It renders one wrapper element and never touches its children, so
 * whatever it wraps stays server-rendered.
 *
 * Two data attributes drive the CSS, which owns the whole visual effect:
 *
 * - `data-reveal-ready` — set on mount, switching on the pre-reveal resting
 *   state. Until it is present no reveal rule matches, so the content is fully
 *   visible when JavaScript never runs. This is what keeps the artwork from
 *   disappearing in a no-JS export.
 * - `data-reveal-shown` — set once, when the element first intersects. It is
 *   deliberately never removed (that would replay the animation), and the
 *   observer disconnects as soon as it fires.
 *
 * Both attributes land on this wrapper while the animated element is a
 * descendant. That split matters: `clip-path` reduces an element's visible area,
 * and the intersection geometry accounts for it, so an observer watching the
 * clipped node itself would measure nothing visible and never fire.
 *
 * The attributes are written straight to the DOM node rather than held in React
 * state. They are one-way output to a style system React does not otherwise read,
 * so a re-render would buy nothing.
 *
 * Reduced-motion is handled purely in CSS rather than by skipping the observer,
 * so a user who changes the preference mid-session still sees the correct state.
 */
export function RevealOnView({
  children,
  className = "",
  /**
   * Optional writing direction for the wrapper. Used when the element sits
   * inside a container whose direction has been pinned (e.g. a physically
   * ordered grid) and its own text needs to read in the locale's direction.
   */
  dir,
  /** How much of the element must be visible before revealing. */
  threshold = 0.2,
  /** Starts the reveal slightly before the element's top edge appears. */
  rootMargin = "0px 0px -10% 0px",
}: {
  children: ReactNode;
  className?: string;
  dir?: "rtl" | "ltr";
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Hand the pre-reveal resting state over to CSS now that something is here
    // to release it.
    element.dataset.revealReady = "true";

    const reveal = () => {
      element.dataset.revealShown = "true";
    };

    // Older browsers without the observer simply keep the content visible.
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
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={className} dir={dir}>
      {children}
    </div>
  );
}
