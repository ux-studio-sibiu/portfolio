import "./clasa-zero.scss";

// Detail body for Clasa Zero — the live site, embedded full-bleed. Loaded on demand
// by ShowcaseLinear, so the iframe is only created once the project is opened.

export default function ClasaZero() {
  return (
    <div className="nsc-project-clasa-zero">
      <iframe src="https://clasa-zero.vercel.app/game" title="Clasa Zero, live site" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
