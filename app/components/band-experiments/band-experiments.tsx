"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ProjectProps } from "@/app/components/showcase-linear/project";
import "./band-experiments.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Where a frame starts and finishes its arrival, as positions of the ROW against
// the scroller: from its top reaching the bottom of the screen to its top a bit
// over halfway up, written as the percentages ScrollTrigger reads. Scrubbed, so
// these are scroll positions and not durations — the frame is wherever between
// them the scroll says it is, and it goes back the way it came.
const ARRIVE_FROM = 95;
const ARRIVE_TO = 55;
// A row of several frames — only the tools row — arrives over its own, much
// longer window, because the four of them come in one after another.
//
// The LAST frame's run is given outright, and it sets the pace for the rest:
// every other frame takes whatever run its own distance needs to cross at that
// same speed. They overlap as a result — one is still coming in as the next
// sets off — which is what lets each of them cross slowly while the whole row
// still settles inside the stretch of scroll it is on screen for.
//
// Where the whole group has finished arriving, as the position of the row's own
// MIDDLE on the screen: everything is home by the time the group reaches half
// way up. Worked back to a row-top percentage at measure time, because how far
// the middle is from the top depends on how tall the row is and how tall the
// screen is, and neither is known from here.
const GROUP_END = 50;
// How long the last frame is in motion. It is the only run stated outright, and
// it sets the pace every other frame travels at.
const GROUP_LAST_RUN = 35;
// The waits between them setting off, both deliberately shorter than a frame's
// run: they are staggered, not queued, so three or four are always crossing at
// once and the stack reads as one thing arriving rather than three. Where the
// first one sets off falls out of these — a fifth tool simply starts a delay
// earlier.
//
// Two numbers rather than one because the last frame is the feature: the stack
// comes in as a flurry, and then it follows on a beat of its own. That beat has
// to be longer than the difference in their runs, or the short trip from the
// divider would land it before the stack it is supposed to follow.
const GROUP_DELAY = 5;
const GROUP_LAST_DELAY = 20;

export function BandExperiments({
  items,
  tools = [],
  onOpen,
}: {
  items: React.ReactElement<ProjectProps>[];
  tools?: React.ReactElement<ProjectProps>[];
  onOpen: (item: React.ReactElement<ProjectProps>) => void;
}) {
  const root = useRef<HTMLElement>(null);

  // Each frame slides in from under the right column. The clip that hides it on
  // the way is in the stylesheet — see .entry-visual there; this only says how
  // far out it starts and ties that to the scroll.
  //
  // GSAP rather than a view() timeline for once: this wants to work in Firefox,
  // which has no scroll-driven animations, and a frame that never arrives there
  // is a hole in the column rather than a missing flourish.
  useGSAP(() => {
    const el = root.current;
    // From tablet up this is the element that scrolls; below it the pane does,
    // and the media query below means we never get here anyway.
    const scroller = el?.closest<HTMLElement>(".pane-scroll");
    if (!el || !scroller) return;

    const mm = gsap.matchMedia();

    // The same 768px the stylesheet splits the row into two columns at: with one
    // column there is nothing to the right to come from.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll<HTMLElement>(".entry-visual").forEach((visual) => {
        const row = visual.closest<HTMLElement>(".scroll-entry-secondary");
        if (!row) return;

        // What moves: the frames themselves, never the column — that carries the
        // clip, and a clip that travels with its contents hides nothing.
        //
        // The tools row has a grid of them, each arriving on its own; every other
        // row has a single frame, which is the same code with nothing to stagger
        // against.
        const cells = visual.querySelectorAll<HTMLElement>(".frame-cell");
        const frames = cells.length ? Array.from(cells) : ([visual.firstElementChild].filter(Boolean) as HTMLElement[]);

        // The right edge of the column, which is where the clip cuts.
        const edge = () => visual.offsetLeft + visual.offsetWidth;

        const alone = frames.length === 1;

        // Alone, a frame crosses the whole window. In company they share it, one
        // after another with no overlap, on two rules:
        //
        //   ORDER   by where a frame sits, not where it is written: the left
        //           column first and top to bottom, then the column after it. So
        //           the stack lands first and the wide one settles against the
        //           divider last, and if the two columns ever swap back the
        //           sequence follows the layout without being told.
        //   SHARE   by distance, not in equal slices, so they all travel at the
        //           same speed. The wide one against the divider has barely any
        //           ground to cover next to the stack crossing the whole column;
        //           on equal slices the small ones snapped across while the big
        //           one drifted.
        //
        // They overlap, and deliberately: the pace comes from the last frame's
        // stated run, the starts keep the order readable, and how long each one
        // is in motion falls out of the two.
        //
        // A function, not a value: the column is fluid, so the schedule is re-cut
        // from the measured positions every time ScrollTrigger refreshes.
        const schedule = () => {
          const distances = frames.map((f) => edge() - f.offsetLeft);
          const order = frames
            .map((_, i) => i)
            .sort((a, b) => frames[a].offsetLeft - frames[b].offsetLeft || frames[a].offsetTop - frames[b].offsetTop);

          // Percent of screen per pixel of travel, taken from the one frame whose
          // run is stated rather than derived. Everything else moves at this rate,
          // which is what keeps the small ones from outrunning the wide one.
          const last = order[order.length - 1];
          const pace = GROUP_LAST_RUN / (distances[last] || 1);
          const runOf = (i: number) => distances[i] * pace;

          // GROUP_END is where the row's middle should be when the last frame
          // lands; ScrollTrigger measures the row's top, so half the row's height
          // comes off it. In percent of the screen, like everything else here.
          const halfRow = (row.offsetHeight / (scroller.clientHeight || 1)) * 50;
          const lastFrom = GROUP_END - halfRow + GROUP_LAST_RUN;

          // Counted back from the last frame's start: one longer wait to clear it,
          // then a shorter one between each of the rest.
          const spans: { from: number; to: number }[] = [];
          order.forEach((i, place) => {
            const back = order.length - 2 - place;
            const from = back < 0 ? lastFrom : lastFrom + GROUP_LAST_DELAY + back * GROUP_DELAY;
            spans[i] = { from, to: from - runOf(i) };
          });
          return spans;
        };

        frames.forEach((frame, i) => {
          // A trigger each rather than one tween with a stagger: a staggered
          // target sits at its FINAL position until its turn comes and then jumps
          // out to the edge to begin, which is a flash of the frame in place
          // before it arrives. Given its own trigger, a frame holds at the edge
          // until its own scroll position comes round.

          gsap.fromTo(
            frame,
            {
              // Pushed far enough right that its own left edge sits on the cut —
              // exactly out of sight and not a pixel further. Per frame, so the
              // ones in the narrow column travel the shorter distance they
              // actually need. Measured off the layout box rather than a rect,
              // because a rect would already have this transform in it and every
              // refresh would compound.
              x: () => edge() - frame.offsetLeft,
            },
            {
              x: 0,
              // Linear: the scroll is the easing.
              ease: "none",
              scrollTrigger: {
                trigger: row,
                scroller,
                start: () => `top ${alone ? ARRIVE_FROM : schedule()[i].from}%`,
                end: () => `top ${alone ? ARRIVE_TO : schedule()[i].to}%`,
                scrub: true,
                // Thumbnails are pictures and the column is fluid, so the
                // distance is only right until something reflows.
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });
    });

    return () => mm.revert();
  }, { scope: root });

  return (
    <section className="band nsc-band-experiments" data-section="Experiments" ref={root}>
      <div className="band-content is-full">
        <h2 className="band-heading">Experiments</h2>

        <ul className="experiment-list">
          {tools.length > 0 && (
            <li className="scroll-entry-secondary tools-entry">
              <div className="entry-visual">
                {/* One explicit row per tool that is NOT the feature, so the wide
                    one can span them all. Only this component knows the count. */}
                <ul className="frame-grid" style={{ gridTemplateRows: `repeat(${Math.max(1, tools.length - 1)}, var(--tool-row))` }}>
                  {tools.map((tool) => (
                    <li className="frame-cell" key={tool.props.title} data-preload={tool.props.href}>
                      <button type="button" className="entry-thumb" onClick={() => onOpen(tool)} aria-label={`Open ${tool.props.title}`}>
                        {tool.props.href && <iframe src={tool.props.href} title={`${tool.props.title}, live`} loading="lazy" tabIndex={-1} aria-hidden="true" referrerPolicy="no-referrer-when-downgrade" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="entry-body reveal">
                <div className="entry-text">
                  <h3 className="entry-title">Tools</h3>
                  <p className="entry-blurb">Small things built to answer one question each, then kept around because they turned out to be useful. Open any frame to see it full size.</p>
                </div>
              </div>
            </li>
          )}

          {items.map((child) => (
            <li className={`scroll-entry-secondary${child.props.className ? ` ${child.props.className}` : ""}`} key={child.props.title} data-preload={child.props.href}>
              <div className="entry-visual">
                {/* The frame opens the experiment too — same target as the View
                    button, so the obvious click works. */}
                <button type="button" className="entry-thumb" onClick={() => onOpen(child)} aria-label={`Open ${child.props.title}`}>
                  {child.props.thumb
                    ? <Image src={child.props.thumb} alt="" sizes="(min-width: 768px) 30vw, 100vw" placeholder="blur" className="frame-img" />
                    : child.props.href && <iframe src={child.props.href} title={`${child.props.title}, live`} loading="lazy" tabIndex={-1} aria-hidden="true" referrerPolicy="no-referrer-when-downgrade" />}
                </button>
              </div>

              <div className="entry-body reveal">
                <div className="entry-text">
                  <h3 className="entry-title">{child.props.title}</h3>
                  <p className="entry-role">{child.props.role}</p>

                  {/* The stack, one pill each, split off the `stack` prop. It replaced the
                      prose summary that used to sit here — hence the class name. */}
                  {child.props.stack && (
                    <ul className="entry-tech-stack">
                      {child.props.stack.split(",").map((tech) => tech.trim()).filter(Boolean).map((tech) => (
                        <li className="pill" key={tech}>{tech}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <button type="button" className="view-more-button" onClick={() => onOpen(child)}>
                  View <span className="row-arrow" aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
