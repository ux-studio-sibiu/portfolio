"use client";

import { useState } from "react";
import Image from "next/image";
import "./screen-carousel.scss";

// A stack of screenshots you click through, in a frame: a browser window by
// default, or the vintage laptop when `laptop` is set — the mask is a PNG with
// the screen cut out of it, and the shot sits behind it in the cut.
//
// Same behaviour as the old portfolio's screens: LEFT CLICK anywhere on the
// frame steps forward, RIGHT CLICK steps back, and the bullets under it jump
// straight to one. Arrow keys do the same as the two clicks, since the frame is
// a real button.
//
// None of which is visible, which is why there are arrows over the frame as
// well. The chevron is the one the photography portfolio's gallery navigates
// with — there it is a custom cursor rather than a button, so the shape is
// borrowed and the affordance is not: these are ordinary buttons you can see.
//
// Only the current shot and the one after it are in the DOM. The next one is
// mounted hidden, so a click paints immediately instead of waiting on a fetch,
// and the other eleven are never requested unless someone clicks that far.
export function ScreenCarousel({
  label,
  year,
  shots,
  start = 0,
  laptop = false,
}: {
  label: string;
  year: string;
  shots: string[];
  start?: number;
  laptop?: boolean;
}) {
  const [index, setIndex] = useState(start);
  const count = shots.length;
  const step = (by: number) => setIndex((prev) => (prev + by + count) % count);

  return (
    <div className={`nsc-screen-carousel${laptop ? " laptop" : ""}`}>
      {/* The frame and the two arrows over it share a box, so the arrows centre
          on the screen itself rather than on the screen plus its bullets. */}
      <div className="screen-stage">
      <button
        type="button"
        className="screen-frame"
        onClick={() => step(1)}
        onContextMenu={(e) => { e.preventDefault(); step(-1); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
        }}
        aria-label={`${label}. Screen ${index + 1} of ${count}. Click for the next one.`}
      >
        <span className="screen-wrap">
          {!laptop && <span className="browser-bar" aria-hidden="true" />}

          <span className="shot-box">
            <Image
              src={shots[index]}
              alt={`${label}, screen ${index + 1} of ${count}`}
              fill
              sizes="(min-width: 1440px) 600px, (min-width: 1024px) 40vw, 92vw"
              className="shot"
            />
            {/* Mounted only to warm the next one. */}
            <Image src={shots[(index + 1) % count]} alt="" aria-hidden="true" fill sizes="600px" className="shot next" />
          </span>

          {laptop && <span className="laptop-mask" aria-hidden="true" />}
        </span>

        <span className="year-tag" aria-hidden="true">{year}</span>
      </button>

      {/* Siblings of the frame, not children: a button cannot hold buttons, and
          being siblings is also what stops a click on an arrow counting as a
          click on the frame behind it. */}
      <button type="button" className="screen-nav prev" onClick={() => step(-1)} aria-label={`${label}, previous screen`}>
        <svg viewBox="0 0 60 60" aria-hidden="true"><path d="M29 43l-3 3-16-16 16-16 3 3-13 13 13 13z" /></svg>
      </button>

      <button type="button" className="screen-nav next" onClick={() => step(1)} aria-label={`${label}, next screen`}>
        {/* The same path, turned over — the way the gallery it comes from does it. */}
        <svg viewBox="0 0 60 60" aria-hidden="true"><g transform="translate(60,0) scale(-1,1)"><path d="M29 43l-3 3-16-16 16-16 3 3-13 13 13 13z" /></g></svg>
      </button>
      </div>

      {/* Outside the frame: a button cannot hold buttons, and these are the one
          part of the control that is not "advance". */}
      <div className="bullets">
        {shots.map((shot, idx) => (
          <button
            key={shot}
            type="button"
            className={`bullet${idx === index ? " is-active" : ""}`}
            onClick={() => setIndex(idx)}
            aria-label={`${label}, screen ${idx + 1}`}
            aria-current={idx === index}
          />
        ))}
      </div>
    </div>
  );
}
