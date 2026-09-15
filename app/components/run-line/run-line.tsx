"use client";

import { Children, Fragment, cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import "./run-line.scss";

// The characters a word is scrambled through. Deliberately plain ASCII, and that
// is the whole trick: this label is set in a MONOSPACE face, so every character
// the font has is exactly as wide as every other, and a scramble that keeps the
// word's length occupies the identical box.
//
// Block-drawing glyphs (▀▊▋▌▍▎) look better for a frame or two, but a mono face
// does not carry them: the browser falls back to another font mid-scramble, and
// that font's taller line box is what pushed the page down.
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/";

// One frame of flicker, and how long each character waits before it locks in.
// Eight or nine characters at 65ms puts a word's turn a little over half a
// second — long enough to read as scrambling rather than as a glitch, and still
// a fraction of the three seconds between turns.
const FRAME = 45;
const PER_CHAR = 65;

type RunWordProps = { children: string; alt: string; turn?: number };

// A title whose words swap for their alternates, one at a time. Every `every`
// ms it picks ONE of its words at random and tells it to turn; the word
// scrambles across to its other reading and stays there until it is picked
// again.
//
// The timer lives here rather than in each word because the whole point is that
// only one of them moves at a time — two independent timers would drift into
// firing together.
export function RunLine({ children, every = 3000 }: { children: React.ReactNode; every?: number }) {
  const words = Children.toArray(children).filter(isValidElement) as React.ReactElement<RunWordProps>[];

  // Which word was last told to turn, and how many turns have been called. The
  // count is what a word watches: being picked twice in a row has to read as two
  // separate events, and an index on its own would not change.
  const [turn, setTurn] = useState({ at: -1, count: 0 });
  const count = words.length;

  useEffect(() => {
    if (count === 0) return;
    // A title rewriting itself every few seconds is motion, whatever else it is.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setTurn((prev) => ({ at: Math.floor(Math.random() * count), count: prev.count + 1 }));
    }, every);
    return () => window.clearInterval(id);
  }, [every, count]);

  return (
    <span className="nsc-run-line">
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          {cloneElement(word, { turn: turn.at === i ? turn.count : 0 })}
        </Fragment>
      ))}
    </span>
  );
}

// One word of the title and the reading it alternates with. `turn` is written by
// RunLine and is only ever non-zero on the turn this word was picked for.
//
// The DOM text is the source of truth once this is running — React never
// rewrites it, because `children` does not change from render to render.
export function RunWord({ children, alt, turn = 0 }: RunWordProps) {
  const el = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | null>(null);
  // Which of the pair is on screen. Not state: nothing renders from it.
  const showingAlt = useRef(false);

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  useEffect(() => {
    const node = el.current;
    // turn 0 means some other word was picked this time round.
    if (turn === 0 || !node) return;
    if (timer.current) window.clearInterval(timer.current);

    const target = showingAlt.current ? children : alt;
    showingAlt.current = !showingAlt.current;

    const started = performance.now();
    timer.current = window.setInterval(() => {
      const revealed = Math.floor((performance.now() - started) / PER_CHAR);

      if (revealed >= target.length) {
        window.clearInterval(timer.current!);
        timer.current = null;
        node.textContent = target;
        return;
      }

      node.textContent = Array.from(target, (char, i) =>
        i < revealed ? char : CHARS[Math.floor(Math.random() * CHARS.length)],
      ).join("");
    }, FRAME);
  }, [turn, children, alt]);

  return <span className="run-word" ref={el}>{children}</span>;
}
