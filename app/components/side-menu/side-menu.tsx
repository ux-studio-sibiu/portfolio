"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./side-menu.scss";

// The nav. Rendered through a portal into <body>, so it is a sibling of the
// showcase rather than a child of it: it sits in its own fixed-position layer
// over the whole viewport, and nothing it does — its width, its scrollbar, its
// transform — can reach the pane geometry underneath.
//
// Only the panel takes pointer events, so the half of the screen it does not
// cover stays live while it is open. Closing is the close button, Escape, a
// section, or a press anywhere outside the panel.
//
// `sections` is the same list the fixed column's rail is built from — read off
// the `data-section` attributes in the DOM by the showcase — so a band that
// declares a section gets a menu entry with nothing to update here.
//
// The entries are buttons rather than <a href="#…">: the index scrolls inside
// .pane-scroll (or .index-pane below tablet) rather than the document, and a
// real hash link would also push a history entry, which is what the detail pane
// uses to know it has been closed. `onSelect` hands the label back and the
// showcase does the scrolling.
export function SideMenu({
  sections,
  isOpen,
  onClose,
  onSelect,
}: {
  sections: string[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (label: string) => void;
}) {
  const panel = useRef<HTMLElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  // There is no document to portal into until the client has it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    close.current?.focus();

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    // Registered after the press that opened the menu has already been and
    // gone, so it cannot close it on the way in.
    const onDown = (e: PointerEvent) => {
      if (!panel.current?.contains(e.target as Node)) onClose();
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className={`nsc-side-menu${isOpen ? " is-open" : ""}`}>
      <nav className="menu-panel" aria-label="Sections" inert={!isOpen} ref={panel}>
        <button type="button" className="menu-close" onClick={onClose} ref={close}>
          Close <span className="close-mark" aria-hidden="true">&times;</span>
        </button>

        <ul className="menu-list">
          {sections.map((label) => (
            <li key={label}>
              <button type="button" className="menu-link" onClick={() => onSelect(label)}>{label}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>,
    document.body,
  );
}
