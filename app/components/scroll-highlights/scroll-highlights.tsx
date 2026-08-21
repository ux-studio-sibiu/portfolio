"use client";

import { useEffect } from "react";

// Adds .is-lit to every .highlight-on-scroll the first time it comes into view,
// then stops watching it — so the highlight sweeps once and never reverts on the
// way back up. The animation itself is CSS (see .highlight-on-scroll in
// globals.scss); this only decides when it starts.
//
// An IntersectionObserver is deliberate: it accounts for clipping by scrolling
// ancestors, so it works inside the panes without being told which element
// scrolls. ScrollTrigger would need an explicit `scroller` per pane, and the
// scroller differs between mobile and desktop here.
export function ScrollHighlights() {
  useEffect(() => {
    const SELECTOR = ".highlight-on-scroll:not(.is-lit)";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = new Set<number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          io.unobserve(el);

          // Stagger by a random 100–400ms. Several phrases usually cross the
          // threshold in the same frame, and lighting them in lockstep reads as
          // one block flipping rather than separate selections being made.
          if (reduceMotion) {
            el.classList.add("is-lit");
            continue;
          }

          const timer = window.setTimeout(() => {
            el.classList.add("is-lit");
            timers.delete(timer);
          }, 100 + Math.random() * 300);
          timers.add(timer);
        }
      },
      // Most of the phrase has to be on screen before it lights.
      { threshold: 0.8 }
    );

    const watch = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.matches(SELECTOR)) io.observe(node);
      node.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    };

    watch(document.body);

    // Project detail bodies mount on demand, so pick up whatever arrives later.
    const mo = new MutationObserver((records) => {
      for (const record of records) record.addedNodes.forEach(watch);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
