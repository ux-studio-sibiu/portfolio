import "./experiment.scss";

// Detail body for Paint — the experiment itself, embedded full-bleed. Loaded on
// demand by ShowcaseLinear, so the iframe is only created once it is opened.

export default function Paint() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://experiments-five-bice.vercel.app/paint-concept/" title="Paint, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
