"use client";

import "./fixed-column.scss";

// Column 1 of the index pane: fixed, never scrolls, and carries two things that
// hand over to each other.
//
//   .fixed-identity   label, name, blurb and facts — faded as ONE unit by
//                     --identity-fade, which the showcase writes on scroll
//   .fixed-sections   the black rail down the left edge, carrying the section
//                     titles rotated on their side, stacked and all transparent
//                     until one takes over — deliberately OUTSIDE
//                     .fixed-identity so it outlasts that fade. The rail itself
//                     is lit by `active`, on the same transition as a title, so
//                     the black and the first word fade in together
//
// `sections` comes from the showcase, which reads it off the `data-section`
// attributes in the DOM. Nothing here needs updating when a band is added.
export function FixedColumn({ sections, active, onOpenMenu }: { sections: string[]; active: string | null; onOpenMenu: () => void }) {
  return (
    <aside className="pane-fixed nsc-fixed-column">
      <div className="fixed-identity">
        <p className="fixed-label">Frontend developer</p>
        {/* The name is the way into the section nav — see SideMenu. */}
        <h1 className="fixed-name">
          <button type="button" className="name-open" onClick={onOpenMenu} aria-label="Open the section menu">
            <span className="name-mask"><span>Razvan</span></span>
            <span className="name-mask"><span>Turcanu</span></span>
          </button>
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

      {/* The rail outlasts the identity fade, so the hamburger in it is how
          the nav is reached once the name has gone. aria-hidden sits on the
          stack rather than the whole rail — the rotated titles are decorative,
          but the button in here is not. */}
      <div className={`fixed-sections${active ? " is-active" : ""}`}>
        <div className="section-stack" aria-hidden="true">
          {sections.map((label) => (
            <span className={`fixed-section${active === label ? " is-active" : ""}`} key={label}>{label}</span>
          ))}
        </div>

        {/* Inert until the rail is up: it fades in with the rail, and an
            invisible button must not be focusable. */}
        <button type="button" className="rail-menu" onClick={onOpenMenu} aria-label="Open the section menu" inert={!active}>
          <span className="menu-bars" aria-hidden="true" />
        </button>
      </div>

      {/* Entrance timeline for this column, currently disabled:
          gsap.timeline({ defaults: { ease: "power3.out" } })
            .from(".fixed-label", { opacity: 0, duration: 0.5 })
            .from(".name-mask span", { yPercent: 110, duration: 1, stagger: 0.09 }, "-=0.25")
            .from(".fixed-facts", { opacity: 0, y: 18, duration: 0.6 }, "-=0.5"); */}
    </aside>
  );
}
