import type { ProjectProps } from "@/app/components/showcase-linear/project";
import "./band-tools-grid.scss";

// Tools. Small things built for a job, shown as a wall of live frames rather
// than as a list: all the frames together on the left in a 2:1 grid, and one
// block of copy on the right that speaks for the set.
//
// Same props and the same `onOpen` as BandExperiments, which is the other shape
// this data can take — a row per item with its own copy beside it. The two are
// interchangeable, and Experiments still uses that one.
//
// There is nowhere to caption a frame in a grid this tight, so the name lives in
// each button's aria-label — the only place it was doing work for anyone who
// could not see the frame anyway.
//
// The frames are live iframes, as before: the thing is running before it is
// opened. They take no pointer events of their own — see the stylesheet — so
// the click belongs to the button around each one and the wheel passes through.
export function BandToolsGrid({
  items,
  onOpen,
}: {
  items: React.ReactElement<ProjectProps>[];
  onOpen: (item: React.ReactElement<ProjectProps>) => void;
}) {
  return (
    <section className="band nsc-band-tools-grid" data-section="Tools">
      <div className="band-content is-full">
        <h2 className="band-heading band-title-large">Tools</h2>

        <div className="alt-split">
          <ul className="frame-grid">
            {items.map((child) => (
              <li className="frame-cell" key={child.props.title} data-preload={child.props.href}>
                <button type="button" className="entry-frame" onClick={() => onOpen(child)} aria-label={`Open ${child.props.title}`}>
                  {child.props.href && <iframe src={child.props.href} title={`${child.props.title}, live`} loading="lazy" tabIndex={-1} aria-hidden="true" referrerPolicy="no-referrer-when-downgrade" />}
                </button>
              </li>
            ))}
          </ul>

          {/* Said once for the whole set, rather than per experiment. Placeholder
              copy — replace it with whatever the set actually has in common. */}
          <div className="alt-notes reveal">
            <p className="notes-lede">Small things built to answer one question each, then kept around because they turned out to be useful.</p>

            <ul className="notes-list">
              <li>Placeholder — what these are for</li>
              <li>Placeholder — how they are built</li>
              <li>Placeholder — what they share</li>
              <li>Placeholder — what came out of them</li>
            </ul>

            <p className="notes-foot">Click any frame to open it full size.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
