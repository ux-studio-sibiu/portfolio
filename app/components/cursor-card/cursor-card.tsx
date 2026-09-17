"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./cursor-card.scss";

// How far from the pointer the card sits, and how far it keeps off the edges of
// the screen when the pointer runs into a corner.
const OFFSET = 18;
const MARGIN = 10;

export type CursorCardItem = {
  title: string;
  role?: string;
  summary?: React.ReactNode;
  // Where the pointer was when this opened. Everything after that comes off
  // pointermove; this is only what saves the card from flashing at 0,0 for a
  // frame before the first one arrives.
  x: number;
  y: number;
};

// A panel that appears at the pointer and follows it until it leaves whatever
// opened it. `item` is the whole of its state: something to say means it is up,
// null means it is not.
//
// Portalled to <body> for a reason, not by habit: the media column it is used in
// is clipped at the divider — see .entry-visual in band-experiments — and a card
// inside that column would be cut off on the same line.
//
// It follows by writing to the node rather than by re-rendering. A pointermove
// through React state would re-render the band on every frame of every mouse
// move, live iframes and all; here the only state change is opening and closing.
export function CursorCard({ item, onDismiss }: { item: CursorCardItem | null; onDismiss: () => void }) {
  const node = useRef<HTMLDivElement>(null);
  // Held in a ref so a fresh inline callback cannot re-bind the listeners below
  // on every render.
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;

  useEffect(() => {
    if (!item) return;

    const place = (x: number, y: number) => {
      const el = node.current;
      if (!el) return;
      // Never off the bottom or the right: past those it sits back from the
      // pointer instead of in front of it.
      const left = Math.min(x + OFFSET, window.innerWidth - el.offsetWidth - MARGIN);
      const top = Math.min(y + OFFSET, window.innerHeight - el.offsetHeight - MARGIN);
      el.style.transform = `translate(${Math.round(Math.max(MARGIN, left))}px, ${Math.round(Math.max(MARGIN, top))}px)`;
    };

    place(item.x, item.y);
    const move = (e: PointerEvent) => place(e.clientX, e.clientY);
    window.addEventListener("pointermove", move, { passive: true });

    // Scrolling takes the thing being described out from under the pointer, and
    // whether that produces a pointerout is up to the browser: some re-hit-test
    // as the page moves, some wait for the next mouse move. Either way the card
    // is describing something that is no longer there, so it closes itself.
    //
    // Capturing on the document, because scroll does not bubble and the element
    // that scrolls here is a pane inside the page rather than the page itself.
    const gone = () => dismiss.current();
    document.addEventListener("scroll", gone, { capture: true, passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("scroll", gone, { capture: true });
    };
  }, [item]);

  if (!item) return null;

  return createPortal(
    // Hidden from assistive tech: it says what the frame's own label and the
    // detail behind it already say, and it only exists for a pointer.
    <div className="nsc-cursor-card" ref={node} aria-hidden="true">
      <p className="card-title">{item.title}</p>
      {item.role && <p className="card-role">{item.role}</p>}
      {item.summary && <div className="card-summary">{item.summary}</div>}
    </div>,
    document.body,
  );
}
