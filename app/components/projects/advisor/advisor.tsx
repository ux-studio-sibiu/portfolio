import "./advisor.scss";

// Detail body for the Advisor project. Loaded on demand by ShowcaseLinear, so
// nothing here ships until the project is opened. Owns its own layout — a
// detail body can be prose, a stat block, images, an iframe, anything.
export default function Advisor() {
  return (
    <div className="nsc-project-advisor">
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

      <p className="note">Screens are behind a customer login, so there is nothing to show here.</p>
    </div>
  );
}
