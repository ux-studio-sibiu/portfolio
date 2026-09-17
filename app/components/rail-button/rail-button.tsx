"use client";

import "./rail-button.scss";

// The one button on the page, at the head of the section rail. The rail is fixed
// to the viewport and outside the sliding track, so this is the same button in
// the same place from the first screen to the last — and it stays there while a
// project is open.
//
// Which is why it has two jobs rather than two buttons: browsing, it opens the
// section menu; with a project open, the same circle becomes the way back out of
// it. One control in one place, saying whatever the page needs it to say.
//
// It is a sibling of the rail's faded contents rather than one of them: the black
// comes and goes with the sections and fades out again over the contact band, and
// the way into the nav cannot go with it.
export function RailButton({ mode, inverted, onClick }: { mode: "menu" | "back"; inverted: boolean; onClick: () => void }) {
  const isBack = mode === "back";

  return (
    <button
      type="button"
      className={`nsc-rail-button${inverted ? " is-inverted" : ""}`}
      onClick={onClick}
      aria-label={isBack ? "Close the project" : "Open the section menu"}
    >
      {isBack ? (
        <svg className="back-arrow" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M13.5 8h-11" />
          <path d="M7 3.5 2.5 8 7 12.5" />
        </svg>
      ) : (
        /* Three rules out of one box: the middle bar is the element, the other
           two are its edges, so there is nothing to keep in step by hand. */
        <span className="menu-bars" aria-hidden="true" />
      )}
    </button>
  );
}
