"use client";

import { useEffect, useRef } from "react";

/**
 * Section 4's single real extension screenshot.
 *
 * A plain, flat framed screenshot: a thin teal border, rounded corners, and a
 * quiet shadow, all in CSS (`.ext-*` in `globals.css`). No 3D lean or parallax.
 * This island only adds the viewport entrance (a simple fade + rise), so the
 * page still renders the screenshot with no JavaScript.
 *
 * The screenshot is a plain `<img>` with reserved width/height per the spec:
 * the file stays byte-identical. The accepted crop (`02-hero-extension-real.png`)
 * already omits personal tabs and account controls.
 */
export function ExtensionScreen({ alt }: { alt: string }) {
  const shellRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={shellRef} className="ext-shell">
      <figure className="ext-frame">
        <span className="ext-media">
          {/* Plain <img> per the spec: byte-identical file. Below-fold, lazy. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/landing/extracted/02-hero-extension-real.png"
            alt={alt}
            width={1620}
            height={960}
            loading="lazy"
            decoding="async"
          />
        </span>
      </figure>
    </div>
  );
}
