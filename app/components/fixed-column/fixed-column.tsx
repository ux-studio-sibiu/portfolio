"use client";

import { RunLine, RunWord } from "@/app/components/run-line/run-line";
import { Highlight } from "@/app/components/highlight/highlight";
import "./fixed-column.scss";

// Column 1 of the index pane: fixed, never scrolls, and carries the identity —
// label, name, blurb and facts — faded as ONE unit by --identity-fade, which the
// showcase writes on scroll.
//
// It used to carry the section rail and the menu button too. Both are their own
// fixed elements now, laid over this one rather than inside it, because they
// have to outlive both this column's fade and the track's slide; what is left
// here of them is the left padding that clears the rail.
export function FixedColumn() {
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


    </aside>
  );
}
