"use client";

import "./menu-button.scss";

// The one thing on the page that is always pressable. It used to live inside
// the fixed column, which meant it came and went with it — gone at the bottom
// of the scroll, where the column fades out for the contact band. It is its own
// element now, fixed to the viewport rather than to any pane, so it is the same
// button in the same place from the first screen to the last.
//
// It is still measured off --rail, so it stays centred on the black section
// rail whether or not that rail is up behind it.
//
// `inverted` is white-on-black: the caller decides, because what is behind the
// button is the rail, and only the showcase knows whether the rail is lit.
export function MenuButton({ inverted, onClick }: { inverted: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`nsc-menu-button${inverted ? " is-inverted" : ""}`}
      onClick={onClick}
      aria-label="Open the section menu"
    >
      {/* Three rules out of one box: the middle bar is the element, the other
          two are its edges, so there is nothing to keep in step by hand. */}
      <span className="menu-bars" aria-hidden="true" />
    </button>
  );
}
