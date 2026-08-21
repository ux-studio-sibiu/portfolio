import "./casedeschise.scss";

// Detail body for Casedeschise — the live site, embedded full-bleed. Loaded on demand
// by ShowcaseLinear, so the iframe is only created once the project is opened.

export default function Casedeschise() {
  return (
    <div className="nsc-project-casedeschise">
      <iframe src="https://www.casedeschise.ro" title="Casedeschise, live site" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
