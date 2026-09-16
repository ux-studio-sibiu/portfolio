import Image from "next/image";
import type { ProjectProps } from "@/app/components/showcase-linear/project";
import "./band-projects.scss";

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
  return (
    <section className="band nsc-band-projects" data-section="Projects">
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
                {/* <span className="visual-marker" aria-hidden="true" /> */}

              </div>
            </div>

            <div className="entry-body reveal">
              <div className="entry-text">
                <h3 className="entry-title">{child.props.title}</h3>
                <p className="entry-role">{child.props.role}{child.props.stack ? ` / ${child.props.stack}` : ""}</p>
                <p className="entry-summary">{child.props.summary}</p>
                {child.props.points && <ul className="entry-points">{child.props.points}</ul>}
              </div>

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
