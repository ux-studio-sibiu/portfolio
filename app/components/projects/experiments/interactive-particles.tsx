import "./experiment.scss";

// Detail body for "Interactive particles" — effects-collection/interactive-particles,
// the full three.js page, embedded full-bleed. Loaded on demand by ShowcaseLinear,
// so the iframe (and three.js inside it) is only created once it is opened.
// clipboard-write lets the page's own Copy buttons (the prompt, the settings)
// reach the clipboard from inside the frame, as the other tools' embeds do.

// The deployed URL, also the entry's href in page.tsx.
const SRC = "https://experiments-five-bice.vercel.app/interactive-particles/";

export default function InteractiveParticles() {
  return <div className="nsc-experiment-embed"><iframe src={SRC} title="Particle effect, live" allow="fullscreen; clipboard-write" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>;
}
