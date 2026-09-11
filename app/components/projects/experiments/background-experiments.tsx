import "./experiment.scss";

// Detail body for Background Experiments — the experiment itself, embedded full-bleed. Loaded on
// demand by ShowcaseLinear, so the iframe is only created once it is opened.

export default function BackgroundExperiments() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://experiments-five-bice.vercel.app/background-experiments/" title="Background Experiments, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
