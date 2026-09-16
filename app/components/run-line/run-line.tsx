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
// that font's taller line box pushes the page down.
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/";

// One frame of flicker, and how long each character waits before it locks in.
const FRAME = 45;
const PER_CHAR = 65;

type RunWordProps = { words: string[]; turn?: number };

// A title whose words swap for another of their own readings, one word at a time
// and strictly in turn: the first, then the second, then back to the first.
//
// WHICH reading a word lands on is random, but never the one already showing —
// so the pair keeps changing without a cycle anyone can learn.
//
// The timer lives here rather than in each word because the whole point is that
// only one of them moves at a time — two independent timers would drift into
// firing together.
export function RunLine({ children, every = 3000 }: { children: React.ReactNode; every?: number }) {
  const words = Children.toArray(children).filter(isValidElement) as React.ReactElement<RunWordProps>[];

  // Which word was last told to turn, and how many turns have been called. The
  // count is what a word watches — an index on its own would not change when the
  // same word comes round again — and it is also what decides whose turn it is,
  // which is what makes the order left, right, left rather than random.
  const [turn, setTurn] = useState({ at: -1, count: 0 });
  const count = words.length;

  useEffect(() => {
    if (count === 0) return;
    // A title rewriting itself every few seconds is motion, whatever else it is.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setTurn((prev) => ({ at: prev.count % count, count: prev.count + 1 }));
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

// One word of the title and the readings it cycles through. `turn` is written by
// RunLine and is only ever non-zero on the turn this word was picked for.
//
// The box is held at the width of the LONGEST reading, by a copy of that word
// sitting in the flow with nothing drawn. Without it every word after this one
// would shift each time a shorter or longer reading came up.
//
// The DOM text is the source of truth once this is running — React never
// rewrites it, because the list it was rendered from does not change.
export function RunWord({ words, turn = 0 }: RunWordProps) {
  const el = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | null>(null);
  // Which reading is on screen. Not state: nothing renders from it.
  const showing = useRef(0);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), words[0]);

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  useEffect(() => {
    const node = el.current;
    // turn 0 means some other word was picked this time round.
    if (turn === 0 || !node) return;
    if (timer.current) window.clearInterval(timer.current);

    // Any reading but the one already up. Picked from the OTHER indices rather
    // than re-rolling until it differs, so there is no loop that can spin.
    const others = words.length - 1;
    if (others > 0) {
      const pick = Math.floor(Math.random() * others);
      showing.current = pick >= showing.current ? pick + 1 : pick;
    }
    const target = words[showing.current];

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
  }, [turn, words]);

  return (
    <span className="run-word">
      <span className="word-sizer" aria-hidden="true">{longest}</span>
      <span className="word-text" ref={el}>{words[0]}</span>
    </span>
  );
}
