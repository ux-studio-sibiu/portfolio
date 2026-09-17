import "./experiment.scss";

// Detail body for Radio — the 2015 prototype, embedded full-bleed. The `curated`
// query is the demo's own flag for a picked set rather than the full library.

export default function Radio() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://ux-studio-sibiu.github.io/playground/projects/radio-prototype/index.html?curated" title="Radio, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
