// A small, stable hash of a string (32-bit FNV-1a), for "random" values that
// should differ from one thing to the next but come out the same on every load:
// how long a highlight waits before it sweeps (highlight.tsx), which way a
// link-lit frame's ring leans (band-experiments.tsx). Not for anything that
// needs to be hard to guess.
export function stableHash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}
