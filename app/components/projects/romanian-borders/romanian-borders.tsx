import "./romanian-borders.scss";

// Detail body for Romania's borders — the live site, embedded full-bleed.
// Loaded on demand by ShowcaseLinear, so the iframe is only created once the
// project is opened.
export default function ProjectRomanianBorders() {
  return (
    <div className="nsc-project-romanian-borders">
      <iframe src="https://interactive-learning-omega.vercel.app/" title="Romania's borders, live site" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
