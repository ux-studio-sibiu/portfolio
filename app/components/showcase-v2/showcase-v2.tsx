"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./showcase-v2.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ProjectProps = {
  title: string;
  year: string;
  role: string;
  stack?: string;
  summary?: string;
  points?: React.ReactNode;
  href?: string;
  children: React.ReactNode;
  index?: number;
  onOpen?: () => void;
};

const num = (idx: number) => String(idx + 1).padStart(2, "0");

// A row in the work list. The write-up passed as `children` is rendered by
// ShowcaseV2 in the detail pane, not here.
export function ProjectV2({ title, year, role, index = 0, onOpen }: ProjectProps) {
  return (
    <li className="work-row reveal">
      <button type="button" className="row-trigger" onClick={onOpen}>
        <span className="row-index">{num(index)}</span>
        <span className="row-title">{title}</span>
        <span className="row-foot">
          <span className="row-meta">{role} / {year}</span>
          <span className="row-more">View more <span className="row-arrow" aria-hidden="true">&rarr;</span></span>
        </span>
      </button>
    </li>
  );
}

// Same two-pane track as the v1 showcase, but the left pane is a single linear
// column that scrolls through eight sections instead of a two-column split.
export function ShowcaseV2({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lastIndex, setLastIndex] = useState(0);

  const items = Children.toArray(children).filter(isValidElement) as React.ReactElement<ProjectProps>[];
  const detail = items[lastIndex]?.props;
  const isDetail = activeIndex !== null;

  const openItem = (idx: number) => {
    setLastIndex(idx);
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

  useGSAP(() => {
    if (!isDetail || prefersReducedMotion()) return;

    gsap.timeline({ delay: 0.25, defaults: { ease: "power3.out" } })
      .from(".detail-title span", { yPercent: 110, duration: 0.85 })
      .from(".detail-fade", { opacity: 0, y: 18, duration: 0.55, stagger: 0.06 }, "-=0.55");
  }, { dependencies: [isDetail, lastIndex], scope: root });

  return (
    <div className="nsc-showcase-v2" ref={root}>
      <div className={`showcase-track${isDetail ? " is-detail" : ""}`}>

        {/* Index pane — one linear column, eight sections deep. */}
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


            {/* <div className="marquee" aria-hidden="true">
              <div className="marquee-track">
                <span>Interface engineering — Motion — Performance — Design systems —&nbsp;</span>
                <span>Interface engineering — Motion — Performance — Design systems —&nbsp;</span>
              </div>
            </div> */}

            <section className="band work">
              <header className="band-head reveal">
                <h2 className="band-title">Selected work</h2>
                <span className="band-count">{items.length} projects</span>
              </header>
              <ul className="work-list">
                {items.map((child, idx) =>
                  cloneElement(child, { index: idx, onOpen: () => openItem(idx) })
                )}
              </ul>
            </section>

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
                        <div className="entry-thumb" aria-hidden="true"><span className="thumb-index">{num(idx)}</span></div>
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

        {/* Detail pane. */}
        <section className="showcase-pane detail-pane" inert={!isDetail}>
          <div className="pane-scroll">
            <div className="detail-bar">
              <button type="button" className="detail-back" onClick={closeItem}>
                <span className="back-arrow" aria-hidden="true">&larr;</span> Index
              </button>
              <span className="detail-count">{num(lastIndex)} / {num(items.length - 1)}</span>
            </div>

            {detail && (
              <div className="detail-inner">
                <h2 className="detail-title"><span>{detail.title}</span></h2>
                <div className="detail-figure detail-fade" aria-hidden="true" />

                <div className="detail-body">
                  <dl className="detail-facts detail-fade">
                    <div className="fact">
                      <dt>Year</dt>
                      <dd>{detail.year}</dd>
                    </div>
                    <div className="fact">
                      <dt>Role</dt>
                      <dd>{detail.role}</dd>
                    </div>
                    {detail.stack && (
                      <div className="fact">
                        <dt>Stack</dt>
                        <dd>{detail.stack}</dd>
                      </div>
                    )}
                  </dl>

                  <div className="detail-copy detail-fade">
                    {detail.children}
                    {detail.href && (
                      <a className="detail-visit" href={detail.href} target="_blank" rel="noopener noreferrer">
                        Visit site <span aria-hidden="true">&rarr;</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
