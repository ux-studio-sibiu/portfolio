import "./band-work-history.scss";
import { Highlight } from "@/app/components/highlight/highlight";

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
// React: it keeps this a server component, it works before hydration and with
// JS off entirely, and the browser brings the keyboard and screen-reader
// behaviour with it.
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

export function BandWorkHistory() {
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
                {/* The current post, open on arrival: it is the one an employer
                    came to read, and leaving it shut asks for a click before
                    the section says anything. The rest stay closed — `open` is
                    the initial state only, so this one still shuts like any
                    other once it is touched. */}
                <details className="entry-detail" open>
                  <summary className="detail-toggle">
                    <span className="toggle-text">
                      <h3 className="entry-place">Visma</h3>
                      <span className="entry-role spec-note">Frontend engineer</span>
                    </span>
                    <ToggleMark />
                  </summary>

                  <ul className="entry-points">
                    <li>long-standing contribution for a complex accounting product — SE, NL, DK, NO markets</li>
                    <li><Highlight>own and maintain</Highlight> the ui-system structure and consistency, enforce constraints, push back on flawed UX and propose alternatives, code-reviews</li>
                    <li><Highlight>large scale ui migration</Highlight> + refactor + ux update, handle frequent design system updates</li>
                    <li>implemented a <Highlight>custom SPA library</Highlight> over <code>.net core</code> + <code>kendo ui</code></li>
                    <li>proactive in reducing complexity, redundant dependencies, bugs and visual inconsistencies</li>
                    <li>responsible use of AI tools, balance strengths/limitations: <code>gh copilot</code>, <code>claude</code>, <code>chat-gpt</code></li>
                    <li>participated in UX research, user testing, interviews, and prototyping</li>
                    <li>close collaboration with design-system owners to deliver polished, usable components</li>
                    <li>improved usability, performance, and accessibility</li>
                  </ul>

                  <ul className="entry-tech-stack">
                    <li className="pill">git</li>
                    <li className="pill">.net core</li>
                    <li className="pill">VS Code</li>
                    <li className="pill">Figma</li>
                    <li className="pill">SignalR</li>
                    <li className="pill">Snowplow</li>
                    <li className="pill">Application Insights</li>
                  </ul>
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
                <details className="entry-detail">
                  <summary className="detail-toggle">
                    <span className="toggle-text">
                      <h3 className="entry-place">Mi-Pay Sibiu</h3>
                      <span className="entry-role spec-note">Frontend developer</span>
                    </span>
                    <ToggleMark />
                  </summary>

                  <ul className="entry-points">
                    <li>frontend dev in <code>.NET MVC</code> for responsive micro-payment apps and dashboards</li>
                    <li>Enhanced web applications by integrating new features and improving performance</li>
                    <li>Refactored legacy code and fixed bugs to boost maintainability and reliability</li>
                    <li><Highlight>Modernized front-end architecture</Highlight> by migrating components from <code>Backbone.js</code> to <code>React</code></li>
                    <li>Improved responsive UI using <code>SCSS</code> and <code>Bootstrap</code>, following mobile-first best practices</li>
                    <li>Increased test coverage and confidence with end-to-end testing via <code>Cypress</code></li>
                    <li>Maintained and updated the company's <code>WordPress</code> (Elementor) site for consistent content delivery</li>
                    <li>ui/ux focus <Highlight>from concept to production</Highlight></li>
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
                    <li>visual composition — proportion, hierarchy, rhythm and scale</li>
                    <li>light, material and contrast used to direct attention</li>
                    <li><Highlight>circulation is user flow</Highlight>: designing the path people take through a thing</li>
                    <li>human scale and ergonomics — a building is only good if it is usable</li>
                  </ul>
                </details>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
