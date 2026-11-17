import { stableHash } from "@/app/components/stable-hash/stable-hash";

// A phrase that is swept with a black band as the page scrolls. Everything it
// looks like is .highlight-on-scroll in globals.scss; this exists only to give
// the two knobs a name, so a blurb can be written without remembering which
// class does what.
//
//   <Highlight>…</Highlight>              travels with the scroll, timed off
//                                         its own position on screen
//   <Highlight pinned>…</Highlight>       does not travel — it is in the fixed
//                                         column — so it is timed off how far
//                                         the pane has been scrolled instead
//   <Highlight pinned delay={100}>        the same, starting 100px of scrolling
//                                         later than an undelayed one
//   <Highlight alwaysSelected>…</Highlight>  no sweep at all — the band is full
//                                         from the start and stays that way
//
// `delay` is pixels of pane scroll and only means anything on a pinned phrase:
// a travelling one already has its own position to be timed off. Two pinned
// phrases in the same paragraph otherwise sweep as one, which reads as a single
// wide band rather than as two things being said.
//
// A pinned phrase with no `delay` of its own still gets one, worked out from
// its words: up to JITTER px, so phrases set off visibly apart rather than in
// lockstep, and by the same amount on every load. Against a sweep of about
// 0.65 of the screen's height, 70 was too little to see and 220 still close;
// 450 puts the blurb's three phrases at 12, 246 and 414px.
const JITTER = 450;

// The phrase's text, for the jitter. Strings and numbers only; anything else
// in it simply does not count.
const textOf = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return "";
};

// The text's stable hash, as a delay between 0 and JITTER.
const jitterOf = (text: string) => stableHash(text) % (JITTER + 1);

export function Highlight({ children, pinned, delay, alwaysSelected }: { children: React.ReactNode; pinned?: boolean; delay?: number; alwaysSelected?: boolean }) {
  const sweepDelay = delay ?? (pinned ? jitterOf(textOf(children)) : 0);
  return (
    <span
      className={`highlight-on-scroll${pinned ? " pinned" : ""}${alwaysSelected ? " is-selected" : ""}`}
      style={sweepDelay ? ({ "--sweep-delay": sweepDelay } as React.CSSProperties) : undefined}
    >
      {/* The inner box paints the glyphs; the outer one paints the band. See
          .highlight-on-scroll in globals.scss for why they cannot be one. */}
      <span className="highlight-ink">{children}</span>
    </span>
  );
}
