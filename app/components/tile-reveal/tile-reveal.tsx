"use client";

import { useEffect, useRef, useState } from "react";
import "./tile-reveal.scss";

// Nominal square size. The grid is whole squares, so the real size is this
// rounded to whatever divides the box.
const TILE = 80;
// Step 1: fully covered and glittering. Step 2: squares go, in random order.
const COVER = 500;
const VANISH = 1500;
// How long one square takes to go. Subtracted from VANISH so the last one
// finishes exactly on time rather than VANISH + FADE.
const FADE = 180;

type Square = { glitter: number; delay: number };

// A two-step cover: drop it inside any positioned box and flip `play` true.
// The box is covered by a grid of ~80px squares that glitter for COVER, then
// disappear one by one in random order over VANISH.
//
// Only the first mount is JS — the delays are handed to each square as custom
// properties and both steps run as CSS animations, so nothing ticks per frame
// and there is no state change while it plays.
export function TileReveal({ play, onDone }: { play: boolean; onDone?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<{ cols: number; squares: Square[] } | null>(null);
  // Held in a ref so an inline callback cannot restart the run on every render.
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (!play || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const box = root.current?.getBoundingClientRect();
    if (!box || box.width <= 0 || box.height <= 0) return;

    const cols = Math.max(1, Math.round(box.width / TILE));
    const rows = Math.max(1, Math.round(box.height / TILE));
    setGrid({ cols, squares: buildSquares(cols * rows) });

    const id = window.setTimeout(() => { setGrid(null); done.current?.(); }, COVER + VANISH);
    return () => { window.clearTimeout(id); setGrid(null); };
  }, [play]);

  return (
    <div className="nsc-tile-reveal" ref={root} aria-hidden="true">
      {grid && (
        <div className="grid" style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}>
          {grid.squares.map((s, i) => (
            <span
              key={i}
              className="square"
              style={{ "--glitter": `${s.glitter}ms`, "--delay": `${s.delay}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Random disappear order spread evenly across step 2, plus a negative glitter
// delay per square so they are all at a different point of the same flicker.
function buildSquares(count: number): Square[] {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const span = Math.max(count - 1, 1);
  const squares = new Array<Square>(count);
  order.forEach((square, pos) => {
    squares[square] = {
      glitter: -Math.round(Math.random() * 300),
      delay: COVER + Math.round((pos / span) * (VANISH - FADE)),
    };
  });
  return squares;
}
