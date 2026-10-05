import Image from "next/image";
import still from "@/app/assets/projects/flashlight-webcam-2.jpg";
import "./light-study-thumb.scss";

// "Light this scene with your phone" thumbnail: the pencil still life, with
// TV static running inside its sun — the light source is the live part, the
// thing your phone becomes in the demo.
//
// `className="frame-img"` keeps the band's sizing: full width, the picture's
// own proportion. `priority` is deliberately NOT set — it is below the fold.
export function LightStudyThumb() {
  return (
    <span className="nsc-light-study-thumb">
      <Image src={still} alt="" sizes="(min-width: 768px) 30vw, 100vw" placeholder="blur" className="frame-img" />
      <span className="sun-static" aria-hidden="true" />
    </span>
  );
}
