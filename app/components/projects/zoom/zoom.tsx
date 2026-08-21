import "./zoom.scss";

// Detail body for Zoom — the live site, embedded full-bleed. Loaded on demand
// by ShowcaseLinear, so the iframe is only created once the project is opened.

export default function Zoom() {
  return (
    <div className="nsc-project-zoom">
      <iframe src="https://vue-playground-mauve.vercel.app/zoom" title="Zoom, live site" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
