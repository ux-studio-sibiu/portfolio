"use client";

import { Children, isValidElement, Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./showcase-linear.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Detail bodies, one component per project, each with its own stylesheet. Keyed
// by slug and wrapped in next/dynamic, so a project's chunk (and its CSS, and
// any images or iframes it contains) is fetched the first time that project is
// opened — never on first paint of the index.
const DETAILS: Record<string, React.ComponentType> = {
  advisor: dynamic(() => import("@/app/components/projects/advisor/advisor")),
  "clasa-zero": dynamic(() => import("@/app/components/projects/clasa-zero/clasa-zero")),
  zoom: dynamic(() => import("@/app/components/projects/zoom/zoom")),
  "slow-days": dynamic(() => import("@/app/components/projects/slow-days/slow-days")),
  photography: dynamic(() => import("@/app/components/projects/photography/photography")),
  map: dynamic(() => import("@/app/components/projects/map/map")),
  casedeschise: dynamic(() => import("@/app/components/projects/casedeschise/casedeschise")),
  "mipay-admin": dynamic(() => import("@/app/components/projects/mipay-admin/mipay-admin")),
  multidevice: dynamic(() => import("@/app/components/projects/multidevice/multidevice")),
  "white-label": dynamic(() => import("@/app/components/projects/white-label/white-label")),
  "four-in-one": dynamic(() => import("@/app/components/projects/four-in-one/four-in-one")),
};

type ProjectProps = {
  title: string;
  year: string;
  role: string;
  stack?: string;
  summary?: string;
  points?: React.ReactNode;
  slug: string;
  // Embeds fill the detail pane edge to edge; everything else gets padding.
  embed?: boolean;
  href?: string;
};

const num = (idx: number) => String(idx + 1).padStart(2, "0");

// Declaration only: ShowcaseLinear reads these props to build the projects
// section and the detail pane. It renders nothing itself — the work list that
// used to render a row per project is gone.
export function LinearProject(_props: ProjectProps) {
  return null;
}

// Two-pane track: the left pane is a single linear column scrolling through
// seven sections, the right pane is the project detail. Its sibling in
// project-showcase splits the left pane into two columns instead.
export function ShowcaseLinear({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Null until the first open, which is what keeps every detail chunk unfetched
  // on load. It then sticks through the slide back so the pane never blanks.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = Children.toArray(children).filter(isValidElement) as React.ReactElement<ProjectProps>[];
  const detail = openIndex === null ? undefined : items[openIndex]?.props;
  const Body = detail ? DETAILS[detail.slug] : undefined;
  const isDetail = activeIndex !== null;

  const openItem = (idx: number) => {
    setOpenIndex(idx);
    setActiveIndex(idx);
    history.pushState({ project: idx }, "");
  };
  const closeItem = () => history.back();

  useEffect(() => {
    const onPop = () => setActiveIndex(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!isDetail) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") history.back(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDetail]);

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Masthead on load, then one reveal per .reveal element as it enters the pane.
  // ScrollTrigger has to be told the scroller: the document never scrolls here,
  // the pane does.
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // gsap.timeline({ defaults: { ease: "power3.out" } })
    //   .from(".masthead-label", { opacity: 0, duration: 0.5 })
    //   .from(".masthead-mask span", { yPercent: 110, duration: 1, stagger: 0.09 }, "-=0.25")
    //   .from(".masthead-foot", { opacity: 0, y: 18, duration: 0.6 }, "-=0.5");

    // gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
    //   gsap.from(el, {
    //     opacity: 0,
    //     y: 36,
    //     duration: 0.7,
    //     ease: "power3.out",
    //     scrollTrigger: { trigger: el, scroller: scroller.current, start: "top 88%", once: true },
    //   });
    // });

    // Rail fills as the list passes through. Scrubbed, so it tracks scroll
    // position; if it never runs the static rail underneath still shows.
    gsap.fromTo(".scroll-progress", { scaleY: 0 }, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".project-scroll",
        scroller: scroller.current,
        start: "top 65%",
        end: "bottom 85%",
        scrub: true,
      },
    });

    ScrollTrigger.refresh();
  }, { scope: root });

  // Fade the incoming body in behind the slide. The title and facts strip it
  // used to animate are gone; the frame is all there is.
  useGSAP(() => {
    if (!isDetail || prefersReducedMotion()) return;

    gsap.from(".detail-frame", { opacity: 0, duration: 0.5, delay: 0.35, ease: "power2.out" });
  }, { dependencies: [isDetail, openIndex], scope: root });

  return (
    <div className="nsc-showcase-linear" ref={root}>
      <div className={`showcase-track${isDetail ? " is-detail" : ""}`}>

        {/* Index pane — one linear column, seven sections deep. */}
        <section className="showcase-pane index-pane" inert={isDetail}>
          <div className="pane-scroll" ref={scroller}>

            <section className="band masthead">
              <p className="masthead-label">Portfolio / 2026</p>
              <h1 className="masthead-name">
                <span className="masthead-mask"><span>Razvan</span></span>
                <span className="masthead-mask"><span>Turcanu</span></span>
              </h1>
              <div className="masthead-foot">
                <span>Frontend developer</span>
                <span>Sibiu, RO</span>
              </div>
            </section>

            <section className="band statement">
              <p className="statement-copy reveal">
                I build interfaces that stay fast after launch — and keep their manners
                on a bad connection, an old phone, a screen reader.
              </p>
            </section>

            {/* Marquee is a CSS animation, not a tween: it runs forever and has no
                business holding a GSAP ticker slot. */}
            <div className="marquee" aria-hidden="true">
              <div className="marquee-track">
                <span>Interface engineering — Motion — Performance — Design systems —&nbsp;</span>
                <span>Interface engineering — Motion — Performance — Design systems —&nbsp;</span>
              </div>
            </div>

            {/* Projects. Timeline rail and markers, but keyed to the thumbnail
                rather than a date — the thumbnail is the scroll device:
                its column is full-entry height and holds a sticky box, so the
                image pins while its own entry scrolls and releases when the next
                one arrives. Nothing between .visual-sticky and .pane-scroll may
                carry a transform, so .reveal stays off the entry and the visual
                column. */}
            <section className="band projects">
              <header className="band-head reveal">
                <h2 className="band-title">Projects</h2>
                <span className="band-count">{items.length} projects</span>
              </header>

              <div className="project-scroll">
                <span className="scroll-rail" aria-hidden="true" />
                <span className="scroll-progress" aria-hidden="true" />

                {items.map((child, idx) => (
                  <article className="scroll-entry" key={child.props.title}>
                    <div className="entry-visual">
                      <div className="visual-sticky">
                        {/* The image opens the project too — same target as the
                            View more button, so the obvious click works. */}
                        <button type="button" className="entry-thumb" onClick={() => openItem(idx)} aria-label={`Open ${child.props.title}`}>
                          <span className="thumb-index">{num(idx)}</span>
                        </button>
                        {/* <span className="visual-marker" aria-hidden="true" /> */}
                      </div>
                    </div>

                    <div className="entry-body reveal">
                      <div className="entry-text">
                        <h3 className="entry-title">{child.props.title}</h3>
                        <p className="entry-role">{child.props.role}{child.props.stack ? ` / ${child.props.stack}` : ""}</p>
                        <p className="entry-summary">{child.props.summary}</p>
                        {child.props.points && <ul className="entry-points">{child.props.points}</ul>}
                      </div>
                      <button type="button" className="entry-more" onClick={() => openItem(idx)}>
                        View more <span className="row-arrow" aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="band capabilities">
              <header className="band-head reveal">
                <h2 className="band-title">Capabilities</h2>
              </header>
              <ul className="cap-list">
                <li className="cap-item reveal">
                  <span className="cap-index">01</span>
                  <h3 className="cap-title">Interface engineering</h3>
                  <p className="cap-copy">React and Next.js front ends built to survive their second year, not just their launch week.</p>
                </li>
                <li className="cap-item reveal">
                  <span className="cap-index">02</span>
                  <h3 className="cap-title">Motion</h3>
                  <p className="cap-copy">GSAP work that carries meaning — transitions that explain where you went, not decoration bolted on at the end.</p>
                </li>
                <li className="cap-item reveal">
                  <span className="cap-index">03</span>
                  <h3 className="cap-title">Performance</h3>
                  <p className="cap-copy">Budgets set before the first component, then held: image pipelines, bundle discipline, interaction under sixteen milliseconds.</p>
                </li>
                <li className="cap-item reveal">
                  <span className="cap-index">04</span>
                  <h3 className="cap-title">Design systems</h3>
                  <p className="cap-copy">Token sets and component libraries that a team can actually extend without a maintainer in the room.</p>
                </li>
              </ul>
            </section>

            <section className="band process">
              <header className="band-head reveal">
                <h2 className="band-title">Process</h2>
              </header>
              <ol className="step-list">
                <li className="step reveal">
                  <span className="step-index">01</span>
                  <div className="step-body">
                    <h3 className="step-title">Narrow it</h3>
                    <p className="step-copy">Half of what gets scoped does not need to exist. That conversation happens first, while it is still cheap.</p>
                  </div>
                </li>
                <li className="step reveal">
                  <span className="step-index">02</span>
                  <div className="step-body">
                    <h3 className="step-title">Build the spine</h3>
                    <p className="step-copy">The hardest screen goes first, in real code with real data. Prototypes that dodge the hard part teach nothing.</p>
                  </div>
                </li>
                <li className="step reveal">
                  <span className="step-index">03</span>
                  <div className="step-body">
                    <h3 className="step-title">Hand it over</h3>
                    <p className="step-copy">Documented, measured, and dull to deploy. If it needs me to keep running, it was not finished.</p>
                  </div>
                </li>
              </ol>
            </section>

            <section className="band recognition">
              <header className="band-head reveal">
                <h2 className="band-title">Worked with</h2>
              </header>
              <ul className="client-list">
                <li className="client reveal">Casedeschise Festival<span className="client-year">2024 — 2026</span></li>
                <li className="client reveal">ux.studio.sibiu<span className="client-year">2023 — 2025</span></li>
                <li className="client reveal">Visma<span className="client-year">2019 — 2024</span></li>
                <li className="client reveal">Independent clients<span className="client-year">2016 —</span></li>
              </ul>
            </section>

            <section className="band contact">
              <p className="contact-label reveal">Available for work</p>
              <a className="contact-mail reveal" href="mailto:hello@example.com">hello@example.com</a>
              <div className="contact-foot reveal">
                <span>Sibiu, Romania</span>
                <span>GitHub</span>
                <span>LinkedIn</span>
                <span>&copy; 2026</span>
              </div>
            </section>

          </div>
        </section>

        {/* Detail pane. Chrome is the back button and nothing else — the
            per-project component owns the whole surface, and for embeds that
            means a full-bleed iframe. Bodies are code-split and mount only
            once a project has been opened. */}
        <section className="showcase-pane detail-pane" inert={!isDetail}>
          <button type="button" className="detail-back" onClick={closeItem}>
            <span className="back-arrow" aria-hidden="true">&larr;</span> Back
          </button>

          <div className="pane-scroll">
            {detail && Body && (
              <div className={`detail-frame${detail.embed ? " is-embed" : ""}`}>
                <Suspense fallback={<p className="detail-loading">Loading {detail.title}…</p>}>
                  <Body />
                </Suspense>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
