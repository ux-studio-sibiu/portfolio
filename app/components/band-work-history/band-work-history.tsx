"use client";

import { useState } from "react";
import "./band-work-history.scss";
import { Highlight } from "@/app/components/highlight/highlight";
import { CursorCard, type CursorCardItem } from "@/app/components/cursor-card/cursor-card";

// What the phrase in the first bullet does. The same device the thumbnails use
// — a card at the pointer — because the page already says "there is something
// behind this" that way, and a second vocabulary for the same promise would be
// one to learn for no reason.
const JUMP_LABEL = "View in projects";

// Work history. Deliberately NOT a `data-section` band: it is read over the
// identity, which is still up while it passes, and a band only declares
// `data-section` to claim the black rail's title and a line in the section
// menu. Both of those belong to the run that starts at Projects, so this one
// claims neither — it is a stretch of the page rather than a destination.
//
// Set like the projects band: the band spans both scrolling columns (`is-full`)
// so each entry can define the same `--col-media` grid and land against the
// divider. Column 2 holds the years, sticky, so the dates hold beside the role
// they belong to for as long as that role is on screen; column 3 is the copy.
//
// An entry IS a disclosure: the <summary> is the place and the role, so the
// title is the thing you press, and everything that is detail — the points and
// the stack — is inside and closed. Native <details> rather than state in
// React: it works before hydration and with JS off entirely, and the browser
// brings the keyboard and screen-reader behaviour with it.
//
// (An earlier note here claimed the <details> kept this a server component. It
// never did — this module is imported by showcase-linear.tsx, which is
// "use client", so it has always been part of the client bundle. The other
// reasons stand on their own.)
//
// The role lines are <span>s, not <p>s, on purpose: a summary takes phrasing
// and heading content, and a paragraph is neither. The stylesheet blocks them.
//
// `<code>` is the device for a tool or a technology named inside a sentence,
// the same one the project detail panels use. `<Highlight>` is the scroll-swept
// emphasis used everywhere else on the page — kept sparse here on purpose, it
// only means something while it is rare.

// The mark. A chevron rather than a triangle or a plus: it is the shape a
// dropdown has everywhere, so it needs no explaining, and it has an obvious
// half-turn to make when the entry opens. Drawn at 16 and stroked in
// currentColor so it sits at the weight of the title beside it.
function ToggleMark() {
  return (
    <svg className="toggle-mark" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M3.5 6 8 10.5 12.5 6" />
    </svg>
  );
}

export function BandWorkHistory({ onScrollToProject }: { onScrollToProject?: (slug: string) => void }) {
  // Whether the pointer is over the jump phrase, and where it was when it
  // arrived. One card for the band; only one phrase can be under the pointer.
  const [hovered, setHovered] = useState<CursorCardItem | null>(null);

  const jumpHover = {
    // Mouse only, like the thumbnails: on a touch screen the card would come up
    // under the finger that just tapped.
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setHovered({ title: JUMP_LABEL, x: e.clientX, y: e.clientY });
    },
    // Brings it back after a scroll has closed it without having to leave the
    // phrase and come back.
    onPointerMove: (e: React.PointerEvent) => {
      if (!hovered && e.pointerType === "mouse") setHovered({ title: JUMP_LABEL, x: e.clientX, y: e.clientY });
    },
    onPointerLeave: () => setHovered(null),
    // The page scrolls out from under the pointer on click, so there is no
    // pointerleave coming to take the card down.
    onPointerDown: () => setHovered(null),
  };

  return (
    <section className="band nsc-band-work-history">
      <div className="band-content is-full">
        {/* The smaller of the two title flavours, the one Experiments takes:
            two words cannot be set at display size in the content column
            without wrapping. */}
        <h2 className="band-heading">Work history</h2>

        <ol className="history-list">
          {/* No `data-section-anchor` here: it is only ever read off a band that
              declares `data-section`, and this one does not. */}
          <li className="history-entry">
            <div className="entry-when">
              <p className="when-mark">
                <span className="when-from">2018</span>
                <span className="when-to">present</span>
              </p>
            </div>

            <div className="entry-body">
              <div className="entry-text">
                {/* The two posts are open on arrival: they are what an employer
                    came to read, and leaving them shut asks for a click before
                    the section says anything. The degree below stays closed —
                    `open` is the initial state only, so any of them still shuts
                    like the others once it is touched. */}
                <details className="entry-detail" open>
                  <summary className="detail-toggle">
                    <span className="toggle-text">
                      <h3 className="entry-place">Visma</h3>
                      <span className="entry-role spec-note">Frontend engineer</span>
                    </span>
                    <ToggleMark />
                  </summary>

                  <ul className="entry-points">
                    {/* The product this post is mostly about is also a project
                        further down the page, so the phrase that names it is
                        the way there. A button, not an anchor: it scrolls the
                        pane, which is not a navigation to a URL of its own.
                        .inline-link is the shared style — see globals. */}
                    <li>
                      <Highlight>long-standing</Highlight> contribution for{" "}
                      {onScrollToProject ? (
                        <button type="button" className="inline-link" onClick={() => onScrollToProject("advisor")} {...jumpHover}>
                          accounting SaaS
                        </button>
                      ) : "accounting SaaS"}{" "}
                      for nordic markets on product development and maintenance, knowledge sharing and documentation
                    </li>

                    {/* <li>contributed extensively to product development and maintenance, knowledge sharing and documentation</li> */}
                    {/* <li>implemented new features, extended existing functionality, improved usability, performance, and accessibility</li> */}
                    
                    <li><Highlight>focused on frontend and UI</Highlight> to improve structure and consistency by refactoring, enforcing constraints and confirmed patterns, <Highlight>discuss design</Highlight>, push back on flawed UX and propose alternatives</li>
                    <li>developed an in-house ajax library to modernize the existing application (.net core) into a <Highlight>custom SPA</Highlight></li>
                    <li>led long-term ui <Highlight>modernization effort</Highlight> to refactor, remodel ux, and addopt <Highlight>design system</Highlight> by <Highlight>coordinating junior devs</Highlight>, knowledge sharing, code-reviews, effort estimation</li>
                    <li>implemented refactoring and migration strategies with version control, drop unnecessary dependencies, centralize components, reduce complexity, <Highlight>improve dx</Highlight></li>
                    <li>proactive in reducing complexity, redundant dependencies, bugs and visual inconsistencies</li>

                    <li>acted as a <Highlight>main contact with the UX team</Highlight>, participated in UX research, user testing, interviews and complemented the design effort with ui prototypes and technical feedback</li>
                    
                    <li>complemented AI development by setting up <Highlight>skills, .md instructions</Highlight> and documenting existing <Highlight>confirmed patterns</Highlight></li>
                    
                  </ul>

                  {/* <ul className="entry-tech-stack">
                    <li className="pill">claude code</li>
                    <li className="pill">git</li>
                    <li className="pill">.net core</li>
                    <li className="pill">VS Code</li>
                    <li className="pill">Figma</li>
                    <li className="pill">SignalR</li>
                    <li className="pill">Snowplow</li>
                    <li className="pill">App Insights</li>
                  </ul> */}
                </details>
              </div>
            </div>
          </li>

          <li className="history-entry">
            <div className="entry-when">
              <p className="when-mark">
                <span className="when-from">2014</span>
                <span className="when-to">2018</span>
              </p>
            </div>

            <div className="entry-body">
              <div className="entry-text">
                <details className="entry-detail" open>
                  <summary className="detail-toggle">
                    <span className="toggle-text">
                      <h3 className="entry-place">Mi-Pay Sibiu</h3>
                      <span className="entry-role spec-note">Frontend developer</span>
                    </span>
                    <ToggleMark />
                  </summary>

                  <ul className="entry-points">

                    <li>enhanced web applications by integrating new features and improving performance</li>
                    <li>improved responsives of products following mobile-first best practices</li>
                    <li>
                      <Highlight>proposed and implemented</Highlight> the design of a{" "}
                      {onScrollToProject ? (
                        <button type="button" className="inline-link" onClick={() => onScrollToProject("four-in-one")} {...jumpHover}>
                          white-label product
                        </button>
                      ) : "white-label product"}{" "}
                      to allow for convenient per-customer branding with <Highlight>ui/ux focus</Highlight> from concept to production
                    </li>

                    <li>modernized the same product by <Highlight>migrating to SPA</Highlight> using ajax libraries of the time</li>
                    <li>migrated an internal customer-support tool to Angular 2</li>
                    
                  </ul>
                </details>
              </div>
            </div>
          </li>

          {/* A degree, not a post, so what is listed under it is what carried
              over rather than what was delivered. Kept to four lines: any longer
              and it starts to read as an excuse for the change of field. */}
          <li className="history-entry">
            <div className="entry-when">
              <p className="when-mark">
                <span className="when-from">2007</span>
                <span className="when-to">2013</span>
              </p>
            </div>

            <div className="entry-body">
              <div className="entry-text">
                <details className="entry-detail">
                  <summary className="detail-toggle">
                    <span className="toggle-text">
                      <h3 className="entry-place">Architecture and Building Design</h3>
                      <span className="entry-role spec-note">Bachelor's Degree -- University of Architecture, Cluj-Napoca</span>
                      <span className="entry-role spec-note"></span>
                    </span>
                    <ToggleMark />
                  </summary>

                  <ul className="entry-points">
                    <li> picked up elements of design theory like usability, visual composition, proportion, scale </li>
                  </ul>
                </details>
              </div>
            </div>
          </li>
        </ol>
      </div>

      {/* Portalled to <body> from in here, the same as the one in the projects
          band — it has to outlive this subtree's clipping and stacking. */}
      <CursorCard item={hovered} onDismiss={() => setHovered(null)} />
    </section>
  );
}
