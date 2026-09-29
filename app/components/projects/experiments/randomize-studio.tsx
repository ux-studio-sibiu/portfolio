import "./experiment.scss";

// Detail body for Randomize Studio — the experiment itself, embedded full-bleed. Loaded on
// demand by ShowcaseLinear, so the iframe is only created once it is opened.
// The trailing slash matters: the intro page loads intro.css, intro.js and
// texture-kit.js by relative path, and without the slash they resolve one
// folder up and 404.
//
// allow="clipboard-write" delegates this page's clipboard permission to the
// frame. That page's "copy prompt" buttons hand a coding agent its errand
// through navigator.clipboard.writeText, and the Permissions Policy default
// for clipboard-write is `self` — so a cross-origin frame gets an empty
// allowlist and every press fails. The attribute puts the frame's origin in
// that allowlist. Delegation is per-iframe, so nothing else here is affected.

export default function RandomizeStudio() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://experiments-five-bice.vercel.app/randomize-studio/intro/" title="Randomize Studio, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allow="clipboard-write" />
    </div>
  );
}
