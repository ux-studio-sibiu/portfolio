import "./experiment.scss";

// Detail body for "Light this scene with your phone" — the pencil still life lit by your phone's
// flashlight, embedded full-bleed. Loaded on demand by ShowcaseLinear, so the
// iframe is only created once it is opened.
//
// `allow="camera"` is what lets the embedded page ask for the webcam at all: a
// cross-origin iframe is refused getUserMedia without it, and the flashlight is
// found through the webcam.

export default function LightStudy() {
  return (
    <div className="nsc-experiment-embed">
      <iframe src="https://experiments-five-bice.vercel.app/3d-lighting-camera/" title="Light this scene with your phone, live" allow="camera" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
