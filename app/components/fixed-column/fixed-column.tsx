"use client";

import "./fixed-column.scss";

// Column 1 of the index pane: fixed, never scrolls, and carries two things that
// hand over to each other.
//
//   .fixed-identity   label, name, blurb and facts — faded as ONE unit by
//                     --identity-fade, which the showcase writes on scroll
//   .fixed-sections   the section titles, stacked and all transparent until one
//                     takes over — deliberately OUTSIDE .fixed-identity so it
//                     outlasts that fade
//
// `sections` comes from the showcase, which reads it off the `data-section`
// attributes in the DOM. Nothing here needs updating when a band is added.
export function FixedColumn({ sections, active }: { sections: string[]; active: string | null }) {
  return (
    <aside className="pane-fixed nsc-fixed-column">
      <div className="fixed-identity">
        <p className="fixed-label">Frontend developer</p>
        <h1 className="fixed-name">
          <span className="name-mask"><span>Razvan</span></span>
          <span className="name-mask"><span>Turcanu</span></span>
        </h1>
        <p className="fixed-blurb">
          I build web interfaces where motion, performance and clarity pull in the
          same direction. Ten years of shipping things that stay fast after launch.
        </p>

        <dl className="fixed-facts">
          <div className="fact">
            <dt>Based in</dt>
            <dd>Sibiu, Romania</dd>
          </div>
          <div className="fact">
            <dt>Working with</dt>
            <dd>React, Next.js, TypeScript, GSAP</dd>
          </div>
          <div className="fact">
            <dt>Contact</dt>
            <dd><a className="fixed-mail" href="mailto:hello@example.com">hello@example.com</a></dd>
          </div>
        </dl>
      </div>

      <div className="fixed-sections" aria-hidden="true">
        {/* Hidden copy of the label reserves exactly the space above the name,
            so the titles land on the name's position without a hard-coded
            offset to keep in sync. */}
        <p className="fixed-label is-ghost">Frontend developer</p>
        <div className="section-stack">
          {sections.map((label) => (
            <span className={`fixed-section${active === label ? " is-active" : ""}`} key={label}>{label}</span>
          ))}
        </div>
      </div>

      {/* Entrance timeline for this column, currently disabled:
          gsap.timeline({ defaults: { ease: "power3.out" } })
            .from(".fixed-label", { opacity: 0, duration: 0.5 })
            .from(".name-mask span", { yPercent: 110, duration: 1, stagger: 0.09 }, "-=0.25")
            .from(".fixed-facts", { opacity: 0, y: 18, duration: 0.6 }, "-=0.5"); */}
    </aside>
  );
}
