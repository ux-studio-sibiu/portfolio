import "./experiment.scss";

// Detail body for Texture Studio — the experiment itself, embedded full-bleed. Loaded on
// demand by ShowcaseLinear, so the iframe is only created once it is opened.
//
// The URL keeps the old name: it is where the thing is actually deployed, and
// renaming it here would only break the embed.

export default function TextureStudio() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://experiments-five-bice.vercel.app/background-experiments/" title="Texture Studio, live" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
