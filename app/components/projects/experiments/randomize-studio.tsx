import "./experiment.scss";

// Detail body for Randomize Studio — the experiment itself, embedded full-bleed. Loaded on
// demand by ShowcaseLinear, so the iframe is only created once it is opened.
// The trailing slash matters: the intro page loads intro.css, intro.js and
// texture-kit.js by relative path, and without the slash they resolve one
// folder up and 404.

export default function RandomizeStudio() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://experiments-five-bice.vercel.app/randomize-studio/intro/" title="Randomize Studio, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
