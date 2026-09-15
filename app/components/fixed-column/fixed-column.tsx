"use client";

import { RunLine, RunWord } from "@/app/components/run-line/run-line";
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
// `sections` comes from the showcase, which reads it off the `data-section`
// attributes in the DOM. Nothing here needs updating when a band is added.
export function FixedColumn({ sections, active, onOpenMenu }: { sections: string[]; active: string | null; onOpenMenu: () => void }) {
  return (
    <aside className="pane-fixed nsc-fixed-column">
      <div className="fixed-identity">
        <p className="fixed-label">
          <RunLine>
            <RunWord alt="Frontend">Creative</RunWord>
            <RunWord alt="Engineer">Developer</RunWord>
          </RunLine>
        </p>
        <h1 className="fixed-name">
          <span className="name-mask"><span>Razvan</span></span>
          <span className="name-mask"><span>Turcanu</span></span>
        </h1>
        <p className="fixed-blurb">
          Passionate about craft, I <span className="highlight-on-scroll pinned">bridge design and dev</span> to build polished, practical interfaces. 
          I enjoy putting together <span className="highlight-on-scroll pinned">creative custom designs</span>, using AI tools to move from quick prototypes to finished products.
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

      {/* The only thing in this column that takes a click, and deliberately so:
          the column is laid over the scroller, and anything here that accepts
          pointer events is a patch of screen the wheel cannot fall through. A
          44px button is a price worth paying; the name, at 576x199, was not.

          It sits outside .fixed-sections rather than in it so it does not
          inherit that rail's fade — the nav has to be reachable from the top of
          the page, not only once a section has taken the title. It inverts when
          the rail comes up underneath it. */}
      <button type="button" className="rail-menu" onClick={onOpenMenu} aria-label="Open the section menu">
        <span className="menu-bars" aria-hidden="true" />
      </button>

      {/* Entrance timeline for this column, currently disabled:
          gsap.timeline({ defaults: { ease: "power3.out" } })
            .from(".fixed-label", { opacity: 0, duration: 0.5 })
            .from(".name-mask span", { yPercent: 110, duration: 1, stagger: 0.09 }, "-=0.25")
            .from(".fixed-facts", { opacity: 0, y: 18, duration: 0.6 }, "-=0.5"); */}
    </aside>
  );
}
