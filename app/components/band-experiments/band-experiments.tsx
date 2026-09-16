import Image from "next/image";
import type { ProjectProps } from "@/app/components/showcase-linear/project";
import "./band-experiments.scss";

// Experiments. A row each: the frame in column 2 against the divider, the copy
// in column 3, and either one opening it into the detail pane with the track
// sliding right. It is `.scroll-entry-secondary` rather than `.scroll-entry` so
// the two can be told apart and pulled further apart later.
//
// An entry with a `thumb` shows the picture, at whatever proportion the picture
// has; one without shows the site itself, running, in a frame with a ratio of
// its own — an iframe has no intrinsic size to take one from. The live frame
// takes no pointer events, which leaves the click to the button around it and
// stops it swallowing the pane's scroll.
//
// `tools` is a group of small things that do not each warrant a row. They share
// the first one, laid out as a grid of frames in the visual column, and every
// frame opens its own detail — the row has no View button because there is no
// single thing for it to open.
export function BandExperiments({
  items,
  tools = [],
  onOpen,
}: {
  items: React.ReactElement<ProjectProps>[];
  tools?: React.ReactElement<ProjectProps>[];
  onOpen: (item: React.ReactElement<ProjectProps>) => void;
}) {
  return (
    <section className="band nsc-band-experiments" data-section="Experiments">
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
