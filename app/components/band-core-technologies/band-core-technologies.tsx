
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
        <ul className="spec-list">
          <li className="spec-row">
            <h2 className="spec-name">Next.js, React</h2>
            <p className="spec-note">SSR, SSG, App Router, component libraries, caching and revalidation</p>
          </li>

          <li className="spec-row">
            <h2 className="spec-name">HTML, CSS, JS, TypeScript</h2>
            <p className="spec-note">proficient with the fundamentals, Core Web Vitals optimization, performance profiling </p>
          </li>


          <li className="spec-row">
            <h2 className="spec-name">GSAP, Motion, Lenis</h2>
            <p className="spec-note">scroll-driven motion, vector animation, micro-interactions</p>
          </li>
          <li className="spec-row">
            <h2 className="spec-name">Headless CMS</h2>
            <p className="spec-note">Sanity, structured content, webhook-driven caching</p>
          </li>

          <li className="spec-row">
            <h2 className="spec-name">AI Development</h2>
            <p className="spec-note">Responsible use of AI tools, balance strengths/limitations: claude code, github copilot, chatGPT</p>
          </li>

          <li className="spec-row">
            <h2 className="spec-name">Workflow Tools</h2>
            <p className="spec-note">figma, github, vscode, vercel, photoshop </p>
          </li>

          <li className="spec-row">
            <h2 className="spec-name">Legacy</h2>
            <p className="spec-note">.net, mvc, jquery, ajax spa libraries, kendoUI, signalR </p>
          </li>

        </ul>
      </div>
    </section>
  );
}
