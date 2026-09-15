"use client";

import { useState } from "react";
import Image from "next/image";
import "./screen-carousel.scss";

// A stack of screenshots you click through, in a frame: a browser window by
// default, or the vintage laptop when `laptop` is set — the mask is a PNG with
// the screen cut out of it, and the shot sits behind it in the cut.
//
// Same behaviour as the old portfolio's screens, which is what people are used
// to here: LEFT CLICK anywhere on the frame steps forward, RIGHT CLICK steps
// back, and the bullets under it jump straight to one. Arrow keys do the same
// as the two clicks, since the frame is a real button.
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
