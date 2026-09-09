import "./band-skills.scss";

// Skills. `data-section` is what puts "Skills" in the fixed column as this band
// passes the trigger line — the showcase reads those attributes off the DOM, so
// this is the only place the label is declared.
//
// Rows use the shared `.spec-*` device from globals.scss, at the smaller size
// variant since these are sentences rather than product names.
export function BandSkills() {
  return (
    <section className="band nsc-band-skills" data-section="Skills">
      <div className="band-content">
        <h3 className="skills-title">Team Player</h3>
        <p className="skills-lede">Able to <span className="highlight-on-scroll">challenge procedures</span> and suggest new ideas</p>

        <ol className="spec-list">
          <li className="spec-row">
            <span className="spec-num">01</span>
            <span className="spec-name spec-name-small">Fast learner</span>
          </li>
          <li className="spec-row">
            <span className="spec-num">02</span>
            <span className="spec-name spec-name-small">High attention to detail, can work to <span className="highlight-on-scroll">tight deadlines</span></span>
          </li>
          <li className="spec-row">
            <span className="spec-num">03</span>
            <span className="spec-name spec-name-small">Can take <span className="highlight-on-scroll">ownership and accountability</span></span>
          </li>
          <li className="spec-row">
            <span className="spec-num">04</span>
            <span className="spec-name spec-name-small">Can work effectively with internal animation, design, content teams</span>
          </li>
          <li className="spec-row">
            <span className="spec-num">05</span>
            <span className="spec-name spec-name-small">Can provide <span className="highlight-on-scroll">headless CMS training</span> to clients</span>
          </li>
          <li className="spec-row">
            <span className="spec-num">06</span>
            <span className="spec-name spec-name-small">Experience of <span className="highlight-on-scroll">mentoring</span> (peer QA and feedback)</span>
          </li>
          <li className="spec-row">
            <span className="spec-num">07</span>
            <span className="spec-name spec-name-small">Can manage scope and delivery across multiple projects</span>
          </li>
          <li className="spec-row">
            <span className="spec-num">08</span>
            <span className="spec-name spec-name-small">Creates tools to improve <span className="highlight-on-scroll">client UX and dev team workflows</span></span>
          </li>
        </ol>
      </div>
    </section>
  );
}
