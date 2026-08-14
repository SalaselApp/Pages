/**
 * Small line icons standing in for the two products.
 *
 * These are symbols, not product UI: no fake app or extension interface is
 * drawn. Real screenshots belong in the dedicated product sections further down
 * the page. Both are decorative next to a real text label, so they are hidden
 * from assistive technology.
 */

const shared = {
  viewBox: "0 0 32 32",
  fill: "none" as const,
  stroke: "currentColor" as const,
  // Thin for the size these render at. Stroke width scales with the box, so a
  // heavier value reads as clumsy once the icon is ~48px tall.
  strokeWidth: 1.15,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false as const,
};

/** A stack of series/playlists: the app's core object. */
export function AppIcon({ className }: { className?: string }) {
  return (
    <svg {...shared} className={className}>
      <rect x="4.5" y="7.5" width="23" height="17" rx="3" />
      <path d="M4.5 12.5h23" />
      <path d="M13.5 16.2v4.6l4.4-2.3z" />
      <path d="M9.2 10h.01M12 10h.01" />
    </svg>
  );
}

/** A puzzle piece: the conventional symbol for a browser extension. */
export function ExtensionIcon({ className }: { className?: string }) {
  return (
    <svg {...shared} className={className}>
      <path d="M13 5.5a2.6 2.6 0 0 1 5.2 0V7h3.4a1.6 1.6 0 0 1 1.6 1.6V12h1.3a2.6 2.6 0 0 1 0 5.2H23v4.2a1.6 1.6 0 0 1-1.6 1.6h-4.2V21.6a2.6 2.6 0 0 0-5.2 0V23H8.6A1.6 1.6 0 0 1 7 21.4v-4.2H5.7a2.6 2.6 0 0 1 0-5.2H7V8.6A1.6 1.6 0 0 1 8.6 7H13z" />
    </svg>
  );
}
