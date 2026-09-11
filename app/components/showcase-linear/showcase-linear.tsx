"use client";

import { Children, isValidElement, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DETAILS } from "@/app/components/projects/registry";
import { FixedColumn } from "@/app/components/fixed-column/fixed-column";
import { DetailPane } from "@/app/components/detail-pane/detail-pane";
import { BandCoreTechnologies } from "@/app/components/band-core-technologies/band-core-technologies";
import { BandTools } from "@/app/components/band-tools/band-tools";
import { BandProjects } from "@/app/components/band-projects/band-projects";
import { BandSkills } from "@/app/components/band-skills/band-skills";
import { BandContact } from "@/app/components/band-contact/band-contact";
import type { ProjectProps } from "./project";
import "./showcase-linear.scss";

export { LinearProject } from "./project";
export type { ProjectProps } from "./project";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// The shell. It owns the frame and the scroll sequence, and nothing else:
//
//   frame     the two-pane track, the three columns of the index pane, and the
//             divider between columns 2 and 3
//   sequence  the identity fade and which band owns the fixed-column title
//
// Each band is its own component and brings its own stylesheet. A band declares
// that it wants the fixed-column title by rendering `data-section="Label"` —
// this file reads those attributes off the DOM, so adding or reordering a band
// is a single edit in the JSX below.
export function ShowcaseLinear({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Null until the first open, which is what keeps every detail chunk unfetched
  // on load. It then sticks through the slide back so the pane never blanks.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Section labels in document order, read from the DOM rather than declared
  // twice, and which of them currently owns the title.
  const [sections, setSections] = useState<string[]>([]);
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

    let bands: HTMLElement[] = [];
    // What is actually measured against the trigger line, one per band. A band
    // is a box with padding on it, so its own top crosses the line well before
    // anything you can see does: a band can nominate the element it wants timed
    // off instead with `data-section-anchor`. Projects points at its first
    // entry, so the title arrives as that entry's top hits the line.
    let anchors: HTMLElement[] = [];
    let labels = "";
    let fadeEnd = 0;
    let fadeStart = 0;

    // Scroll offsets are only valid until something reflows, so this is redone
    // on resize and whenever the content changes height.
    const measure = () => {
      bands = Array.from(el.querySelectorAll<HTMLElement>("[data-section]"));
      // Resolved here rather than per frame: this is the only place the DOM
      // can have changed under us.
      anchors = bands.map((node) => node.querySelector<HTMLElement>("[data-section-anchor]") ?? node);

      // Publish the labels only when they actually change: this runs from a
      // ResizeObserver, and setting state unconditionally would have it
      // re-render, re-observe and fire again.
      const next = bands.map((node) => node.dataset.section ?? "").filter(Boolean);
      if (next.join("|") !== labels) {
        labels = next.join("|");
        setSections(next);
      }

      const first = anchors[0];
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

      // The last band whose anchor has passed the trigger line owns the title.
      // Not "the band covering the line": the final section starts below the
      // furthest that line can ever reach, so a containment test would never
      // light Contact at all.
      const paneTop = el.getBoundingClientRect().top;
      const line = el.clientHeight * TRIGGER;
      let owner: string | null = null;
      for (let i = 0; i < bands.length; i++) {
        if (anchors[i].getBoundingClientRect().top - paneTop > line) break;
        owner = bands[i].dataset.section ?? null;
      }
      // The final band is shorter than the pane, so its top never reaches the
      // line however far you scroll — at the bottom of the scroll it wins
      // outright, otherwise Contact could never light.
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
      if (atBottom && bands.length) {
        owner = bands[bands.length - 1].dataset.section ?? owner;
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

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Reveal-on-enter for every .reveal in the bands, currently disabled. The
    // scroller has to be named explicitly: the document never scrolls here.
    //
    // gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
    //   gsap.from(el, {
    //     opacity: 0,
    //     y: 36,
    //     duration: 0.7,
    //     ease: "power3.out",
    //     scrollTrigger: { trigger: el, scroller: scroller.current, start: "top 88%", once: true },
    //   });
    // });

    // Divider progress, also disabled. To bring it back, render a
    // <span className="column-progress" /> next to .column-rule (same position,
    // scaleY(0), transform-origin top) and re-enable this:
    //
    // gsap.fromTo(".column-progress", { scaleY: 0 }, {
    //   scaleY: 1,
    //   ease: "none",
    //   scrollTrigger: {
    //     trigger: ".nsc-band-projects",
    //     scroller: scroller.current,
    //     start: "top 65%",
    //     end: "bottom 85%",
    //     scrub: true,
    //   },
    // });

    ScrollTrigger.refresh();
  }, { scope: root });

  return (
    <div className="nsc-showcase-linear" ref={root}>
      <div className={`showcase-track${isDetail ? " is-detail" : ""}`}>

        {/* Index pane — three vertical sections. Column 1 is fixed and never
            scrolls; columns 2 and 3 scroll together inside .pane-scroll. The
            rule between 2 and 3 is the same line the project thumbnails sit
            against: both are placed off --col-media, so they cannot drift. */}
        <section className="showcase-pane index-pane" inert={isDetail}>
          <FixedColumn sections={sections} active={section} />

          {/* Columns 2 + 3 — scrolling. */}
          <div className="pane-scroll" ref={scroller}>
            <div className="scroll-inner">
              {/* The divider between columns 2 and 3, full height of the
                  scrolling content. Static for now — see the disabled scrub
                  in the GSAP block above. */}
              <span className="column-rule" aria-hidden="true" />

              <BandCoreTechnologies />

              {/* <div className="marquee" aria-hidden="true">
                <div className="marquee-track">
                  <span>Interface engineering — Motion — Performance — Design systems —&nbsp;</span>
                  <span>Interface engineering — Motion — Performance — Design systems —&nbsp;</span>
                </div>
              </div> */}

              <BandTools />
              <BandProjects items={items} onOpen={openItem} />
              <BandSkills />
              <BandContact />
            </div>
          </div>
        </section>

        <DetailPane detail={detail} Body={Body} isOpen={isDetail} onClose={closeItem} />

      </div>
    </div>
  );
}
