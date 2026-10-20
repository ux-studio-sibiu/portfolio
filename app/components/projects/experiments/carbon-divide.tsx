import "./experiment.scss";

// Detail body for "The carbon divide" — the data-viz globe (casedeschise/data-viz), embedded
// full-bleed. Loaded on demand by ShowcaseLinear, so the iframe is only created once it is opened.

// The deployed URL, also the entry's href in page.tsx.
const SRC = "https://data-viz-phi.vercel.app/";

export default function CarbonDivide() {
  return <div className="nsc-experiment-embed">{SRC && <iframe src={SRC} title="The carbon divide, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}</div>;
}
