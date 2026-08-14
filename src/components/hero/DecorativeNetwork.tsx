/**
 * Decorative connected-dot network for the hero.
 *
 * Entirely HTML/CSS. No connector bitmap is loaded; the extracted
 * `01-hero-connected-dots-background.png` served only as a geometry and mood
 * reference (sparse clusters hugging the far edges, a few glowing nodes, thin
 * low-contrast links).
 *
 * Motion layers, slowest to fastest:
 *   1. whole-motif drift + scroll parallax  (very slow, tiny amplitude)
 *   2. per-node glow pulse                  (staggered, never in sync)
 *   3. edge shimmer                         (base opacity breathing)
 *   4. a light travelling along each edge   (the "connecting" gesture)
 *
 * Everything is percentage-positioned, `pointer-events: none`, and
 * `aria-hidden`, so it can never affect layout or interaction. Under
 * `prefers-reduced-motion` every animation stops and a calm static composition
 * remains.
 */

type Node = {
  /** Percent of the motif box, horizontally. */
  x: number;
  /** Percent of the motif box, vertically. */
  y: number;
  /** Softly glowing node. Kept rare so the field stays quiet. */
  active?: boolean;
  /** Seconds of delay, to break up synchronised motion. */
  delay?: number;
  /** Relative size multiplier for depth. */
  scale?: number;
};

type Motif = {
  nodes: Node[];
  /** Index pairs into `nodes`. */
  edges: [number, number][];
};

const startMotif: Motif = {
  nodes: [
    { x: 44, y: 6, scale: 0.8 },
    { x: 16, y: 13 },
    { x: 68, y: 17, active: true, delay: 0 },
    { x: 30, y: 24, scale: 0.9 },
    { x: 6, y: 30 },
    { x: 55, y: 33 },
    { x: 78, y: 40, scale: 0.85 },
    { x: 22, y: 43, active: true, delay: 2.9 },
    { x: 42, y: 50, scale: 1.1 },
    { x: 10, y: 57 },
    { x: 63, y: 60, scale: 0.9 },
    { x: 31, y: 67, active: true, delay: 5.4 },
    { x: 72, y: 74, scale: 0.8 },
    { x: 14, y: 79 },
    { x: 48, y: 85, scale: 0.95 },
    { x: 26, y: 93, active: true, delay: 7.8 },
  ],
  edges: [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 5],
    [3, 4],
    [3, 5],
    [4, 7],
    [5, 6],
    [5, 8],
    [6, 10],
    [7, 8],
    [7, 9],
    [8, 10],
    [9, 11],
    [10, 12],
    [11, 13],
    [11, 14],
    [12, 14],
    [13, 15],
    [14, 15],
  ],
};

const endMotif: Motif = {
  nodes: [
    { x: 58, y: 5, scale: 0.85 },
    { x: 86, y: 11, active: true, delay: 1.4 },
    { x: 34, y: 16 },
    { x: 70, y: 22, scale: 0.9 },
    { x: 94, y: 29 },
    { x: 47, y: 32, active: true, delay: 4.1 },
    { x: 22, y: 39, scale: 0.8 },
    { x: 76, y: 44, scale: 1.05 },
    { x: 55, y: 51 },
    { x: 90, y: 57, active: true, delay: 6.6 },
    { x: 33, y: 62, scale: 0.9 },
    { x: 66, y: 69 },
    { x: 18, y: 75, scale: 0.8 },
    { x: 82, y: 81, active: true, delay: 9.2 },
    { x: 44, y: 87 },
    { x: 71, y: 95, scale: 0.9 },
  ],
  edges: [
    [0, 1],
    [0, 2],
    [1, 4],
    [2, 3],
    [3, 5],
    [3, 7],
    [4, 7],
    [5, 6],
    [5, 8],
    [6, 10],
    [7, 9],
    [8, 10],
    [8, 11],
    [9, 11],
    [10, 12],
    [11, 13],
    [11, 14],
    [12, 14],
    [13, 15],
    [14, 15],
  ],
};

/**
 * The motif box is far taller than it is wide, so raw percentage deltas would
 * skew the angle. Folding the box ratio in keeps each line visually straight
 * between its two endpoints.
 */
const BOX_ASPECT = 0.28;

function edgeGeometry(a: Node, b: Node) {
  const dx = (b.x - a.x) * BOX_ASPECT;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return { length: length / BOX_ASPECT, angle };
}

function MotifLayer({
  motif,
  className,
  seed,
}: {
  motif: Motif;
  className: string;
  /** Offsets every animation in this motif so the two sides never match. */
  seed: number;
}) {
  return (
    <div className={className}>
      {motif.edges.map(([from, to], index) => {
        const a = motif.nodes[from];
        const { length, angle } = edgeGeometry(a, motif.nodes[to]);
        // Only every third edge carries a travelling light. Putting one on
        // every edge both looked busy and animated far more layers than the
        // effect needs.
        const carriesSpark = index % 3 === 0;
        // Longer edges take proportionally longer to traverse, so the light
        // reads at a constant speed across the field. Only a fraction of each
        // cycle is a visible traverse (see the keyframes), so the total is
        // deliberately long.
        const travel = 9 + length * 0.12;
        return (
          <span
            key={`edge-${from}-${to}`}
            className="motif-edge"
            style={{
              left: `${a.x}%`,
              top: `${a.y}%`,
              width: `${length}%`,
              transform: `rotate(${angle}deg)`,
              animationDelay: `${seed + index * 0.7}s`,
            }}
          >
            {carriesSpark ? (
              <span
                className="motif-spark"
                style={{
                  animationDuration: `${travel}s`,
                  // Spread starts far apart so sparks fire in ones and twos.
                  animationDelay: `${seed + index * 2.7}s`,
                }}
              />
            ) : null}
          </span>
        );
      })}
      {motif.nodes.map((node, index) => (
        <span
          key={`node-${index}`}
          className="motif-node"
          data-active={node.active ? "true" : undefined}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            animationDelay: `${seed * 0.5 + (node.delay ?? index * 0.8)}s`,
            ...(node.scale ? { "--node-scale": node.scale } : {}),
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function DecorativeNetwork() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Below `md` the start motif is dropped so one calm accent remains. */}
      <MotifLayer
        motif={startMotif}
        className="motif motif-start start-0 hidden md:block"
        seed={0}
      />
      <MotifLayer
        motif={endMotif}
        className="motif motif-end end-0 opacity-70 md:opacity-100"
        seed={3.5}
      />
    </div>
  );
}
