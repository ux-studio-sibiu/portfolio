import "./photography.scss";

// Detail body for Photography Portfolio — the live site, embedded full-bleed. Loaded on demand
// by ShowcaseLinear, so the iframe is only created once the project is opened.
export default function Photography() {
  return (
    <div className="nsc-project-photography">
      <iframe src="https://photography-prototype.vercel.app" title="Photography Portfolio, live site" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
