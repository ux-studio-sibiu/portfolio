"use client";

import { RunLine, RunWord } from "@/app/components/run-line/run-line";
import { Highlight } from "@/app/components/highlight/highlight";
import "./fixed-column.scss";

// Column 1 of the index pane: fixed, never scrolls, and carries the identity —
// label, name and blurb — faded as ONE unit by --identity-fade, which the
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
          Frontend engineer with strong experience in <Highlight pinned>product UI and design systems</Highlight>.
          I&rsquo;m most interested in <Highlight pinned>design engineering</Highlight>, data-driven storytelling and <Highlight pinned>interactive work</Highlight> that feels considered.
          AI tools help me prototype fast, then I refine by hand.
        </p>
      </div>
    </aside>
  );
}
