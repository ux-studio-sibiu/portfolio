import "./band-core-technologies.scss";

// The fold: exactly one viewport tall, so the projects below it are only
// reachable by scrolling. Content sits in column 3 with its own header, so the
// left half stays the identity.
//
// Layout (the `band` class, the column grid, `--col-media`) comes from the
// showcase shell; this file only owns what is inside the band. The numbered
// rows are the shared `.spec-*` device in globals.scss, also used by Skills.
export function BandCoreTechnologies() {
  return (
    <section className="band is-fold nsc-band-core-technologies">
      <div className="band-content">
        {/* <div className="list-head">
          <span className="band-count">Core technologies</span>
          <span className="band-count">05</span>
        </div> */}
        <ul className="spec-list">
          <li className="spec-row">
            <h2 className="spec-name">Next.js, React</h2>
            <p className="spec-note">SSR, SSG, App Router, server components, caching and revalidation</p>
          </li>

          <li className="spec-row">
            <h2 className="spec-name">HTML, CSS, JS, TypeScript</h2>
            <p className="spec-note">proficient with the fundamentals, Core Web Vitals optimization, performance profiling </p>
          </li>

          <li className="spec-row">
            <h2 className="spec-name">Design focus</h2>
            <p className="spec-note">Figma</p>
          </li>

          <li className="spec-row">
            <h2 className="spec-name">AI Tools</h2>
            <p className="spec-note">Responsible use of AI tools, balance strengths/limitations: claude, github copilot, chatGPT</p>
          </li>

          <li className="spec-row">
            <h2 className="spec-name">GSAP</h2>
            <p className="spec-note">Timelines, scroll-driven motion, interactive vector</p>
          </li>
          <li className="spec-row">
            <h2 className="spec-name">Headless CMS</h2>
            <p className="spec-note">Sanity, structured content, webhook-driven caching</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
