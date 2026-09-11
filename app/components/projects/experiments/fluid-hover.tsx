import "./experiment.scss";

// Detail body for Fluid hover — the experiment itself, embedded full-bleed. Loaded on
// demand by ShowcaseLinear, so the iframe is only created once it is opened.

export default function FluidHover() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://experiments-five-bice.vercel.app/effect/" title="Fluid hover, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
