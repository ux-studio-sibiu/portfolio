import type { ProjectProps } from "@/app/components/showcase-linear/project";
import "./band-experiments.scss";

// Experiments. The same entry as a project — the frame sits in column 2 against
// the divider and pins while its own entry scrolls, the copy runs in column 3,
// and the frame and the View live button both open it into the detail pane with
// the track sliding right. It is `.scroll-entry-secondary` rather than
// `.scroll-entry` so the two can be told apart and pulled further apart later;
// today they differ only in the frame and in scale.
//
// The frame is a live iframe rather than a still, so the thing is running
// before it is opened. It takes no pointer events of its own — see the
// stylesheet — which is what leaves the click to the button around it and stops
// it swallowing the pane's scroll.
//
// As in band-projects: nothing between .visual-sticky and the scrolling pane
// may carry a transform, or the sticky breaks. The one on the iframe is a
// descendant of it, which is fine.
export function BandExperiments({
  items,
  onOpen,
}: {
  items: React.ReactElement<ProjectProps>[];
  onOpen: (item: React.ReactElement<ProjectProps>) => void;
}) {
  return (
    <section className="band nsc-band-experiments" data-section="Experiments">
      <div className="band-content is-full">
        <ul className="experiment-list">
          {items.map((child) => (
            <li className="scroll-entry-secondary" key={child.props.title} data-preload={child.props.href}>
              <div className="entry-visual">
                <div className="visual-sticky">
                  {/* The frame opens the experiment too — same target as the
                      View live button, so the obvious click works. */}
                  <button type="button" className="entry-frame" onClick={() => onOpen(child)} aria-label={`Open ${child.props.title}`}>
                    {child.props.href && <iframe src={child.props.href} title={`${child.props.title}, live`} loading="lazy" tabIndex={-1} aria-hidden="true" referrerPolicy="no-referrer-when-downgrade" />}
                  </button>
                </div>
              </div>

              <div className="entry-body reveal">
                <div className="entry-text">
                  <h3 className="entry-title">{child.props.title}</h3>
                  <p className="entry-role">{child.props.role}{child.props.stack ? ` / ${child.props.stack}` : ""}</p>
                  <p className="entry-summary">{child.props.summary}</p>
                </div>

                <button type="button" className="entry-more" onClick={() => onOpen(child)}>
                  View live <span className="row-arrow" aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
