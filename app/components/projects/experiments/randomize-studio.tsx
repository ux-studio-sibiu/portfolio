import "./experiment.scss";

// Detail body for Randomize Studio — the experiment itself, embedded full-bleed. Loaded on
// demand by ShowcaseLinear, so the iframe is only created once it is opened.

export default function RandomizeStudio() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://experiments-five-bice.vercel.app/randomize-studio/" title="Randomize Studio, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
