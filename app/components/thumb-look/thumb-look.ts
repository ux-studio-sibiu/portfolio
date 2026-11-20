// "Being looked at", for the thumbnails that run their own motion in JS
// (StaticThumb, DataVizThumb, ParticlesThumb). Every way a frame is looked at
// ends in the same two calls:
// - the mouse over the frame (mouse only: a touch screen has no hover, and a
//   tap opens the thing rather than asking to look at it);
// - keyboard focus on it, since the frame is a button and can be tabbed to;
// - pointing at its name in the copy, the `thumb-preview` events that preview()
//   in band-experiments.tsx sends.
// Listens on the frame's button (.entry-thumb), not the canvas, so the whole
// frame is the target, as with every other frame. Returns its own cleanup.
export function watchLook(el: HTMLElement, look: () => void, away: () => void) {
  const host = el.closest<HTMLElement>(".entry-thumb") ?? el;
  const onEnter = (e: PointerEvent) => { if (e.pointerType === "mouse") look(); };
  const on: [string, EventListener][] = [
    ["pointerenter", onEnter as EventListener],
    ["pointerleave", away],
    ["focusin", look],
    ["focusout", away],
    ["thumb-preview", look],
    ["thumb-preview-end", away],
  ];
  for (const [type, fn] of on) host.addEventListener(type, fn);
  return () => { for (const [type, fn] of on) host.removeEventListener(type, fn); };
}
