"use client";

import { RunLine, RunWord } from "@/app/components/run-line/run-line";
import { Highlight } from "@/app/components/highlight/highlight";
import "./fixed-column.scss";

// Column 1 of the index pane: fixed, never scrolls, and carries two things that
// hand over to each other.
//
//   .fixed-identity   label, name, blurb and facts — faded as ONE unit by
//                     --identity-fade, which the showcase writes on scroll
//   .fixed-sections   the black rail down the left edge, carrying the section
//                     titles rotated on their side, stacked and all transparent
//                     until one takes over — deliberately OUTSIDE
//                     .fixed-identity so it outlasts that fade. The rail itself
//                     is lit by `active`, on the same transition as a title, so
//                     the black and the first word fade in together
//
// The section-menu button used to be the third thing here. It is its own
// element now — see MenuButton — because it has to outlive this column, which
// fades out again at the bottom of the scroll.
//
// `sections` comes from the showcase, which reads it off the `data-section`
// attributes in the DOM. Nothing here needs updating when a band is added.
export function FixedColumn({ sections, active }: { sections: string[]; active: string | null }) {
  return (
    <aside className="pane-fixed nsc-fixed-column">
      <div className="fixed-identity">
        <p className="fixed-label">
          <RunLine>
            <RunWord words={["Creative", "Frontend"]} />
            <RunWord words={["Developer", "Engineer"]} />
          </RunLine>
        </p>
        <h1 className="fixed-name">
          <span className="name-mask"><span>Razvan</span></span>
          <span className="name-mask"><span>Turcanu</span></span>
        </h1>
        <p className="fixed-blurb">
          Passionate about craft, I <Highlight pinned>bridge design and dev</Highlight> to build polished, practical interfaces. 
          I enjoy putting together <Highlight pinned delay={250}>creative custom designs</Highlight>, using AI tools to move from quick prototypes to finished products.
        </p>

        <dl className="fixed-facts">
          <div className="fact">
            <dt>Based in</dt>
            <dd>Sibiu, Romania</dd>
          </div>
          <div className="fact">
            <dt>Working with</dt>
            <dd>React, Next.js, TypeScript, GSAP</dd>
          </div>
          <div className="fact">
            <dt>Contact</dt>
            <dd><a className="fixed-mail" href="mailto:hello@example.com">hello@example.com</a></dd>
          </div>
        </dl>
      </div>

      {/* Decorative: the rotated titles say what the scroll already says. */}
      <div className={`fixed-sections${active ? " is-active" : ""}`} aria-hidden="true">
        <div className="section-stack">
          {sections.map((label) => (
            <span className={`fixed-section${active === label ? " is-active" : ""}`} key={label}>{label}</span>
          ))}
        </div>
      </div>

    </aside>
  );
}
