import "./experiment.scss";

// Detail body for "Romania's Power Grid" — one of the romanian-maps pages, embedded
// full-bleed. Loaded on demand by ShowcaseLinear, so the iframe is only created once it is opened.

const SRC = "https://romanian-maps.vercel.app/electric-grid/";

export default function RomanianPowerGrid() {
  return <div className="nsc-experiment-embed"><iframe src={SRC} title="Romania's Power Grid, live" allow="fullscreen" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>;
}
