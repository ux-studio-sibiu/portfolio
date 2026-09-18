"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ProjectProps } from "@/app/components/showcase-linear/project";
import "./band-projects.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const num = (idx: number) => String(idx + 1).padStart(2, "0");

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
    });

    return () => mm.revert();
  }, { scope: root });

  // `data-identity-handover` is what makes the cover in the fixed column fade
  // out as THIS band arrives rather than as the first band does — the bands
  // above it are read over the name, so the name has to still be up. See the
  // sequence in showcase-linear.tsx.
  return (
    <section className="band nsc-band-projects" data-section="Projects" data-identity-handover="" ref={root}>
      <div className="band-content is-full">
        <h2 className="band-heading band-title-large">Projects</h2>

        {/* The FIRST entry is what the fixed column is timed off — see
            `data-section-anchor` in showcase-linear.tsx. Without it the band box
            is measured, and its padding crosses the trigger line 9rem early. */}
        {items.map((child, idx) => (
          <article className={`scroll-entry${child.props.className ? ` ${child.props.className}` : ""}`} key={child.props.title} data-preload={child.props.href} data-section-anchor={idx === 0 ? "" : undefined}>
            <div className="entry-visual">
              <div className="visual-sticky">
                {/* The image opens the project too — same target as the
                    View project button, so the obvious click works. */}
                <button type="button" className={`entry-thumb${child.props.thumb ? "" : " is-empty"}`} onClick={() => onOpen(child)} aria-label={`Open ${child.props.title}`}>
                  {child.props.thumb && <Image src={child.props.thumb} alt="" sizes="(min-width: 1440px) 420px, (min-width: 768px) 30vw, 100vw" placeholder="blur" className="thumb-img" />}
                  {/* <span className="thumb-index">{num(idx)}</span> */}
                </button>

                {/* A second frame beside the first, for a project one image does
                    not cover. It opens the same detail — there is nothing else
                    to go to. */}
                {child.props.thumbAlt && (
                  <button type="button" className="entry-thumb" onClick={() => onOpen(child)} aria-label={`Open ${child.props.title}`}>
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
                View project <span className="row-arrow" aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </article>
        ))}

        {/* Hand-written entries, after the generated ones. See the note above
            the component for the shape a .scroll-entry expects. */}
        {children}
      </div>
    </section>
  );
}
