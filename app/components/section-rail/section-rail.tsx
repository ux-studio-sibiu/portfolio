"use client";

import { RailButton } from "@/app/components/rail-button/rail-button";
import "./section-rail.scss";

// The black rail down the left edge of the screen, carrying the section titles
// on their side, and the one button on the page.
//
// It is fixed to the VIEWPORT and lives outside the sliding track, which is the
// whole point of it being here rather than in column 1 where it started: the
// track is transformed while the detail pane comes over, and a fixed box inside
// a transformed ancestor is laid out against that ancestor instead — it would
// travel with the slide, and jump at the moment the transform appears. Out here
// it simply stays.
//
// `sections` comes from the showcase, which reads it off the `data-section`
// attributes in the DOM. Nothing here needs updating when a band is added.
//
//   active    which section owns the title, and whether the rail is up at all
//   lit       whether the black is actually on screen — it fades out with the
//             fixed column over the contact band, and a white-on-white button
//             would go with it
//   isDetail  a project is open, which is what the button does next: the same
//             circle is the way back out rather than the way into the menu
export function SectionRail({ sections, active, lit, isDetail, onOpenMenu, onClose }: { sections: string[]; active: string | null; lit: boolean; isDetail: boolean; onOpenMenu: () => void; onClose: () => void }) {
  return (
    <div className={`nsc-section-rail${isDetail ? " is-detail" : ""}`}>
      {/* Everything that fades with the fixed column, and nothing that does not.
          The button is outside it deliberately: it is the only way into the nav,
          so it is there on the first screen and on the last. */}
      <div className={`rail-body${active ? " is-active" : ""}`}>
        <span className="rail-ink" />

        {/* Decorative: the rotated titles say what the scroll already says. The
            hiding stops at this box — a focusable control inside an aria-hidden
            subtree is a control screen readers cannot reach. */}
        <div className="section-stack" aria-hidden="true">
          {sections.map((label) => (
            <span className={`rail-section${active === label ? " is-active" : ""}`} key={label}>{label}</span>
          ))}
        </div>
      </div>

      <RailButton mode={isDetail ? "back" : "menu"} inverted={!!active && lit} onClick={isDetail ? onClose : onOpenMenu} />
    </div>
  );
}
