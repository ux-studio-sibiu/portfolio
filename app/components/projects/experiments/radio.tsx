import "./experiment.scss";

// Detail body for Instant dance party — the 2015 prototype, embedded full-bleed.
// The `curated` query is the demo's own flag for a picked set rather than the
// full library.
//
// The slug, this file and the component keep the old name: the registry key is
// what page.tsx points at, and renaming a lookup is not what renaming a project
// on the page asks for.

export default function Radio() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://ux-studio-sibiu.github.io/playground/projects/radio-prototype/index.html?curated" title="Instant dance party, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
