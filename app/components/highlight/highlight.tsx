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
//
// `delay` is pixels of pane scroll and only means anything on a pinned phrase:
// a travelling one already has its own position to be timed off. Two pinned
// phrases in the same paragraph otherwise sweep as one, which reads as a single
// wide band rather than as two things being said.
export function Highlight({ children, pinned, delay }: { children: React.ReactNode; pinned?: boolean; delay?: number }) {
  return (
    <span
      className={`highlight-on-scroll${pinned ? " pinned" : ""}`}
      style={delay ? ({ "--sweep-delay": delay } as React.CSSProperties) : undefined}
    >
      {children}
    </span>
  );
}
