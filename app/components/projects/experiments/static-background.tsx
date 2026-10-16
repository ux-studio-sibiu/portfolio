import "./experiment.scss";

// Detail body for Static background — the experiment itself, embedded full-bleed. Loaded on
// demand by ShowcaseLinear, so the iframe is only created once it is opened.

// allow="clipboard-write" lets the page's copy buttons reach the clipboard from inside this
// cross-origin frame (see randomize-studio.tsx for the full why).

export default function StaticBackground() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://experiments-five-bice.vercel.app/static-background/" title="Static background, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allow="clipboard-write" />
    </div>
  );
}
