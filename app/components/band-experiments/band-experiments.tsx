"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CursorCard, type CursorCardItem } from "@/app/components/cursor-card/cursor-card";
import { Highlight } from "@/app/components/highlight/highlight";
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
// Where the whole group has finished arriving, as the position of the FRAMES'
// middle on the screen: everything is home by the time they reach half way up.
// Worked back to a row-top percentage at measure time, because how far that
// middle is from the row's top depends on how tall the frames are and how tall
// the screen is, and neither is known from here. The frames rather than the row:
// see the sum in schedule(), and what taking half of the row instead cost.
const GROUP_END = 50;
// How long the last frame is in motion. It is the only run stated outright, and
// it sets the pace every other frame travels at — so it is also the knob that
// decides whether a sequence FITS, and how much of one there is room for.
//
// It was 35, which put the longest run in Various at 57% of the screen. Four
// frames each taking that long cannot also be spaced far enough apart to read
// one at a time: the first would have had to set off at 126%, well below the
// bottom of the screen, and would have been half way across before the row came
// into view. Shortening it scales every run down in proportion — nothing here
// travels further, it all just travels faster.
//
// 22, and it is the ONLY number here that moved from the original 35. That 35
// was set against a Various row of four small squares; this one is half again as
// tall with wider frames, so the same run carried the first frame's start to
// 119% — below the bottom of the screen, arriving half crossed already. 22 is
// about the largest that keeps every frame setting off on screen while leaving
// the overlap where it was: 80% in the tools row, 96% in Various. At 24 that
// second number was 101%, a hair below the fold.
const GROUP_LAST_RUN = 22;
// The waits between them setting off, both shorter than a frame's run: they are
// staggered, not queued, so two or three are usually crossing at once. Where the
// first one sets off falls out of these — a fifth tool simply starts a delay
// earlier.
//
// Five is deliberately a small fraction of a run — about a seventh of one — so
// three or four frames are always crossing at once and the stack reads as one
// thing arriving rather than as a queue. That overlap is the effect, not a
// side-effect of it.
//
// Worth knowing before reaching for this: it was tried at 12 and at 20. At 20
// each frame all but lands before the next sets off, which is a clean cascade
// and much too slow and separated to read as one movement. At either value the
// runs also have to be cut hard to fit, which makes every frame snap across.
// The overlap is what lets each one travel slowly.
//
// Two numbers rather than one because the last frame is the feature: the stack
// comes in as a flurry, and then it follows on a beat of its own. That beat has
// to be longer than the difference in their runs, or the short trip from the
// divider would land it before the stack it is supposed to follow.
//
// GROUP_LAST_DELAY is a FLOOR, not the gap itself, and for most of its range it
// is not even the binding one — see GROUP_CLEAR, which sets a floor of its own
// and has been the larger of the two. Moving this from 20 down to 14 changed
// nothing at all; the clearance was holding the feature 20 behind the stack on
// its own. Both had to come down together.
const GROUP_DELAY = 5;
const GROUP_LAST_DELAY = 10;
// Daylight between two frames that share a band, on top of the distance that
// merely keeps them from overlapping. Without it they arrive on the same frame:
// same speed, and a head start of exactly the ground between them means the one
// in front finishes exactly as the one behind does, which reads as a pair moving
// as one rather than as two things arriving.
//
// It is also, in practice, what decides how far the feature trails the stack:
// the feature shares a band with every frame beside it, so this lands on top of
// their horizontal distance for each one. At 9 the big frame was still half out
// past the divider when the stack had settled. 4 brings it in behind them and
// still has it landing last, by 4% of the screen rather than 9.
const GROUP_CLEAR = 4;

// What a tool's name in the copy promises. The frames say "there is something
// behind this" with a card at the pointer, so a name that opens the same thing
// says it the same way rather than inventing a second vocabulary for it. The
// card is deliberately just the label: the sentence around the name is already
// the description, which is what a frame's card has to supply and this does not.
const LINK_LABEL = "view details";
// What a project frame promises, as against a tool's name in a sentence. The
// rows built from single entries have no copy naming them, so the card is the
// only thing that says the frame can be opened at all.
const FRAME_LABEL = "view project";

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
  // Whether the pointer is over a tool's name in the copy, and where it was when
  // it arrived. One card for the band — only one name can be under the pointer,
  // and the frames' own cards are a row's business, held in FrameRow.
  const [linked, setLinked] = useState<CursorCardItem | null>(null);

  // Every entry the band was handed, in one list: a name in the copy is matched
  // back to its entry by slug, which is the only name a sentence can be expected
  // to know. Same lookup whichever row the name happens to sit in.
  const all = [...items, ...tools, ...various];

  const hoverCard = (label: string) => ({
    // Mouse only, like the frames: on a touch screen the card would come up
    // under the finger that just tapped the name open.
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setLinked({ title: label, x: e.clientX, y: e.clientY });
    },
    // Brings it back after a scroll has closed it, without having to leave the
    // name and come back.
    onPointerMove: (e: React.PointerEvent) => {
      if (!linked && e.pointerType === "mouse") setLinked({ title: label, x: e.clientX, y: e.clientY });
    },
    onPointerLeave: () => setLinked(null),
    // Opening the detail slides the track out from under the pointer without it
    // ever leaving the name, so there is no pointerleave to take the card down.
    onPointerDown: () => setLinked(null),
  });

  const linkHover = hoverCard(LINK_LABEL);
  const frameHover = hoverCard(FRAME_LABEL);

  // A tool's name inside a sentence, opening exactly what its frame opens. A
  // button, not an anchor: it is a pane sliding over the page, not a navigation
  // to a URL of its own. .inline-link is the shared style — see globals. Falls
  // back to plain text when no entry carries that slug, so page.tsx can drop a
  // tool without this going looking for it.
  //
  // A function returning an element, NOT a component declared in this body. A
  // component defined inside a render is a fresh TYPE on every render, so React
  // discards its <button> and builds another whenever the card opens or closes —
  // including on the pointerdown that takes the card down, which IS the press
  // being made. The node the press started on is gone before the click can
  // land, so the name looked live and opened nothing. Called rather than
  // rendered, the same button survives the re-render.
  const toolLink = (slug: string, label: string) => {
    const item = all.find((child) => child.props.slug === slug);
    if (!item) return label;
    return <button type="button" className="inline-link" onClick={() => onOpen(item)} {...linkHover}>{label}</button>;
  };

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
        //   ORDER   by where a frame sits, not where it is written: line by line
        //           and left to right within a line, so they arrive in the order
        //           they are read. A frame tall enough to span the others' lines
        //           — the tools feature — is the one exception and goes LAST, so
        //           the stack lands first and it settles against the divider
        //           after them.
        //
        //           This was offsetLeft first, which is column-major: right for
        //           the tools grid, where the stack IS a column, and wrong for
        //           Various the moment that row became two wrapped lines of two.
        //           There the left edges no longer track reading order, and it
        //           was arriving bottom-left, top-left, bottom-right, top-right.
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
          // Which frame, if any, is the feature: taller than half again the
          // middle of the pack. Measured rather than declared, so the row that
          // has no such frame simply has none and nothing is special-cased.
          const heights = frames.map((f) => f.offsetHeight).sort((x, y) => x - y);
          const median = heights[Math.floor(heights.length / 2)];
          const isFeature = (f: HTMLElement) => f.offsetHeight > median * 1.5;

          const order = frames
            .map((_, i) => i)
            .sort((a, b) => {
              const fa = frames[a];
              const fb = frames[b];
              if (isFeature(fa) !== isFeature(fb)) return isFeature(fa) ? 1 : -1;
              return fa.offsetTop - fb.offsetTop || fa.offsetLeft - fb.offsetLeft;
            });

          // Percent of screen per pixel of travel, taken from the one frame whose
          // run is stated rather than derived. Everything else moves at this rate,
          // which is what keeps the small ones from outrunning the wide one.
          const last = order[order.length - 1];
          const pace = GROUP_LAST_RUN / (distances[last] || 1);
          const runOf = (i: number) => distances[i] * pace;

          // GROUP_END is where the FRAMES' middle should be when the last one
          // lands; ScrollTrigger measures the row's top, so half their height
          // comes off it. In percent of the screen, like everything else here.
          //
          // Measured off the FRAMES, not off the row and not off the column they
          // sit in. The row is the frames AND the copy beside them, and the copy
          // is by far the taller of the two — 589px against 336px in Various
          // once the frames grew. Taking half of 589 put the anchor at 34.9% of
          // the screen, so the last frame did not begin to move until it was
          // already well into view, leaving a hole where it should have been for
          // most of a screen of scrolling.
          //
          // .entry-visual is no better: it is a grid item and stretches to the
          // row's height, so it measured 525 of those 589. The frames' own
          // extent is the only thing here that is actually the frames.
          const top = Math.min(...frames.map((f) => f.offsetTop));
          const bottom = Math.max(...frames.map((f) => f.offsetTop + f.offsetHeight));
          const halfRow = ((bottom - top) / (scroller.clientHeight || 1)) * 50;
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
            title="Design Tooling"
            viewFeature
            stack="claude code, .skills, html, css, js, webgl, dev-design tooling"
            blurb={<>Simple tools for experimenting with design elements such as <Highlight>font, colour, image and texture</Highlight>. Lightweight, can be used as <Highlight>.skills</Highlight> on existing projects, to enable design previews in-browser.</>}
            points={
              <>
                <li>{toolLink("randomize-studio", "Randomize Studio")} :  adobe-like ui, for experimenting with typography, layout, effects. Its modeled as a landing-page generator</li>
                <li>{toolLink("texture-studio", "Texture Studio")} : handles svg overlays and blending modes over images</li>
                <li>{toolLink("fluid-hover", "Fluid hover")} : models a mouse driven, webGL visual effect </li>
                <li>{toolLink("static-background", "Static Background")} : generates animated film-grain overlays</li>
              </>
            }
            onOpen={onOpen}
          />

          {items.map((child) => (
            <li className={`scroll-entry-secondary${child.props.className ? ` ${child.props.className}` : ""}`} key={child.props.title} data-preload={child.props.href}>
              <div className="entry-visual">
                {/* The frame opens the experiment too — same target as the View
                    button, so the obvious click works. */}
                <button type="button" className="entry-thumb" onClick={() => onOpen(child)} aria-label={`Open ${child.props.title}`} {...frameHover}>
                  {child.props.thumbNode
                    ?? (child.props.thumb
                      ? <Image src={child.props.thumb} alt="" sizes="(min-width: 768px) 30vw, 100vw" placeholder="blur" className="frame-img" />
                      : child.props.href && <iframe src={child.props.href} title={`${child.props.title}, live`} loading="lazy" tabIndex={-1} aria-hidden="true" referrerPolicy="no-referrer-when-downgrade" />)}
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

                  {/* Same list the projects band carries, and written the same
                      way in page.tsx. An experiment had nowhere to say what it
                      actually does before this — the props were being set and
                      then rendered by nobody. */}
                  {child.props.points && <ul className="entry-points">{child.props.points}</ul>}
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
            title="Archive"
            stack="vue, nuxt, jquery, bootstrap, scss, zoomooz, github copilot"
            blurb={<>Concepts, prototypes and <Highlight>relics from another age</Highlight></>}
            points={
              <>
                <li>2016 - {toolLink("paint", "Paint")} : Win95 MS Paint rebuilt with claude and CSS</li>
                <li>2016 - {toolLink("optimize-studio", "Optimize Studio")} : ui interactions, effects and techniques</li>
                <li>2015 - {toolLink("zoom", "Zoom")} : navigation concept for a presentation website</li>
                <li>2014 - <Highlight>{toolLink("radio", "Instant dance party")}</Highlight> plays random music and visuals</li>
              </>
            }
            onOpen={onOpen}
          />
        </ul>
      </div>

      {/* Portalled to <body> from in here, the same as a row's own — it has to
          outlive this subtree's clipping and stacking. */}
      <CursorCard item={linked} onDismiss={() => setLinked(null)} />
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
  stack,
  points,
  rows,
  viewFeature,
  onOpen,
}: {
  items: React.ReactElement<ProjectProps>[];
  className: string;
  title: string;
  blurb?: React.ReactNode;
  stack?: string;
  points?: React.ReactNode;
  rows?: number;
  // Gives the row the same View button a single entry has, opening the FIRST
  // item — which in the tools grid is the feature, the frame that spans the row
  // and the one the copy is mostly about. Opt-in, because a row of odds and ends
  // has no one frame that stands for the set.
  viewFeature?: boolean;
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
        <ul className="frame-grid" style={rows ? ({ gridTemplateRows: `repeat(${rows}, var(--tool-row))`, "--tool-rows": rows } as React.CSSProperties) : undefined}>
          {items.map((item) => (
            <li
              className={`frame-cell${item.props.className ? ` ${item.props.className}` : ""}`}
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
                {item.props.thumbNode
                  ?? (item.props.thumb
                    ? <Image src={item.props.thumb} alt="" sizes="(min-width: 768px) 20vw, 50vw" placeholder="blur" className="frame-img" />
                    : item.props.href && <iframe src={item.props.href} title={`${item.props.title}, live`} loading="lazy" tabIndex={-1} aria-hidden="true" referrerPolicy="no-referrer-when-downgrade" />)}

                {/* aria-hidden: the button already carries the same words in its
                    label, and a screen reader reading them twice is worse than
                    not having them. This is for the eye. */}
                {item.props.thumbLabel && <span className="frame-label" aria-hidden="true">{item.props.title}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <CursorCard item={hovered} onDismiss={() => setHovered(null)} />

      <div className="entry-body reveal">
        <div className="entry-text">
          <h3 className="entry-title">{title}</h3>
          {blurb && <p className="entry-blurb">{blurb}</p>}

          {/* Same pills and same list a single entry above carries, so a row of
              frames reads as the same kind of entry as a row with one. */}
          {stack && (
            <ul className="entry-tech-stack">
              {stack.split(",").map((tech) => tech.trim()).filter(Boolean).map((tech) => (
                <li className="pill" key={tech}>{tech}</li>
              ))}
            </ul>
          )}

          {points && <ul className="entry-points">{points}</ul>}
        </div>

        {/* Named rather than a bare "View": this row has four frames in it, so
            the button has to say which one it opens. Same class, so it is the
            same control as every other View on the page. */}
        {viewFeature && (
          <button type="button" className="view-more-button" onClick={() => onOpen(items[0])}>
            View {items[0].props.title} <span className="row-arrow" aria-hidden="true">&rarr;</span>
          </button>
        )}
      </div>
    </li>
  );
}
