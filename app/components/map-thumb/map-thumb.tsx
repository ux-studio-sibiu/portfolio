import Image from "next/image";
import ground from "@/app/assets/projects/romanian-rivers-ground.webp";
import { RiversMap } from "./rivers-map";
import { PowerGridMap } from "./power-grid-map";
import "./map-thumb.scss";

// Thumbnails for the two Romania maps: the section each frame shows, drawn as
// inline SVG from the maps' own data (scripts/map-thumbs.mjs writes the two
// *-map.tsx files). Still at rest; pointed at, the water flows down the big
// rivers and power runs along the lines — see map-thumb.scss. Inline rather
// than an <img>, because the page's CSS has to reach the paths to move them.
//
// Drawn at 2x a 170 x 120 frame and sliced to fill whatever frame it is in.
export function RiversThumb() {
  return (
    <span className="nsc-map-thumb rivers">
      <Image src={ground} alt="" sizes="(min-width: 768px) 20vw, 50vw" className="ground" />
      <svg viewBox="0 0 340 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <RiversMap />
      </svg>
    </span>
  );
}

export function PowerGridThumb() {
  return (
    <span className="nsc-map-thumb power-grid">
      <svg viewBox="0 0 340 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <PowerGridMap />
      </svg>
    </span>
  );
}
