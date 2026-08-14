/**
 * Decorative connected-dot network for the hero.
 *
 * Entirely inline SVG + CSS. No connector bitmap is loaded; the extracted
 * `01-hero-connected-dots-background.png` and the hero comp served only as
 * geometry and mood references (sparse clusters hugging the far edges, long
 * low-contrast links that run off-canvas, a few glowing nodes).
 *
 * Why SVG rather than positioned <span> elements: nodes and links then live in
 * one coordinate system, so a dot can never drift off the end of its line.
 * A percentage-positioned DOM version has to reconstruct each link's angle and
 * length from the motif box's aspect ratio, which changes with every viewport,
 * so any hardcoded ratio is wrong nearly everywhere.
 *
 * The motif deliberately overflows its own viewBox at the outer edge: points
 * sit at negative x (start side) or beyond the viewBox width (end side), so the
 * links are clipped mid-run and the field reads as a continuation of something
 * larger outside the page rather than a self-contained cluster.
 *
 * Motion layers, slowest to fastest:
 *   1. whole-motif drift        (very slow, tiny amplitude)
 *   2. per-node glow pulse      (staggered, never in sync)
 *   3. link shimmer             (base opacity breathing)
 *   4. a light travelling along some links (the "connecting" gesture)
 *
 * The whole layer is `pointer-events: none` and `aria-hidden`, so it can never
 * affect layout or interaction. Under `prefers-reduced-motion` every animation
 * stops and a calm static composition remains.
 */

/** Motif coordinate space. `x: 0` is the outer page edge. */
const VIEW = { width: 300, height: 1000 } as const;

type Point = {
  x: number;
  y: number;
  /**
   * Anchor living outside the viewBox. Its dot is never drawn; it exists only
   * so links have somewhere off-page to run to.
   */
  off?: true;
  /** Softly glowing node. Kept rare so the field stays quiet. */
  active?: true;
  /** Relative dot size, for a little depth. */
  scale?: number;
};

type Motif = {
  points: Point[];
  /** Index pairs into `points`. */
  links: [number, number][];
};

/**
 * Start-edge motif. Off-page anchors carry negative x so their links enter the
 * frame already in progress.
 */
const startMotif: Motif = {
  points: [
    { x: -70, y: 52, off: true },
    { x: 52, y: 96, scale: 0.85 },
    { x: 140, y: 150, active: true },
    { x: -48, y: 276, off: true },
    { x: 26, y: 232 },
    { x: 108, y: 300, scale: 1.05 },
    { x: 196, y: 258, scale: 0.8 },
    { x: 62, y: 372, active: true },
    { x: -78, y: 430, off: true },
    { x: 150, y: 424, scale: 0.9 },
    { x: 18, y: 486 },
    { x: 104, y: 552, active: true },
    { x: 204, y: 512, scale: 0.8 },
    { x: -40, y: 620, off: true },
    { x: 70, y: 636, scale: 1.05 },
    { x: 158, y: 700, scale: 0.9 },
    { x: 30, y: 762, active: true },
    { x: -66, y: 852, off: true },
    { x: 118, y: 828 },
    { x: 196, y: 786, scale: 0.8 },
    { x: 78, y: 906, scale: 0.95 },
    { x: 152, y: 962, active: true },
    { x: -30, y: 992, off: true },
  ],
  links: [
    [0, 1],
    [1, 2],
    [1, 4],
    [2, 6],
    [3, 4],
    [4, 5],
    [5, 2],
    [5, 7],
    [5, 9],
    [6, 9],
    [7, 10],
    [8, 7],
    [9, 12],
    [10, 11],
    [11, 14],
    [11, 12],
    [13, 14],
    [14, 16],
    [15, 11],
    [15, 18],
    [16, 20],
    [17, 16],
    [18, 19],
    [18, 21],
    [20, 21],
    [22, 20],
  ],
};

/**
 * End-edge motif. Mirrored in spirit but not in geometry, so the two sides never
 * read as a reflection of each other. Off-page anchors sit beyond the viewBox
 * width.
 */
const endMotif: Motif = {
  points: [
    { x: 330, y: 40, off: true },
    { x: 248, y: 92, scale: 0.85 },
    { x: 160, y: 148, active: true },
    { x: 352, y: 262, off: true },
    { x: 274, y: 226 },
    { x: 192, y: 294, scale: 1.05 },
    { x: 104, y: 250, scale: 0.8 },
    { x: 238, y: 366, active: true },
    { x: 378, y: 424, off: true },
    { x: 150, y: 418, scale: 0.9 },
    { x: 282, y: 480 },
    { x: 196, y: 546, active: true },
    { x: 96, y: 506, scale: 0.8 },
    { x: 340, y: 614, off: true },
    { x: 230, y: 630, scale: 1.05 },
    { x: 142, y: 694, scale: 0.9 },
    { x: 270, y: 756, active: true },
    { x: 366, y: 846, off: true },
    { x: 182, y: 822 },
    { x: 104, y: 780, scale: 0.8 },
    { x: 222, y: 900, scale: 0.95 },
    { x: 148, y: 956, active: true },
    { x: 330, y: 986, off: true },
  ],
  links: [
    [0, 1],
    [1, 2],
    [1, 4],
    [2, 5],
    [3, 4],
    [4, 5],
    [5, 7],
    [6, 2],
    [6, 9],
    [7, 9],
    [7, 10],
    [8, 10],
    [9, 11],
    [10, 14],
    [11, 12],
    [11, 14],
    [12, 15],
    [13, 14],
    [14, 16],
    [15, 18],
    [16, 20],
    [17, 16],
    [18, 20],
    [19, 15],
    [20, 21],
    [22, 21],
  ],
};

function MotifLayer({
  motif,
  id,
  className,
  /** Anchors the geometry to the page edge this motif sits on. */
  align,
  /** Offsets every animation in this motif so the two sides never match. */
  seed,
}: {
  motif: Motif;
  id: string;
  className: string;
  align: "start" | "end";
  seed: number;
}) {
  // `slice` scales the motif to cover its box and crops the overflow, which is
  // what lets the composition bleed past the page edge at any viewport instead
  // of being letterboxed into the box's aspect ratio.
  const preserveAspectRatio =
    align === "start" ? "xMinYMid slice" : "xMaxYMid slice";
  const fadeId = `${id}-fade`;
  const maskId = `${id}-mask`;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
      preserveAspectRatio={preserveAspectRatio}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/*
          Fades the motif out toward the page centre so it dissolves behind the
          headline and product paths instead of stopping at a hard boundary.
          `userSpaceOnUse` keeps the ramp tied to the viewBox, so it stays put
          however the geometry is cropped.
        */}
        <linearGradient
          id={fadeId}
          gradientUnits="userSpaceOnUse"
          x1={align === "start" ? 0 : VIEW.width}
          y1="0"
          x2={align === "start" ? VIEW.width : 0}
          y2="0"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.72" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="-200" y="-200" width="800" height="1400">
          {/* Covers the off-page anchors too, so nothing is masked out early. */}
          <rect x="-200" y="-200" width="800" height="1400" fill={`url(#${fadeId})`} />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        {motif.links.map(([from, to], index) => {
          const a = motif.points[from];
          const b = motif.points[to];
          const d = `M${a.x} ${a.y}L${b.x} ${b.y}`;
          // Only every third link carries a travelling light. One on every link
          // both looked busy and animated far more layers than the effect needs.
          const carriesSpark = index % 3 === 0;
          return (
            <g key={`link-${from}-${to}`}>
              <path
                className="motif-link"
                d={d}
                style={{ animationDelay: `${seed + index * 0.7}s` }}
              />
              {carriesSpark ? (
                /*
                  The travelling light is a dash sliding along the very same
                  path. `pathLength="1"` normalises the dash pattern, so one
                  set of keyframes drives every link regardless of its length
                  and the light can never leave the line it belongs to.
                */
                <path
                  className="motif-spark"
                  d={d}
                  pathLength="1"
                  // Spread starts far apart so sparks fire in ones and twos.
                  style={{ animationDelay: `${seed + index * 2.6}s` }}
                />
              ) : null}
            </g>
          );
        })}

        {motif.points.map((point, index) =>
          point.off ? null : (
            <circle
              key={`node-${index}`}
              className="motif-node"
              data-active={point.active ? "true" : undefined}
              cx={point.x}
              cy={point.y}
              r={(point.active ? 4.6 : 3.4) * (point.scale ?? 1)}
              style={{ animationDelay: `${seed * 0.5 + index * 0.9}s` }}
            />
          ),
        )}
      </g>
    </svg>
  );
}

export function DecorativeNetwork() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/*
        Physical `left`/`right` rather than logical `start`/`end`: the field is
        purely decorative, so direction carries no meaning here, and pinning the
        geometry to fixed sides keeps each motif's off-page bleed on the edge it
        was drawn for in both Arabic and English.

        Below `md` the left motif is dropped so one calm accent remains.
      */}
      <MotifLayer
        motif={startMotif}
        id="motif-start"
        align="start"
        className="motif left-0 hidden md:block"
        seed={0}
      />
      <MotifLayer
        motif={endMotif}
        id="motif-end"
        align="end"
        className="motif motif-end right-0 opacity-70 md:opacity-100"
        seed={3.5}
      />
    </div>
  );
}
