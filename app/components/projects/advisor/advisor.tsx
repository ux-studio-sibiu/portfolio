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
        <div className="project-copy">
          <p className="lede">Accounting office management studio, sold as SaaS to Nordic accounting firms and their clients.</p>

          <dl className="scale">
            <div className="figure">
              <dt>8,000</dt>
              <dd>accounting firms</dd>
            </div>
            <div className="figure">
              <dt>40,000</dt>
              <dd>active users</dd>
            </div>
            <div className="figure">
              <dt>2018 —</dt>
              <dd>continuous delivery</dd>
            </div>
          </dl>

          <h3 className="heading">The UI system</h3>
          <p>KendoUI over .NET MVC, with a custom SPA framework and the Visma Unified Design token set on top. Base components are styled to VUD and then extended well past it.</p>

          <ul className="specs">
            <li><span className="spec-key">Wizards</span>Multi-step flows with branching, reversible logic</li>
            <li><span className="spec-key">Grids</span>Configurable columns, reorder, persistent filtering, endless scroll, expandable rows</li>
            <li><span className="spec-key">Comboboxes</span>Chained async loading, segmented infinite scroll, inline add, multi-select</li>
            <li><span className="spec-key">Dashboards</span>Resizable, draggable, lazy-loading</li>
            <li><span className="spec-key">Live updates</span>Long-running tasks reporting over SignalR</li>
            <li><span className="spec-key">Validation</span>Client and server, with keyboard-driven flows where it matters</li>
          </ul>

          <h3 className="heading">What made it hard</h3>
          <p>Mostly archaeology. Inherited code with ad-hoc implementations, inconsistent patterns and undocumented logic, at a scale where nothing could be rewritten in one go — so refactoring ran incrementally under version control until it covered the UI.</p>
          <p>Large data sets forced async dropdowns, segmented endless scroll and server-side filtering. A steady part of the job was bridging design intent and technical reality, and pushing back when a proposed flow would not scale.</p>
        </div>

        <div className="project-screens">
          <p className="screens-note">Click a screen for the next one, right-click for the previous.</p>

          <ScreenCarousel year="2026" label="Advisor in 2026" shots={SHOTS_2026} />
          <ScreenCarousel year="2025" label="Advisor, the new case workflow" shots={SHOTS_NCW} />
          <ScreenCarousel year="2023" label="Advisor in 2023" shots={SHOTS_CLASSIC} start={9} />
          <ScreenCarousel year="2018 — 2022" label="Advisor, the original interface" shots={SHOTS_OLDIES} laptop />
        </div>
      </div>
    </div>
  );
}
