"use client";

import { Children, isValidElement, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DETAILS } from "@/app/components/projects/registry";
import { FixedColumn } from "@/app/components/fixed-column/fixed-column";
import { DetailPane } from "@/app/components/detail-pane/detail-pane";
import { useEmbedPreload } from "@/app/components/embed-preload/embed-preload";
import { ElasticLine } from "@/app/components/elastic-line/elastic-line";
import { SideMenu } from "@/app/components/side-menu/side-menu";
import { SectionRail } from "@/app/components/section-rail/section-rail";
import { BandCoreTechnologies } from "@/app/components/band-core-technologies/band-core-technologies";
import { BandWorkHistory } from "@/app/components/band-work-history/band-work-history";
import { BandProjects } from "@/app/components/band-projects/band-projects";
import { BandExperiments } from "@/app/components/band-experiments/band-experiments";
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
  // The index pane, which is also the surface the divider watches the cursor
  // over — see ElasticLine at the foot of the JSX.
  const pane = useRef<HTMLElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Null until the first open, which is what keeps every detail chunk unfetched
  // on load. It then sticks through the slide back so the pane never blanks.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Section labels in document order, read from the DOM rather than declared
  // twice, and which of them currently owns the title.
  const [sections, setSections] = useState<string[]>([]);
  const [section, setSection] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // Whether the black rail is actually up behind the menu button. Not the same
  // question as `section`: the last band lights a title AND fades the column
  // out from under it, so the button has to go back to ink while a section is
  // still nominally active.
  const [railLit, setRailLit] = useState(false);

  const items = Children.toArray(children).filter(isValidElement) as React.ReactElement<ProjectProps>[];
  // One list, split for display only: both bands open into the same pane, and
  // the index that reaches history is the position in `items` either way.
  const projects = items.filter((child) => !child.props.group);
  const experiments = items.filter((child) => child.props.group === "experiments");
  const tools = items.filter((child) => child.props.group === "tools");
  const various = items.filter((child) => child.props.group === "various");
  const detail = openIndex === null ? undefined : items[openIndex]?.props;
  const Body = detail ? DETAILS[detail.slug] : undefined;
  const isDetail = activeIndex !== null;

  // Warms each embed URL as its entry scrolls into view, so the connection is
  // open — and usually the document cached — by the time the cover comes down
  // over the detail pane. Entries opt in with `data-preload` on themselves.
  useEmbedPreload(scroller);

  // Takes the element rather than a number, so a band can hand back whatever it
  // was given without having to know where that sits in the whole list.
  const openItem = (item: React.ReactElement<ProjectProps>) => {
    const idx = items.indexOf(item);
    if (idx < 0) return;
    setOpenIndex(idx);
    setActiveIndex(idx);
    history.pushState({ project: idx }, "");
  };
  const closeItem = () => history.back();

  // Menu entries are section LABELS, matched back to the band that declared
  // one. scrollIntoView rather than a scrollTop sum, because which element
  // actually scrolls changes with the breakpoint — .pane-scroll from tablet up,
  // .index-pane below it — and this walks up to whichever one it is.
  const goToSection = (label: string) => {
    setMenuOpen(false);
    const band = scroller.current?.querySelector<HTMLElement>(`[data-section="${label}"]`);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    band?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  // The fixed column is laid OVER the scroller, not inside it. Most of it is
  // click-through so the wheel falls straight to the pane and scrolls it
  // natively, but the two things that have to take pointer events — the mail
  // link in the column and the menu button beside it — have no scrollable
  // ancestor for a wheel to reach: .pane-scroll is their SIBLING, and the
  // button is not even in the same pane. This fires only over those two, and
  // hands the delta to the pane by hand.
  //
  // Forwarded scrolling does not feel like the real thing — no inertia, no
  // smoothing — which is exactly why the name is no longer a button. Keep what
  // takes pointer events here small, or this becomes noticeable again.
  useEffect(() => {
    const el = scroller.current;
    const targets = [
      pane.current?.querySelector<HTMLElement>(".pane-fixed"),
      root.current?.querySelector<HTMLElement>(".nsc-rail-button"),
    ].filter(Boolean) as HTMLElement[];
    if (!el || !targets.length) return;

    const onWheel = (e: WheelEvent) => {
      // Below tablet this element does not scroll — the pane around it does,
      // and the column is in its flow, so there is nothing to forward.
      if (el.scrollHeight <= el.clientHeight) return;
      e.preventDefault();
      // deltaMode is lines or pages on some mice, pixels everywhere else.
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1;
      el.scrollTop += e.deltaY * unit;
    };

    targets.forEach((node) => node.addEventListener("wheel", onWheel, { passive: false }));
    return () => targets.forEach((node) => node.removeEventListener("wheel", onWheel));
  }, []);

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

    // The two boxes the scroll properties below are written ON, rather than the
    // shell they used to be written on. They are inherited custom properties, so
    // every write re-resolves computed style for the whole subtree under the
    // element that carries them: from the shell that is 338 nodes and 2.4ms of
    // style recalc on every scroll event, against 0.3ms for these two, which
    // hold between them every rule that actually reads one.
    //
    //   the column   --identity-fade, and the --sweep-* pair that the pinned
    //                highlights in its blurb are swept by
    //   both         --column-fade: the column fades with the rail, and the
    //                rail is not inside it — it is fixed to the viewport,
    //                outside the sliding track
    const column = pane.current?.querySelector<HTMLElement>(".pane-fixed");
    const rail = shell.querySelector<HTMLElement>(".nsc-section-rail");
    if (!column || !rail) return;

    const TRIGGER = 0.5;
    const FADE_OVER = 0.45;
    // How far the pane scrolls before a pinned highlight is fully swept, as a
    // fraction of the pane height. A phrase in the fixed column has no travel of
    // its own to measure against, so this is the travel of the PAGE instead.
    const SWEEP_OVER = 0.5;

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
    // The mirror of those two at the other end of the scroll: where the fixed
    // column starts and finishes fading back OUT as the last band comes up.
    let outroEnd = 0;
    let outroStart = 0;
    // Where the rail takes over from the identity — see `data-identity-handover`
    // in measure(). Bands before it are read over the cover and light no title.
    let handoverIdx = 0;

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

      // Which band the identity gives way to. NOT simply the first one: bands
      // can sit above it that the cover is meant to stay up through — Work
      // history is read over the name, so the name has to still be there. A
      // band claims the handover with `data-identity-handover`, the same way it
      // claims a rail title with `data-section`, and the first band is the
      // fallback if none does.
      //
      // It is one moment, not two: the identity going and the rail arriving are
      // the same handover, so this index also gates which bands may light the
      // rail at all — see onScroll.
      const handover = bands.findIndex((node) => node.dataset.identityHandover !== undefined);
      handoverIdx = handover < 0 ? 0 : handover;
      const first = anchors[handoverIdx];
      if (!first) return;
      const paneTop = el.getBoundingClientRect().top;
      const offset = first.getBoundingClientRect().top - paneTop + el.scrollTop;
      fadeEnd = Math.max(0, offset - el.clientHeight * TRIGGER);
      fadeStart = Math.max(0, fadeEnd - el.clientHeight * FADE_OVER);

      // Same sum against the LAST band. The column is gone by the moment that
      // band crosses the trigger line, the point at which it would take the
      // title, so the two handovers are symmetric: the identity gives way to
      // the rail as the first band arrives, and the whole column gives way to
      // the last one. Its own top, not an anchor: Contact is the band being
      // cleared for, so the gap above it is part of the run.
      const last = bands[bands.length - 1];
      const lastTop = last ? last.getBoundingClientRect().top - paneTop + el.scrollTop : 0;
      outroEnd = Math.max(0, lastTop - el.clientHeight * TRIGGER);
      outroStart = Math.max(0, outroEnd - el.clientHeight * FADE_OVER);
    };

    const onScroll = () => {
      const span = fadeEnd - fadeStart;
      const t = span > 0 ? Math.min(1, Math.max(0, (el.scrollTop - fadeStart) / span)) : 0;
      column.style.setProperty("--identity-fade", String(1 - t));
      // Published for .highlight-on-scroll.pinned, which cannot time itself off a
      // box that never moves. Two numbers rather than the finished fraction, so a
      // phrase can subtract its own delay from the pixels before dividing.
      const sweepOver = el.clientHeight * SWEEP_OVER;
      column.style.setProperty("--sweep-px", String(el.scrollTop));
      column.style.setProperty("--sweep-over", String(sweepOver > 0 ? sweepOver : 1));
      // Fully invisible: stop it swallowing clicks on the email link. A class on
      // the shell is fine where a property is not — it changes at a threshold
      // rather than on every frame, and toggling one that is already set does
      // not touch the DOM at all.
      shell.classList.toggle("is-identity-hidden", t === 1);

      // And the column itself on the way out, on both boxes that fade with it.
      const outroSpan = outroEnd - outroStart;
      const o = outroSpan > 0 ? Math.min(1, Math.max(0, (el.scrollTop - outroStart) / outroSpan)) : 0;
      column.style.setProperty("--column-fade", String(1 - o));
      rail.style.setProperty("--column-fade", String(1 - o));
      // Gone rather than merely transparent, so the hamburger is not still
      // there to be pressed over the contact band.
      shell.classList.toggle("is-column-hidden", o === 1);
      // Halfway through that fade is where the rail stops being a black enough
      // backdrop to invert against. A flip rather than a ramp, smoothed by the
      // button's own colour transition.
      setRailLit(o < 0.5);

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
      //
      // The count starts at the handover band, not at zero: the bands above it
      // are read over the identity, and the rail is what the identity gives way
      // TO — both of them up at once would be two answers to the same question.
      // They keep their `data-section`, so they are still in the section menu
      // and still somewhere you can be sent; they just light nothing.
      const paneTop = el.getBoundingClientRect().top;
      const line = el.clientHeight * TRIGGER;
      let owner: string | null = null;
      for (let i = handoverIdx; i < bands.length; i++) {
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

    // Every scroll-bound animation on the page is declared against its own
    // element — "start when this row's top is 95% down the screen" — which reads
    // as though it cannot care what is above or below it. It does: ScrollTrigger
    // resolves that sentence into an absolute scrollTop ONCE, when it refreshes,
    // and from then on it is a number, not a relationship. Anything that changes
    // the height of the content above a trigger afterwards — a band added or
    // removed, fonts swapping in, a picture decoding, one of the Work history
    // entries opening — slides its element without telling ScrollTrigger, and
    // every one of those numbers is then wrong by exactly that shift.
    //
    // ScrollTrigger refreshes itself on window resize and on load, neither of
    // which covers content changing height inside a scroller of our own. So the
    // observer below, which is already watching for exactly that, refreshes it.
    //
    // Coalesced to one per frame: a refresh recomputes every trigger on the page,
    // and a ResizeObserver can fire several times for one reflow.
    let refreshQueued = false;
    const refreshTriggers = () => {
      if (refreshQueued) return;
      refreshQueued = true;
      requestAnimationFrame(() => {
        refreshQueued = false;
        ScrollTrigger.refresh();
      });
    };

    const remeasure = () => {
      measure();
      onScroll();
    };

    remeasure();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);

    // Fonts loading, images decoding and the detail pane mounting all move the
    // bands; the offsets have to be taken again when they do — ours here, and
    // ScrollTrigger's own, which are stale in exactly the same way.
    const ro = new ResizeObserver(() => {
      remeasure();
      refreshTriggers();
    });
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

    // Scroll progress on the divider was tried and dropped: the line is a solid
    // black rule at all times, which leaves a read/unread split nothing to say.
    // If it comes back it wants to be weight or opacity, not colour, and it
    // wants a second <path> over the first sharing its `d` — elastic-line
    // already writes every path in the svg, so it would be carried along.

    ScrollTrigger.refresh();
  }, { scope: root });

  return (
    <div className="nsc-showcase-linear" ref={root}>
      <div className={`showcase-track${isDetail ? " is-detail" : ""}`}>

        {/* Index pane — three vertical sections. Column 1 is fixed and never
            scrolls; columns 2 and 3 scroll together inside .pane-scroll. The
            rule between 2 and 3 is the same line the project thumbnails sit
            against: both are placed off --col-media, so they cannot drift. */}
        <section className="showcase-pane index-pane" ref={pane} inert={isDetail}>
          <FixedColumn />

          {/* Columns 2 + 3 — scrolling. */}
          <div className="pane-scroll" ref={scroller}>
            <div className="scroll-inner">
              <BandCoreTechnologies />

              <BandWorkHistory />
              <BandProjects items={projects} onOpen={openItem} />
              {/* Two shapes for the same kind of entry: a row each with its own
                  copy, or a wall of frames with one block of copy for the set.
                  Which group takes which is the `group` prop in page.tsx. */}
              <BandExperiments items={experiments} tools={tools} various={various} onOpen={openItem} />
              <BandSkills />
              <BandContact />
            </div>
          </div>

          {/* The divider between columns 2 and 3. It sits on the pane rather
              than in the scrolling content — the content is always taller than
              the pane, so it reads as the same full-height line, the cursor can
              be measured straight off the viewport, and it ends on the bottom
              edge of the screen rather than somewhere down the content. The
              pane is what it watches for the cursor; .column-rule is only where
              it goes. */}
          <ElasticLine surface={pane} className="column-rule" />
        </section>

        <DetailPane detail={detail} Body={Body} isOpen={isDetail} onClose={closeItem} />

      </div>

      {/* Outside the track, fixed to the viewport: the rail and the one control
          on the page stay exactly where they are while the detail pane comes
          over the top of everything else. */}
      <SectionRail sections={sections} active={section} lit={railLit} isDetail={isDetail} onOpenMenu={() => setMenuOpen(true)} onClose={closeItem} />

      {/* Portalled to <body> from here, so it is outside the shell entirely —
          it only needs the section list and the open state. */}
      <SideMenu sections={sections} isOpen={menuOpen} onClose={() => setMenuOpen(false)} onSelect={goToSection} reveal="fade" />
    </div>
  );
}
