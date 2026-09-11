import "./experiment.scss";

// Detail body for Static background — the experiment itself, embedded full-bleed. Loaded on
// demand by ShowcaseLinear, so the iframe is only created once it is opened.

export default function StaticBackground() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://experiments-five-bice.vercel.app/static-background/" title="Static background, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
