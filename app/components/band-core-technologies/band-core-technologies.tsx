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
            <h2 className="spec-name">Next.js</h2>
            <p className="spec-note">App Router, server components, caching and revalidation</p>
          </li>
          <li className="spec-row">
            <h2 className="spec-name">TypeScript</h2>
            <p className="spec-note">Strict mode, typed data layers end to end</p>
          </li>
          <li className="spec-row">
            <h2 className="spec-name">TailwindCSS</h2>
            <p className="spec-note">Utility-first, driven off a shared token set</p>
          </li>
          <li className="spec-row">
            <h2 className="spec-name">Framer Motion, GSAP, Rive</h2>
            <p className="spec-note">Timelines, scroll-driven motion, interactive vector</p>
          </li>
          <li className="spec-row">
            <h2 className="spec-name">Headless CMS platforms</h2>
            <p className="spec-note">Sanity, structured content, webhook-driven caching</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
