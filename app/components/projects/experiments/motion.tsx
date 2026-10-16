import "./experiment.scss";

// Detail body for "GSAP, motion, 3d" — the motion experiments, embedded
// full-bleed. Loaded on demand by ShowcaseLinear, so the iframe is only created
// once it is opened.

// allow="clipboard-write" lets the page's copy buttons reach the clipboard from inside this
// cross-origin frame (see randomize-studio.tsx for the full why).

export default function Motion() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://experiments-five-bice.vercel.app/motion/" title="GSAP, motion, 3d, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allow="clipboard-write" />
    </div>
  );
}
