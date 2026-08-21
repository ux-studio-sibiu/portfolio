"use client";

import { Children, isValidElement, Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image, { type StaticImageData } from "next/image";
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

// Bands that take over the fixed column title, in document order.
const SECTIONS = ["Projects", "Skills", "Contact"];

type ProjectProps = {
  title: string;
  year: string;
  role: string;
  stack?: string;
  summary?: React.ReactNode;
  points?: React.ReactNode;
  slug: string;
  // Thumbnail for the index. Without one the block stays a flat placeholder.
  thumb?: StaticImageData;
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

// Two-pane track. The index pane is split into three vertical sections: a fixed
// identity column, then two scrolling columns whose shared divider lines up with
// the project thumbnails. The right pane of the track is the project detail.
export function ShowcaseLinear({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Null until the first open, which is what keeps every detail chunk unfetched
  // on load. It then sticks through the slide back so the pane never blanks.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Which band is crossing the middle of the pane, if any. Drives the title swap
  // in the fixed column.
  const [section, setSection] = useState<string | null>(null);

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

  // Identity fade and section titles are one sequence, measured from the DOM so
  // they stay in step at any viewport. Two knobs, both fractions of the pane
  // height rather than pixel counts:
  //
  //   TRIGGER    where the line sits that a band has to cross to own the title
  //   FADE_OVER  how much scrolling the identity takes to fade, as a fraction
  //
  // The fade is timed to *finish exactly* as the first titled band crosses the
  // trigger line, so there is never a gap with neither showing, nor a stretch
  // where the title is held back after the identity has gone. A fixed pixel
  // threshold cannot do that: band positions move with viewport size and text
  // reflow, and 2000px landed 1382px early at 1280x720.
  //
  // Only bites from tablet up: below that .pane-scroll is not the scroller, so
  // scrollTop stays 0 and the column scrolls away on its own.
  useEffect(() => {
    const el = scroller.current;
    const shell = root.current;
    if (!el || !shell) return;

    const TRIGGER = 0.5;
    const FADE_OVER = 0.45;

    const sections = Array.from(el.querySelectorAll<HTMLElement>("[data-section]"));
    let fadeEnd = 0;
    let fadeStart = 0;

    // Scroll offsets are only valid until something reflows, so this is redone
    // on resize and whenever the content changes height.
    const measure = () => {
      const first = sections[0];
      if (!first) return;
      const paneTop = el.getBoundingClientRect().top;
      const offset = first.getBoundingClientRect().top - paneTop + el.scrollTop;
      fadeEnd = Math.max(0, offset - el.clientHeight * TRIGGER);
      fadeStart = Math.max(0, fadeEnd - el.clientHeight * FADE_OVER);
    };

    const onScroll = () => {
      const span = fadeEnd - fadeStart;
      const t = span > 0 ? Math.min(1, Math.max(0, (el.scrollTop - fadeStart) / span)) : 0;
      shell.style.setProperty("--identity-fade", String(1 - t));
      // Fully invisible: stop it swallowing clicks on the email link.
      shell.classList.toggle("is-identity-hidden", t === 1);

      // Below tablet this element does not scroll, so there is no meaningful
      // trigger line to measure against.
      if (el.scrollHeight <= el.clientHeight + 1) {
        setSection(null);
        return;
      }

      // The last band whose top has passed the trigger line owns the title. Not
      // "the band covering the line": the final section starts below the
      // furthest that line can ever reach, so a containment test would never
      // light Contact at all.
      const paneTop = el.getBoundingClientRect().top;
      const line = el.clientHeight * TRIGGER;
      let owner: string | null = null;
      for (const node of sections) {
        if (node.getBoundingClientRect().top - paneTop > line) break;
        owner = node.dataset.section ?? null;
      }
      // The final band is shorter than the pane, so its top never reaches the
      // line however far you scroll — at the bottom of the scroll it wins
      // outright, otherwise Contact could never light.
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
      if (atBottom && sections.length) {
        owner = sections[sections.length - 1].dataset.section ?? owner;
      }

      setSection(owner);
    };

    const remeasure = () => {
      measure();
      onScroll();
    };

    remeasure();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);

    // Fonts loading, images decoding and the detail pane mounting all move the
    // bands; the offsets have to be taken again when they do.
    const ro = new ResizeObserver(remeasure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
    };
  }, []);

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Masthead on load, then one reveal per .reveal element as it enters the pane.
  // ScrollTrigger has to be told the scroller: the document never scrolls here,
  // the pane does.
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // gsap.timeline({ defaults: { ease: "power3.out" } })
    //   .from(".fixed-label", { opacity: 0, duration: 0.5 })
    //   .from(".name-mask span", { yPercent: 110, duration: 1, stagger: 0.09 }, "-=0.25")
    //   .from(".fixed-facts", { opacity: 0, y: 18, duration: 0.6 }, "-=0.5");

    // gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
    //   gsap.from(el, {
    //     opacity: 0,
    //     y: 36,
    //     duration: 0.7,
    //     ease: "power3.out",
    //     scrollTrigger: { trigger: el, scroller: scroller.current, start: "top 88%", once: true },
    //   });
    // });

    // Divider animation temporarily disabled. To bring it back, render a
    // <span className="column-progress" /> next to .column-rule (same
    // position, scaleY(0), transform-origin top) and re-enable this:
    //
    // gsap.fromTo(".column-progress", { scaleY: 0 }, {
    //   scaleY: 1,
    //   ease: "none",
    //   scrollTrigger: {
    //     trigger: ".projects",
    //     scroller: scroller.current,
    //     start: "top 65%",
    //     end: "bottom 85%",
    //     scrub: true,
    //   },
    // });

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

        {/* Index pane — three vertical sections. Column 1 is fixed and never
            scrolls; columns 2 and 3 scroll together inside .pane-scroll. The
            rule between 2 and 3 is the same line the project thumbnails sit
            against: both are placed off --col-media, so they cannot drift. */}
        <section className="showcase-pane index-pane" inert={isDetail}>

          {/* Column 1 — fixed. */}
          <aside className="pane-fixed">
            {/* One unit, faded by --identity-fade as a whole — label, name,
                blurb and facts go together rather than one at a time. */}
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

            {/* Outside the identity so it survives that fade. Titles are stacked
                and all at opacity 0 until their band takes over, so the change
                between them cross-fades instead of swapping text. */}
            <div className="fixed-sections" aria-hidden="true">
              {/* Hidden copy of the label reserves exactly the space above the
                  name, so the titles land on the name's position without a
                  hard-coded offset to keep in sync. */}
              <p className="fixed-label is-ghost">Frontend developer</p>
              <div className="section-stack">
                {SECTIONS.map((label) => (
                  <span className={`fixed-section${section === label ? " is-active" : ""}`} key={label}>{label}</span>
                ))}
              </div>
            </div>
          </aside>

          {/* Columns 2 + 3 — scrolling. */}
          <div className="pane-scroll" ref={scroller}>
            <div className="scroll-inner">
              {/* The divider between columns 2 and 3, full height of the
                  scrolling content. Static for now — see the disabled scrub
                  in the GSAP block above. */}
              <span className="column-rule" aria-hidden="true" />

              {/* The fold: exactly one viewport tall, so the projects below it
                  are only reachable by scrolling. Content sits in column 3
                  with its own header, so the left half stays the identity. */}
              <section className="band tech is-fold">
                <div className="band-content">
                  <div className="list-head">
                    <span className="band-count">Core technologies</span>
                    <span className="band-count">05</span>
                  </div>
                  <ul className="spec-list">
                    <li className="spec-row">
                      <span className="spec-num">01</span>
                      <h2 className="spec-name">Next.js</h2>
                      <p className="spec-note">App Router, server components, caching and revalidation</p>
                    </li>
                    <li className="spec-row">
                      <span className="spec-num">02</span>
                      <h2 className="spec-name">TypeScript</h2>
                      <p className="spec-note">Strict mode, typed data layers end to end</p>
                    </li>
                    <li className="spec-row">
                      <span className="spec-num">03</span>
                      <h2 className="spec-name">TailwindCSS</h2>
                      <p className="spec-note">Utility-first, driven off a shared token set</p>
                    </li>
                    <li className="spec-row">
                      <span className="spec-num">04</span>
                      <h2 className="spec-name">Framer Motion, GSAP, Rive</h2>
                      <p className="spec-note">Timelines, scroll-driven motion, interactive vector</p>
                    </li>
                    <li className="spec-row">
                      <span className="spec-num">05</span>
                      <h2 className="spec-name">Headless CMS platforms</h2>
                      <p className="spec-note">Sanity, structured content, webhook-driven caching</p>
                    </li>
                  </ul>
                </div>
              </section>

              {/* <div className="marquee" aria-hidden="true">
                <div className="marquee-track">
                  <span>Interface engineering — Motion — Performance — Design systems —&nbsp;</span>
                  <span>Interface engineering — Motion — Performance — Design systems —&nbsp;</span>
                </div>
              </div> */}

              {/* Tools. Cards carry no logo yet — the copy stands on its own,
                  and a mark can drop in above the title later. */}
              <section className="band tools">
                {/* <div className="band-label">
                  <h2 className="band-title">Tools</h2>
                  <span className="band-count">08</span>
                </div> */}

                <div className="band-content">
                  <ul className="tool-grid">
                    <li className="tool-card">
                      <h3 className="tool-name">HTML CSS JS</h3>
                      <p className="tool-note">Proficient at core web technologies: ts, jsx, utility css, tailwind, design systems</p>
                    </li>
                    <li className="tool-card">
                      <h3 className="tool-name">React, Next.js</h3>
                      <p className="tool-note">Working knowledge and hands-on experience in small-scale projects. Next.js, Zustand</p>
                    </li>
                    <li className="tool-card">
                      <h3 className="tool-name">dev Tools</h3>
                      <p className="tool-note">Core Web Vitals optimization, performance profiling, debugging</p>
                    </li>
                    <li className="tool-card">
                      <h3 className="tool-name">VS code</h3>
                      <p className="tool-note">debugging, task runners, extensions ecosystem, copilot</p>
                    </li>
                    <li className="tool-card">
                      <h3 className="tool-name">Photoshop</h3>
                      <p className="tool-note">or similar, for asset preparation, optimization, visual design</p>
                    </li>
                    <li className="tool-card">
                      <h3 className="tool-name">AI tools</h3>
                      <p className="tool-note">responsible use of AI tools, balance strengths/limitations: claude, github copilot, chatGPT</p>
                    </li>
                    <li className="tool-card">
                      <h3 className="tool-name">Figma</h3>
                      <p className="tool-note">design systems, prototyping, design collaboration</p>
                    </li>
                    <li className="tool-card">
                      <h3 className="tool-name">github</h3>
                      <p className="tool-note">github, vercel, sanity, headless cms</p>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Projects. The thumbnail is the scroll device: its column is
                  full-entry height and holds a sticky box, so the image pins
                  while its own entry scrolls and releases when the next one
                  arrives. Nothing between .visual-sticky and .pane-scroll may
                  carry a transform, so .reveal stays off the entry and the
                  visual column. */}
              <section className="band projects" data-section="Projects">
                <div className="band-content is-full">
                  {items.map((child, idx) => (
                    <article className="scroll-entry" key={child.props.title}>
                      <div className="entry-visual">
                        <div className="visual-sticky">
                          {/* The image opens the project too — same target as the
                              View project button, so the obvious click works. */}
                          <button type="button" className={`entry-thumb${child.props.thumb ? "" : " is-empty"}`} onClick={() => openItem(idx)} aria-label={`Open ${child.props.title}`}>
                            {child.props.thumb && <Image src={child.props.thumb} alt="" sizes="(min-width: 1440px) 18rem, (min-width: 1024px) 14rem, 10rem" placeholder="blur" className="thumb-img" />}
                            {/* <span className="thumb-index">{num(idx)}</span> */}
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
                          View project <span className="row-arrow" aria-hidden="true">&rarr;</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="band skills" data-section="Skills">
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

              <section className="band contact" data-section="Contact">
                <div className="band-content">
                  <p className="contact-label reveal"><span className="highlight-on-scroll">Available for work</span></p>
                  <a className="contact-mail reveal" href="mailto:hello@example.com">hello@example.com</a>
                  <div className="contact-foot reveal">
                    <span>Sibiu, Romania</span>
                    <span>GitHub</span>
                    <span>LinkedIn</span>
                    <span>&copy; 2026</span>
                  </div>
                </div>
              </section>

            </div>
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
