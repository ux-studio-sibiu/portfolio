import "./band-skills.scss";
import { Highlight } from "@/app/components/highlight/highlight";

// The CAN stack is commented out for now — see the block in the JSX below. Its
// styles are still in band-skills.scss, so bringing it back is uncommenting the
// two together.
// const CAN_COPIES = 5;

// Skills. `data-section` is what puts "Skills" in the fixed column as this band
// passes the trigger line — the showcase reads those attributes off the DOM, so
// this is the only place the label is declared.
//
// Rows use the shared `.spec-*` device from globals.scss, at the smaller size
// variant since these are sentences rather than product names.
export function BandSkills() {
  return (
    <section className="band nsc-band-skills" data-section="Skills">
      {/* Out for now. The word every line in this list starts with, hollow -
          only its outline drawn. One copy to begin with, level with the first
          row; the rest arrive underneath it as the band crosses the screen.
          Decorative either way: the list says it nine times over.

          <div className="band-visual" aria-hidden="true">
            <span className="can-stack">
              {Array.from({ length: CAN_COPIES }, (_, i) => (
                <span className="can-ghost" key={i} style={{ "--i": i } as React.CSSProperties}>Can</span>
              ))}
            </span>
          </div>
      */}

      <div className="band-content">
        <h2 className="band-heading band-title-large">Skills</h2>
        {/* <p className="skills-lede">Able to <Highlight>challenge procedures</Highlight> and suggest new ideas</p> */}

        <ol className="spec-list">
          <li className="spec-row">
            <span className="spec-name spec-name-small">Fast learner, team player, good communication skills</span>
          </li>
          <li className="spec-row">
            <span className="spec-name spec-name-small">High attention to detail, can work to <Highlight>tight deadlines</Highlight></span>
          </li>
          <li className="spec-row">
            <span className="spec-name spec-name-small">Can take <Highlight>ownership and accountability</Highlight></span>
          </li>
          <li className="spec-row">
            <span className="spec-name spec-name-small">Can work effectively with internal animation, design, content teams</span>
          </li>

          <li className="spec-row">
            <span className="spec-name spec-name-small">Can constructively complement vague or incomplete requirements</span>
          </li>

          <li className="spec-row">
            <span className="spec-name spec-name-small">Can discuss design </span>
          </li>

          <li className="spec-row">
            <span className="spec-name spec-name-small">Can <Highlight>challenge procedures</Highlight> and suggest new ideas</span>
          </li>
          
          <li className="spec-row">
            <span className="spec-name spec-name-small">Can provide <Highlight>headless CMS training</Highlight> to clients</span>
          </li>
          <li className="spec-row">
            <span className="spec-name spec-name-small">Experience of <Highlight>mentoring</Highlight> (peer QA and feedback)</span>
          </li>
          <li className="spec-row">
            <span className="spec-name spec-name-small">Can manage scope and delivery across multiple projects</span>
          </li>
          <li className="spec-row">
            <span className="spec-name spec-name-small">Can create tools to improve <Highlight>client, design and dev teams workflows</Highlight></span>
          </li>
        </ol>
      </div>
    </section>
  );
}
