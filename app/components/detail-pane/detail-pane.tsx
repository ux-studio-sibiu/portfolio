"use client";

import { Suspense } from "react";
import type { ProjectProps } from "@/app/components/showcase-linear/project";
import { TileReveal } from "@/app/components/tile-reveal/tile-reveal";
import "./detail-pane.scss";

// Right pane of the track. Chrome is the back button and nothing else — the
// per-project component owns the whole surface, and for embeds that means a
// full-bleed iframe.
//
// `Body` arrives already wrapped in next/dynamic and is only non-null once a
// project has been opened, which is what keeps every detail chunk unfetched on
// first paint.
export function DetailPane({
  detail,
  Body,
  isOpen,
  onClose,
}: {
  detail?: ProjectProps;
  Body?: React.ComponentType;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <section className="showcase-pane detail-pane nsc-detail-pane" inert={!isOpen}>
      <button type="button" className="detail-back" onClick={onClose}>
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

      {/* Covers the frame for the length of the slide, then dissolves off it.
          Sits over the back button as well, so the pane arrives as one surface
          rather than a button floating on a grid. */}
      <TileReveal play={isOpen} />
    </section>
  );
}
