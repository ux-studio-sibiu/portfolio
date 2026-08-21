import "./slow-days.scss";

// Detail body for Slow Days Outside — the live site, embedded full-bleed. Loaded on demand
// by ShowcaseLinear, so the iframe is only created once the project is opened.
export default function SlowDays() {
  return (
    <div className="nsc-project-slow-days">
      <iframe src="https://slow-days-outside.vercel.app/" title="Slow Days Outside, live site" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
