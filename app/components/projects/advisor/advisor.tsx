import { ScreenCarousel } from "@/app/components/screen-carousel/screen-carousel";
import "./advisor.scss";

// Detail body for the Advisor project. Loaded on demand by ShowcaseLinear, so
// nothing here ships until the project is opened. Owns its own layout — a
// detail body can be prose, a stat block, images, an iframe, anything.
//
// Four screen stacks, one per era of the product, the way the old portfolio
// showed it: three browser windows and the laptop the first version ran on.
// Click a frame to step through it, right-click to go back, or use the bullets.
//
// The shots live in /public rather than app/assets: there are forty of them,
// they are already cut to 700px, and a carousel needs them as a list either
// way — forty import lines would buy nothing.
const SHOTS_2026 = [
  "/advisor/2026/01-overview.jpg", "/advisor/2026/02-case-management.jpg", "/advisor/2026/03-customers.jpg",
  "/advisor/2026/04-checklists.jpg", "/advisor/2026/05-kyc.jpg", "/advisor/2026/06-contacts.jpg",
  "/advisor/2026/07-time-reg.jpg", "/advisor/2026/08-outlays.jpg", "/advisor/2026/09-invoicing.jpg",
  "/advisor/2026/10-resource-planning.jpg", "/advisor/2026/11-reports.jpg", "/advisor/2026/12-settings.jpg",
  "/advisor/2026/13-settings.jpg",
];

const SHOTS_NCW = [
  "/advisor/ncw/ncw-00.jpg", "/advisor/ncw/ncw-01.jpg", "/advisor/ncw/ncw-02.jpg",
  "/advisor/ncw/ncw-03.jpg", "/advisor/ncw/ncw-04.jpg", "/advisor/ncw/ncw-05.jpg",
];

const SHOTS_CLASSIC = [
  "/advisor/classic/01-overview.jpg", "/advisor/classic/02-case-management.jpg", "/advisor/classic/03-customers.jpg",
  "/advisor/classic/04-checklists.jpg", "/advisor/classic/05-kyc.jpg", "/advisor/classic/06-contacts.jpg",
  "/advisor/classic/07-time-registration.jpg", "/advisor/classic/08-outlays.jpg", "/advisor/classic/09-invoicing.jpg",
  "/advisor/classic/10-resource-planning.jpg", "/advisor/classic/11-reports.jpg", "/advisor/classic/12-settings.jpg",
  "/advisor/classic/13-settings-2.jpg",
];

const SHOTS_OLDIES = [
  "/advisor/oldies/01-old.jpg", "/advisor/oldies/02-old.jpg", "/advisor/oldies/03-old.jpg",
  "/advisor/oldies/04-old.jpg", "/advisor/oldies/05-old.jpg", "/advisor/oldies/06-old.jpg",
  "/advisor/oldies/07-old.jpg", "/advisor/oldies/08-old-new.jpg", "/advisor/oldies/09-old-new.jpg",
];

export default function Advisor() {
  return (
    <div className="nsc-project-advisor">
      <div className="project-columns">
        {/* The copy scrolls on its own; the screens beside it never move. */}
        <div className="project-copy">
          {/* Set like an entry in the index rather than like the sections under
              it: a title, the line of what it is, and the three figures that say
              the size of it — then a rule, and the detail begins. */}
          <section className="intro">
            <h2 className="project-title">Accounting platform</h2>
            <p className="project-role">Saas for nordic accounting firms and their clients</p>

            <p className="project-scale">
              <strong>8k firms</strong> · <strong>40k active users</strong> · <strong>continuous delivery since 2018</strong>
            </p>

            <hr className="intro-rule" />

            <p>
              My role involved long-standing contribution to the product development, with focus on advancing the UI system.
              Close collaboration with ux teams to bridge design intent and technical implementation.
            </p>
          </section>

          <section>
            <p>
              <strong><code>UI system</code> : </strong>
              <code>KendoUI</code> + <code>.NET MVC</code> + <code>custom SPA</code> + <code>VUD</code>
            </p>
            <ul>
              <li><strong><code>KendoUI</code> : </strong>base components are styled using the VUD design system and extended with significant custom behavior.</li>
              <li><strong><code>VUD</code> : </strong> Visma Unified Design, token based, frequent updates.</li>
              <li>
                <strong><code>custom SPA framework</code></strong> over <code>.NET MVC</code> and <code>KendoUI</code> also integrating <code>VUD</code> design system.
                Only possible after a full refactor of UI code
              </li>
            </ul>
          </section>

          <section>
            <strong><code>Notable features</code> : </strong>
            <ul>
              <li>8000+ accounting firms - 40k active users</li>
              <li>complex UI with dense functionality</li>
              <li>multi-step flows with branching logic (reversible wizard)</li>
              <li>configurable <code>dashboards</code> (resizable, draggable, lazy-loading)</li>
              <li><code>dynamic grids</code> (configurable columns, resize, reorder, persistent filtering, endless scroll, expandable rows)</li>
              <li>intricate <code>combobox</code> inputs: persistent states, chained async loading, segmented with infinite scroll, inline add, multi-select, auto-filled values</li>
              <li>long running tasks send live updates via <code>signalR</code></li>
              <li>rigorous <code>validation</code> : client + server</li>
              <li>occasional <code>keyboard</code> focused flows</li>
            </ul>
          </section>

          <section>
            <strong><code>Challenges</code> : </strong>
            <ul>
              <li>difficult to evolve inherited code: ad-hoc implementations, inconsistent patterns, un-documented logic, significant scale</li>
              <li>implement <code>refactoring</code> strategies with version control, eventually covering all UI</li>
              <li>enforce consistency and constraints</li>
              <li>large data sets require optimizing for <code>performance</code> : async dropdowns, segmented with endless-scroll, server-side filtering</li>
              <li>bridge design intent and technical implementation</li>
              <li>push back when UX is technically flawed and propose alternatives that scale</li>
            </ul>
          </section>

          <section className="stack-section">
            <strong><code>Stack</code> : </strong>
            <code>git</code>
            <code>.NET</code>
            <code>vscode</code>
            <code>jQuery</code>
            <code>kendo ui</code>
            <code>figma</code>
            <code>snowplow</code>
            <code>cypress</code>
            <code>signalR</code>
          </section>
        </div>

        <div className="project-screens">
          <ScreenCarousel year="2026" label="Advisor in 2026" shots={SHOTS_2026} />
          <ScreenCarousel year="2025" label="Advisor, the new case workflow" shots={SHOTS_NCW} />
          <ScreenCarousel year="2023" label="Advisor in 2023" shots={SHOTS_CLASSIC} start={9} />
          <ScreenCarousel year="2018 — 2022" label="Advisor, the original interface" shots={SHOTS_OLDIES} laptop />
        </div>
      </div>
    </div>
  );
}
