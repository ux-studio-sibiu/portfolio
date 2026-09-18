"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CursorCard, type CursorCardItem } from "@/app/components/cursor-card/cursor-card";
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
// Daylight between two frames that share a band, on top of the distance that
// merely keeps them from overlapping. Without it they arrive on the same frame:
// same speed, and a head start of exactly the ground between them means the one
// in front finishes exactly as the one behind does, which reads as a pair moving
// as one rather than as two things arriving.
const GROUP_CLEAR = 9;

export function BandExperiments({
  items,
  tools = [],
  various = [],
  onOpen,
}: {
  items: React.ReactElement<ProjectProps>[];
  tools?: React.ReactElement<ProjectProps>[];
  various?: React.ReactElement<ProjectProps>[];
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
      // One per row, emptied when a refresh begins — see the cache by each
      // row's schedule() below.
      const invalidators: (() => void)[] = [];

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
          // Do two frames share any of the same horizontal band? Ranges rather
          // than equal tops, because a frame can span several rows — the feature
          // in the tools grid does.
          const sameBand = (a: HTMLElement, b: HTMLElement) =>
            a.offsetTop < b.offsetTop + b.offsetHeight && b.offsetTop < a.offsetTop + a.offsetHeight;

          // Counted back from the last frame's start, one wait at a time.
          const spans: { from: number; to: number }[] = [];
          let from = lastFrom;

          for (let place = order.length - 1; place >= 0; place--) {
            spans[order[place]] = { from, to: from - runOf(order[place]) };
            if (place === 0) break;

            const prev = frames[order[place - 1]];
            let next = from + (place === order.length - 1 ? GROUP_LAST_DELAY : GROUP_DELAY);

            // The waits above are a rhythm, not a guarantee. Two frames that
            // share a band all set off from the same edge at the same speed, so
            // the wait between their starts IS the space between them — and a
            // wait shorter than the ground between their resting places has the
            // one behind laid over the one in front the whole way in. So each
            // frame also waits out its distance from every frame already
            // scheduled in its band, plus GROUP_CLEAR so the two are not still
            // level with each other when they land.
            for (let later = place; later < order.length; later++) {
              const other = frames[order[later]];
              if (!sameBand(prev, other)) continue;
              next = Math.max(next, spans[order[later]].from + Math.abs(prev.offsetLeft - other.offsetLeft) * pace + GROUP_CLEAR);
            }

            from = next;
          }

          return spans;
        };

        // schedule() re-measures the whole row and does O(n^2) work against it,
        // and it was read fresh by every frame's start AND its end — 2n runs per
        // refresh, each one a fistful of forced layout reads for an answer that
        // cannot change within a refresh. Computed once and held instead.
        //
        // Dropped when the NEXT refresh begins rather than kept for good,
        // because what it is cut from moves: the column is fluid, and refreshes
        // now happen on any change to the page's height rather than only on
        // resize — see the ResizeObserver in showcase-linear.tsx. That is also
        // what makes this worth doing: opening one Work history entry refreshes
        // every trigger on the page.
        let cached: ReturnType<typeof schedule> | null = null;
        const spansNow = () => (cached ??= schedule());
        invalidators.push(() => { cached = null; });

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
                start: () => `top ${alone ? ARRIVE_FROM : spansNow()[i].from}%`,
                end: () => `top ${alone ? ARRIVE_TO : spansNow()[i].to}%`,
                scrub: true,
                // Thumbnails are pictures and the column is fluid, so the
                // distance is only right until something reflows.
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      // refreshInit fires before positions are recomputed, so every row's cache
      // is empty by the time the first start() of that refresh asks for it.
      const dropCaches = () => invalidators.forEach((invalidate) => invalidate());
      ScrollTrigger.addEventListener("refreshInit", dropCaches);
      return () => ScrollTrigger.removeEventListener("refreshInit", dropCaches);
    });

    return () => mm.revert();
  }, { scope: root });

  return (
    <section className="band nsc-band-experiments" data-section="Experiments" ref={root}>
      <div className="band-content is-full">
        <h2 className="band-heading">Experiments</h2>

        <ul className="experiment-list">
          <FrameRow
            items={tools}
            className="tools-entry"
            rows={Math.max(1, tools.length - 1)}
            title="Tools"
            blurb="Small things built to answer one question each, then kept around because they turned out to be useful. Open any frame to see it full size."
            onOpen={onOpen}
          />

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

          {/* Last, and deliberately: it is the odds and ends, so it reads as what
              is left rather than as one more thing in the sequence. */}
          <FrameRow
            items={various}
            className="various-entry"
            title="Various"
            blurb="Concepts and prototypes, the oldest of them a decade back and still running off the files they shipped with. Open any frame to see it full size."
            onOpen={onOpen}
          />
        </ul>
      </div>
    </section>
  );
}

// A row whose visual column is a grid of frames rather than one, sharing a single
// block of copy. Two of them: the tools, where one feature spans the height and
// the rest stack beside it, and the various, four equal squares two by two. Which
// shape a row takes is its `className` and lives in the stylesheet; what is the
// same — the cells, the hover card, and the arrival the band animates off
// .frame-cell — is here.
//
// `rows` is only for the tools grid, which needs its row count written out for
// `grid-row: 1 / -1` to mean anything. Only this component knows the count.
function FrameRow({
  items,
  className,
  title,
  blurb,
  rows,
  onOpen,
}: {
  items: React.ReactElement<ProjectProps>[];
  className: string;
  title: string;
  blurb: string;
  rows?: number;
  onOpen: (item: React.ReactElement<ProjectProps>) => void;
}) {
  // Which frame the pointer is over, if any. These are frames without captions —
  // the row has one block of copy for the whole set — so this is where each one
  // gets to say what it is. Per row, because only one row can be hovered at a
  // time and a row's card is nobody else's business.
  const [hovered, setHovered] = useState<CursorCardItem | null>(null);

  if (!items.length) return null;

  const describe = (item: React.ReactElement<ProjectProps>, e: React.PointerEvent) => ({
    title: item.props.title,
    role: item.props.role,
    summary: item.props.summary,
    x: e.clientX,
    y: e.clientY,
  });

  return (
    <li className={`scroll-entry-secondary ${className}`}>
      <div className="entry-visual">
        <ul className="frame-grid" style={rows ? { gridTemplateRows: `repeat(${rows}, var(--tool-row))` } : undefined}>
          {items.map((item) => (
            <li
              className="frame-cell"
              key={item.props.title}
              data-preload={item.props.href}
              // Mouse only: on a touch screen the card would come up under the
              // finger that just tapped the frame open.
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(describe(item, e))}
              // Brings it back after a scroll has closed it, which is otherwise
              // impossible without leaving the frame and coming back: the pointer
              // is already inside, so there is no second enter to wait for.
              onPointerMove={(e) => { if (!hovered && e.pointerType === "mouse") setHovered(describe(item, e)); }}
              onPointerLeave={() => setHovered(null)}
              // Opening the detail slides the track out from under the pointer
              // without it ever leaving this cell, so there is no pointerleave to
              // take the card down.
              onPointerDown={() => setHovered(null)}
            >
              <button type="button" className="entry-thumb" onClick={() => onOpen(item)} aria-label={`Open ${item.props.title}`}>
                {item.props.thumb
                  ? <Image src={item.props.thumb} alt="" sizes="(min-width: 768px) 20vw, 50vw" placeholder="blur" className="frame-img" />
                  : item.props.href && <iframe src={item.props.href} title={`${item.props.title}, live`} loading="lazy" tabIndex={-1} aria-hidden="true" referrerPolicy="no-referrer-when-downgrade" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <CursorCard item={hovered} onDismiss={() => setHovered(null)} />

      <div className="entry-body reveal">
        <div className="entry-text">
          <h3 className="entry-title">{title}</h3>
          <p className="entry-blurb">{blurb}</p>
        </div>
      </div>
    </li>
  );
}
