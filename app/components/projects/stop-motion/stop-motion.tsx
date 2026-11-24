import "./stop-motion.scss";

// Detail body for Stop-Motion Studio — the live site, embedded full-bleed.
// Loaded on demand by ShowcaseLinear, so the iframe is only created once the
// project is opened.
export default function ProjectStopMotion() {
  return (
    <div className="nsc-project-stop-motion">
      <iframe src="https://stop-motion.studiosibiu.com/" title="Stop-Motion Studio, live site" allow="fullscreen" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
