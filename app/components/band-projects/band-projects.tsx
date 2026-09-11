import Image from "next/image";
import type { ProjectProps } from "@/app/components/showcase-linear/project";
import "./band-projects.scss";

const num = (idx: number) => String(idx + 1).padStart(2, "0");

// Projects. The thumbnail is the scroll device: its column is full-entry height
// and holds a sticky box, so the image pins while its own entry scrolls and
// releases when the next one arrives.
//
// Nothing between .visual-sticky and the scrolling pane may carry a transform —
// it would break the sticky — so `.reveal` stays off the entry and the visual
// column, and belongs only on .entry-body.
//
// This band spans both scrolling columns (`is-full`) so its entries can define
// the same `--col-media` grid themselves and land against the divider.
export function BandProjects({
  items,
  onOpen,
}: {
  items: React.ReactElement<ProjectProps>[];
  onOpen: (idx: number) => void;
}) {
  return (
    <section className="band nsc-band-projects" data-section="Projects">
      <div className="band-content is-full">
        {items.map((child, idx) => (
          <article className="scroll-entry" key={child.props.title}>
            <div className="entry-visual">
              <div className="visual-sticky">
                {/* The image opens the project too — same target as the
                    View project button, so the obvious click works. */}
                <button type="button" className={`entry-thumb${child.props.thumb ? "" : " is-empty"}`} onClick={() => onOpen(idx)} aria-label={`Open ${child.props.title}`}>
                  {child.props.thumb && <Image src={child.props.thumb} alt="" sizes="(min-width: 1440px) 320px, (min-width: 768px) 25vw, 100vw" placeholder="blur" className="thumb-img" />}
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

              <button type="button" className="entry-more" onClick={() => onOpen(idx)}>
                View project <span className="row-arrow" aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
