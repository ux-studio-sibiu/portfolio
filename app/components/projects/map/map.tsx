import "./map.scss";

// Detail body for Map — the live site, embedded full-bleed. Loaded on demand
// by ShowcaseLinear, so the iframe is only created once the project is opened.
// The old portfolio delayed this src by 2s to keep map tiles off the initial
// page load. Mounting on click makes that unnecessary.
export default function ProjectMap() {
  return (
    <div className="nsc-project-map">
      <iframe src="https://vue-playground-mauve.vercel.app/map?curated&sort=year" title="Map, live site" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
