import type { ReactNode } from "react";
import type { Destination } from "@/config/links";

/**
 * One of the two equally weighted hero product paths.
 *
 * Both paths share this component precisely so neither reads as subordinate to
 * the other: same frame, same type scale, same CTA weight. Only the accent
 * colour and the icon differ.
 *
 * The two panels always match in height. `items-stretch` on the parent grid
 * plus `h-full` here makes them share the tallest row height, and the CTA is
 * pinned to the bottom with `mt-auto`, so the buttons line up across both
 * panels no matter how the titles wrap.
 */
export function ProductPath({
  eyebrow,
  title,
  cta,
  destination,
  accent,
  icon,
}: {
  eyebrow: string;
  title: string;
  cta: string;
  destination: Destination;
  accent: "teal" | "lime";
  /** Decorative symbol for the product. Not product UI. */
  icon: ReactNode;
}) {
  const accentText = accent === "lime" ? "text-lime-brand" : "text-teal-brand";

  return (
    <div className="border-hairline bg-canvas-raised/50 hover:border-hairline-strong relative flex h-full flex-col gap-3 rounded-2xl border p-4 backdrop-blur-[2px] transition-colors duration-300 sm:gap-4 sm:p-5">
      <div className="flex items-center gap-3.5">
        {/*
          The icon sits directly on the panel with no inner frame: a
          card-inside-card box was extra structure for no gain, and dropping it
          lets the mark read at nearly the panel's full text height.
        */}
        <span className={`shrink-0 ${accentText}`}>{icon}</span>
        <span className="flex min-w-0 flex-col gap-1">
          <span
            className={`text-[0.68rem] font-medium tracking-[0.16em] uppercase ${accentText}`}
          >
            {eyebrow}
          </span>
          <h2 className="text-cream text-base leading-snug font-semibold text-balance sm:text-lg">
            {title}
          </h2>
        </span>
      </div>

      <a
        href={destination.href}
        className="border-hairline-strong text-cream hover:bg-lime-brand/10 hover:border-lime-brand/50 mt-auto inline-flex min-h-11 w-full items-center justify-center rounded-full border px-6 text-sm font-medium transition-colors duration-200 sm:w-auto sm:self-start"
      >
        {cta}
      </a>
    </div>
  );
}
