import "./experiment.scss";

// Detail body for "GSAP, motion, 3d" — the motion experiments, embedded
// full-bleed. Loaded on demand by ShowcaseLinear, so the iframe is only created
// once it is opened.

export default function Motion() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://experiments-five-bice.vercel.app/motion/" title="GSAP, motion, 3d, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
