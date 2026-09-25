"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CursorCard, type CursorCardItem } from "@/app/components/cursor-card/cursor-card";
import { Highlight } from "@/app/components/highlight/highlight";
import type { ProjectProps } from "@/app/components/showcase-linear/project";
import "./band-projects.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// What the thumbnail does, said once. The button below the copy is written from
// the same constant, so the card at the pointer and the control at the foot of
// the entry cannot end up promising different things.
const VIEW_LABEL = "View project";

// Where a thumbnail starts and finishes arriving, as positions of its ENTRY
// against the scroller: from its top near the bottom of the screen to its top a
// little past halfway up. The same two figures the experiments band arrives on —
// see ARRIVE_FROM / ARRIVE_TO there — so a project and an experiment come in at
// the same point of their own travel.
//
// It is over well before the entry's top reaches the pin line, so the slide has
// always finished by the time the thumbnail sticks.
const ARRIVE_FROM = 95;
const ARRIVE_TO = 55;
// Daylight between two thumbnails that travel the same track, on top of the
// ground that merely keeps them from touching. Without it they clear each other
// by exactly nothing and read as one object sliding in.
const THUMB_CLEAR = 6;

// Projects. The thumbnail is the scroll device: its column is full-entry height
// and holds a sticky box, so the image pins while its own entry scrolls and
// releases when the next one arrives.
//
// An entry's `className` lands next to .scroll-entry, which is how a project
// picks its own thumbnail size: `large` and `small` in band-projects.scss, or
// nothing for the middle one. Chosen per project in page.tsx rather than worked
// out from the position here, so the column can be mixed by eye — it is a
// composition, not a pattern.
//
// Nothing between .visual-sticky and the scrolling pane may carry a transform —
// it would break the sticky — so `.reveal` stays off the entry and the visual
// column, and belongs only on .entry-body.
//
// This band spans both scrolling columns (`is-full`) so its entries can define
// the same `--col-media` grid themselves and land against the divider.
//
// An entry that <LinearProject>'s props cannot describe is written out by hand
// instead, as children. They land in .band-content alongside the generated ones
// and pick up the same styles, so an entry can be as close to or as far from
// the usual shape as it needs:
//
//   <BandProjects items={projects} onOpen={openItem}>
//     <article className="scroll-entry">
//       <div className="entry-visual">
//         <div className="visual-sticky">…anything…</div>
//       </div>
//       <div className="entry-body reveal">…anything…</div>
//     </article>
//   </BandProjects>
//
// Nothing is enforced: drop in a plain <div>, a full-bleed image, two entries
// side by side. Keeping .scroll-entry on the outside is only what buys the
// column grid and the sticky visual.
export function BandProjects({
  items,
  onOpen,
  children,
}: {
  items: React.ReactElement<ProjectProps>[];
  onOpen: (item: React.ReactElement<ProjectProps>) => void;
  children?: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  // A pinned thumbnail holds at full strength for as long as it is pinned, and
  // fades once it is let go. The window is read off the page rather than guessed:
  // it begins where the entry's bottom catches up with the bottom of the pinned
  // box — the moment the pin ends and the thumbnail starts travelling with the
  // page again — and runs for the thumbnail's own height of scroll after that, so
  // it is gone by the time it has moved its own length and never simply slides
  // off the top still visible.
  //
  // Scrubbed, so it is scroll position and not a duration: scroll back up and the
  // thumbnail comes back.
  useGSAP(() => {
    const el = root.current;
    // From tablet up this is the element that scrolls, and it is also the only
    // width at which the thumbnails pin at all.
    const scroller = el?.closest<HTMLElement>(".pane-scroll");
    if (!el || !scroller) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      // Arrival. Each thumbnail waits out of sight past the right edge of its
      // column and slides to its resting place as the entry comes up — the same
      // reveal the experiments frames have, and the same two positions of the
      // trigger against the scroller, so the two bands read as one page.
      //
      // Separate from the fade below on purpose. This moves the THUMBNAIL, the
      // fade moves the sticky box around it, so neither touches a property the
      // other owns and the pin is untouched by both. Putting the slide on the
      // sticky box itself would have worked too, but a transform on a sticky
      // element is the kind of thing that stops working quietly.

      // One per entry, emptied when a refresh begins — see the cache by each
      // entry's schedule() below.
      const invalidators: (() => void)[] = [];

      el.querySelectorAll<HTMLElement>(".scroll-entry").forEach((entry) => {
        const column = entry.querySelector<HTMLElement>(".entry-visual");
        if (!column) return;

        // How far a thumbnail has to go to put its own left edge on the cut the
        // clip-path makes — out of sight, and not a pixel further.
        //
        // Rects rather than offsetLeft, unlike the experiments band: there the
        // frames and their column share an offsetParent, here they do not.
        // .visual-sticky is `position: sticky`, which makes it the offsetParent
        // of the thumbnails inside it while the column is measured against
        // something further out, and subtracting the two gave a distance 80px
        // long on the first entry.
        //
        // Rects have the current transform baked in, which is what the comment
        // in the experiments band warns about — so the transform is taken back
        // off, and the answer is the resting geometry however often it is asked.
        const travel = (thumb: HTMLElement) => {
          const current = Number(gsap.getProperty(thumb, "x")) || 0;
          return column.getBoundingClientRect().right - (thumb.getBoundingClientRect().left - current);
        };

        const thumbs = Array.from(entry.querySelectorAll<HTMLElement>(".entry-thumb"));

        // One thumbnail crosses the whole window on its own. Two — the
        // photography entry — share it on the same two rules the experiments
        // band shares a row by:
        //
        //   ORDER  left to right. They all set off from the same cut, so the
        //          one whose resting place is furthest from it has the longest
        //          trip and has to leave first.
        //   SPEED  one speed for both, not one window for both. Sharing the
        //          window made the far one travel twice as fast to cover twice
        //          the ground, and they landed together.
        //
        // The waits are what keeps them from ever being drawn on top of each
        // other. Both start with their left edge ON the cut, so at rest-time
        // zero they are stacked exactly — and a wait shorter than the ground
        // between their resting places leaves them overlapping the whole way
        // in. Each therefore waits out the full distance to the one ahead, plus
        // THUMB_CLEAR so they are not still touching when they land.
        //
        // Moving at one speed with that head start, the gap between them is
        // constant for the whole crossing: they overlap in TIME — both are
        // travelling at once for most of it — and never in space.
        //
        // offsetLeft is safe here where it was not for the column: these are
        // siblings, so they share an offsetParent.
        const schedule = () => {
          const travels = thumbs.map(travel);
          const lefts = thumbs.map((t) => t.offsetLeft);
          const order = thumbs.map((_, i) => i).sort((a, b) => lefts[a] - lefts[b]);

          // Set by the LAST to arrive, the one nearest the cut: it gets the
          // plain single-thumbnail window, and everything else takes whatever
          // run its own distance needs at that speed.
          const last = order[order.length - 1];
          const pace = (ARRIVE_FROM - ARRIVE_TO) / (travels[last] || 1);

          const spans: { from: number; to: number }[] = [];
          let from = ARRIVE_TO + travels[last] * pace;

          for (let place = order.length - 1; place >= 0; place--) {
            const i = order[place];
            spans[i] = { from, to: from - travels[i] * pace };
            if (place === 0) break;
            const ahead = order[place - 1];
            from += Math.abs(lefts[i] - lefts[ahead]) * pace + THUMB_CLEAR;
          }

          return spans;
        };

        // Read by both ends of every thumbnail's trigger, so it is worked out
        // once per refresh rather than 2n times — the same cache the
        // experiments band keeps, for the same reason.
        let cached: ReturnType<typeof schedule> | null = null;
        const spansNow = () => (cached ??= schedule());
        invalidators.push(() => { cached = null; });

        thumbs.forEach((thumb, i) => {
          gsap.fromTo(
            thumb,
            { x: () => travel(thumb) },
            {
              x: 0,
              // Linear: the scroll is the easing.
              ease: "none",
              scrollTrigger: {
                trigger: entry,
                scroller,
                start: () => `top ${spansNow()[i].from}%`,
                end: () => `top ${spansNow()[i].to}%`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      el.querySelectorAll<HTMLElement>(".scroll-entry").forEach((entry) => {
        const visual = entry.querySelector<HTMLElement>(".visual-sticky");
        // The last entry's visual is static — there is nothing after it to push
        // the pin off, so it never sticks and has nothing to fade through.
        if (!visual || getComputedStyle(visual).position !== "sticky") return;

        // Read at refresh rather than held: the offset is a rem value that changes
        // at the breakpoint, and the height is a picture's.
        const offset = () => parseFloat(getComputedStyle(visual).top) || 0;

        gsap.to(visual, {
          // autoAlpha, not opacity: it takes visibility with it at zero, so a
          // thumbnail faded to nothing stops swallowing the clicks meant for
          // whatever is under it. It is a button, and it is pinned across the
          // top of the screen.
          autoAlpha: 0,
          // Linear: the scroll is the easing.
          ease: "none",
          scrollTrigger: {
            trigger: entry,
            scroller,
            start: () => `bottom top+=${offset() + visual.offsetHeight}`,
            end: () => `bottom top+=${offset()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      // refreshInit fires before positions are recomputed, so every entry's
      // cache is empty by the time the first start() of that refresh asks.
      const dropCaches = () => invalidators.forEach((invalidate) => invalidate());
      ScrollTrigger.addEventListener("refreshInit", dropCaches);
      return () => ScrollTrigger.removeEventListener("refreshInit", dropCaches);
    });

    return () => mm.revert();
  }, { scope: root });

  // Whether the pointer is over a thumbnail, and where it was when it arrived.
  // One piece of state for the band, not one per entry: only one thumbnail can
  // be under the pointer at a time.
  //
  // A thumbnail here is a button with no words on it, which is the same problem
  // the experiments frames have — so it gets the same answer, the card that
  // follows the pointer. What it says is what pressing it does.
  const [hovered, setHovered] = useState<CursorCardItem | null>(null);

  // Spread onto every thumbnail. Written once because the photography entry has
  // two of them and a second copy is a second thing to keep in step.
  const hoverProps = {
    // Mouse only: on a touch screen the card would come up under the finger
    // that just tapped the thumbnail open.
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setHovered({ title: VIEW_LABEL, x: e.clientX, y: e.clientY });
    },
    // Brings it back after a scroll has closed it, which is otherwise impossible
    // without leaving the thumbnail and coming back: the pointer is already
    // inside, so there is no second enter to wait for.
    onPointerMove: (e: React.PointerEvent) => {
      if (!hovered && e.pointerType === "mouse") setHovered({ title: VIEW_LABEL, x: e.clientX, y: e.clientY });
    },
    onPointerLeave: () => setHovered(null),
    // Opening the detail slides the track out from under the pointer without it
    // ever leaving the thumbnail, so there is no pointerleave to take the card
    // down.
    onPointerDown: () => setHovered(null),
  };

  // `data-identity-handover` is what makes the cover in the fixed column fade
  // out as THIS band arrives rather than as the first band does — the bands
  // above it are read over the name, so the name has to still be up. See the
  // sequence in showcase-linear.tsx.
  return (
    <section className="band nsc-band-projects" data-section="Projects" data-identity-handover="" ref={root}>
      <div className="band-content is-full">
        <h2 className="band-heading band-title-large">Projects <span className="heading-subtitle"><Highlight alwaysSelected>Case studies</Highlight></span></h2>

        {/* The FIRST entry is what the fixed column is timed off — see
            `data-section-anchor` in showcase-linear.tsx. Without it the band box
            is measured, and its padding crosses the trigger line 9rem early. */}
        {items.map((child, idx) => (
          <article className={`scroll-entry${child.props.className ? ` ${child.props.className}` : ""}`} key={child.props.title} data-slug={child.props.slug} data-preload={child.props.href} data-section-anchor={idx === 0 ? "" : undefined}>
            <div className="entry-visual">
              <div className="visual-sticky">
                {/* The image opens the project too — same target as the
                    View project button, so the obvious click works. */}
                <button type="button" className={`entry-thumb${child.props.thumb ? "" : " is-empty"}`} onClick={() => onOpen(child)} aria-label={`Open ${child.props.title}`} {...hoverProps}>
                  {child.props.thumb && <Image src={child.props.thumb} alt="" sizes="(min-width: 1440px) 420px, (min-width: 768px) 30vw, 100vw" placeholder="blur" className="thumb-img" />}
                  {/* <span className="thumb-index">{num(idx)}</span> */}
                </button>

                {/* A second frame beside the first, for a project one image does
                    not cover. It opens the same detail — there is nothing else
                    to go to. */}
                {child.props.thumbAlt && (
                  <button type="button" className="entry-thumb" onClick={() => onOpen(child)} aria-label={`Open ${child.props.title}`} {...hoverProps}>
                    <Image src={child.props.thumbAlt} alt="" sizes="(min-width: 1440px) 320px, (min-width: 768px) 30vw, 100vw" placeholder="blur" className="thumb-img" />
                  </button>
                )}
                {/* <span className="visual-marker" aria-hidden="true" /> */}

              </div>
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
                {child.props.points && <ul className="entry-points">{child.props.points}</ul>}
              </div>

              {/* Closes the copy off before the button, the same way a .spec-row
                  closes off a line of the lists. */}
              <hr className="entry-rule" />

              <button type="button" className="view-more-button" onClick={() => onOpen(child)}>
                {child.props.viewLabel ?? VIEW_LABEL} <span className="row-arrow" aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </article>
        ))}

        {/* Hand-written entries, after the generated ones. See the note above
            the component for the shape a .scroll-entry expects. */}
        {children}
      </div>

      {/* One card for the band, portalled to <body> from inside itself. It has
          to leave this subtree: the media column is clipped at the divider —
          see .entry-visual in band-projects.scss — and a card drawn inside that
          column would be cut off on the same line. */}
      <CursorCard item={hovered} onDismiss={() => setHovered(null)} />
    </section>
  );
}
