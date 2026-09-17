import "./experiment.scss";

// Detail body for Optimize Studio — the 2016 portfolio itself, embedded
// full-bleed. Loaded on demand by ShowcaseLinear, so the iframe is only created
// once it is opened.

export default function OptimizeStudio() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://ux-studio-sibiu.github.io/playground/projects/old-portfolio/index.html" title="Optimize Studio, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
