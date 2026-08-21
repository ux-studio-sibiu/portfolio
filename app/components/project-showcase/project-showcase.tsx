"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import "./project-showcase.scss";

type ProjectProps = {
  title: string;
  year: string;
  role: string;
  stack?: string;
  href?: string;
  children: React.ReactNode;
  index?: number;
  onOpen?: () => void;
};

const num = (idx: number) => String(idx + 1).padStart(2, "0");

// One row in the index. The write-up passed as `children` is not rendered here —
// ProjectShowcase pulls it out and renders it in the detail pane.
export function Project({ title, year, role, index = 0, onOpen }: ProjectProps) {
  return (
    <li className="project-row">
      <button type="button" className="row-trigger" onClick={onOpen}>
        <span className="row-number label">{num(index)}</span>
        <span className="row-body">
          <span className="row-title">{title}</span>
          <span className="row-meta label">{role} — {year}</span>
        </span>
        <span className="row-more">View more <span className="row-arrow" aria-hidden="true">&rarr;</span></span>
      </button>
    </li>
  );
}

// Two panes on a 200%-wide track, mirroring the mobile one-pager in
// postcard-design: the index pane (intro + project list, side by side) and the
// detail pane. Opening a project slides the track left so the detail comes in
// from the right. Each pane scrolls inside itself, so the document never does.
export function ProjectShowcase({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  // `activeIndex` drives the slide (null = index shown). `lastIndex` is the
  // project rendered in the detail pane — it sticks through the slide back so
  // the pane never blanks mid-transition.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lastIndex, setLastIndex] = useState(0);

  const items = Children.toArray(children).filter(isValidElement) as React.ReactElement<ProjectProps>[];
  const detail = items[lastIndex]?.props;
  const isDetail = activeIndex !== null;

  // Opening pushes a synthetic history entry so the browser back button returns
  // to the index instead of leaving the page; the in-app back button calls
  // history.back() to consume it. Both paths land on `popstate`.
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

  // Intro reveal, once on mount.
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".intro-label, .index-head", { opacity: 0, duration: 0.5, stagger: 0.06 })
      .from(".name-mask span", { yPercent: 110, duration: 0.9, stagger: 0.08 }, "-=0.2")
      .from(".intro-blurb, .intro-facts", { opacity: 0, y: 14, duration: 0.6, stagger: 0.08 }, "-=0.55")
      .from(".project-row", { opacity: 0, y: 18, duration: 0.6, stagger: 0.07 }, "-=0.6");
  }, { scope: root });

  // The detail content comes in behind the slide. The slide itself is a CSS
  // transform on .is-detail, deliberately not a tween: which pane is on screen
  // is a state change, and it must survive GSAP being slow, throttled or absent.
  useGSAP(() => {
    if (!isDetail || prefersReducedMotion()) return;

    gsap.timeline({ delay: 0.25, defaults: { ease: "power3.out" } })
      .from(".detail-title span", { yPercent: 110, duration: 0.8 })
      .from(".detail-fade", { opacity: 0, y: 16, duration: 0.55, stagger: 0.06 }, "-=0.5");
  }, { dependencies: [isDetail, lastIndex], scope: root });

  return (
    <div className="nsc-project-showcase" ref={root}>
      <div className={`showcase-track${isDetail ? " is-detail" : ""}`} ref={track}>

        {/* Index pane — intro and project list, side by side. */}
        <section className="showcase-pane index-pane" inert={isDetail}>
          <div className="pane-scroll">
            <div className="pane-grid">

              <div className="intro-col">
                <p className="intro-label label">Frontend developer</p>
                <h1 className="intro-name">
                  <span className="name-mask"><span>Razvan</span></span>
                  <span className="name-mask"><span>Turcanu</span></span>
                </h1>
                <p className="intro-blurb">
                  I build web interfaces where motion, performance and clarity pull in the same
                  direction. Ten years of shipping things that stay fast after launch.
                </p>
                <dl className="intro-facts">
                  <div className="fact">
                    <dt className="label">Based in</dt>
                    <dd>Sibiu, Romania</dd>
                  </div>
                  <div className="fact">
                    <dt className="label">Working with</dt>
                    <dd>React, Next.js, TypeScript, GSAP</dd>
                  </div>
                  <div className="fact">
                    <dt className="label">Contact</dt>
                    <dd><a className="fact-link" href="mailto:hello@example.com">hello@example.com</a></dd>
                  </div>
                </dl>
              </div>

              <div className="index-col">
                <div className="index-head">
                  <span className="label">Selected work</span>
                  <span className="label">{items.length} projects</span>
                </div>
                <ul className="project-list">
                  {items.map((child, idx) =>
                    cloneElement(child, { index: idx, onOpen: () => openItem(idx) })
                  )}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Detail pane — the selected project. */}
        <section className="showcase-pane detail-pane" inert={!isDetail}>
          <div className="pane-scroll">
            <div className="detail-bar">
              <button type="button" className="detail-back" onClick={closeItem}>
                <span className="back-arrow" aria-hidden="true">&larr;</span> Index
              </button>
              <span className="detail-count label">{num(lastIndex)} / {num(items.length - 1)}</span>
            </div>

            {detail && (
              <div className="detail-inner">
                <header className="detail-head">
                  <h2 className="detail-title"><span>{detail.title}</span></h2>
                  <div className="detail-figure detail-fade" aria-hidden="true" />
                </header>

                <div className="detail-body">
                  <dl className="detail-facts detail-fade">
                    <div className="fact">
                      <dt className="label">Year</dt>
                      <dd>{detail.year}</dd>
                    </div>
                    <div className="fact">
                      <dt className="label">Role</dt>
                      <dd>{detail.role}</dd>
                    </div>
                    {detail.stack && (
                      <div className="fact">
                        <dt className="label">Stack</dt>
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
