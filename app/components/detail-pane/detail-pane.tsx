"use client";

import { Suspense, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ProjectProps } from "@/app/components/showcase-linear/project";
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
  const root = useRef<HTMLElement>(null);

  // Fade the incoming body in behind the slide.
  useGSAP(() => {
    if (!isOpen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(".detail-frame", { opacity: 0, duration: 0.5, delay: 0.35, ease: "power2.out" });
  }, { dependencies: [isOpen, detail?.slug], scope: root });

  return (
    <section className="showcase-pane detail-pane nsc-detail-pane" inert={!isOpen} ref={root}>
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
    </section>
  );
}
