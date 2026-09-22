import Image from "next/image";
import stage from "@/app/assets/projects/randomize-studio.jpg";
import panel from "@/app/assets/projects/randomize-panel.jpg";
import "./randomize-thumb.scss";

// Randomize Studio's thumbnail: the poster the tool is currently making, and the
// panel that makes it — which is docked on the right in the tool itself, and is
// docked on the right here.
//
// It is in the markup from the start rather than mounted on hover, and hidden
// with opacity alone: it decodes with the picture behind it, so the first hover
// fades something that is already there instead of waiting on a request. That
// is the whole reason it reads as part of the image rather than as an overlay
// arriving late.
//
// `priority` is deliberately NOT set on either — this is the fourth row down.
export function RandomizeThumb() {
  return (
    <span className="nsc-randomize-thumb">
      <Image src={stage} alt="" sizes="(min-width: 768px) 20vw, 50vw" placeholder="blur" className="stage" />
      {/* aria-hidden, and no alt: it is the same tool the frame already names,
          said twice. The button around it carries the label. */}
      <Image src={panel} alt="" sizes="(min-width: 768px) 8vw, 20vw" placeholder="blur" className="panel" aria-hidden="true" />
    </span>
  );
}
